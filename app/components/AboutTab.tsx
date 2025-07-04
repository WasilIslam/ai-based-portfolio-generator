'use client'

import React from 'react'

interface Link {
  title: string
  url: string
}

interface AboutData {
  aboutParagraph: string
  skills: string[]
  links: Link[]
}

interface AboutTabProps {
  data: AboutData
}

const AboutTab: React.FC<AboutTabProps> = ({ data }) => {
  return (
    <div className="space-y-12">
      <section>
        <h2 className="text-2xl font-bold text-base-content mb-6">About</h2>
        <p className="text-lg leading-relaxed text-base-content/80">
          {data.aboutParagraph}
        </p>
      </section>
      
      <section>
        <h2 className="text-2xl font-bold text-base-content mb-6">Skills</h2>
        <div className="flex flex-wrap gap-2">
          {data.skills.map((skill, index) => (
            <span key={index} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
              {skill}
            </span>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-base-content mb-6">Links</h2>
        <div className="flex flex-wrap gap-3">
          {data.links.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 border border-primary text-primary hover:bg-primary hover:text-primary-content rounded transition-colors"
            >
              {link.title}
            </a>
          ))}
        </div>
      </section>
    </div>
  )
}

export default AboutTab 