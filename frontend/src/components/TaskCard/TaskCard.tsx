import { motion } from 'framer-motion'
import { MoreVertical, Check } from 'lucide-react'
import type { Task } from '../../types/todo'

interface TaskCardProps {
  task: Task
  onToggle: (id: string) => void
}

const tagStyles: Record<string, string> = {
  tertiary: 'bg-tertiary/10 text-tertiary',
  primary: 'bg-primary/10 text-primary',
  surface: 'bg-surface-variant text-on-surface-variant',
}

export default function TaskCard({ task, onToggle }: TaskCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={`group bg-[#232323] p-6 rounded-2xl border transition-all duration-300 flex items-center gap-6 ${
        task.completed
          ? 'border-outline-variant opacity-80'
          : 'border-outline-variant hover:border-tertiary/50 cursor-pointer'
      }`}
    >
      <button
        onClick={() => onToggle(task.id)}
        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0 ${
          task.completed
            ? 'border-tertiary bg-tertiary'
            : 'border-outline-variant group-hover:border-tertiary'
        }`}
      >
        {task.completed && <Check className="w-3 h-3 text-black font-bold" />}
        {!task.completed && (
          <div className="w-3 h-3 rounded-full bg-tertiary opacity-0 group-hover:opacity-20 transition-opacity" />
        )}
      </button>

      <div className="flex-grow min-w-0">
        <div className="flex items-center gap-3 mb-1">
          <h3
            className={`font-title-lg truncate ${
              task.completed
                ? 'text-on-surface-variant line-through'
                : 'text-on-surface'
            }`}
          >
            {task.title}
          </h3>
          <span
            className={`px-3 py-1 rounded-full text-[10px] font-label-caps tracking-wider flex-shrink-0 ${
              task.completed
                ? 'bg-surface-variant text-on-surface-variant opacity-40'
                : tagStyles[task.tagVariant]
            }`}
          >
            {task.tag}
          </span>
        </div>
        <p
          className={`text-body-sm ${
            task.completed
              ? 'text-on-surface-variant opacity-40'
              : 'text-on-surface-variant opacity-60'
          }`}
        >
          {task.time}
        </p>
      </div>

      <MoreVertical className="w-5 h-5 text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
    </motion.div>
  )
}
