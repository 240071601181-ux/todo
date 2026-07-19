import { AnimatePresence } from 'framer-motion'
import TaskCard from '../TaskCard/TaskCard'
import type { Task } from '../../types/todo'

interface TaskListProps {
  tasks: Task[]
  onToggle: (id: string) => void
  isLoading?: boolean
  isError?: boolean
  error?: Error | null
}

export default function TaskList({ tasks, onToggle, isLoading, isError, error }: TaskListProps) {
  if (isLoading) {
    return (
      <section className="flex-grow overflow-y-auto scrollbar-hide space-y-4 pb-12">
        <div className="flex items-center justify-center h-32 text-on-surface-variant text-body-sm">
          Loading tasks...
        </div>
      </section>
    )
  }

  if (isError) {
    return (
      <section className="flex-grow overflow-y-auto scrollbar-hide space-y-4 pb-12">
        <div className="flex flex-col items-center justify-center h-32 text-on-surface-variant text-body-sm">
          <span>Failed to load tasks</span>
          <span className="text-xs opacity-60 mt-1">{error?.message}</span>
        </div>
      </section>
    )
  }

  if (tasks.length === 0) {
    return (
      <section className="flex-grow overflow-y-auto scrollbar-hide space-y-4 pb-12">
        <div className="flex items-center justify-center h-32 text-on-surface-variant text-body-sm">
          No tasks yet. Add one above.
        </div>
      </section>
    )
  }

  return (
    <section className="flex-grow overflow-y-auto scrollbar-hide space-y-4 pb-12">
      <AnimatePresence mode="popLayout">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onToggle={onToggle} />
        ))}
      </AnimatePresence>
    </section>
  )
}
