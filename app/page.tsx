'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import PortfolioPage from './portfolio/page'

const Page = () => {
  const router = useRouter()
  const [isSubdomain, setIsSubdomain] = useState(false)
  const [portfolioId, setPortfolioId] = useState<string | null>(null)

  useEffect(() => {
    // Set title for loading state
    document.title = 'Loading... | CutHours'
    
    // Check if we're on a subdomain
    const hostname = window.location.hostname
    const subdomainMatch = hostname.match(/^([^.]+)\./)
    
    if (subdomainMatch && subdomainMatch[1] !== 'www') {
      // We're on a subdomain, treat the subdomain as portfolio ID
      setIsSubdomain(true)
      setPortfolioId(subdomainMatch[1])
    } else {
      // No subdomain, redirect to create
      router.push('/create')
    }
  }, [router])

  // If we're on a subdomain, render the portfolio component
  if (isSubdomain && portfolioId) {
    return <PortfolioPage portfolioId={portfolioId} />
  }

  // Loading state while checking subdomain
  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center">
      <div className="loading loading-spinner loading-lg"></div>
    </div>
  )
}

export default Page