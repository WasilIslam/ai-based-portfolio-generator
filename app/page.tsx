'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { PortfolioContent } from './portfolio/page'
import { ArrowRightIcon, SparklesIcon, ChatBubbleLeftRightIcon, PaperAirplaneIcon, UserIcon, GlobeAltIcon } from '@heroicons/react/24/outline'

const Page = () => {
  const router = useRouter()
  const [isSubdomain, setIsSubdomain] = useState(false)
  const [portfolioId, setPortfolioId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    document.title = 'CutHours - AI Portfolio Platform'

    const hostname = window.location.hostname
    const subdomainMatch = hostname.match(/^([^.]+)\./)

    // List of common subdomains to ignore
    const ignoredSubdomains = ['www', 'auth', 'api', 'admin', 'app', 'cdn', 'static', 'assets', 'blog', 'docs', 'help', 'support', 'mail', 'email', 'ftp', 'smtp', 'pop', 'imap', 'webmail', 'cpanel', 'whm', 'ns1', 'ns2', 'mx1', 'mx2']

    if (subdomainMatch && !ignoredSubdomains.includes(subdomainMatch[1])) {

      if (window.location.href === "https://cuthours.com/" || window.location.href === "https://cuthours.com") {
        setIsSubdomain(false)
        setPortfolioId(null)
        setIsLoading(false)
        return
        
      } else {
        setIsSubdomain(true)
        setPortfolioId(subdomainMatch[1])
      }
    } else {

      setIsSubdomain(false)

    }

    setIsLoading(false)
  }, [router])

  // Show loading state while checking domain
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white font-serif flex items-center justify-center">
        <div className="text-center">
          <SparklesIcon className="w-12 h-12 text-white mx-auto mb-4 animate-pulse" />
          <div className="text-lg font-bold tracking-wider">CUTHOURS</div>
          <div className="text-sm text-gray-400 mt-2">Loading...</div>
        </div>
      </div>
    )
  }

  if (isSubdomain && portfolioId) {
    return <PortfolioContent portfolioId={portfolioId} />
  }

  return (
    <div className="min-h-screen bg-black text-white font-serif">
      {/* Header */}
      <header className="border-b border-gray-800 p-4 md:p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 md:gap-3">
            <SparklesIcon className="w-6 h-6 md:w-8 md:h-8 text-white" />
            <span className="text-lg md:text-2xl font-bold tracking-wider">CUTHOURS</span>
          </div>
          <button
            onClick={() => router.push('/create')}
            className="bg-white text-black px-4 md:px-6 py-2 font-medium hover:bg-gray-200 transition-colors text-sm md:text-base"
          >
            CREATE PORTFOLIO
          </button>
        </div>
      </header>

      {/* Main Content - Newspaper Layout */}
      <main className="max-w-7xl mx-auto p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 min-h-[calc(100vh-200px)]">

          {/* Left Column - Main Story */}
          <div className="lg:col-span-8 space-y-6 lg:space-y-8">
            {/* Headline */}
            <div className="border-b border-gray-800 pb-4 lg:pb-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
                RESUMES SHOULD BE
                <br />
                MINIMAL & FUTURISTIC
              </h1>
              <p className="text-lg md:text-xl text-gray-400 leading-relaxed">
                CutHours believes traditional resumes are outdated. We've built AI-powered portfolios that anyone can create for free within minutes.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
              <div className="border border-gray-800 p-4">
                <ChatBubbleLeftRightIcon className="w-6 h-6 md:w-8 md:h-8 text-white mb-3" />
                <h3 className="text-base md:text-lg font-bold mb-2">AI CHATBOT</h3>
                <p className="text-xs md:text-sm text-gray-400">Your portfolio speaks for itself</p>
              </div>
              <div className="border border-gray-800 p-4">
                <PaperAirplaneIcon className="w-6 h-6 md:w-8 md:h-8 text-white mb-3" />
                <h3 className="text-base md:text-lg font-bold mb-2">INSTANT SETUP</h3>
                <p className="text-xs md:text-sm text-gray-400">Create in minutes, not hours</p>
              </div>
              <div className="border border-gray-800 p-4">
                <UserIcon className="w-6 h-6 md:w-8 md:h-8 text-white mb-3" />
                <h3 className="text-base md:text-lg font-bold mb-2">FUTURISTIC DESIGN</h3>
                <p className="text-xs md:text-sm text-gray-400">Clean, minimal, professional</p>
              </div>
            </div>

            {/* CTA */}
            <div className="border-t border-gray-800 pt-4 lg:pt-6">
              <button
                onClick={() => router.push('/create')}
                className="bg-white text-black px-6 md:px-8 py-3 font-bold text-base md:text-lg hover:bg-gray-200 transition-colors w-full md:w-auto"
              >
                CREATE YOUR PORTFOLIO →
              </button>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-4 space-y-4 lg:space-y-6">
            {/* Company Info */}
            <div className="border border-gray-800 p-4 lg:p-6">
              <h2 className="text-lg md:text-xl font-bold mb-3 lg:mb-4 border-b border-gray-800 pb-2">ABOUT CUTHOURS</h2>
              <p className="text-xs md:text-sm text-gray-400 mb-3 lg:mb-4 leading-relaxed">
                A software company by Wasil Islam. Contact if you have a fun and exciting project.
              </p>
              <div className="text-xs text-gray-500">
                Contact: wasilislam456@gmail.com
              </div>
            </div>

            {/* Custom Domain */}
            <div className="border border-gray-800 p-4 lg:p-6">
              <h2 className="text-lg md:text-xl font-bold mb-3 lg:mb-4 border-b border-gray-800 pb-2">CUSTOM DOMAINS</h2>
              <div className="flex items-center gap-2 mb-3">
                <GlobeAltIcon className="w-4 h-4 md:w-5 md:h-5 text-white" />
                <span className="text-base md:text-lg font-mono">wasil.yourdomain.com</span>
              </div>
              <p className="text-xs md:text-sm text-gray-400 mb-3 lg:mb-4">
                Want to use your own domain? Contact us.
              </p>
              <a
                href="mailto:wasilislam456@gmail.com"
                className="text-white border border-white px-3 md:px-4 py-2 text-xs md:text-sm hover:bg-white hover:text-black transition-colors inline-block"
              >
                CONTACT US
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Full Page Example */}
      <section className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto p-4 md:p-6">
          <div className="text-center mb-6 lg:mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-2 lg:mb-4">SEE IT IN ACTION</h2>
            <p className="text-sm md:text-base text-gray-400">
              Live example of our portfolio platform
            </p>
          </div>

          <div className="w-full h-[600px] md:h-[700px] lg:h-[800px] border border-gray-800 bg-gray-900">
            <iframe
              src="/portfolio?id=wasil"
              className="w-full h-full border-0"
              title="Example Portfolio"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 p-4 md:p-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 md:gap-3 mb-2">
            <SparklesIcon className="w-5 h-5 md:w-6 md:h-6 text-white" />
            <span className="text-base md:text-lg font-bold tracking-wider">CUTHOURS</span>
          </div>
          <p className="text-xs md:text-sm text-gray-500">
            Minimal, futuristic portfolios for everyone
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Page