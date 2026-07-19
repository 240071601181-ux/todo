import { motion } from 'framer-motion'
import { Bell, Search } from 'lucide-react'

interface DashboardHeaderProps {
  dateStr: string
  greeting: string
}

export default function DashboardHeader({ dateStr, greeting }: DashboardHeaderProps) {
  return (
    <motion.header
      className="mb-10"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="flex justify-between items-start mb-2">
        <p className="font-label-caps text-label-caps text-tertiary uppercase tracking-widest">
          {dateStr}
        </p>
        <div className="flex gap-4">
          <Bell className="w-5 h-5 text-on-surface-variant cursor-pointer hover:text-primary transition-colors" />
          <Search className="w-5 h-5 text-on-surface-variant cursor-pointer hover:text-primary transition-colors" />
        </div>
      </div>
      <h2 className="font-display-lg text-display-lg text-on-surface mb-2 leading-[1.1]">
        {greeting}
      </h2>
      <p className="font-body-md text-on-surface-variant opacity-60">
        What's your plan for today?
      </p>
    </motion.header>
  )
}
