'use client'

import React, { useState } from 'react'
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  LinkIcon,
  ChatBubbleLeftRightIcon,
  VideoCameraIcon,
  CalendarIcon,
  UserIcon,
  CommandLineIcon,
  GlobeAltIcon,
  BriefcaseIcon,
  DocumentTextIcon,
  RssIcon,
  DocumentIcon
} from '@heroicons/react/24/outline'

interface Link {
  type: string
  title: string
  url: string
}

interface ContactForm {
  enabled: boolean
}

interface ContactData {
  links: Link[]
  contactForm: ContactForm
}

interface ContactTabProps {
  data: ContactData
  portfolioData?: any
}

const ContactTab: React.FC<ContactTabProps> = ({ data, portfolioData }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [submitMessage, setSubmitMessage] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!portfolioData) {
      setSubmitStatus('error')
      setSubmitMessage('Portfolio data not available')
      return
    }

    setIsSubmitting(true)
    setSubmitStatus('idle')
    setSubmitMessage('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          portfolioId: portfolioData.portfolioId || portfolioData.id,
          creatorEmail: portfolioData.userEmail,
          creatorName: portfolioData.userName || `${portfolioData.firstName} ${portfolioData.lastName}`
        }),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        setSubmitStatus('success')
        setSubmitMessage('Message sent successfully! We\'ll get back to you soon.')
        setFormData({ name: '', email: '', subject: '', message: '' })
      } else {
        setSubmitStatus('error')
        setSubmitMessage(result.error || 'Failed to send message. Please try again.')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      setSubmitStatus('error')
      setSubmitMessage('An error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Connect Section - Left Side */}
        <section>
          <h2 className="text-2xl font-bold text-base-content mb-6">
            Connect
          </h2>
          <div className="space-y-4">
            {data.links.map((link, index) => {
              const getIcon = (type: string) => {
                switch (type) {
                  case 'email':
                    return <EnvelopeIcon className="w-5 h-5" />
                  case 'phone':
                    return <PhoneIcon className="w-5 h-5" />
                  case 'whatsapp':
                  case 'telegram':
                  case 'discord':
                    return <ChatBubbleLeftRightIcon className="w-5 h-5" />
                  case 'skype':
                    return <VideoCameraIcon className="w-5 h-5" />
                  case 'zoom':
                    return <VideoCameraIcon className="w-5 h-5" />
                  case 'calendly':
                    return <CalendarIcon className="w-5 h-5" />
                  case 'linkedin':
                    return <UserIcon className="w-5 h-5" />
                  case 'github':
                    return <CommandLineIcon className="w-5 h-5" />
                  case 'twitter':
                    return <UserIcon className="w-5 h-5" />
                  case 'instagram':
                    return <UserIcon className="w-5 h-5" />
                  case 'facebook':
                    return <UserIcon className="w-5 h-5" />
                  case 'youtube':
                    return <VideoCameraIcon className="w-5 h-5" />
                  case 'twitch':
                    return <VideoCameraIcon className="w-5 h-5" />
                  case 'website':
                    return <GlobeAltIcon className="w-5 h-5" />
                  case 'portfolio':
                    return <BriefcaseIcon className="w-5 h-5" />
                  case 'blog':
                    return <RssIcon className="w-5 h-5" />
                  case 'resume':
                    return <DocumentIcon className="w-5 h-5" />
                  case 'custom':
                  default:
                    return <LinkIcon className="w-5 h-5" />
                }
              };

              return (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-3 border border-base-300 text-base-content hover:border-primary hover:text-primary rounded-lg transition-colors group"
                >
                  {getIcon(link.type)}
                  <span className="font-medium">{link.title}</span>
                </a>
              );
            })}
          </div>
        </section>

        {/* Contact Form - Right Side */}
        {data.contactForm.enabled && (
          <section>
            <h2 className="text-2xl font-bold text-base-content mb-6">
              Get in Touch
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-base-content mb-1">Name</label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-base-300 rounded focus:border-primary focus:outline-none" 
                    required 
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-base-content mb-1">Email</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-base-300 rounded focus:border-primary focus:outline-none" 
                    required 
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-base-content mb-1">Subject</label>
                <input 
                  type="text" 
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-base-300 rounded focus:border-primary focus:outline-none" 
                  required 
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-base-content mb-1">Message</label>
                <textarea 
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-base-300 rounded focus:border-primary focus:outline-none h-32 resize-none" 
                  required
                  disabled={isSubmitting}
                ></textarea>
              </div>
              {submitStatus === 'success' && (
                <div className="p-3 bg-success/10 border border-success/20 rounded text-success text-sm">
                  {submitMessage}
                </div>
              )}
              
              {submitStatus === 'error' && (
                <div className="p-3 bg-error/10 border border-error/20 rounded text-error text-sm">
                  {submitMessage}
                </div>
              )}
              
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full px-4 py-2 bg-primary text-primary-content rounded hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </section>
        )}
      </div>
    </div>
  )
}

export default ContactTab 