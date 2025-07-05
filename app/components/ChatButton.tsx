'use client'

import React from 'react';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

interface ChatButtonProps {
  onClick: () => void;
  isVisible: boolean;
}

const ChatButton: React.FC<ChatButtonProps> = ({ onClick, isVisible }) => {
  if (!isVisible) return null;
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-primary text-primary-content rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 flex items-center justify-center group"
    >
      <ChatBubbleLeftRightIcon className="w-6 h-6" />
      
      {/* Tooltip */}
      <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-base-300 text-base-content text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
        Chat with AI
        <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-base-300"></div>
      </div>
    </button>
  );
};

export default ChatButton; 