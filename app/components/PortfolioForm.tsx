'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { createPortfolio, getPortfolioByUserId, updatePortfolio, checkPortfolioIdAvailability } from '../firebase/portfolios';
import { PlusIcon, XMarkIcon, LinkIcon, CheckIcon, ExclamationTriangleIcon, CloudArrowUpIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { getPortfolioUrl } from '../utils/domainUtils';
import { ensureHttps } from '../utils/urlUtils';
import GallerySection from './GallerySection';
import ProjectsSection from './ProjectsSection';
import BlogsSection from './BlogsSection';
import AutocompleteInput from './AutocompleteInput';
import ContactLinkInput from './ContactLinkInput';
import suggestions from '../../suggestions.json';

const defaultPortfolioData = {
  firstName: "",
  lastName: "",
  positionTitle: "",
  tabs: {
    about: {
      aboutParagraph: "",
      skills: [] as string[],
      links: [] as Array<{ title: string; url: string }>
    },
    gallery: {
      display: true,
      items: [] as Array<{ title: string; description: string; imageLink: string }>
    },
    pastProjects: {
      display: true,
      projects: [] as Array<{ title: string; description: string; startDate?: string; endDate?: string; link?: string }>
    },
    blogs: {
      display: true,
      posts: [] as Array<{ title: string; description: string; content: string }>
    },
    ai: {
      chatbot: {
        enabled: false,
        instructions: ''
      }
    },
    contact: {
      contactForm: {
        enabled: true
      },
      links: [] as Array<{ type: string; title: string; url: string }>
    }
  }
};

// Custom hook for debouncing
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Modern input component
const ModernInput: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  error?: string;
  className?: string;
}> = ({ label, value, onChange, placeholder, type = "text", error, className = '' }) => (
  <div className={`form-control ${className}`}>
    <label className="label">
      <span className="label-text font-medium">{label}</span>
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`input input-bordered w-full transition-all duration-200 focus:input-primary ${error ? 'input-error' : ''
        }`}
      placeholder={placeholder}
    />
    {error && (
      <label className="label">
        <span className="label-text-alt text-error">{error}</span>
      </label>
    )}
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

// Dynamic list component for skills and links
const DynamicList: React.FC<{
  items: Array<{ title: string; url?: string }>;
  onAdd: () => void;
  onUpdate: (index: number, field: string, value: string) => void;
  onRemove: (index: number) => void;
  addButtonText: string;
  titlePlaceholder: string;
  urlPlaceholder?: string;
  showUrl?: boolean;
}> = ({ items, onAdd, onUpdate, onRemove, addButtonText, titlePlaceholder, urlPlaceholder, showUrl = false }) => (
  <div className="space-y-3">
    {items.map((item, index) => (
      <div key={index} className="flex gap-3 items-start">
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            type="text"
            value={item.title}
            onChange={(e) => onUpdate(index, 'title', e.target.value)}
            className="input input-bordered input-sm transition-all duration-200 focus:input-primary"
            placeholder={titlePlaceholder}
          />
          {showUrl && (
            <input
              type="url"
              value={item.url || ''}
              onChange={(e) => onUpdate(index, 'url', e.target.value)}
              className="input input-bordered input-sm transition-all duration-200 focus:input-primary"
              placeholder={urlPlaceholder}
            />
          )}
        </div>
        <button
          onClick={() => onRemove(index)}
          className="btn btn-square btn-error btn-sm transition-all duration-200 hover:scale-105"
        >
          <XMarkIcon className="w-4 h-4" />
        </button>
      </div>
    ))}
    <button
      onClick={onAdd}
      className="btn btn-outline btn-sm w-full transition-all duration-200 hover:btn-primary"
    >
      <PlusIcon className="w-4 h-4 mr-2" />
      {addButtonText}
    </button>
  </div>
);

const PortfolioForm: React.FC = () => {
  const { user } = useAuth();
  const [portfolioId, setPortfolioId] = useState('');
  const [originalPortfolioId, setOriginalPortfolioId] = useState('');
  const [portfolioData, setPortfolioData] = useState(defaultPortfolioData);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [existingPortfolio, setExistingPortfolio] = useState<any>(null);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);

  // Debounce portfolio ID changes for availability checking
  const debouncedPortfolioId = useDebounce(portfolioId, 500);

  // Memoized validation state
  const validationState = useMemo(() => {
    const isValid = portfolioId.length > 0 && /^[a-z0-9-]+$/.test(portfolioId);
    const isChanged = portfolioId !== originalPortfolioId;
    const canSave = isValid && (isChanged ? isAvailable : true);
    return { isValid, isChanged, canSave };
  }, [portfolioId, originalPortfolioId, isAvailable]);

  // Migrate portfolio data to new structure
  const migratePortfolioData = (data: any) => {
    const migrated = { ...data };
    
    // Migrate gallery if it's an array
    if (Array.isArray(data.tabs?.gallery)) {
      migrated.tabs.gallery = {
        display: true,
        items: data.tabs.gallery
      };
    } else if (!data.tabs?.gallery?.display) {
      migrated.tabs.gallery = {
        display: true,
        items: data.tabs?.gallery?.items || []
      };
    }
    
    // Migrate pastProjects if it's an array
    if (Array.isArray(data.tabs?.pastProjects)) {
      migrated.tabs.pastProjects = {
        display: true,
        projects: data.tabs.pastProjects
      };
    } else if (!data.tabs?.pastProjects?.display) {
      migrated.tabs.pastProjects = {
        display: true,
        projects: data.tabs?.pastProjects?.projects || []
      };
    }
    
    // Add blogs section if it doesn't exist
    if (!data.tabs?.blogs) {
      migrated.tabs.blogs = {
        display: true,
        posts: []
      };
    }
    
    // Add AI section if it doesn't exist
    if (!data.tabs?.ai) {
      migrated.tabs.ai = {
        chatbot: {
          enabled: false,
          instructions: ''
        }
      };
    } else if (!data.tabs.ai.chatbot?.instructions) {
      // Add instructions field if it doesn't exist
      migrated.tabs.ai.chatbot = {
        ...migrated.tabs.ai.chatbot,
        instructions: ''
      };
    }
    
    return migrated;
  };

  // Load existing portfolio
  const loadExistingPortfolio = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const portfolio = await getPortfolioByUserId(user.uid);
      if (portfolio) {
        setExistingPortfolio(portfolio);
        setPortfolioId(portfolio.portfolioId);
        setOriginalPortfolioId(portfolio.portfolioId);
        
        // Migrate data to new structure if needed
        const migratedData = migratePortfolioData(portfolio.data);
        setPortfolioData(migratedData);
        setIsAvailable(true); // Existing portfolio is always available
      } else {
        // Generate a default portfolio ID
        const defaultId = user.displayName?.toLowerCase().replace(/\s+/g, '-') || `user-${user.uid.slice(0, 8)}`;
        setPortfolioId(defaultId);
        setOriginalPortfolioId(defaultId);
        setIsAvailable(false);

        // Pre-fill with Google user data
        try {
          const names = user.displayName?.split(' ') || [];
          const firstName = names[0] || '';
          const lastName = names.slice(1).join(' ') || '';

          setPortfolioData(prev => ({
            ...prev,
            firstName,
            lastName
          }));
        } catch (error) {
          console.error('Error parsing user name:', error);
        }
      }
    } catch (error) {
      console.error('Error loading portfolio:', error);
      setMessage('Error loading portfolio');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadExistingPortfolio();
    }
  }, [user, loadExistingPortfolio]);

  // Check portfolio ID availability when debounced value changes
  useEffect(() => {
    const checkAvailability = async () => {
      if (!debouncedPortfolioId || debouncedPortfolioId === originalPortfolioId) {
        setMessage('');
        setIsAvailable(originalPortfolioId === debouncedPortfolioId);
        return;
      }

      if (!validationState.isValid) {
        setMessage('');
        setIsAvailable(false);
        return;
      }

      try {
        setIsCheckingAvailability(true);
        const available = await checkPortfolioIdAvailability(debouncedPortfolioId);
        setIsAvailable(available);
        if (!available) {
          setMessage('ID taken');
        } else {
          setMessage('Available');
        }
      } catch (error) {
        console.error('Error checking availability:', error);
        setMessage('Error');
        setIsAvailable(false);
      } finally {
        setIsCheckingAvailability(false);
      }
    };

    checkAvailability();
  }, [debouncedPortfolioId, originalPortfolioId, validationState.isValid]);

  // Handle portfolio ID change
  const handlePortfolioIdChange = useCallback((newId: string) => {
    const sanitizedId = newId.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setPortfolioId(sanitizedId);
  }, []);

  // Save portfolio with URL formatting
  const handleSave = useCallback(async () => {
    if (!user || !portfolioId || !validationState.canSave) return;

    try {
      setSaving(true);

      // Format URLs before saving
      const formattedData = {
        ...portfolioData,
        tabs: {
          ...portfolioData.tabs,
          about: {
            ...portfolioData.tabs.about,
            links: portfolioData.tabs.about.links.map(link => ({
              ...link,
              url: ensureHttps(link.url)
            }))
          },
          gallery: {
            ...portfolioData.tabs.gallery
          },
          pastProjects: {
            ...portfolioData.tabs.pastProjects,
            projects: (portfolioData.tabs.pastProjects?.projects || []).map(project => ({
              ...project,
              link: project.link ? ensureHttps(project.link) : project.link
            }))
          },
          blogs: {
            ...portfolioData.tabs.blogs
          },
          ai: {
            ...portfolioData.tabs.ai
          },
          contact: {
            ...portfolioData.tabs.contact,
            links: portfolioData.tabs.contact.links.map(link => {
              const contactType = suggestions.contactTypes.find(t => t.type === link.type);
              if (contactType && contactType.prefix) {
                return {
                  ...link,
                  url: contactType.prefix + link.url
                };
              }
              return {
                ...link,
                url: ensureHttps(link.url)
              };
            })
          }
        }
      };

      if (existingPortfolio) {
        // If portfolio ID changed, we need to create a new portfolio
        if (portfolioId !== originalPortfolioId) {
          await createPortfolio(
            user.uid,
            user.email || '',
            user.displayName || '',
            portfolioId,
            formattedData
          );
          setMessage('Portfolio created successfully with new ID!');
          // Reload to get the new portfolio
          await loadExistingPortfolio();
        } else {
          // Just update existing portfolio
          await updatePortfolio(user.uid, formattedData);
          setMessage('Portfolio updated successfully!');
        }
      } else {
        await createPortfolio(
          user.uid,
          user.email || '',
          user.displayName || '',
          portfolioId,
          formattedData
        );
        setMessage('Portfolio created successfully!');
        await loadExistingPortfolio();
      }
    } catch (error) {
      console.error('Error saving portfolio:', error);
      setMessage('Error saving portfolio');
    } finally {
      setSaving(false);
    }
  }, [user, portfolioId, portfolioData, existingPortfolio, originalPortfolioId, validationState.canSave, loadExistingPortfolio]);

  // Update field helper
  const updateField = useCallback((path: string, value: any) => {
    const keys = path.split('.');
    setPortfolioData(prevData => {
      const newData = { ...prevData };
      let current: any = newData;

      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;

      return newData;
    });
  }, []);

  // Skills management
  const addSkill = useCallback(() => {
    setPortfolioData(prev => ({
      ...prev,
      tabs: {
        ...prev.tabs,
        about: {
          ...prev.tabs.about,
          skills: [...prev.tabs.about.skills, '']
        }
      }
    }));
  }, []);

  const updateSkill = useCallback((index: number, value: string) => {
    setPortfolioData(prev => ({
      ...prev,
      tabs: {
        ...prev.tabs,
        about: {
          ...prev.tabs.about,
          skills: prev.tabs.about.skills.map((skill, i) => i === index ? value : skill)
        }
      }
    }));
  }, []);

  const removeSkill = useCallback((index: number) => {
    setPortfolioData(prev => ({
      ...prev,
      tabs: {
        ...prev.tabs,
        about: {
          ...prev.tabs.about,
          skills: prev.tabs.about.skills.filter((_, i) => i !== index)
        }
      }
    }));
  }, []);

  // Links management with URL formatting
  const addLink = useCallback((type: 'about' | 'contact') => {
    setPortfolioData(prev => ({
      ...prev,
      tabs: {
        ...prev.tabs,
        [type]: {
          ...prev.tabs[type],
          links: [...prev.tabs[type].links, { title: '', url: '' }]
        }
      }
    }));
  }, []);

  const updateLink = useCallback((type: 'about' | 'contact', index: number, field: 'title' | 'url', value: string) => {
    setPortfolioData(prev => ({
      ...prev,
      tabs: {
        ...prev.tabs,
        [type]: {
          ...prev.tabs[type],
          links: prev.tabs[type].links.map((link, i) =>
            i === index ? { ...link, [field]: value } : link
          )
        }
      }
    }));
  }, []);

  const removeLink = useCallback((type: 'about' | 'contact', index: number) => {
    setPortfolioData(prev => ({
      ...prev,
      tabs: {
        ...prev.tabs,
        [type]: {
          ...prev.tabs[type],
          links: prev.tabs[type].links.filter((_, i) => i !== index)
        }
      }
    }));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-base-100 to-base-200">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
          <p className="text-base-content/70">Loading your portfolio...</p>
        </div>
      </div>
    );
  }

  const portfolioUrl = portfolioId ? getPortfolioUrl(portfolioId) : '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200">
      {/* Single Minimal Header */}
      <div className="sticky top-0 z-50 bg-base-100/80 backdrop-blur-md border-b border-base-300 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Spacer */}
            <div></div>

            {/* Portfolio ID Input */}
            <div className="text-lg font-bold"></div>
            <div className="flex-1 max-w-xs">
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-xs font-medium">Portfolio ID</span>
                  {validationState.isChanged && (
                    <span className="badge badge-info badge-xs gap-1">
                      <ExclamationTriangleIcon className="w-2 h-2" />
                      Changed
                    </span>
                  )}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={portfolioId}
                    onChange={(e) => handlePortfolioIdChange(e.target.value)}
                    className={`input input-bordered input-sm w-full transition-all duration-200 focus:input-primary ${!validationState.isValid && portfolioId ? 'input-error' : ''
                      }`}
                    placeholder="your-id"
                    disabled={isCheckingAvailability}
                  />
                  {isCheckingAvailability && (
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                      <div className="loading loading-spinner loading-xs"></div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* URL Preview */}
            {portfolioId && (
              <div className="hidden md:flex items-center gap-2 text-xs">
                <span className="text-base-content/60">Preview:</span>
                <a
                  href={`https://${portfolioUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link link-primary hover:link-primary-focus transition-colors duration-200 flex items-center gap-1"
                >
                  {portfolioUrl}
                  <ArrowTopRightOnSquareIcon className="w-3 h-3" />
                </a>
              </div>
            )}

            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={saving || !portfolioId || !validationState.canSave}
              className="btn btn-primary btn-sm transition-all duration-200 hover:scale-105 disabled:scale-100"
            >
              {saving ? (
                <>
                  <span className="loading loading-spinner loading-xs"></span>
                  Saving...
                </>
              ) : (
                'Save'
              )}
            </button>
          </div>

          {/* Status Message */}
          {message && (
            <div className="mt-2 text-center">
              <span className={`text-xs px-2 py-1 rounded-full ${message === 'Available' ? 'bg-success/20 text-success' :
                  message === 'ID taken' ? 'bg-error/20 text-error' :
                    'bg-warning/20 text-warning'
                }`}>
                {message}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-6 space-y-8">
        {/* Basic Information */}
        <div className="card bg-base-100 shadow-xl border border-base-300">
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ModernInput
                label="First Name"
                value={portfolioData.firstName}
                onChange={(value) => updateField('firstName', value)}
                placeholder="John"
              />
              <ModernInput
                label="Last Name"
                value={portfolioData.lastName}
                onChange={(value) => updateField('lastName', value)}
                placeholder="Doe"
              />
            </div>
            <ModernInput
              label="Position Title"
              value={portfolioData.positionTitle}
              onChange={(value) => updateField('positionTitle', value)}
              placeholder="Full Stack Developer"
              className="mt-6"
            />
          </div>
        </div>

        {/* About Section */}
        <div className="card bg-base-100 shadow-xl border border-base-300">
          <div className="card-body">
            <ModernTextarea
              label="About"
              value={portfolioData.tabs.about.aboutParagraph}
              onChange={(value) => updateField('tabs.about.aboutParagraph', value)}
              placeholder="Tell us about yourself, your experience, and what drives you..."
              rows={6}
              className="mb-6"
            />

            <div className="space-y-6">
              {/* Skills */}
              <div>
                <label className="label">
                  <span className="label-text font-medium">Skills & Technologies</span>
                </label>
                <div className="space-y-3">
                  {portfolioData.tabs.about.skills.map((skill, index) => (
                    <div key={index} className="flex gap-3 items-center">
                      <AutocompleteInput
                        value={skill}
                        onChange={(value) => updateSkill(index, value)}
                        suggestions={suggestions.skills}
                        placeholder="e.g., React, TypeScript, Node.js"
                        className="flex-1"
                      />
                      <button
                        onClick={() => removeSkill(index)}
                        className="btn btn-square btn-error btn-sm transition-all duration-200 hover:scale-105"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button onClick={addSkill} className="btn btn-outline btn-sm w-full transition-all duration-200 hover:btn-primary">
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Add Skill
                  </button>
                </div>
              </div>

              {/* Links */}
              <div>
                <label className="label">
                  <span className="label-text font-medium">Social Links</span>
                </label>
                <div className="space-y-3">
                  {portfolioData.tabs.about.links.map((link, index) => (
                    <div key={index} className="flex gap-3 items-start">
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                        <AutocompleteInput
                          value={link.title}
                          onChange={(value) => updateLink('about', index, 'title', value)}
                          suggestions={suggestions.socialLinks.map(s => s.title)}
                          placeholder="e.g., GitHub, LinkedIn"
                        />
                        <input
                          type="url"
                          value={link.url}
                          onChange={(e) => updateLink('about', index, 'url', e.target.value)}
                          className="input input-bordered input-sm transition-all duration-200 focus:input-primary"
                          placeholder="github.com/username"
                        />
                      </div>
                      <button
                        onClick={() => removeLink('about', index)}
                        className="btn btn-square btn-error btn-sm transition-all duration-200 hover:scale-105"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addLink('about')}
                    className="btn btn-outline btn-sm w-full transition-all duration-200 hover:btn-primary"
                  >
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Add Social Link
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Gallery Section */}
        <div className="card bg-base-100 shadow-xl border border-base-300">
          <div className="card-body">
            <div className="form-control mb-6">
              <label className="label cursor-pointer">
                <span className="label-text font-medium">Display Gallery Section</span>
                <input
                  type="checkbox"
                  checked={portfolioData.tabs.gallery?.display ?? true}
                  onChange={(e) => updateField('tabs.gallery.display', e.target.checked)}
                  className="checkbox checkbox-primary"
                />
              </label>
            </div>
            
            {(portfolioData.tabs.gallery?.display ?? true) && (
              <GallerySection
                items={portfolioData.tabs.gallery?.items || []}
                onUpdate={(items) => updateField('tabs.gallery.items', items)}
              />
            )}
          </div>
        </div>

        {/* Projects Section */}
        <div className="card bg-base-100 shadow-xl border border-base-300">
          <div className="card-body">
            <div className="form-control mb-6">
              <label className="label cursor-pointer">
                <span className="label-text font-medium">Display Projects Section</span>
                <input
                  type="checkbox"
                  checked={portfolioData.tabs.pastProjects?.display ?? true}
                  onChange={(e) => updateField('tabs.pastProjects.display', e.target.checked)}
                  className="checkbox checkbox-primary"
                />
              </label>
            </div>
            
            {(portfolioData.tabs.pastProjects?.display ?? true) && (
              <ProjectsSection
                projects={portfolioData.tabs.pastProjects?.projects || []}
                onUpdate={(projects) => updateField('tabs.pastProjects.projects', projects)}
              />
            )}
          </div>
        </div>

        {/* Blogs Section */}
        <div className="card bg-base-100 shadow-xl border border-base-300">
          <div className="card-body">
            <div className="form-control mb-6">
              <label className="label cursor-pointer">
                <span className="label-text font-medium">Display Blogs Section</span>
                <input
                  type="checkbox"
                  checked={portfolioData.tabs.blogs?.display ?? true}
                  onChange={(e) => updateField('tabs.blogs.display', e.target.checked)}
                  className="checkbox checkbox-primary"
                />
              </label>
            </div>
            
            {(portfolioData.tabs.blogs?.display ?? true) && (
              <BlogsSection
                posts={portfolioData.tabs.blogs?.posts || []}
                onUpdate={(posts) => updateField('tabs.blogs.posts', posts)}
              />
            )}
          </div>
        </div>

        {/* Contact Section */}
        <div className="card bg-base-100 shadow-xl border border-base-300">
          <div className="card-body">
            <div className="space-y-6">
              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text font-medium">Enable Contact Form</span>
                  <input
                    type="checkbox"
                    checked={portfolioData.tabs.contact.contactForm.enabled}
                    onChange={(e) => updateField('tabs.contact.contactForm.enabled', e.target.checked)}
                    className="checkbox checkbox-primary"
                  />
                </label>
              </div>

              <div>
                <label className="label">
                  <span className="label-text font-medium">Contact Links</span>
                </label>
                <div className="space-y-4">
                  {portfolioData.tabs.contact.links.map((link, index) => (
                    <ContactLinkInput
                      key={index}
                      link={link}
                      onUpdate={(updatedLink) => {
                        const newLinks = [...portfolioData.tabs.contact.links];
                        newLinks[index] = updatedLink;
                        updateField('tabs.contact.links', newLinks);
                      }}
                      onRemove={() => {
                        const newLinks = portfolioData.tabs.contact.links.filter((_, i) => i !== index);
                        updateField('tabs.contact.links', newLinks);
                      }}
                    />
                  ))}
                  <button
                    onClick={() => {
                      const newLinks = [...portfolioData.tabs.contact.links, { type: 'email', title: 'Email', url: '' }];
                      updateField('tabs.contact.links', newLinks);
                    }}
                    className="btn btn-outline w-full transition-all duration-200 hover:btn-primary"
                  >
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Add Contact Link
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Section */}
        <div className="card bg-base-100 shadow-xl border border-base-300">
          <div className="card-body">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-base-content">AI Assistant</h3>
                <p className="text-sm text-base-content/60">Add an intelligent chatbot to your portfolio</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text font-medium">Enable AI Chatbot</span>
                  <input
                    type="checkbox"
                    checked={portfolioData.tabs.ai?.chatbot?.enabled ?? false}
                    onChange={(e) => updateField('tabs.ai.chatbot.enabled', e.target.checked)}
                    className="checkbox checkbox-primary"
                  />
                </label>
                <label className="label">
                  <span className="label-text-alt text-base-content/60">
                    Visitors can chat with an AI assistant about your work and experience
                  </span>
                </label>
              </div>

              {(portfolioData.tabs.ai?.chatbot?.enabled ?? false) && (
                <div className="space-y-4">
                  <ModernTextarea
                    label="AI Instructions"
                    value={portfolioData.tabs.ai?.chatbot?.instructions || ''}
                    onChange={(value) => updateField('tabs.ai.chatbot.instructions', value)}
                    placeholder="Tell the AI how to respond to visitors. For example: 'You are a helpful assistant representing [Your Name]. You can discuss my projects, skills, and experience. Be professional but friendly. If asked about specific projects, refer to the ones listed in my portfolio. If asked about contact information, direct them to my contact section.'"
                    rows={6}
                  />
                  
                  <div className="bg-base-200 rounded-lg p-4">
                    <h4 className="font-medium text-base-content mb-2">💡 Tips for AI Instructions:</h4>
                    <ul className="text-sm text-base-content/70 space-y-1">
                      <li>The ai model is already trained on your portfolio and your information. You don't need to tell it about your portfolio or your information.</li>
                      <li>Write about additional information like the tone of voice, personality, and how to respond to visitors.</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="card bg-base-100 shadow-xl border border-base-300">
          <div className="card-body">
            <div className="space-y-6">
              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text font-medium">Enable Contact Form</span>
                  <input
                    type="checkbox"
                    checked={portfolioData.tabs.contact.contactForm.enabled}
                    onChange={(e) => updateField('tabs.contact.contactForm.enabled', e.target.checked)}
                    className="checkbox checkbox-primary"
                  />
                </label>
              </div>

              <div>
                <label className="label">
                  <span className="label-text font-medium">Contact Links</span>
                </label>
                <div className="space-y-4">
                  {portfolioData.tabs.contact.links.map((link, index) => (
                    <ContactLinkInput
                      key={index}
                      link={link}
                      onUpdate={(updatedLink) => {
                        const newLinks = [...portfolioData.tabs.contact.links];
                        newLinks[index] = updatedLink;
                        updateField('tabs.contact.links', newLinks);
                      }}
                      onRemove={() => {
                        const newLinks = portfolioData.tabs.contact.links.filter((_, i) => i !== index);
                        updateField('tabs.contact.links', newLinks);
                      }}
                    />
                  ))}
                  <button
                    onClick={() => {
                      const newLinks = [...portfolioData.tabs.contact.links, { type: 'email', title: 'Email', url: '' }];
                      updateField('tabs.contact.links', newLinks);
                    }}
                    className="btn btn-outline w-full transition-all duration-200 hover:btn-primary"
                  >
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Add Contact Link
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioForm; 