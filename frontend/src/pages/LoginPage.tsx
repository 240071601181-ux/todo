import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppProvider'
import LoginScreen from '../components/LoginScreen'

export default function LoginPage() {
  const { settings, login, register } = useApp()
  const navigate = useNavigate()

  const handleLogin = async (email: string, password: string) => {
    await login(email, password)
    navigate('/dashboard')
  }

  const handleRegister = async (name: string, email: string, password: string) => {
    await register(name, email, password)
    navigate('/dashboard')
  }

  return (
    <LoginScreen
      onLogin={handleLogin}
      onRegister={handleRegister}
      settings={settings}
    />
  )
}
