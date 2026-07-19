import { motion } from 'framer-motion'

interface PersonalInsightProps {
  label?: string
  text?: string
  className?: string
}

export default function PersonalInsight({
  label = 'PERSONAL INSIGHT',
  text = 'Focus is 22% higher today',
}: PersonalInsightProps) {
  return (
    <motion.div
      className="mt-auto relative w-full h-48 rounded-2xl overflow-hidden border border-outline-variant group cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="absolute inset-0 z-10 p-6 flex flex-col justify-end bg-gradient-to-t from-black/80 to-transparent">
        <p className="text-[10px] font-label-caps text-tertiary mb-1">{label}</p>
        <p className="text-body-sm font-bold text-white">{text}</p>
      </div>
      <div className="absolute inset-0 bg-[#1D1D1D] flex items-center justify-center">
        <div className="w-full h-full opacity-20 group-hover:opacity-40 transition-opacity">
          <div
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage:
                'linear-gradient(135deg, #2b292f 0%, #1d1b20 30%, #36343a 60%, #2b292f 100%)',
            }}
          />
        </div>
      </div>
    </motion.div>
  )
}
