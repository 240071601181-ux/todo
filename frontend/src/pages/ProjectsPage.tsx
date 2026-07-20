import { useParams, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppProvider'
import ProjectsScreen from '../components/ProjectsScreen'

export default function ProjectsPage() {
  const { id } = useParams<{ id: string }>()
  const { projects, setProjects, tasks, settings } = useApp()
  const navigate = useNavigate()

  return (
    <ProjectsScreen
      projects={projects}
      setProjects={setProjects}
      tasks={tasks}
      setSelectedTaskId={(taskId) => {
        if (taskId) navigate(`/tasks/${taskId}`)
      }}
      setActiveTab={(tab) => {
        if (tab.startsWith('project-detail:')) {
          const projId = tab.split(':')[1]
          navigate(`/projects/${projId}`)
        } else {
          navigate(`/${tab}`)
        }
      }}
      currentProjectId={id ?? null}
      setCurrentProjectId={(projectId) => {
        if (projectId) navigate(`/projects/${projectId}`)
      }}
      accentColor={settings.accentColor}
    />
  )
}
