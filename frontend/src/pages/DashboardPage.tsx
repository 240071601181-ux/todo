import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppProvider'
import DashboardScreen from '../components/DashboardScreen'

export default function DashboardPage() {
  const { user, setUser, tasks, setTasks, projects, events, settings } = useApp()
  const navigate = useNavigate()

  return (
    <DashboardScreen
      user={user}
      setUser={setUser}
      tasks={tasks}
      setTasks={setTasks}
      projects={projects}
      events={events}
      settings={settings}
      setActiveTab={(tab) => {
        if (tab.startsWith('project-detail:')) {
          const projId = tab.split(':')[1]
          navigate(`/projects/${projId}`)
        } else {
          navigate(`/${tab}`)
        }
      }}
      setSelectedTaskId={(id) => {
        if (id) navigate(`/tasks/${id}`)
      }}
    />
  )
}
