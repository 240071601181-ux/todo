import { useParams, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppProvider'
import TaskDetailsScreen from '../components/TaskDetailsScreen'

export default function TaskDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { tasks, setTasks, settings } = useApp()
  const navigate = useNavigate()

  const task = tasks.find((t) => t.id === id)

  return (
    <TaskDetailsScreen
      task={task}
      setTasks={setTasks}
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
