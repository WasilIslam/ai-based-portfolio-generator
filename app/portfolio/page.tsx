'use client'

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { getPortfolioByPortfolioId } from '../firebase/portfolios';
import { Portfolio } from '../firebase/portfolios';
import { PortfolioProvider } from '../context/PortfolioContext';
import { useActiveTab } from '../hooks/useActiveTab';

import { TABS } from '../constants/tabs';
import ThemeSwitcher from '../components/ThemeSwitcher';
import Header from '../components/Header';
import MainContent from '../components/MainContent';
import Footer from '../components/Footer';
import ChatButton from '../components/ChatButton';
import Chatbot from '../components/Chatbot';
import DynamicTitle from '../components/DynamicTitle';
import { ExclamationTriangleIcon, ArrowRightCircleIcon } from '@heroicons/react/24/outline';

interface PortfolioContentProps {
  portfolioId?: string;
}

const PortfolioContent: React.FC<PortfolioContentProps> = ({ portfolioId: propPortfolioId }) => {
  const searchParams = useSearchParams();
  const urlPortfolioId = searchParams.get('id');
  const portfolioId = propPortfolioId || urlPortfolioId;
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const { activeTab, changeTab } = useActiveTab('about');

  useEffect(() => {
    if (portfolioId) {
      loadPortfolio();
    } else {
      setError('No portfolio ID provided');
      setLoading(false);
    }
  }, [portfolioId]);

  const loadPortfolio = async () => {
    if (!portfolioId) return;

    try {
      setLoading(true);
      const portfolioData = await getPortfolioByPortfolioId(portfolioId);
      if (portfolioData) {
        setPortfolio(portfolioData);
        
        // Ensure the active tab is valid for this portfolio
        const validTabs = getValidTabs(portfolioData.data);
        if (!validTabs.includes(activeTab)) {
          changeTab(validTabs[0] || 'about');
        }
      } else {
        setError('Portfolio not found');
      }
    } catch (error) {
      console.error('Error loading portfolio:', error);
      setError('Error loading portfolio');
    } finally {
      setLoading(false);
    }
  };

  // Get valid tabs based on display state and data availability
  const getValidTabs = (data: any) => {
    const validTabs = ['about', 'contact']; // Always valid
    
    if (data.tabs.gallery?.display && (data.tabs.gallery?.items || []).length > 0) {
      validTabs.push('gallery');
    }
    if (data.tabs.pastProjects?.display && (data.tabs.pastProjects?.projects || []).length > 0) {
      validTabs.push('pastProjects');
    }
    if (data.tabs.blogs?.display && (data.tabs.blogs?.posts || []).length > 0) {
      validTabs.push('blogs');
    }
    if (data.tabs.ai?.chatbot?.enabled) {
      validTabs.push('ai');
    }
    
    return validTabs;
  };

  // Handle tab change with validation
  const handleTabChange = (tabId: string) => {
    if (portfolio) {
      const validTabs = getValidTabs(portfolio.data);
      if (validTabs.includes(tabId)) {
        changeTab(tabId);
      }
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

  if (error || !portfolio) {
    return (
      <div className="min-h-screen bg-base-100">
        <div className="flex items-center justify-center min-h-screen">
          <div className="card bg-base-100 shadow-xl max-w-md w-full">
            <div className="card-body text-center">
              <ExclamationTriangleIcon className="w-10 h-10 text-error mx-auto mb-2" />
              <h1 className="text-2xl font-bold mb-4 text-error">Portfolio Not Found</h1>
              <p className="text-base-content/70 mb-6">
                {error || 'The portfolio you are looking for does not exist.'}
              </p>
              <a href="/create" className="btn btn-primary flex items-center justify-center">
                <ArrowRightCircleIcon className="w-5 h-5 mr-2" />
                Create Your Portfolio
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <PortfolioProvider data={portfolio.data}>
      <DynamicTitle portfolio={portfolio} loading={loading} error={error} />
      <div className="min-h-screen bg-base-100">
        <ThemeSwitcher />
        

        
        <Header
          firstName={portfolio.data.firstName}
          lastName={portfolio.data.lastName}
          positionTitle={portfolio.data.positionTitle}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          tabs={TABS.filter(tab => getValidTabs(portfolio.data).includes(tab.id))}
        />

        <MainContent activeTab={activeTab} portfolioData={portfolio} />

        <Footer 
          firstName={portfolio.data.firstName}
          lastName={portfolio.data.lastName}
        />

        {/* AI Chatbot */}
        {portfolio.data.tabs.ai?.chatbot?.enabled && (
          <>
            <ChatButton 
              onClick={() => setIsChatbotOpen(true)} 
              isVisible={!isChatbotOpen}
            />
            <Chatbot 
              isOpen={isChatbotOpen} 
              onClose={() => setIsChatbotOpen(false)}
              portfolioData={portfolio}
            />
          </>
        )}
      </div>
    </PortfolioProvider>
  );
};

// Loading fallback component
const PortfolioLoading = () => (
  <div className="min-h-screen bg-base-100">
    <div className="flex items-center justify-center min-h-screen">
      <div className="loading loading-spinner loading-lg"></div>
    </div>
  </div>
);

// Next.js page component (no props)
const PortfolioPage: React.FC = () => {
  return (
    <Suspense fallback={<PortfolioLoading />}>
      <PortfolioContent />
    </Suspense>
  );
};

export default PortfolioPage;
export { PortfolioContent }; 