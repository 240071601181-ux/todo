import { useState } from 'react'
import type { Task } from '../types/todo'

const initialTasks: Task[] = [
  {
    id: '1',
    title: "Call Max about weekend trip",
    tag: '#REMINDER',
    tagVariant: 'tertiary',
    time: 'Today at 4:30 PM',
    completed: false,
  },
  {
    id: '2',
    title: 'Go to Gym',
    tag: '#HEALTH',
    tagVariant: 'primary',
    time: '6:00 PM - Chest & Shoulders',
    completed: false,
  },
  {
    id: '3',
    title: 'Pick up dry cleaning',
    tag: '#ERRANDS',
    tagVariant: 'surface',
    time: 'Friday, Oct 25',
    completed: false,
  },
  {
    id: '4',
    title: 'Buy birthday gift for Sarah',
    tag: '#LIFE',
    tagVariant: 'surface',
    time: 'Completed',
    completed: true,
  },
]

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    )
  }

  const addTask = (title: string) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      tag: '#NEW',
      tagVariant: 'tertiary',
      time: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      }),
      completed: false,
    }
    setTasks((prev) => [newTask, ...prev])
  }

  return { tasks, toggleTask, addTask }
}
