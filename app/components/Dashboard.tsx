'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { getPortfolioByUserId } from '../firebase/portfolios'
import { Portfolio } from '../firebase/portfolios'
import PortfolioForm from './PortfolioForm'
import ResponsesTab from './ResponsesTab'
import {
  UserIcon,
  DocumentTextIcon,
  ChartBarIcon,
  CogIcon,
  EyeIcon
} from '@heroicons/react/24/outline'

interface DashboardProps {
  user: any
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'edit' | 'responses' | 'view'>('edit')

  useEffect(() => {
    loadPortfolio()
  }, [user])

  const loadPortfolio = async () => {
    if (!user?.uid) return

    try {
      setLoading(true)
      const portfolioData = await getPortfolioByUserId(user.uid)
      setPortfolio(portfolioData)
    } catch (error) {
      console.error('Error loading portfolio:', error)
    } finally {
      setLoading(false)
    }
  }

  const getTabIcon = (tabId: string) => {
    switch (tabId) {
      case 'edit':
        return <DocumentTextIcon className="w-5 h-5" />
      case 'responses':
        return <ChartBarIcon className="w-5 h-5" />
      case 'view':
        return <EyeIcon className="w-5 h-5" />
      default:
        return <CogIcon className="w-5 h-5" />
    }
  }

  const tabs = [
    { id: 'edit', label: 'Edit Portfolio', icon: getTabIcon('edit') },
    { id: 'responses', label: 'Responses', icon: getTabIcon('responses') },
    { id: 'view', label: 'View Portfolio', icon: getTabIcon('view') }
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'edit':
        return <PortfolioForm />
      case 'responses':
        return portfolio ? <ResponsesTab portfolioData={portfolio} /> : (
          <div className="text-center py-12">
            <ChartBarIcon className="w-12 h-12 text-base-content/30 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Portfolio Found</h3>
            <p className="text-base-content/60">Create your portfolio first to view responses</p>
          </div>
        )
      case 'view':
        return portfolio ? (
          <div className="text-center py-12">
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-4">Your Portfolio</h3>
              <p className="text-base-content/60 mb-6">
                Share this link with others to view your portfolio
              </p>
              <div className="bg-base-200 p-4 rounded-lg mb-4">
                <code className="text-sm break-all">
                  {portfolio.portfolioId}.{window.location.origin}
                </code>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`${portfolio.portfolioId}.${window.location.origin}`)
                }}
                className="btn btn-primary"
              >
                Copy Link
              </button>
            </div>
            <a
              href={`${portfolio.portfolioId}.${window.location.origin}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
            >
              <EyeIcon className="w-4 h-4 mr-2" />
              Open Portfolio
            </a>
          </div>
        ) : (
          <div className="text-center py-12">
            <EyeIcon className="w-12 h-12 text-base-content/30 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Portfolio Found</h3>
            <p className="text-base-content/60">Create your portfolio first to view it</p>
          </div>
        )
      default:
        return <PortfolioForm />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-base-content/60">Manage your portfolio and view responses</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="tabs tabs-boxed">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`tab ${activeTab === tab.id ? 'tab-active' : ''}`}
            >
              {tab.icon}
              <span className="ml-2">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="bg-base-100 rounded-lg border border-base-300">
        {renderTabContent()}
      </div>
    </div>
  )
}

export default Dashboard 