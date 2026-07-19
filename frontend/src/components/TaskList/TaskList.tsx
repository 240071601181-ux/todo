import { AnimatePresence } from 'framer-motion'
import TaskCard from '../TaskCard/TaskCard'
import type { Task } from '../../types/todo'

interface TaskListProps {
  tasks: Task[]
  onToggle: (id: string) => void
}

export default function TaskList({ tasks, onToggle }: TaskListProps) {
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
