'use client'

import React from 'react'
import { usePortfolio } from '../context/PortfolioContext'
import AboutTab from './AboutTab'
import GalleryTab from './GalleryTab'
import ProjectsTab from './ProjectsTab'
import BlogsTab from './BlogsTab'
import ContactTab from './ContactTab'

interface MainContentProps {
  activeTab: string
  portfolioData?: any
}

const MainContent: React.FC<MainContentProps> = ({ activeTab, portfolioData: propPortfolioData }) => {
  const { portfolioData: contextPortfolioData } = usePortfolio()
  const portfolioData = propPortfolioData || contextPortfolioData

  const renderTabContent = () => {
    // Ensure portfolioData exists and has the required structure
    if (!portfolioData || !portfolioData.data || !portfolioData.data.tabs) {
      return (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold mb-2">Data Not Available</h2>
          <p className="text-base-content/60">Portfolio data is not properly loaded.</p>
        </div>
      );
    }

    const tabs = portfolioData.data.tabs;

    switch (activeTab) {
      case 'about':
        return <AboutTab data={tabs.about || {}} />
      case 'gallery':
        return tabs.gallery?.display && (tabs.gallery?.items || []).length > 0 ? (
          <GalleryTab items={tabs.gallery.items || []} />
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🖼️</div>
            <h2 className="text-2xl font-bold mb-2">Gallery Not Available</h2>
            <p className="text-base-content/60">This section is either disabled or has no content.</p>
          </div>
        )
      case 'pastProjects':
        return tabs.pastProjects?.display && (tabs.pastProjects?.projects || []).length > 0 ? (
          <ProjectsTab projects={tabs.pastProjects.projects || []} />
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💼</div>
            <h2 className="text-2xl font-bold mb-2">Projects Not Available</h2>
            <p className="text-base-content/60">This section is either disabled or has no content.</p>
          </div>
        )
      case 'blogs':
        return tabs.blogs?.display && (tabs.blogs?.posts || []).length > 0 ? (
          <BlogsTab posts={tabs.blogs.posts || []} />
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-2xl font-bold mb-2">Blogs Not Available</h2>
            <p className="text-base-content/60">This section is either disabled or has no content.</p>
          </div>
        )
      case 'contact':
        return <ContactTab data={tabs.contact || {}} portfolioData={portfolioData} />
      default:
        return <AboutTab data={tabs.about || {}} />
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <main>
        {renderTabContent()}
      </main>
    </div>
  )
}

export default MainContent 