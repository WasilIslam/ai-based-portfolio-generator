import React from 'react'

export const parseDescription = (description: string): React.ReactNode => {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
  const parts: React.ReactNode[] = []
  let lastIndex = 0
  let match

  while ((match = linkRegex.exec(description)) !== null) {
    if (match.index > lastIndex) {
      parts.push(description.slice(lastIndex, match.index))
    }
    
    parts.push(
      React.createElement('a', {
        key: match.index,
        href: match[2],
        target: '_blank',
        rel: 'noopener noreferrer',
        className: 'text-primary underline'
      }, match[1])
    )
    
    lastIndex = match.index + match[0].length
  }
  
  if (lastIndex < description.length) {
    parts.push(description.slice(lastIndex))
  }
  
  return parts.length > 0 ? parts : description
}

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short' 
  })
} 