# AI Chat API

## Overview
The AI chat API handles conversations with portfolio visitors using an external AI service and stores all chat interactions in Firebase for analytics and tracking.

## API Endpoint
`POST /api/ai`

## Request Body
```json
{
  "portfolioData": "object",
  "query": "string",
  "sessionId": "string (optional)",
  "portfolioId": "string"
}
```

## Response
### Success (200)
```json
{
  "response": "string",
  "sessionId": "string"
}
```

### Error (400/500)
```json
{
  "error": "string"
}
```

## Features
- ✅ Integrates with external AI service
- ✅ Creates and manages chat sessions
- ✅ Saves all messages to Firebase
- ✅ Tracks user metadata (IP, User-Agent)
- ✅ Measures response times
- ✅ Session-based conversation tracking

## Firebase Collections

### `chatMessages`
Stores individual chat messages:
```typescript
{
  id: string;
  portfolioId: string;
  sessionId: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Timestamp;
  metadata?: {
    userAgent?: string;
    ipAddress?: string;
    responseTime?: number;
  };
}
```

### `chatSessions`
Stores chat session information:
```typescript
{
  id: string;
  portfolioId: string;
  sessionId: string;
  startedAt: Timestamp;
  lastActivity: Timestamp;
  messageCount: number;
  isActive: boolean;
}
```

## Session Management
- Each chat session gets a unique `sessionId`
- Sessions are created automatically on first message
- Session activity is tracked and updated
- Message counts are maintained per session

## Analytics Data
The API captures:
- User messages and AI responses
- Session duration and activity
- Response times
- User agent and IP information
- Portfolio-specific chat metrics

## Usage Example
```javascript
const response = await fetch('/api/ai', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    portfolioData: portfolio,
    query: "Tell me about your experience",
    sessionId: "session_123456",
    portfolioId: "portfolio_abc123"
  })
});

const data = await response.json();
console.log(data.response); // AI response
console.log(data.sessionId); // Session ID for tracking
```

## Firebase Functions Available
- `saveChatMessage()` - Save individual messages
- `createChatSession()` - Create new chat session
- `getChatSession()` - Retrieve session data
- `updateChatSession()` - Update session activity
- `getChatMessagesBySession()` - Get messages for a session
- `getChatMessagesByPortfolioId()` - Get all messages for a portfolio
- `getActiveChatSessionsByPortfolioId()` - Get active sessions for a portfolio 