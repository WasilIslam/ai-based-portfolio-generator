import { NextRequest, NextResponse } from 'next/server';
import { saveChatMessage, getChatSession, createChatSession, updateChatSession } from '../../firebase/ai-chat';
import { getPortfolioByPortfolioId } from '../../firebase/portfolios';

const AI_API_BASE_URL = 'https://bot-alistermartin.pythonanywhere.com';

export async function POST(request: NextRequest) {
  try {
    const { portfolioData, query, sessionId, portfolioId } = await request.json();

    console.log('=== AI API DEBUG ===')
    console.log('Received portfolioId:', portfolioId)
    console.log('Received sessionId:', sessionId)
    console.log('Portfolio data keys:', Object.keys(portfolioData || {}))

    if (!portfolioData || !query) {
      return NextResponse.json(
        { error: 'Portfolio data and query are required' },
        { status: 400 }
      );
    }

    if (!portfolioId) {
      console.error('No portfolioId provided')
      return NextResponse.json(
        { error: 'Portfolio ID is required' },
        { status: 400 }
      );
    }

    const startTime = Date.now();

    // Get the portfolio to find the userId
    const portfolio = await getPortfolioByPortfolioId(portfolioId);
    if (!portfolio) {
      return NextResponse.json(
        { error: 'Portfolio not found' },
        { status: 404 }
      );
    }

    // Create or get chat session
    let chatSession = sessionId ? await getChatSession(sessionId) : null;
    if (!chatSession && portfolioId) {
      const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      chatSession = await createChatSession({
        portfolioId,
        userId: portfolio.userId,
        sessionId: newSessionId,
        messageCount: 0,
        isActive: true
      });
    }

    // Get IP address from various headers
    const getClientIP = () => {
      return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
             request.headers.get('x-real-ip') ||
             request.headers.get('cf-connecting-ip') ||
             request.headers.get('x-client-ip') ||
             'Unknown';
    };

    // Save user message to Firebase
    if (chatSession && portfolioId) {
      await saveChatMessage({
        portfolioId,
        userId: portfolio.userId,
        sessionId: chatSession.sessionId,
        role: 'user',
        content: query,
        metadata: {
          userAgent: request.headers.get('user-agent') || undefined,
          ipAddress: getClientIP(),
        }
      });

      // Update session message count
      await updateChatSession(chatSession.sessionId, {
        messageCount: chatSession.messageCount + 1
      });
    }

    // Create instructions based on portfolio data
    const instructions = createInstructions(portfolioData);

    // Call the external AI API
    const response = await fetch(`${AI_API_BASE_URL}/simple_ai_query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        instructions,
        query,
      }),
    });

    if (!response.ok) {
      throw new Error(`AI API responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.error) {
      return NextResponse.json(
        { error: data.error },
        { status: 400 }
      );
    }

    const responseTime = Date.now() - startTime;

    // Save AI response to Firebase
    if (chatSession && portfolioId) {
      await saveChatMessage({
        portfolioId,
        userId: portfolio.userId,
        sessionId: chatSession.sessionId,
        role: 'assistant',
        content: data.resp_text,
        metadata: {
          responseTime
        }
      });

      // Update session message count
      await updateChatSession(chatSession.sessionId, {
        messageCount: chatSession.messageCount + 2 // +2 because we added both user and assistant messages
      });
    }

    return NextResponse.json({ 
      response: data.resp_text,
      sessionId: chatSession?.sessionId
    });

  } catch (error) {
    console.error('AI API error:', error);
    return NextResponse.json(
      { error: 'Failed to get AI response' },
      { status: 500 }
    );
  }
}

function createInstructions(portfolioData: any): string {
  const { firstName, lastName, positionTitle, tabs } = portfolioData;
  
  let instructions = `You are an AI assistant for ${firstName} ${lastName}'s portfolio. `;
  
  if (positionTitle) {
    instructions += `${firstName} is a ${positionTitle}. `;
  }

  // Add about information
  if (tabs.about?.aboutParagraph) {
    instructions += `About ${firstName}: ${tabs.about.aboutParagraph} `;
  }

  // Add skills
  if (tabs.about?.skills && tabs.about.skills.length > 0) {
    instructions += `Skills and technologies: ${tabs.about.skills.join(', ')}. `;
  }

  // Add social links
  if (tabs.about?.links && tabs.about.links.length > 0) {
    const socialLinks = tabs.about.links.map((link: any) => `${link.title}: ${link.url}`).join(', ');
    instructions += `Social links: ${socialLinks}. `;
  }

  // Add projects
  if (tabs.pastProjects?.projects && tabs.pastProjects.projects.length > 0) {
    const projects = tabs.pastProjects.projects.map((project: any) => 
      `${project.title}: ${project.description}${project.link ? ` (${project.link})` : ''}`
    ).join('; ');
    instructions += `Past projects: ${projects}. `;
  }

  // Add gallery items
  if (tabs.gallery?.items && tabs.gallery.items.length > 0) {
    const galleryItems = tabs.gallery.items.map((item: any) => 
      `${item.title}: ${item.description}`
    ).join('; ');
    instructions += `Gallery items: ${galleryItems}. `;
  }

  // Add blog posts
  if (tabs.blogs?.posts && tabs.blogs.posts.length > 0) {
    const blogPosts = tabs.blogs.posts.map((post: any) => 
      `${post.title}: ${post.description}`
    ).join('; ');
    instructions += `Blog posts: ${blogPosts}. `;
  }

  // Add contact information
  if (tabs.contact?.links && tabs.contact.links.length > 0) {
    const contactLinks = tabs.contact.links.map((link: any) => 
      `${link.title}: ${link.url}`
    ).join(', ');
    instructions += `Contact information: ${contactLinks}. `;
  }

  instructions += `
  
  Instructions:
  - Act as ${firstName} and respond as if you are ${firstName}.
  - Respond in a friendly, professional, and helpful manner.
  - Keep responses very short only one or two lines and non pushy.
  - For listing things, use bullet points.
  - Focus on ${firstName}'s work, experience, and portfolio content
  - If asked about something not in the portfolio, politely redirect to available information
  - Use a conversational tone but maintain professionalism
  - Use plain text, no markdown.
  `;

  return instructions;
} 