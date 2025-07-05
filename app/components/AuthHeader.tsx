'use client'

import React from 'react';
import { signOut } from '../firebase/auth';
import { useAuth } from '../hooks/useAuth';
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

const AuthHeader: React.FC = () => {
  const { user } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="bg-base-100 border-b border-base-300">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-content font-bold text-sm">C</span>
            </div>
            <h1 className="text-xl font-bold text-base-content">Cuthours</h1>
          </div>
          
          {user && (
            <button
              onClick={handleSignOut}
              className="btn btn-sm btn-ghost flex items-center"
            >
              <ArrowRightOnRectangleIcon className="w-4 h-4 mr-2" />
              Sign Out
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default AuthHeader; 