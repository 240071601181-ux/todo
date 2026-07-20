import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppProvider'
import LoginScreen from '../components/LoginScreen'

export default function LoginPage() {
  const { settings, login } = useApp()
  const navigate = useNavigate()

  const handleLoginSuccess = (name: string, email: string) => {
    login(name, email)
    navigate('/dashboard')
  }

  return (
    <LoginScreen
      onLoginSuccess={handleLoginSuccess}
      settings={settings}
    />
  )
}
