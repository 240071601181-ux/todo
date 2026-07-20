import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppProvider'
import ProfileScreen from '../components/ProfileScreen'

export default function ProfilePage() {
  const { user, settings, logout, projects } = useApp()
  const navigate = useNavigate()

  const weeklyTaskTotal = user.weeklyTaskCount.reduce((a, b) => a + b, 0)
  const projectCount = projects.length

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <ProfileScreen
      user={user}
      settings={settings}
      onLogout={handleLogout}
      accentColor={settings.accentColor}
      weeklyTaskTotal={weeklyTaskTotal}
      projectCount={projectCount}
    />
  )
}
