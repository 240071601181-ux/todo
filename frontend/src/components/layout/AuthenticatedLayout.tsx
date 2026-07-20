import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { useApp } from '../../context/AppProvider'
import Sidebar from '../Sidebar'

export default function AuthenticatedLayout() {
  const { user, projects, settings, logout } = useApp()
  const location = useLocation()
  const navigate = useNavigate()

  const activeTab = location.pathname.split('/')[1] || 'dashboard'

  const handleSetActiveTab = (tab: string) => {
    if (tab.startsWith('project-detail:')) {
      const projId = tab.split(':')[1]
      navigate(`/projects/${projId}`)
    } else {
      navigate(`/${tab}`)
    }
  }

  const themeClasses: Record<string, string> = {
    obsidian: 'bg-[#05070a] text-slate-100',
    slate: 'bg-[#0a0f1d] text-slate-200',
    light: 'bg-slate-50 text-slate-900 light-theme',
  }

  return (
    <div
      className={`min-h-screen flex ${themeClasses[settings.theme]} font-sans overflow-hidden`}
    >
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-900/5 rounded-full blur-3xl opacity-30 pointer-events-none" />

      <Sidebar
        activeTab={activeTab}
        setActiveTab={handleSetActiveTab}
        user={user}
        projects={projects}
        settings={settings}
        onLogout={logout}
      />

      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={settings.smartTransitions ? { opacity: 0, y: 10 } : undefined}
            animate={settings.smartTransitions ? { opacity: 1, y: 0 } : undefined}
            exit={settings.smartTransitions ? { opacity: 0, y: -10 } : undefined}
            transition={{ duration: 0.25 }}
            className="flex-1 flex flex-col h-full overflow-hidden"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}
