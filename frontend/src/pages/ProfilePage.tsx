import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppProvider'
import ProfileScreen from '../components/ProfileScreen'
import * as authService from '../services/authService'

export default function ProfilePage() {
  const { user, setUser, settings, logout, projects } = useApp()
  const navigate = useNavigate()

  const weeklyTaskTotal = user.weeklyTaskCount.reduce((a, b) => a + b, 0)
  const projectCount = projects.length

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const handleUpdateProfile = async (data: { name?: string; email?: string }) => {
    const updatedUser = await authService.updateProfile(data)
    setUser(prev => ({
      ...prev,
      name: updatedUser.name,
      email: updatedUser.email,
    }))
  }

  const handleChangePassword = async (currentPassword: string, newPassword: string) => {
    await authService.changePassword(currentPassword, newPassword)
  }

  const handleUploadAvatar = async (file: File) => {
    const updatedUser = await authService.uploadAvatar(file)
    const apiUrl = import.meta.env.VITE_API_URL?.replace('/api', '') ?? ''
    const avatarUrl = updatedUser.avatarUrl
      ? (updatedUser.avatarUrl.startsWith('http') ? updatedUser.avatarUrl : `${apiUrl}${updatedUser.avatarUrl}`)
      : user.avatar
    setUser(prev => ({
      ...prev,
      avatar: avatarUrl,
    }))
  }

  return (
    <ProfileScreen
      user={user}
      settings={settings}
      onLogout={handleLogout}
      accentColor={settings.accentColor}
      weeklyTaskTotal={weeklyTaskTotal}
      projectCount={projectCount}
      onUpdateProfile={handleUpdateProfile}
      onChangePassword={handleChangePassword}
      onUploadAvatar={handleUploadAvatar}
    />
  )
}
