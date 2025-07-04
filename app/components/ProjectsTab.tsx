'use client'

import React from 'react'
import { formatDate } from '../utils/textUtils'

interface Project {
  title: string
  description: string
  startDate?: string
  endDate?: string
  link?: string
}

interface ProjectsTabProps {
  projects: Project[]
}

const ProjectsTab: React.FC<ProjectsTabProps> = ({ projects }) => {
  return (
    <div className="space-y-12">
      <section>
        <h2 className="text-2xl font-bold text-base-content mb-6">Projects</h2>
        <div className="space-y-6">
          {projects.map((project, index) => (
            <div key={index} className="p-6 border border-base-300 rounded-lg hover:border-primary transition-colors">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4">
                <h3 className="text-xl font-bold text-base-content mb-2 sm:mb-0">{project.title}</h3>
                {(project.startDate || project.endDate) && (
                  <div className="text-sm text-base-content/60">
                    {project.startDate && formatDate(project.startDate)}
                    {project.startDate && project.endDate && ' - '}
                    {project.endDate && formatDate(project.endDate)}
                  </div>
                )}
              </div>
              <p className="text-base-content/80 leading-relaxed mb-4">{project.description}</p>
              {project.link && (
                <a 
                  href={project.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block px-4 py-2 bg-primary text-primary-content rounded hover:bg-primary/90 transition-colors"
                >
                  View Project
                </a>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default ProjectsTab 