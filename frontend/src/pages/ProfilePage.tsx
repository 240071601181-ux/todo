import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppProvider'
import ProfileScreen from '../components/ProfileScreen'

export default function ProfilePage() {
  const { user, settings, logout } = useApp()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <ProfileScreen
      user={user}
      settings={settings}
      onLogout={handleLogout}
      accentColor={settings.accentColor}
    />
  )
}
