'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { parseDescription } from '../utils/textUtils'

interface GalleryItem {
  title: string
  description: string
  imageLink: string
}

interface ImageModalProps {
  items: GalleryItem[]
  currentIndex: number
  onClose: () => void
  onNext: () => void
  onPrev: () => void
}

const ImageModal: React.FC<ImageModalProps> = ({
  items,
  currentIndex,
  onClose,
  onNext,
  onPrev
}) => {
  const [imageLoading, setImageLoading] = useState(true)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose()
          break
        case 'ArrowRight':
          onNext()
          break
        case 'ArrowLeft':
          onPrev()
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose, onNext, onPrev])

  // Reset loading state when image changes
  useEffect(() => {
    setImageLoading(true)
    setImageError(false)
  }, [currentIndex])

  const currentImage = items[currentIndex]

  const handleImageLoad = () => {
    setImageLoading(false)
    setImageError(false)
  }

  const handleImageError = () => {
    setImageLoading(false)
    setImageError(true)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative w-full h-full flex items-center justify-center p-4">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 transition-colors"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Navigation Arrows */}
        <button
          onClick={onPrev}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 text-white hover:text-gray-300 transition-colors"
        >
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={onNext}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 text-white hover:text-gray-300 transition-colors"
        >
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Image Container */}
        <div className="relative max-w-4xl max-h-full">
          {/* Loading Spinner */}
          {imageLoading && (
            <div className="flex items-center justify-center w-full h-64 bg-gray-800 rounded-lg">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
          )}

          {/* Error Fallback */}
          {imageError && (
            <div className="flex flex-col items-center justify-center w-full h-64 bg-gray-800 rounded-lg text-white">
              <svg className="w-16 h-16 mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-lg font-medium">Image not available</p>
              <p className="text-sm text-gray-400 mt-1">{currentImage.title}</p>
            </div>
          )}

          {/* Actual Image */}
          <Image
            src={currentImage.imageLink}
            alt={currentImage.title}
            width={1200}
            height={800}
            className={`max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl transition-opacity duration-300 ${
              imageLoading ? 'opacity-0' : 'opacity-100'
            }`}
            priority
            quality={90}
            onLoad={handleImageLoad}
            onError={handleImageError}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
          />
          
          {/* Image Info - Only show when image is loaded or has error */}
          {(!imageLoading || imageError) && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-lg">
              <h3 className="text-2xl font-bold text-white mb-2">{currentImage.title}</h3>
              <div className="text-white/90">
                {parseDescription(currentImage.description)}
              </div>
            </div>
          )}
        </div>

        {/* Image Counter */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white/80 text-sm">
          {currentIndex + 1} / {items.length}
        </div>

        {/* Keyboard Hints */}
        <div className="absolute top-4 left-4 text-white/60 text-xs">
          <div>← → Arrow keys to navigate</div>
          <div>ESC to close</div>
        </div>
      </div>
    </div>
  )
}

export default ImageModal 