import type { ReactNode } from 'react'

interface FocusLayoutProps {
  children: ReactNode
}

export default function FocusLayout({ children }: FocusLayoutProps) {
  return (
    <div className="min-h-screen bg-[#05060a]">
      {children}
    </div>
  )
}
