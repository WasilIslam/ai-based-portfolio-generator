'use client'

import React from 'react';
import { PlusIcon, XMarkIcon, BriefcaseIcon, CalendarIcon, LinkIcon } from '@heroicons/react/24/outline';

interface Project {
  title: string;
  description: string;
  startDate?: string;
  endDate?: string;
  link?: string;
}

interface ProjectsSectionProps {
  projects: Project[];
  onUpdate: (projects: Project[]) => void;
}

// Modern input component
const ModernInput: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  className?: string;
}> = ({ label, value, onChange, placeholder, type = "text", className = '' }) => (
  <div className={`form-control ${className}`}>
    <label className="label">
      <span className="label-text font-medium">{label}</span>
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="input input-bordered w-full transition-all duration-200 focus:input-primary"
      placeholder={placeholder}
    />
  </div>
);

// Modern textarea component
const ModernTextarea: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
}> = ({ label, value, onChange, placeholder, rows = 4, className = '' }) => (
  <div className={`form-control ${className}`}>
    <label className="label">
      <span className="label-text font-medium">{label}</span>
    </label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="textarea textarea-bordered w-full transition-all duration-200 focus:textarea-primary resize-none"
      placeholder={placeholder}
      rows={rows}
    />
  </div>
);

const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects, onUpdate }) => {
  const addProject = () => {
    const newProject: Project = {
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      link: ''
    };
    onUpdate([...projects, newProject]);
  };

  const updateProject = (index: number, field: keyof Project, value: string) => {
    const newProjects = [...projects];
    newProjects[index] = { ...newProjects[index], [field]: value };
    onUpdate(newProjects);
  };

  const removeProject = (index: number) => {
    const newProjects = projects.filter((_, i) => i !== index);
    onUpdate(newProjects);
  };

  return (
    <div className="card bg-base-100 shadow-xl border border-base-300">
      <div className="card-body">
        {/* Add Project Button */}
        <div className="mb-6">
          <button 
            onClick={addProject} 
            className="btn btn-outline btn-primary transition-all duration-200 hover:scale-105"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Add Project
          </button>
        </div>

        {/* Projects List */}
        <div className="space-y-6">
          {projects.map((project, index) => (
            <div key={index} className="border border-base-300 rounded-xl p-6 bg-base-50/50 transition-all duration-200 hover:shadow-md">
              <div className="flex gap-6">
                <div className="flex-1 space-y-4">
                  {/* Project Title */}
                  <ModernInput
                    label="Project Title"
                    value={project.title}
                    onChange={(value) => updateProject(index, 'title', value)}
                    placeholder="Enter project title"
                  />
                  
                  {/* Project Description */}
                  <ModernTextarea
                    label="Project Description"
                    value={project.description}
                    onChange={(value) => updateProject(index, 'description', value)}
                    placeholder="Describe the project, technologies used, and your role"
                    rows={4}
                  />
                  
                  {/* Date Range */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ModernInput
                      label="Start Date"
                      value={project.startDate || ''}
                      onChange={(value) => updateProject(index, 'startDate', value)}
                      type="month"
                      className="md:col-span-1"
                    />
                    <ModernInput
                      label="End Date"
                      value={project.endDate || ''}
                      onChange={(value) => updateProject(index, 'endDate', value)}
                      type="month"
                      className="md:col-span-1"
                    />
                  </div>
                  
                  {/* Project Link */}
                  <ModernInput
                    label="Project Link (optional)"
                    value={project.link || ''}
                    onChange={(value) => updateProject(index, 'link', value)}
                    type="url"
                    placeholder="project-url.com"
                  />
                </div>
                
                {/* Remove Button */}
                <button
                  onClick={() => removeProject(index)}
                  className="btn btn-square btn-error btn-sm self-start transition-all duration-200 hover:scale-105"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          
          {projects.length === 0 && (
            <div className="text-center py-12 text-base-content/60 border-2 border-dashed border-base-300 rounded-xl">
              <BriefcaseIcon className="w-16 h-16 mx-auto mb-4 text-base-content/40" />
              <p className="text-lg font-medium mb-2">No projects yet</p>
              <p className="text-sm">Add your past work to showcase your experience and skills!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectsSection; 