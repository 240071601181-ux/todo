import { motion } from 'framer-motion'
import { Calendar, ArrowUpDown, Flag, Tag } from 'lucide-react'
import type { SortMethod } from '../../types/todo'

interface SortPanelProps {
  activeSort: SortMethod
  onSortChange: (method: SortMethod) => void
}

interface SortOption {
  method: SortMethod
  label: string
  icon: typeof Calendar
}

const sortOptions: SortOption[] = [
  { method: 'date', label: 'Date', icon: Calendar },
  { method: 'name', label: 'Name', icon: ArrowUpDown },
  { method: 'priority', label: 'Priority', icon: Flag },
  { method: 'tag', label: 'Tag', icon: Tag },
]

export default function SortPanel({ activeSort, onSortChange }: SortPanelProps) {
  return (
    <div className="mb-12">
      <h4 className="font-headline-md text-title-lg text-on-surface mb-6">
        Sort Method
      </h4>
      <div className="grid grid-cols-2 gap-3">
        {sortOptions.map((option) => {
          const isActive = activeSort === option.method
          const isPriority = option.method === 'priority'
          const Icon = option.icon

          return (
            <motion.button
              key={option.method}
              onClick={() => onSortChange(option.method)}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive && isPriority
                  ? 'bg-tertiary text-black font-bold active-glow shadow-lg col-span-2'
                  : isActive
                    ? 'bg-surface-container-high border border-outline-variant text-on-surface'
                    : 'bg-surface-container-high border border-outline-variant text-on-surface-variant hover:text-on-surface hover:border-on-surface-variant'
              } ${isPriority ? 'col-span-2' : ''}`}
            >
              <Icon className="w-[18px] h-[18px]" />
              <span>{option.label}</span>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
