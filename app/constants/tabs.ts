export const TABS = [
  { id: 'about', label: 'About' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'pastProjects', label: 'Projects' },
  { id: 'contact', label: 'Contact' }
] as const

export type TabId = typeof TABS[number]['id'] 