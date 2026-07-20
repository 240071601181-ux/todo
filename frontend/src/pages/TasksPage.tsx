import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppProvider'
import TasksScreen from '../components/TasksScreen'
import * as taskService from '../services/taskService'
import * as listService from '../services/listService'
import type { Task } from '../types'

export default function TasksPage() {
  const { user: ctxUser, settings } = useApp()
  const navigate = useNavigate()

  const [tasks, setTasks] = useState<Task[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const limit = 50

  const [searchQuery, setSearchQuery] = useState('')
  const [filterProject, setFilterProject] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showArchived, setShowArchived] = useState(false)
  const [sortBy, setSortBy] = useState<string>('createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fetchTasks = useCallback(async () => {
    try {
      const params: taskService.TaskQueryParams = {
        page,
        limit,
        sortBy: sortBy as any,
        sortOrder,
        archived: showArchived ? undefined : false,
      }

      if (searchQuery) params.search = searchQuery

      if (filterProject !== 'all') params.listId = filterProject
      if (filterPriority !== 'all') {
        params.priority = taskService.mapPriorityToNumber(filterPriority as any)
      }
      if (filterStatus !== 'all') {
        if (filterStatus === 'todo') params.completed = false
        else if (filterStatus === 'in_progress') params.completed = false
        else if (filterStatus === 'done') params.completed = true
      }

      const result = await taskService.getTasks(params)

      const lists = await listService.getLists()
      const listMap = new Map(lists.map(l => [l.id, l]))

      const mapped = result.tasks.map(bt =>
        taskService.mapTask(bt, listMap.get(bt.listId)?.name ?? 'General', ctxUser.name, ctxUser.avatar),
      )
      setTasks(mapped)
      setTotal(result.total)
      setTotalPages(result.totalPages)
    } catch (err) {
      console.error('Failed to fetch tasks:', err)
    }
  }, [page, limit, searchQuery, filterProject, filterPriority, filterStatus, sortBy, sortOrder, showArchived])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const handleSearch = useCallback((query: string) => {
    if (searchTimer.current) clearTimeout(searchTimer.current)
    searchTimer.current = setTimeout(() => {
      setSearchQuery(query)
      setPage(1)
    }, 300)
  }, [])

  const handleToggleTask = useCallback(async (taskId: string) => {
    try {
      const result = await taskService.toggleTask(taskId)
      setTasks(prev => prev.map(t =>
        t.id === taskId
          ? { ...t, status: result.completed ? 'done' : 'todo' }
          : t,
      ))
    } catch (err) {
      console.error('Toggle failed:', err)
    }
  }, [])

  const handleDeleteTask = useCallback(async (taskId: string) => {
    try {
      await taskService.deleteTask(taskId)
      setTasks(prev => prev.filter(t => t.id !== taskId))
    } catch (err) {
      console.error('Delete failed:', err)
    }
  }, [])

  const handleCreateTask = useCallback(async (data: {
    title: string
    description: string
    priority: string
    listId: string
    tagIds?: string[]
  }) => {
    try {
      const created = await taskService.createTask({
        title: data.title,
        description: data.description || undefined,
        priority: taskService.mapPriorityToNumber(data.priority as any),
        listId: data.listId,
      })
      const lists = await listService.getLists()
      const listMap = new Map(lists.map(l => [l.id, l]))
      const mapped = taskService.mapTask(created, listMap.get(created.listId)?.name ?? 'General', ctxUser.name, ctxUser.avatar)
      setTasks(prev => [mapped, ...prev])
      setPage(1)
    } catch (err) {
      console.error('Create failed:', err)
    }
  }, [])

  const handleArchiveTask = useCallback(async (taskId: string) => {
    try {
      await taskService.archiveTask(taskId)
      setTasks(prev => prev.filter(t => t.id !== taskId))
    } catch (err) {
      console.error('Archive failed:', err)
    }
  }, [])

  return (
    <TasksScreen
      tasks={tasks}
      setTasks={setTasks}
      selectedTaskId={null}
      setSelectedTaskId={(id) => {
        if (id) navigate(`/tasks/${id}`)
      }}
      setActiveTab={(tab) => {
        if (tab.startsWith('project-detail:')) {
          const projId = tab.split(':')[1]
          navigate(`/projects/${projId}`)
        } else {
          navigate(`/${tab}`)
        }
      }}
      accentColor={settings.accentColor}
      // Search/filter/sort/pagination
      searchQuery={searchQuery}
      onSearchChange={handleSearch}
      filterProject={filterProject}
      onFilterProjectChange={(v) => { setFilterProject(v); setPage(1) }}
      filterPriority={filterPriority}
      onFilterPriorityChange={(v) => { setFilterPriority(v); setPage(1) }}
      filterStatus={filterStatus}
      onFilterStatusChange={(v) => { setFilterStatus(v); setPage(1) }}
      showArchived={showArchived}
      onToggleArchived={() => setShowArchived(v => !v)}
      sortBy={sortBy}
      onSortChange={(field, order) => { setSortBy(field); if (order) setSortOrder(order) }}
      page={page}
      totalPages={totalPages}
      total={total}
      onPageChange={setPage}
      onRefresh={fetchTasks}
      // Actions
      onToggleTask={handleToggleTask}
      onDeleteTask={handleDeleteTask}
      onCreateTask={handleCreateTask}
      onArchiveTask={handleArchiveTask}
    />
  )
}
