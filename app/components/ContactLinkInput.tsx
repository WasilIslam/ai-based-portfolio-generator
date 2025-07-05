'use client'

import React, { useState, useEffect } from 'react';
import { ChevronDownIcon, CheckIcon, ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import suggestions from '../../suggestions.json';

interface ContactLink {
  type: string;
  title: string;
  url: string;
}

interface ContactLinkInputProps {
  link: ContactLink;
  onUpdate: (link: ContactLink) => void;
  onRemove: () => void;
}

const ContactLinkInput: React.FC<ContactLinkInputProps> = ({ link, onUpdate, onRemove }) => {
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [validationError, setValidationError] = useState('');

  const contactTypes = suggestions.contactTypes;

  const getCurrentType = () => {
    return contactTypes.find(type => type.type === link.type) || contactTypes[0];
  };

  const validateInput = (type: string, value: string) => {
    const contactType = contactTypes.find(t => t.type === type);
    if (!contactType) return '';

    switch (contactType.validation) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value) ? '' : 'Please enter a valid email address';
      
      case 'phone':
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(value.replace(/\D/g, '')) ? '' : 'Please enter a valid phone number';
      
      case 'username':
        const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
        return usernameRegex.test(value) ? '' : 'Username should be 3-20 characters, letters, numbers, and underscores only';
      
      case 'url':
        try {
          new URL(value.startsWith('http') ? value : `https://${value}`);
          return '';
        } catch {
          return 'Please enter a valid URL';
        }
      
      case 'discord':
        const discordRegex = /^[a-zA-Z0-9]{2,32}$/;
        return discordRegex.test(value) ? '' : 'Discord invite code should be 2-32 characters';
      
      case 'zoom':
        const zoomRegex = /^\d{9,11}$/;
        return zoomRegex.test(value.replace(/\D/g, '')) ? '' : 'Please enter a valid Zoom meeting ID';
      
      case 'calendly':
        const calendlyRegex = /^[a-zA-Z0-9-]+$/;
        return calendlyRegex.test(value) ? '' : 'Please enter a valid Calendly username';
      
      case 'linkedin':
        const linkedinRegex = /^[a-zA-Z0-9-]{3,100}$/;
        return linkedinRegex.test(value) ? '' : 'Please enter a valid LinkedIn username';
      
      case 'github':
        const githubRegex = /^[a-zA-Z0-9-]{1,39}$/;
        return githubRegex.test(value) ? '' : 'Please enter a valid GitHub username';
      
      case 'twitter':
        const twitterRegex = /^[a-zA-Z0-9_]{1,15}$/;
        return twitterRegex.test(value) ? '' : 'Please enter a valid Twitter username';
      
      case 'instagram':
        const instagramRegex = /^[a-zA-Z0-9._]{1,30}$/;
        return instagramRegex.test(value) ? '' : 'Please enter a valid Instagram username';
      
      case 'facebook':
        const facebookRegex = /^[a-zA-Z0-9.]{5,50}$/;
        return facebookRegex.test(value) ? '' : 'Please enter a valid Facebook username';
      
      case 'youtube':
        return value.length > 0 ? '' : 'Please enter a channel name';
      
      case 'twitch':
        const twitchRegex = /^[a-zA-Z0-9_]{4,25}$/;
        return twitchRegex.test(value) ? '' : 'Please enter a valid Twitch username';
      
      default:
        return '';
    }
  };

  const handleTypeChange = (type: string) => {
    const newType = contactTypes.find(t => t.type === type);
    if (newType) {
      onUpdate({
        type: newType.type,
        title: type === 'custom' ? '' : newType.label,
        url: ''
      });
      setValidationError('');
    }
    setIsTypeDropdownOpen(false);
  };

  const handleUrlChange = (url: string) => {
    const currentType = getCurrentType();
    const fullUrl = currentType.prefix + url;
    const error = validateInput(currentType.type, url);
    
    setValidationError(error);
    onUpdate({
      ...link,
      url: url
    });
  };

  const formatUrl = (url: string) => {
    const currentType = getCurrentType();
    if (url.startsWith(currentType.prefix)) {
      return url.substring(currentType.prefix.length);
    }
    return url;
  };

  const currentType = getCurrentType();

  return (
    <div className="flex gap-3 items-start">
      <div className="flex-1 space-y-3">
        {/* Type Selector */}
        <div className="relative">
          <label className="label">
            <span className="label-text font-medium">Type</span>
          </label>
          <button
            type="button"
            onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
            className="input input-bordered w-full text-left flex items-center justify-between transition-all duration-200 focus:input-primary"
          >
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 flex items-center justify-center">
                {/* You can add icons here based on currentType.icon */}
              </span>
              {currentType.label}
            </span>
            <ChevronDownIcon className={`w-4 h-4 transition-transform ${isTypeDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Type Dropdown */}
          {isTypeDropdownOpen && (
            <div className="absolute z-50 w-full mt-1 bg-base-100 border border-base-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {contactTypes.map((type) => (
                <button
                  key={type.type}
                  type="button"
                  onClick={() => handleTypeChange(type.type)}
                  className={`w-full px-4 py-2 text-left hover:bg-base-200 transition-colors flex items-center justify-between ${
                    type.type === link.type ? 'bg-primary/10 text-primary' : ''
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 flex items-center justify-center">
                      {/* You can add icons here based on type.icon */}
                    </span>
                    {type.label}
                  </span>
                  {type.type === link.type && (
                    <CheckIcon className="w-4 h-4 text-primary flex-shrink-0 ml-2" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Title Input for Custom Type */}
        {link.type === 'custom' && (
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Title</span>
            </label>
            <input
              type="text"
              value={link.title}
              onChange={(e) => onUpdate({ ...link, title: e.target.value })}
              placeholder="Enter custom title"
              className="input input-bordered w-full transition-all duration-200 focus:input-primary"
            />
          </div>
        )}

        {/* URL Input */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Value</span>
            {currentType.prefix && (
              <span className="label-text-alt text-base-content/60">
                {currentType.prefix}
              </span>
            )}
          </label>
          <input
            type="text"
            value={formatUrl(link.url)}
            onChange={(e) => handleUrlChange(e.target.value)}
            placeholder={currentType.placeholder}
            className={`input input-bordered w-full transition-all duration-200 focus:input-primary ${
              validationError ? 'input-error' : ''
            }`}
          />
          {validationError && (
            <label className="label">
              <span className="label-text-alt text-error flex items-center gap-1">
                <ExclamationTriangleIcon className="w-3 h-3" />
                {validationError}
              </span>
            </label>
          )}
        </div>
      </div>

      {/* Remove Button */}
      <button
        onClick={onRemove}
        className="btn btn-square btn-error btn-sm transition-all duration-200 hover:scale-105"
      >
        <XMarkIcon className="w-4 h-4" />
      </button>
    </div>
  );
};

export default ContactLinkInput; 