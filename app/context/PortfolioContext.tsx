'use client'

import React, { createContext, useContext, ReactNode } from 'react'

interface PortfolioData {
  firstName: string
  lastName: string
  positionTitle: string
  tabs: {
    about: {
      aboutParagraph: string
      skills: string[]
      links: Array<{ title: string; url: string }>
    }
    gallery: {
      display: boolean
      items: Array<{
        title: string
        description: string
        imageLink: string
      }>
    }
    pastProjects: {
      display: boolean
      projects: Array<{
        title: string
        description: string
        startDate?: string
        endDate?: string
        link?: string
      }>
    }
    blogs: {
      display: boolean
      posts: Array<{
        title: string
        description: string
        content: string
      }>
    }
    ai: {
      chatbot: {
        enabled: boolean
      }
    }
    contact: {
      links: Array<{ type: string; title: string; url: string }>
      contactForm: { enabled: boolean }
    }
  }
}

interface PortfolioContextType {
  portfolioData: PortfolioData
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined)

interface PortfolioProviderProps {
  children: ReactNode
  data: PortfolioData
}

export const PortfolioProvider: React.FC<PortfolioProviderProps> = ({ children, data }) => {
  return (
    <PortfolioContext.Provider value={{ portfolioData: data }}>
      {children}
    </PortfolioContext.Provider>
  )
}

export const usePortfolio = (): PortfolioContextType => {
  const context = useContext(PortfolioContext)
  if (context === undefined) {
    throw new Error('usePortfolio must be used within a PortfolioProvider')
  }
  return context
} 