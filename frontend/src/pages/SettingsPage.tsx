import { useApp } from '../context/AppProvider'
import SettingsScreen from '../components/SettingsScreen'

export default function SettingsPage() {
  const { settings, setSettings } = useApp()

  return (
    <SettingsScreen
      settings={settings}
      setSettings={setSettings}
    />
  )
}
