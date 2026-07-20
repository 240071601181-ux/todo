import { useNavigate } from 'react-router-dom'

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#05070a] flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <div className="text-6xl font-mono font-bold text-slate-800 mb-4">404</div>
        <h1 className="text-xl font-display font-semibold text-slate-300 mb-2">
          Module Not Found
        </h1>
        <p className="text-sm text-slate-500 font-mono mb-8">
          ERR_OUT_OF_BOUNDS // The requested route does not exist in the workspace.
        </p>
        <button
          onClick={() => navigate('/dashboard')}
          className="px-6 py-2.5 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-xl text-sm font-medium hover:bg-blue-500/20 transition-all cursor-pointer"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  )
}
