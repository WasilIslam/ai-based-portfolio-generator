'use client'

import React, { useState, useEffect } from 'react'
import { 
  EnvelopeIcon, 
  ChatBubbleLeftRightIcon,
  CalendarIcon,
  UserIcon,
  ClockIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline'
import { getContactResponsesByUserId } from '../firebase/contacts'
import { getChatMessagesByUserId } from '../firebase/ai-chat'

interface ContactResponse {
  id: string
  name: string
  email: string
  subject: string
  message: string
  createdAt: any
  status: string
  ipAddress?: string
  userAgent?: string
}

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: any
  sessionId: string
  metadata?: {
    userAgent?: string
    ipAddress?: string
    responseTime?: number
  }
}

interface ResponsesTabProps {
  portfolioData?: any
}

const ResponsesTab: React.FC<ResponsesTabProps> = ({ portfolioData }) => {
  const [contactResponses, setContactResponses] = useState<ContactResponse[]>([])
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'contacts' | 'chats'>('contacts')
  const [showFullMessage, setShowFullMessage] = useState<string | null>(null)

  useEffect(() => {
    if (portfolioData?.portfolioId || portfolioData?.id) {
      loadResponses()
    }
  }, [portfolioData])

  const loadResponses = async () => {
    try {
      setLoading(true)
      const userId = portfolioData?.userId
      
      console.log('=== RESPONSES TAB DEBUG ===')
      console.log('Loading responses for user:', userId)
      console.log('Portfolio data:', portfolioData)
      console.log('Portfolio data keys:', Object.keys(portfolioData || {}))

      if (!userId) {
        console.error('No userId found in portfolio data')
        setContactResponses([])
        setChatMessages([])
        return
      }

      // Load contact responses
      console.log('Loading contact responses for userId:', userId)
      const contacts = await getContactResponsesByUserId(userId)
      console.log('Contact responses loaded:', contacts)
      setContactResponses(contacts)

      // Load chat messages
      console.log('Loading chat messages for userId:', userId)
      const chats = await getChatMessagesByUserId(userId, 20)
      console.log('Chat messages loaded:', chats)
      console.log('Chat messages count:', chats.length)
      console.log('Sample chat message:', chats[0])
      setChatMessages(chats)
      
      console.log('=== END RESPONSES TAB DEBUG ===')
    } catch (error) {
      console.error('Error loading responses:', error)
      setContactResponses([])
      setChatMessages([])
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Unknown'
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  const toggleMessage = (messageId: string) => {
    setShowFullMessage(showFullMessage === messageId ? null : messageId)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="loading loading-spinner loading-lg"></div>
        <div className="ml-4">Loading responses...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Debug Info */}
      <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
        <strong>Debug Info:</strong><br/>
        Portfolio ID: {portfolioData?.portfolioId || portfolioData?.id || 'Unknown'}<br/>
        Contact Responses: {contactResponses.length}<br/>
        Chat Messages: {chatMessages.length}<br/>
        Chat Sessions: {(() => {
          const sessions = new Map<string, ChatMessage[]>()
          chatMessages.forEach(msg => {
            if (!sessions.has(msg.sessionId)) {
              sessions.set(msg.sessionId, [])
            }
            sessions.get(msg.sessionId)!.push(msg)
          })
          return sessions.size
        })()}
      </div>

      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-base-content mb-2">Responses</h2>
        <p className="text-base-content/60">View contact form submissions and chat interactions</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center">
        <div className="tabs tabs-boxed">
          <button
            className={`tab ${activeTab === 'contacts' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('contacts')}
          >
            <EnvelopeIcon className="w-4 h-4 mr-2" />
            Contact Forms ({contactResponses.length})
          </button>
          <button
            className={`tab ${activeTab === 'chats' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('chats')}
          >
            <ChatBubbleLeftRightIcon className="w-4 h-4 mr-2" />
            AI Chats ({(() => {
              const sessions = new Map<string, ChatMessage[]>()
              chatMessages.forEach(msg => {
                if (!sessions.has(msg.sessionId)) {
                  sessions.set(msg.sessionId, [])
                }
                sessions.get(msg.sessionId)!.push(msg)
              })
              return sessions.size
            })()})
          </button>
        </div>
      </div>

      {/* Contact Responses */}
      {activeTab === 'contacts' && (
        <div className="space-y-4">
          {contactResponses.length === 0 ? (
            <div className="text-center py-12">
              <EnvelopeIcon className="w-12 h-12 text-base-content/30 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Contact Responses</h3>
              <p className="text-base-content/60">Contact form responses will appear here</p>
            </div>
          ) : (
            contactResponses.map((response) => (
              <div key={response.id} className="card bg-base-100 shadow-sm border border-base-300">
                <div className="card-body p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="avatar placeholder">
                        <div className="bg-primary text-primary-content rounded-full w-10">
                          <UserIcon className="w-5 h-5" />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold">{response.name}</h3>
                        <p className="text-sm text-base-content/60">{response.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-sm text-base-content/60">
                        <CalendarIcon className="w-4 h-4" />
                        {formatDate(response.createdAt)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <h4 className="font-medium text-base-content mb-1">{response.subject}</h4>
                    <div className="text-sm text-base-content/70">
                      {showFullMessage === response.id ? (
                        <div>
                          <p className="whitespace-pre-wrap">{response.message}</p>
                          <button
                            onClick={() => toggleMessage(response.id)}
                            className="btn btn-ghost btn-xs mt-2"
                          >
                            <EyeSlashIcon className="w-3 h-3 mr-1" />
                            Show Less
                          </button>
                        </div>
                      ) : (
                        <div>
                          <p>{truncateText(response.message, 150)}</p>
                          {response.message.length > 150 && (
                            <button
                              onClick={() => toggleMessage(response.id)}
                              className="btn btn-ghost btn-xs mt-2"
                            >
                              <EyeIcon className="w-3 h-3 mr-1" />
                              Read More
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="badge badge-outline badge-sm">
                        {response.status || 'sent'}
                      </span>
                      {response.ipAddress && (
                        <span className="text-xs text-base-content/50">
                          IP: {response.ipAddress}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Chat Messages */}
      {activeTab === 'chats' && (
        <div className="space-y-4">
          {chatMessages.length === 0 ? (
            <div className="text-center py-12">
              <ChatBubbleLeftRightIcon className="w-12 h-12 text-base-content/30 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Chat Messages</h3>
              <p className="text-base-content/60">AI chat interactions will appear here</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Group messages by session */}
              {(() => {
                const sessions = new Map<string, ChatMessage[]>()
                chatMessages.forEach(msg => {
                  if (!sessions.has(msg.sessionId)) {
                    sessions.set(msg.sessionId, [])
                  }
                  sessions.get(msg.sessionId)!.push(msg)
                })

                return Array.from(sessions.entries()).map(([sessionId, messages]) => {
                  const userMessages = messages.filter(m => m.role === 'user')
                  const assistantMessages = messages.filter(m => m.role === 'assistant')
                  const lastMessage = messages[messages.length - 1]

                  return (
                    <div key={sessionId} className="card bg-base-100 shadow-sm border border-base-300">
                      <div className="card-body p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <ChatBubbleLeftRightIcon className="w-5 h-5 text-secondary" />
                            <span className="font-medium">Chat Session</span>
                          </div>
                          <div className="text-sm text-base-content/60">
                            {formatDate(lastMessage.timestamp)}
                          </div>
                        </div>

                        <div className="space-y-2">
                          {userMessages.slice(-2).map((msg, index) => (
                            <div key={msg.id} className="flex items-start gap-2">
                              <div className="avatar placeholder">
                                <div className="bg-primary text-primary-content rounded-full w-6">
                                  <UserIcon className="w-3 h-3" />
                                </div>
                              </div>
                              <div className="flex-1">
                                <p className="text-sm bg-base-200 rounded-lg p-2">
                                  {showFullMessage === msg.id ? (
                                    <span>{msg.content}</span>
                                  ) : (
                                    <span>{truncateText(msg.content, 80)}</span>
                                  )}
                                </p>
                                {msg.content.length > 80 && (
                                  <button
                                    onClick={() => toggleMessage(msg.id)}
                                    className="btn btn-ghost btn-xs mt-1"
                                  >
                                    {showFullMessage === msg.id ? (
                                      <>
                                        <EyeSlashIcon className="w-3 h-3 mr-1" />
                                        Less
                                      </>
                                    ) : (
                                      <>
                                        <EyeIcon className="w-3 h-3 mr-1" />
                                        More
                                      </>
                                    )}
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-base-300">
                          <div className="flex items-center gap-4 text-sm text-base-content/60">
                            <span>{userMessages.length} messages</span>
                            <span>{assistantMessages.length} responses</span>
                            {messages[0]?.metadata?.ipAddress && (
                              <span>IP: {messages[0].metadata.ipAddress}</span>
                            )}
                          </div>
                          <span className="text-xs text-base-content/40">
                            Session: {sessionId.slice(-8)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })
              })()}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ResponsesTab 