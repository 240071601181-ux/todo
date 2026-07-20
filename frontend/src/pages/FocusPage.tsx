import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppProvider'
import FocusScreen from '../components/FocusScreen'

export default function FocusPage() {
  const { settings, setUser } = useApp()
  const navigate = useNavigate()

  return (
    <FocusScreen
      settings={settings}
      setActiveTab={(tab) => navigate(`/${tab}`)}
      setUser={setUser}
    />
  )
}
