import { useState, useCallback } from 'react'

export const useActiveTab = (initialTab: string = 'about') => {
  const [activeTab, setActiveTab] = useState(initialTab)

  const changeTab = useCallback((tabId: string) => {
    setActiveTab(tabId)
  }, [])

  return { activeTab, changeTab }
} 