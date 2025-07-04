'use client'

import React from 'react'
import portfolioData from '../example.json'
import { PortfolioProvider } from './context/PortfolioContext'
import { useActiveTab } from './hooks/useActiveTab'
import { TABS } from './constants/tabs'
import ThemeSwitcher from './components/ThemeSwitcher'
import Header from './components/Header'
import MainContent from './components/MainContent'
import Footer from './components/Footer'

const PortfolioApp: React.FC = () => {
  const { activeTab, changeTab } = useActiveTab('about')

  return (
    <div className="min-h-screen bg-base-100">
      <ThemeSwitcher />
      
      <Header
        firstName={portfolioData.firstName}
        lastName={portfolioData.lastName}
        positionTitle={portfolioData.positionTitle}
        activeTab={activeTab}
        onTabChange={changeTab}
        tabs={TABS}
      />

      <MainContent activeTab={activeTab} />

      <Footer 
        firstName={portfolioData.firstName}
        lastName={portfolioData.lastName}
      />
    </div>
  )
}

const Page = () => {
  return (
    <PortfolioProvider data={portfolioData}>
      <PortfolioApp />
    </PortfolioProvider>
  )
}

export default Page