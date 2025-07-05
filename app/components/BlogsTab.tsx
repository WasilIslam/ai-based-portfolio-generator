'use client'

import React from 'react'

interface BlogPost {
  title: string
  description: string
  content: string
}

interface BlogsTabProps {
  posts: BlogPost[]
}

const BlogsTab: React.FC<BlogsTabProps> = ({ posts }) => {
  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📝</div>
        <h2 className="text-2xl font-bold mb-2">No Blog Posts Yet</h2>
        <p className="text-base-content/60">Blog posts will appear here when they're added.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Blog Posts</h1>
        <p className="text-base-content/60">Thoughts, insights, and updates</p>
      </div>

      <div className="space-y-8">
        {posts.map((post, index) => (
          <article key={index} className="card bg-base-100 shadow-lg border border-base-300">
            <div className="card-body">
              <header className="mb-6">
                <h2 className="text-2xl font-bold mb-3 text-base-content">
                  {post.title}
                </h2>
                {post.description && (
                  <p className="text-base-content/70 text-lg leading-relaxed">
                    {post.description}
                  </p>
                )}
              </header>

              {post.content && (
                <div 
                  className="prose prose-lg max-w-none prose-headings:text-base-content prose-p:text-base-content/80 prose-strong:text-base-content prose-a:text-primary hover:prose-a:text-primary-focus"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

export default BlogsTab 