import React, { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#07090d] text-slate-100 p-8 font-sans">
          <div className="max-w-md text-center space-y-4">
            <div className="text-5xl font-serif font-bold text-amber-500/80">F</div>
            <h1 className="text-xl font-semibold text-slate-200">Something went wrong</h1>
            <p className="text-sm text-slate-500 font-mono">
              {this.state.error?.message ?? 'An unexpected error occurred'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-amber-600/20 border border-amber-600/30 text-amber-400 rounded-xl text-sm hover:bg-amber-600/30 transition-all cursor-pointer"
            >
              Reload Application
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
