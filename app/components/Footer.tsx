'use client'

import React from 'react'

interface FooterProps {
  firstName: string
  lastName: string
}

const Footer: React.FC<FooterProps> = ({ firstName, lastName }) => {
  return (
    <footer className="text-center py-8 mt-16 border-t border-base-300">
      <p className="text-base-content/60 mb-2">
        © {firstName} {lastName} - All rights reserved
      </p>
      <p className="text-base-content/40 text-sm">
        Developed by <a href="https://cuthours.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Cuthours</a> - Host yours now!
      </p>
    </footer>
  )
}

export default Footer 