'use client'

import React, { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { signInWithGoogle } from '../firebase/auth';
import AuthHeader from '../components/AuthHeader';
import Dashboard from '../components/Dashboard';
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

const CreatePage: React.FC = () => {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (user) {
      document.title = 'Dashboard | CutHours'
    } else {
      document.title = 'Create Portfolio | CutHours'
    }
  }, [user])

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-100">
        <div className="flex items-center justify-center min-h-screen">
          <div className="loading loading-spinner loading-lg"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-base-100">
        <div className="flex items-center justify-center min-h-screen">
          <div className="card bg-base-100 shadow-xl max-w-md w-full">
            <div className="card-body text-center">
              <h1 className="text-2xl font-bold mb-4">Create Your Portfolio</h1>
              <p className="text-base-content/70 mb-6">
                Sign in with Google to create and manage your portfolio
              </p>
              <button
                onClick={handleSignIn}
                className="btn btn-primary btn-lg w-full flex items-center justify-center"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5 mr-2" />
                Sign in with Google
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100">
      <AuthHeader />
      <Dashboard user={user} />
    </div>
  );
};

export default CreatePage; 