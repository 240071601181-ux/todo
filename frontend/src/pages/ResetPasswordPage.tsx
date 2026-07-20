import { useSearchParams, useNavigate } from 'react-router-dom'
import ResetPasswordScreen from '../components/ResetPasswordScreen'
import * as authService from '../services/authService'

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')

  if (!token) {
    navigate('/forgot-password', { replace: true })
    return null
  }

  const handleSubmit = async (password: string) => {
    await authService.resetPassword(token, password)
  }

  return <ResetPasswordScreen onSubmit={handleSubmit} />
}
