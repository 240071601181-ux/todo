import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { getMonthDays, dayLabels, getMonthName } from '../../utils/date'

export default function MiniCalendar() {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())

  const weeks = getMonthDays(year, month)
  const currentDay = today.getDate()
  const isCurrentMonth = today.getMonth() === month && today.getFullYear() === year

  const prevMonth = () => {
    if (month === 0) {
      setYear((y) => y - 1)
      setMonth(11)
    } else {
      setMonth((m) => m - 1)
    }
  }

  const nextMonth = () => {
    if (month === 11) {
      setYear((y) => y + 1)
      setMonth(0)
    } else {
      setMonth((m) => m + 1)
    }
  }

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h4 className="font-headline-md text-title-lg text-on-surface">
          {getMonthName(month)} {year}
        </h4>
        <div className="flex gap-2">
          <button
            onClick={prevMonth}
            className="p-1 hover:bg-surface-container-high rounded transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 text-on-surface-variant" />
          </button>
          <button
            onClick={nextMonth}
            className="p-1 hover:bg-surface-container-high rounded transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4 text-on-surface-variant" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-y-4 text-center">
        {dayLabels.map((label) => (
          <span
            key={label}
            className="text-[10px] font-label-caps text-on-surface-variant opacity-40 uppercase"
          >
            {label}
          </span>
        ))}
        {weeks.map((week, wi) =>
          week.map((day, di) => {
            if (day === null) {
              return <span key={`${wi}-${di}`} />
            }
            const isToday = isCurrentMonth && day === currentDay
            const isPast = isCurrentMonth && day < currentDay
            return (
              <span
                key={`${wi}-${di}`}
                className={`text-body-sm relative flex items-center justify-center ${
                  isToday
                    ? 'font-bold text-black'
                    : isPast
                      ? 'text-on-surface-variant opacity-40'
                      : 'text-on-surface-variant hover:text-on-surface cursor-pointer'
                }`}
              >
                {isToday && (
                  <motion.span
                    layoutId="calendar-today"
                    className="absolute w-8 h-8 rounded-full bg-tertiary -z-10"
                    initial={false}
                  />
                )}
                {day}
              </span>
            )
          })
        )}
      </div>
    </div>
  )
}
