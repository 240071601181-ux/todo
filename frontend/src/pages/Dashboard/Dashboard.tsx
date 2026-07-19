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
import type { SortMethod, NavItem } from '../../types/todo'

const navItems: NavItem[] = [
  { id: 'life', label: 'Life', icon: Leaf, active: true },
  { id: 'work', label: 'Work', icon: Briefcase },
  { id: 'project-a', label: 'Project A', icon: Folder },
]

export default function Dashboard() {
  const { dateStr, greeting } = useDate()
  const { tasks, toggleTask, addTask, isLoading, isError, error } = useTasks()
  const [activeSort, setActiveSort] = useState<SortMethod>('priority')

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
        <PersonalInsight />
      </aside>
    </div>
  )
}
