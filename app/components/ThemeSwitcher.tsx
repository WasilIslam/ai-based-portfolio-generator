'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { useTheme } from '../hooks/useTheme'

const themes = [
  { id: 'light', name: 'Light', emoji: '☀️' },
  { id: 'dark', name: 'Dark', emoji: '🌙' },
  { id: 'cupcake', name: 'Cupcake', emoji: '🧁' },
  { id: 'bumblebee', name: 'Bumblebee', emoji: '🐝' },
  { id: 'emerald', name: 'Emerald', emoji: '💎' },
  { id: 'corporate', name: 'Corporate', emoji: '💼' },
  { id: 'synthwave', name: 'Synthwave', emoji: '🌆' },
  { id: 'retro', name: 'Retro', emoji: '📺' },
  { id: 'cyberpunk', name: 'Cyberpunk', emoji: '🤖' },
  { id: 'valentine', name: 'Valentine', emoji: '💕' },
  { id: 'halloween', name: 'Halloween', emoji: '🎃' },
  { id: 'garden', name: 'Garden', emoji: '🌱' },
  { id: 'forest', name: 'Forest', emoji: '🌲' },
  { id: 'aqua', name: 'Aqua', emoji: '🌊' },
  { id: 'lofi', name: 'Lo-Fi', emoji: '📻' },
  { id: 'pastel', name: 'Pastel', emoji: '🎨' },
  { id: 'fantasy', name: 'Fantasy', emoji: '🧚' },
  { id: 'wireframe', name: 'Wireframe', emoji: '📐' },
  { id: 'black', name: 'Black', emoji: '⚫' },
  { id: 'luxury', name: 'Luxury', emoji: '💎' },
  { id: 'dracula', name: 'Dracula', emoji: '🧛' },
  { id: 'cmyk', name: 'CMYK', emoji: '🖨️' },
  { id: 'autumn', name: 'Autumn', emoji: '🍂' },
  { id: 'business', name: 'Business', emoji: '📊' },
  { id: 'acid', name: 'Acid', emoji: '🧪' },
  { id: 'lemonade', name: 'Lemonade', emoji: '🍋' },
  { id: 'night', name: 'Night', emoji: '🌃' },
  { id: 'coffee', name: 'Coffee', emoji: '☕' },
  { id: 'winter', name: 'Winter', emoji: '❄️' }
]

const ThemeSwitcher: React.FC = () => {
  const { theme, changeTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const currentTheme = themes.find(t => t.id === theme) || themes[0]

  const filteredThemes = themes.filter(themeOption =>
    themeOption.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    themeOption.id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleThemeSelect = useCallback((themeId: string) => {
    changeTheme(themeId)
    setIsOpen(false)
    setSearchTerm('')
  }, [changeTheme])

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && isOpen) {
      setIsOpen(false)
      setSearchTerm('')
    }
  }, [isOpen])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return (
    <>
      {/* Theme Button */}
      <div className="fixed sm:top-6 sm:right-6 bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="btn btn-ghost btn-sm gap-2 bg-base-100/80 backdrop-blur-sm border border-base-300 shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <span className="text-lg">{currentTheme.emoji}</span>
          <span className="hidden sm:inline">{currentTheme.name}</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

             {/* Theme Modal */}
       {isOpen && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
           <div className="bg-base-100 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] sm:max-h-[80vh] overflow-hidden border border-base-300">
                         {/* Modal Header */}
             <div className="p-4 sm:p-6 border-b border-base-300">
               <div className="flex items-center justify-between mb-4">
                 <h2 className="text-lg sm:text-xl font-bold text-base-content">Choose Theme</h2>
                <button
                  onClick={() => {
                    setIsOpen(false)
                    setSearchTerm('')
                  }}
                  className="btn btn-ghost btn-sm btn-circle"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
                             {/* Search Input */}
               <div className="relative">
                 <input
                   type="text"
                   placeholder="Search themes..."
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   className="w-full px-3 sm:px-4 py-2 sm:py-3 pl-8 sm:pl-10 bg-base-200 border border-base-300 rounded-lg focus:border-primary focus:outline-none text-sm sm:text-base"
                   autoFocus
                 />
                                 <svg className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-base-content/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

                         {/* Theme Grid */}
             <div className="p-4 sm:p-6 overflow-y-auto max-h-[65vh] sm:max-h-[60vh]">
               {filteredThemes.length === 0 ? (
                 <div className="text-center py-6 sm:py-8 text-base-content/60">
                   <svg className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-base-content/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <p>No themes found</p>
                </div>
              ) : (
                                 <div className="grid grid-cols-2 gap-2 sm:gap-3">
                   {filteredThemes.map((themeOption) => (
                     <button
                       key={themeOption.id}
                       onClick={() => handleThemeSelect(themeOption.id)}
                       className={`p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                         theme === themeOption.id
                           ? 'border-primary bg-primary/10 shadow-lg'
                           : 'border-base-300 hover:border-primary/50 hover:bg-base-200'
                       }`}
                     >
                       <div className="text-center">
                         <div className="text-xl sm:text-2xl mb-1 sm:mb-2">{themeOption.emoji}</div>
                         <div className={`font-medium text-xs sm:text-sm leading-tight ${
                           theme === themeOption.id ? 'text-primary' : 'text-base-content'
                         }`}>
                           {themeOption.name}
                         </div>
                                                 {theme === themeOption.id && (
                           <div className="mt-1">
                             <svg className="w-3 h-3 sm:w-4 sm:h-4 mx-auto text-primary" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

                         {/* Modal Footer */}
             <div className="p-4 sm:p-6 border-t border-base-300 bg-base-200/50">
               <div className="text-xs text-base-content/60 text-center">
                 Press <kbd className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-base-300 rounded text-xs">ESC</kbd> to close
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ThemeSwitcher 