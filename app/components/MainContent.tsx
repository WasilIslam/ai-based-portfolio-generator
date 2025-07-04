'use client'

import React from 'react'
import { usePortfolio } from '../context/PortfolioContext'
import AboutTab from './AboutTab'
import GalleryTab from './GalleryTab'
import ProjectsTab from './ProjectsTab'
import ContactTab from './ContactTab'

interface MainContentProps {
  activeTab: string
}

const MainContent: React.FC<MainContentProps> = ({ activeTab }) => {
  const { portfolioData } = usePortfolio()

  const renderTabContent = () => {
    switch (activeTab) {
      case 'about':
        return <AboutTab data={portfolioData.tabs.about} />
      case 'gallery':
        return <GalleryTab items={portfolioData.tabs.gallery} />
      case 'pastProjects':
        return <ProjectsTab projects={portfolioData.tabs.pastProjects} />
      case 'contact':
        return <ContactTab data={portfolioData.tabs.contact} />
      default:
        return <AboutTab data={portfolioData.tabs.about} />
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