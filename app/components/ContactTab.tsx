'use client'

import React, { useState } from 'react'

interface Link {
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
}

const ContactTab: React.FC<ContactTabProps> = ({ data }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log('Form submitted:', formData)
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
            {data.links.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 border border-base-300 text-base-content hover:border-primary hover:text-primary rounded-lg transition-colors group"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                <span className="font-medium">{link.title}</span>
              </a>
            ))}
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
                ></textarea>
              </div>
              <button type="submit" className="w-full px-4 py-2 bg-primary text-primary-content rounded hover:bg-primary/90 transition-colors">
                Send Message
              </button>
            </form>
          </section>
        )}
      </div>
    </div>
  )
}

export default ContactTab 