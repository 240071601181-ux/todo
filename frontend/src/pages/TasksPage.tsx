import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppProvider'
import TasksScreen from '../components/TasksScreen'

export default function TasksPage() {
  const { tasks, setTasks, projects, settings } = useApp()
  const navigate = useNavigate()

  return (
    <TasksScreen
      tasks={tasks}
      setTasks={setTasks}
      projects={projects}
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
    />
  )
}
