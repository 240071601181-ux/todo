import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppProvider'
import TaskDetailsScreen from '../components/TaskDetailsScreen'
import * as taskService from '../services/taskService'
import * as listService from '../services/listService'
import type { Task } from '../types'

export default function TaskDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { settings } = useApp()
  const navigate = useNavigate()

  const [task, setTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    Promise.all([
      taskService.getTaskById(id),
      listService.getLists(),
    ])
      .then(([bt, lists]) => {
        const listMap = new Map(lists.map(l => [l.id, l]))
        const mapped = taskService.mapTask(
          bt,
          listMap.get(bt.listId)?.name ?? 'General',
          'User',
          '',
        )
        setTask(mapped)
      })
      .catch((err) => {
        console.error('Failed to load task:', err)
        setTask(null)
      })
      .finally(() => setLoading(false))
  }, [id])

  const handleUpdate = async (data: {
    title?: string
    description?: string | null
    priority?: string
    status?: string
    dueDate?: string
  }) => {
    if (!id || !task) return
    try {
      const updateData: Record<string, any> = {}
      if (data.title) updateData.title = data.title
      if (data.description !== undefined) updateData.description = data.description
      if (data.priority) updateData.priority = taskService.mapPriorityToNumber(data.priority as any)
      if (data.dueDate) updateData.dueDate = new Date(data.dueDate).toISOString()

      if (data.status) {
        if (data.status === 'done' || data.status === 'todo') {
          updateData.completed = data.status === 'done'
        }
      }

      const result = await taskService.updateTask(id, updateData)
      const lists = await listService.getLists()
      const listMap = new Map(lists.map(l => [l.id, l]))
      const mapped = taskService.mapTask(result, listMap.get(result.listId)?.name ?? 'General', 'User', '')
      setTask(mapped)
    } catch (err) {
      console.error('Update failed:', err)
    }
  }

  const handleDelete = async () => {
    if (!id) return
    try {
      await taskService.deleteTask(id)
      navigate('/tasks')
    } catch (err) {
      console.error('Delete failed:', err)
    }
  }

  const handleArchive = async () => {
    if (!id) return
    try {
      await taskService.archiveTask(id)
      navigate('/tasks')
    } catch (err) {
      console.error('Archive failed:', err)
    }
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#07090d] text-slate-500 font-mono text-sm h-screen">
        <span>LOADING TASK SCOPE...</span>
      </div>
    )
  }

  return (
    <TaskDetailsScreen
      task={task}
      onUpdate={handleUpdate}
      onDelete={handleDelete}
      onArchive={handleArchive}
      onRestore={async () => {
        if (!id) return
        try {
          await taskService.restoreTask(id)
          navigate('/tasks')
        } catch (err) {
          console.error('Restore failed:', err)
        }
      }}
      setActiveTab={(tab) => {
        if (tab.startsWith('project-detail:')) {
          const projId = tab.split(':')[1]
          navigate(`/projects/${projId}`)
        } else {
          navigate(`/${tab}`)
        }
      }}
      setSelectedTaskId={() => navigate('/tasks')}
      accentColor={settings.accentColor}
    />
  )
}
