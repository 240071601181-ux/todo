import type { ComponentType } from 'react'

export interface Task {
  id: string
  title: string
  tag: string
  tagVariant: 'tertiary' | 'primary' | 'surface'
  time: string
  completed: boolean
}

export interface NavItem {
  id: string
  label: string
  icon: ComponentType<{ className?: string }>
  active?: boolean
}

export type SortMethod = 'date' | 'name' | 'priority' | 'tag'
