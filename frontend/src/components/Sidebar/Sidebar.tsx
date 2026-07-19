import { motion } from 'framer-motion'
import { Plus, Settings, HelpCircle } from 'lucide-react'
import type { NavItem } from '../../types/todo'

interface SidebarProps {
  navItems: NavItem[]
  userName?: string
  userAccount?: string
  avatarUrl?: string
  onNewList?: () => void
}

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: [0.16, 1, 0.3, 1] as const },
  }),
}

export default function Sidebar({
  navItems,
  userName = 'Alex Rivera',
  userAccount = 'Pro Account',
  avatarUrl,
  onNewList,
}: SidebarProps) {
  return (
    <aside className="w-1/5 min-w-[220px] flex flex-col h-screen py-8 px-6 bg-surface-container-low border-r border-outline-variant shadow-sm transition-all duration-300">
      <motion.div
        className="mb-12"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <h1 className="font-display-lg text-display-lg-mobile font-extrabold text-primary mb-1">
          Fastodo
        </h1>
        <p className="font-body-md text-body-sm text-on-surface-variant opacity-70">
          Premium Productivity
        </p>
      </motion.div>

      <div className="flex-grow">
        <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-4 opacity-50 tracking-widest">
          My Lists
        </p>
        <nav className="space-y-2">
          {navItems.map((item, i) => (
            <motion.a
              key={item.id}
              href="#"
              custom={i}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                item.active
                  ? 'bg-tertiary text-black font-bold active-glow scale-100 hover:scale-[1.02]'
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </motion.a>
          ))}
        </nav>

        <motion.button
          onClick={onNewList}
          className="mt-8 w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-outline-variant text-on-surface font-semibold hover:bg-surface-container-highest transition-colors active:scale-95"
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="w-5 h-5" />
          <span>New List</span>
        </motion.button>
      </div>

      <div className="pt-8 border-t border-outline-variant space-y-4">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-10 h-10 rounded-full border border-outline-variant overflow-hidden flex-shrink-0 bg-surface-container-high">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={userName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-on-surface-variant text-sm font-bold">
                {userName.charAt(0)}
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="font-title-lg text-body-md font-bold text-on-surface truncate">
              {userName}
            </p>
            <p className="text-[12px] text-on-surface-variant opacity-60">
              {userAccount}
            </p>
          </div>
        </div>
        <div className="space-y-2">
          <a
            href="#"
            className="flex items-center gap-3 text-on-surface-variant font-medium hover:text-on-surface transition-colors"
          >
            <Settings className="w-5 h-5" />
            <span className="text-body-sm">Settings</span>
          </a>
          <a
            href="#"
            className="flex items-center gap-3 text-on-surface-variant font-medium hover:text-on-surface transition-colors"
          >
            <HelpCircle className="w-5 h-5" />
            <span className="text-body-sm">Support</span>
          </a>
        </div>
      </div>
    </aside>
  )
}
