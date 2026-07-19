import { useState, type KeyboardEvent } from 'react'
import { motion } from 'framer-motion'
import { PlusCircle } from 'lucide-react'

interface AddTaskInputProps {
  onAdd: (title: string) => void
  listName?: string
}

export default function AddTaskInput({ onAdd, listName = 'Life' }: AddTaskInputProps) {
  const [value, setValue] = useState('')

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && value.trim()) {
      onAdd(value.trim())
      setValue('')
    }
  }

  return (
    <motion.div
      className="relative mb-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
    >
      <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
        <PlusCircle className="w-5 h-5 text-tertiary" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={`Add a new task to '${listName}'...`}
        className="w-full bg-surface-container-low border border-outline-variant rounded-2xl py-5 pl-16 pr-20 text-on-surface focus:outline-none focus:border-tertiary focus:ring-1 focus:ring-tertiary transition-all duration-300 placeholder:text-on-surface-variant/40"
      />
      <div className="absolute inset-y-0 right-6 flex items-center">
        <span className="text-xs text-on-surface-variant font-label-caps border border-outline-variant px-2 py-1 rounded">
          ⌘ K
        </span>
      </div>
    </motion.div>
  )
}
