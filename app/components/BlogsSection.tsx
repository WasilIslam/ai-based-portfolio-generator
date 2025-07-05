'use client'

import React from 'react';
import { PlusIcon, XMarkIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

interface BlogPost {
  title: string;
  description: string;
  content: string;
}

interface BlogsSectionProps {
  posts: BlogPost[];
  onUpdate: (posts: BlogPost[]) => void;
}

const BlogsSection: React.FC<BlogsSectionProps> = ({ posts, onUpdate }) => {
  const addPost = () => {
    const newPost: BlogPost = {
      title: '',
      description: '',
      content: ''
    };
    onUpdate([...posts, newPost]);
  };

  const updatePost = (index: number, field: keyof BlogPost, value: string) => {
    const newPosts = [...posts];
    newPosts[index] = { ...newPosts[index], [field]: value };
    onUpdate(newPosts);
  };

  const removePost = (index: number) => {
    const newPosts = posts.filter((_, i) => i !== index);
    onUpdate(newPosts);
  };

  return (
    <div className="card bg-base-100 shadow-xl border border-base-300">
      <div className="card-body">
        {/* Add Blog Post Button */}
        <div className="mb-6">
          <button 
            onClick={addPost} 
            className="btn btn-outline btn-primary transition-all duration-200 hover:scale-105"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Add Blog Post
          </button>
        </div>

        {/* Blog Posts List */}
        <div className="space-y-6">
          {posts.map((post, index) => (
            <div key={index} className="border border-base-300 rounded-xl p-6 bg-base-50/50 transition-all duration-200 hover:shadow-md">
              <div className="flex gap-6">
                <div className="flex-1 space-y-4">
                  {/* Post Title */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Post Title</span>
                    </label>
                    <input
                      type="text"
                      value={post.title}
                      onChange={(e) => updatePost(index, 'title', e.target.value)}
                      className="input input-bordered w-full transition-all duration-200 focus:input-primary"
                      placeholder="Enter blog post title"
                    />
                  </div>
                  
                  {/* Post Description */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Description</span>
                    </label>
                    <textarea
                      value={post.description}
                      onChange={(e) => updatePost(index, 'description', e.target.value)}
                      className="textarea textarea-bordered w-full transition-all duration-200 focus:textarea-primary resize-none"
                      placeholder="Brief description of the blog post"
                      rows={2}
                    />
                  </div>
                  
                  {/* Post Content */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Content</span>
                    </label>
                    <textarea
                      value={post.content}
                      onChange={(e) => updatePost(index, 'content', e.target.value)}
                      className="textarea textarea-bordered w-full transition-all duration-200 focus:textarea-primary resize-none"
                      placeholder="Blog post content (HTML supported)"
                      rows={6}
                    />
                  </div>
                </div>
                
                {/* Remove Button */}
                <button
                  onClick={() => removePost(index)}
                  className="btn btn-square btn-error btn-sm self-start transition-all duration-200 hover:scale-105"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          
          {posts.length === 0 && (
            <div className="text-center py-12 text-base-content/60 border-2 border-dashed border-base-300 rounded-xl">
              <DocumentTextIcon className="w-16 h-16 mx-auto mb-4 text-base-content/40" />
              <p className="text-lg font-medium mb-2">No blog posts yet</p>
              <p className="text-sm">Add some blog posts to share your thoughts and insights!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogsSection; 