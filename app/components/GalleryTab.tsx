'use client'

import React, { useState, useCallback } from 'react'
import Image from 'next/image'
import { parseDescription } from '../utils/textUtils'
import ImageModal from './ImageModal'

interface GalleryItem {
  title: string
  description: string
  imageLink: string
}

interface GalleryTabProps {
  items: GalleryItem[]
}

const GalleryTab: React.FC<GalleryTabProps> = ({ items }) => {
  const [modalOpen, setModalOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const openModal = useCallback((index: number) => {
    setCurrentImageIndex(index)
    setModalOpen(true)
    document.body.style.overflow = 'hidden'
  }, [])

  const closeModal = useCallback(() => {
    setModalOpen(false)
    document.body.style.overflow = 'unset'
  }, [])

  const nextImage = useCallback(() => {
    setCurrentImageIndex((prev) => 
      prev === items.length - 1 ? 0 : prev + 1
    )
  }, [items.length])

  const prevImage = useCallback(() => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? items.length - 1 : prev - 1
    )
  }, [items.length])

  return (
    <div className="space-y-12">
      <section>
        <h2 className="text-2xl font-bold text-base-content mb-6">Gallery</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {items.map((item, index) => (
            <div key={index} className="group cursor-pointer" onClick={() => openModal(index)}>
              <div className="overflow-hidden rounded-lg relative">
                <Image 
                  src={item.imageLink} 
                  alt={item.title}
                  width={600}
                  height={400}
                  className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                  priority={index < 2}
                  quality={85}
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                />
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-bold text-base-content mb-2">{item.title}</h3>
                <p className="text-base-content/70 leading-relaxed">
                  {parseDescription(item.description)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {modalOpen && (
        <ImageModal
          items={items}
          currentIndex={currentImageIndex}
          onClose={closeModal}
          onNext={nextImage}
          onPrev={prevImage}
        />
      )}
    </div>
  )
}

export default GalleryTab 