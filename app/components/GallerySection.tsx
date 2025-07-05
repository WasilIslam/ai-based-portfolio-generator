'use client'

import React, { useState, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { uploadImage, generateImagePath } from '../firebase/storage';
import { PlusIcon, XMarkIcon, PhotoIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline';

interface GalleryItem {
  title: string;
  description: string;
  imageLink: string;
}

interface GallerySectionProps {
  items: GalleryItem[];
  onUpdate: (items: GalleryItem[]) => void;
}

const GallerySection: React.FC<GallerySectionProps> = ({ items, onUpdate }) => {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (file: File) => {
    if (!user) return;

    try {
      setUploading(true);
      const path = generateImagePath(user.uid, file.name);
      const imageUrl = await uploadImage(file, path);
      
      const newItem: GalleryItem = {
        title: '',
        description: '',
        imageLink: imageUrl
      };
      
      onUpdate([...items, newItem]);
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploading(false);
    }
  };

  const updateItem = (index: number, field: keyof GalleryItem, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    onUpdate(newItems);
  };

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    onUpdate(newItems);
  };

  return (
    <div className="card bg-base-100 shadow-xl border border-base-300">
      <div className="card-body">
        {/* Upload Button */}
        <div className="mb-6">
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                handleImageUpload(file);
                e.target.value = '';
              }
            }}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="btn btn-outline btn-primary transition-all duration-200 hover:scale-105 disabled:scale-100"
          >
            {uploading ? (
              <div className="loading loading-spinner loading-sm"></div>
            ) : (
              <CloudArrowUpIcon className="w-5 h-5 mr-2" />
            )}
            {uploading ? 'Uploading...' : 'Add Image'}
          </button>
        </div>

        {/* Gallery Items */}
        <div className="space-y-6">
          {items.map((item, index) => (
            <div key={index} className="border border-base-300 rounded-xl p-6 bg-base-50/50 transition-all duration-200 hover:shadow-md">
              <div className="flex gap-6">
                {/* Image Preview */}
                <div className="w-32 h-32 flex-shrink-0">
                  <img
                    src={item.imageLink}
                    alt={item.title || 'Gallery item'}
                    className="w-full h-full object-cover rounded-lg shadow-md"
                  />
                </div>
                
                {/* Form Fields */}
                <div className="flex-1 space-y-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Image Title</span>
                    </label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => updateItem(index, 'title', e.target.value)}
                      className="input input-bordered w-full transition-all duration-200 focus:input-primary"
                      placeholder="Enter image title"
                    />
                  </div>
                  
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Description</span>
                    </label>
                    <textarea
                      value={item.description}
                      onChange={(e) => updateItem(index, 'description', e.target.value)}
                      className="textarea textarea-bordered w-full transition-all duration-200 focus:textarea-primary resize-none"
                      placeholder="Describe this image (supports markdown links like [text](url))"
                      rows={4}
                    />
                  </div>
                </div>
                
                {/* Remove Button */}
                <button
                  onClick={() => removeItem(index)}
                  className="btn btn-square btn-error btn-sm self-start transition-all duration-200 hover:scale-105"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          
          {items.length === 0 && (
            <div className="text-center py-12 text-base-content/60 border-2 border-dashed border-base-300 rounded-xl">
              <PhotoIcon className="w-16 h-16 mx-auto mb-4 text-base-content/40" />
              <p className="text-lg font-medium mb-2">No gallery items yet</p>
              <p className="text-sm">Add some images to showcase your work and projects!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GallerySection; 