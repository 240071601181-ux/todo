import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { Lock, ShieldAlert, CheckCircle, Cpu } from 'lucide-react'

interface ResetPasswordScreenProps {
  onSubmit: (password: string) => Promise<void>
}

export default function ResetPasswordScreen({ onSubmit }: ResetPasswordScreenProps) {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!password) {
      setError('Please enter a new password.')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setIsLoading(true)
    try {
      await onSubmit(password)
      setIsSuccess(true)
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'response' in err
          ? ((err as { response: { data: { message: string } } }).response?.data?.message ?? 'Something went wrong')
          : 'Something went wrong'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#07090e] text-slate-100 p-4 relative overflow-hidden font-sans">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-900/15 rounded-full blur-3xl animate-pulse-subtle"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-900/15 rounded-full blur-3xl animate-pulse-subtle" style={{ animationDelay: '2s' }}></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-[#0f131a]/85 backdrop-blur-xl border border-slate-800/80 shadow-[0_8px_32px_rgba(0,0,0,0.5)] rounded-2xl p-8 relative z-10"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-slate-900/80 border border-slate-800/80 rounded-xl mb-3 shadow-inner">
            <Cpu className="w-5 h-5 text-blue-400" />
          </div>
          <h1 className="font-display text-xl font-bold tracking-tight text-white">
            Set New Password
          </h1>
          <p className="text-slate-400 text-xs mt-1 font-mono">
            Enter your new workspace credentials
          </p>
        </div>

        {isSuccess ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-4"
          >
            <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
            <p className="text-sm text-slate-300 mb-6">
              Password reset successfully.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              Return to login
            </button>
          </motion.div>
        ) : (
          <>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-4 p-3 bg-red-950/40 border border-red-500/30 text-red-400 text-xs rounded-lg flex items-start gap-2"
              >
                <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono tracking-wider uppercase text-slate-400 mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type="password"
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#090b10] border border-slate-800/80 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono tracking-wider uppercase text-slate-400 mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type="password"
                    placeholder="••••••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-[#090b10] border border-slate-800/80 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all font-sans"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full inline-flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-medium text-sm py-3 px-4 rounded-xl transition-all cursor-pointer shadow-[0_4px_20px_rgba(59,130,246,0.15)] hover:shadow-[0_4px_25px_rgba(59,130,246,0.25)] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
              >
                {isLoading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : (
                  <span>Reset Password</span>
                )}
              </button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  )
}
