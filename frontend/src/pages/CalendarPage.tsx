import { useApp } from '../context/AppProvider'
import CalendarScreen from '../components/CalendarScreen'

export default function CalendarPage() {
  const { events, setEvents, settings } = useApp()

  return (
    <CalendarScreen
      events={events}
      setEvents={setEvents}
      settings={settings}
    />
  )
}
