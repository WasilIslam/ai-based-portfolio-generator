'use client'

import React, { useState, useRef, useEffect } from 'react';
import { 
  PaperAirplaneIcon, 
  ChatBubbleLeftRightIcon,
  XMarkIcon,
  SparklesIcon,
  UserIcon
} from '@heroicons/react/24/outline';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  portfolioData: any; // This is now the full portfolio object
}

const Chatbot: React.FC<ChatbotProps> = ({ isOpen, onClose, portfolioData }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm an AI assistant. I can help you learn more about this portfolio and answer questions about the work and experience. What would you like to know?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Get AI response from API
    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          portfolioData: portfolioData.data, // Send the portfolio content data
          query: inputValue,
          sessionId,
          portfolioId: portfolioData.portfolioId, // Use the portfolioId from the full object
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      // Update session ID if provided
      if (data.sessionId && !sessionId) {
        setSessionId(data.sessionId);
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('AI API error:', error);
      
      // Fallback response
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I apologize, but I'm having trouble connecting to my AI service right now. Please try again later or feel free to reach out through the contact information provided.",
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50 w-96 h-[500px] bg-base-100 rounded-lg shadow-xl border border-base-300 flex flex-col md:flex hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-base-300 bg-primary text-primary-content rounded-t-lg">
        <div className="flex items-center gap-3">
          <SparklesIcon className="w-5 h-5" />
          <div>
            <h3 className="font-semibold">AI Assistant</h3>
            <p className="text-primary-content/70 text-xs">Ask me anything!</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="btn btn-ghost btn-sm text-primary-content/70 hover:text-primary-content"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex gap-2 max-w-[80%] ${message.isUser ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                {message.isUser ? (
                  <UserIcon className="w-4 h-4 text-primary" />
                ) : (
                  <SparklesIcon className="w-4 h-4 text-secondary" />
                )}
              </div>
              <div className={`chat ${message.isUser ? 'chat-end' : 'chat-start'}`}>
                <div className={`chat-bubble ${
                  message.isUser ? 'chat-bubble-primary' : 'chat-bubble-secondary'
                }`}>
                  <p className="text-sm">{message.text}</p>
                  <p className={`text-xs mt-1 ${
                    message.isUser ? 'text-primary-content/70' : 'text-secondary-content/70'
                  }`}>
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex gap-2">
              <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                <SparklesIcon className="w-4 h-4 text-secondary" />
              </div>
              <div className="chat chat-start">
                <div className="chat-bubble chat-bubble-secondary">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-secondary-content/30 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-secondary-content/30 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-secondary-content/30 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-base-300">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message..."
            className="input input-bordered flex-1 text-sm"
            disabled={isTyping}
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            className="btn btn-primary btn-sm"
          >
            <PaperAirplaneIcon className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>

    {/* Mobile Full Screen Version */}
    <div className="fixed inset-0 z-50 bg-base-100 flex flex-col md:hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-base-300 bg-primary text-primary-content">
        <div className="flex items-center gap-3">
          <SparklesIcon className="w-5 h-5" />
          <div>
            <h3 className="font-semibold">AI Assistant</h3>
            <p className="text-primary-content/70 text-xs">Ask me anything!</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="btn btn-ghost btn-sm text-primary-content/70 hover:text-primary-content"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex gap-2 max-w-[85%] ${message.isUser ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                {message.isUser ? (
                  <UserIcon className="w-4 h-4 text-primary" />
                ) : (
                  <SparklesIcon className="w-4 h-4 text-secondary" />
                )}
              </div>
              <div className={`chat ${message.isUser ? 'chat-end' : 'chat-start'}`}>
                <div className={`chat-bubble ${
                  message.isUser ? 'chat-bubble-primary' : 'chat-bubble-secondary'
                }`}>
                  <p className="text-sm">{message.text}</p>
                  <p className={`text-xs mt-1 ${
                    message.isUser ? 'text-primary-content/70' : 'text-secondary-content/70'
                  }`}>
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex gap-2">
              <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                <SparklesIcon className="w-4 h-4 text-secondary" />
              </div>
              <div className="chat chat-start">
                <div className="chat-bubble chat-bubble-secondary">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-secondary-content/30 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-secondary-content/30 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-secondary-content/30 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-base-300">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message..."
            className="input input-bordered flex-1 text-sm"
            disabled={isTyping}
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            className="btn btn-primary btn-sm"
          >
            <PaperAirplaneIcon className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
    </>
  );
};

export default Chatbot; 