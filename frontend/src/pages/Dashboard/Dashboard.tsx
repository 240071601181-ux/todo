import { useState } from 'react'
import { Leaf, Briefcase, Folder } from 'lucide-react'
import Sidebar from '../../components/Sidebar/Sidebar'
import DashboardHeader from '../../components/Navbar/DashboardHeader'
import AddTaskInput from '../../components/AddTaskInput/AddTaskInput'
import TaskList from '../../components/TaskList/TaskList'
import MiniCalendar from '../../components/Calendar/MiniCalendar'
import SortPanel from '../../components/SortPanel/SortPanel'
import PersonalInsight from '../../components/PersonalInsight/PersonalInsight'
import { useDate } from '../../hooks/useDate'
import { useTasks } from '../../hooks/useTasks'
import { useAnalytics } from '../../hooks/useAnalytics'
import type { SortMethod, NavItem } from '../../types/todo'

const navItems: NavItem[] = [
  { id: 'life', label: 'Life', icon: Leaf, active: true },
  { id: 'work', label: 'Work', icon: Briefcase },
  { id: 'project-a', label: 'Project A', icon: Folder },
]

function buildInsightText(analytics: {
  completedTasks: number
  pendingTasks: number
  completionPercent: number
  dueToday: number
  overdue: number
  mostActiveCategory: { id: string; name: string; count: number } | null
}): string {
  const total = analytics.completedTasks + analytics.pendingTasks
  if (total === 0) return 'No tasks yet. Start by adding one above.'

  if (analytics.dueToday > 0) {
    return `${analytics.dueToday} task${analytics.dueToday > 1 ? 's' : ''} due today`
  }

  if (analytics.overdue > 0) {
    return `${analytics.overdue} task${analytics.overdue > 1 ? 's' : ''} overdue — time to catch up!`
  }

  return `You've completed ${analytics.completedTasks} of ${total} tasks (${analytics.completionPercent}%)`
}

export default function Dashboard() {
  const { dateStr, greeting } = useDate()
  const { tasks, toggleTask, addTask, isLoading, isError, error } = useTasks()
  const { data: analytics } = useAnalytics()
  const [activeSort, setActiveSort] = useState<SortMethod>('priority')

  const insightLabel = analytics?.mostActiveCategory
    ? `TOP CATEGORY: ${analytics.mostActiveCategory.name.toUpperCase()}`
    : 'PERSONAL INSIGHT'

  const insightText = analytics ? buildInsightText(analytics) : undefined

  return (
    <div className="flex h-screen w-full bg-background text-on-surface font-body-md overflow-hidden">
      <Sidebar navItems={navItems} />

      <main className="w-[55%] h-full bg-surface flex flex-col px-12 py-12 overflow-hidden">
        <DashboardHeader dateStr={dateStr} greeting={greeting} />
        <AddTaskInput onAdd={addTask} />
        <TaskList
          tasks={tasks}
          onToggle={toggleTask}
          isLoading={isLoading}
          isError={isError}
          error={error}
        />
      </main>

      <aside className="w-1/4 min-w-[260px] h-screen bg-surface-container-low border-l border-outline-variant flex flex-col px-8 py-12 overflow-y-auto">
        <MiniCalendar />
        <SortPanel activeSort={activeSort} onSortChange={setActiveSort} />
        <PersonalInsight label={insightLabel} text={insightText} />
      </aside>
    </div>
  )
}
