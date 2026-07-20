import ForgotPasswordScreen from '../components/ForgotPasswordScreen'
import * as authService from '../services/authService'

export default function ForgotPasswordPage() {
  const handleSubmit = async (email: string) => {
    await authService.forgotPassword(email)
  }

  return <ForgotPasswordScreen onSubmit={handleSubmit} />
}
