'use client'

import { useEffect } from 'react'

interface DynamicTitleProps {
  portfolio?: {
    data: {
      firstName?: string
      lastName?: string
      positionTitle?: string
    }
  } | null
  loading?: boolean
  error?: string | null
}

const DynamicTitle: React.FC<DynamicTitleProps> = ({ portfolio, loading, error }) => {
  useEffect(() => {
    if (loading) {
      document.title = 'Loading Portfolio... | CutHours'
      return
    }

    if (error || !portfolio) {
      document.title = 'Portfolio Not Found | CutHours'
      return
    }

    const { firstName, lastName, positionTitle } = portfolio.data
    const fullName = [firstName, lastName].filter(Boolean).join(' ')
    
    if (fullName && positionTitle) {
      document.title = `${fullName} - ${positionTitle} | CutHours`
    } else if (fullName) {
      document.title = `${fullName} | CutHours`
    } else {
      document.title = 'Portfolio | CutHours'
    }
  }, [portfolio, loading, error])

  return null
}

export default DynamicTitle 