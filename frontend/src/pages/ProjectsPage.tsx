import { useParams, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppProvider'
import ProjectsScreen from '../components/ProjectsScreen'
import * as projectService from '../services/projectService'

export default function ProjectsPage() {
  const { id } = useParams<{ id: string }>()
  const { user, projects, setProjects, tasks, settings } = useApp()
  const navigate = useNavigate()

  const handleCreate = async (data: Parameters<typeof projectService.createProject>[0]) => {
    try {
      const created = await projectService.createProject(data)
      const mapped = projectService.mapProject(created)
      setProjects(prev => [...prev, mapped])
      navigate(`/projects/${mapped.id}`)
    } catch (err) {
      console.error('Create project failed:', err)
    }
  }

  const handleUpdate = async (projectId: string, data: Parameters<typeof projectService.updateProject>[1]) => {
    try {
      const updated = await projectService.updateProject(projectId, data)
      const mapped = projectService.mapProject(updated)
      setProjects(prev => prev.map(p => p.id === projectId ? { ...mapped, pulseFeed: p.pulseFeed } : p))
    } catch (err) {
      console.error('Update project failed:', err)
    }
  }

  const handleDelete = async (projectId: string) => {
    try {
      await projectService.deleteProject(projectId)
      setProjects(prev => prev.filter(p => p.id !== projectId))
      navigate('/projects')
    } catch (err) {
      console.error('Delete project failed:', err)
    }
  }

  return (
    <ProjectsScreen
      projects={projects}
      setProjects={setProjects}
      tasks={tasks}
      onCreateProject={handleCreate}
      onUpdateProject={handleUpdate}
      onDeleteProject={handleDelete}
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
      currentUser={user}
    />
  )
}
