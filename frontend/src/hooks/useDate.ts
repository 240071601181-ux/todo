import { useState, useEffect } from 'react'
import { formatDate, getGreeting } from '../utils/date'

export function useDate() {
  const [dateStr, setDateStr] = useState(() => formatDate(new Date()))
  const [greeting, setGreeting] = useState(getGreeting)

  useEffect(() => {
    const timer = setInterval(() => {
      setDateStr(formatDate(new Date()))
      setGreeting(getGreeting())
    }, 60000)
    return () => clearInterval(timer)
  }, [])

  return { dateStr, greeting }
}
