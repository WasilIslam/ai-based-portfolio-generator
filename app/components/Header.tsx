'use client'

import React from 'react'

interface Tab {
  readonly id: string
  readonly label: string
}

type TabArray = readonly Tab[]

interface HeaderProps {
  firstName: string
  lastName: string
  positionTitle: string
  activeTab: string
  onTabChange: (tabId: string) => void
  tabs: TabArray
}

const Header: React.FC<HeaderProps> = ({
  firstName,
  lastName,
  positionTitle,
  activeTab,
  onTabChange,
  tabs
}) => {
  return (
    <header className="sticky top-0 z-40 bg-base-100/95 backdrop-blur-sm border-b border-base-300">
      <div className="max-w-4xl mx-auto px-6 py-6">
        <div className="flex flex-col">
          <div className="mb-4">
            <h1 className="text-4xl font-bold text-base-content mb-2">
              {firstName} {lastName}
            </h1>
            <p className="text-xl text-base-content/60">
              {positionTitle}
            </p>
          </div>
          
          {/* Navigation */}
          <nav>
            <div className="flex gap-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    activeTab === tab.id 
                      ? 'text-primary border-b-2 border-primary' 
                      : 'text-base-content/60 hover:text-base-content'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header 