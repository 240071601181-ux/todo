import React from 'react';
import { 
  Sliders, 
  Palette, 
  Sparkles, 
  Layers, 
  Volume2, 
  Zap, 
  Layout, 
  Activity,
  Bell,
  Shield,
  Globe,
  Mail,
  Smartphone,
  KeyRound,
  CheckCircle2,
  Eye,
  EyeOff,
} from 'lucide-react';
import { AppSettings } from '../types';

interface SettingsScreenProps {
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
}

const languages = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'es', label: 'Spanish', native: 'Español' },
  { code: 'fr', label: 'French', native: 'Français' },
  { code: 'de', label: 'German', native: 'Deutsch' },
  { code: 'ja', label: 'Japanese', native: '日本語' },
  { code: 'zh', label: 'Chinese', native: '中文' },
];

export default function SettingsScreen({ settings, setSettings }: SettingsScreenProps) {
  
  const handleToggleGlassmorphism = () => {
    setSettings(prev => ({ ...prev, glassmorphism: !prev.glassmorphism }));
  };

  const handleToggleSoundEffects = () => {
    setSettings(prev => ({ ...prev, soundEffects: !prev.soundEffects }));
  };

  const handleToggleSmartTransitions = () => {
    setSettings(prev => ({ ...prev, smartTransitions: !prev.smartTransitions }));
  };

  const handleChangeTheme = (theme: AppSettings['theme']) => {
    setSettings(prev => ({ ...prev, theme }));
  };

  const handleChangeDensity = (density: AppSettings['density']) => {
    setSettings(prev => ({ ...prev, density }));
  };

  const handleChangeAccent = (accentColor: AppSettings['accentColor']) => {
    setSettings(prev => ({ ...prev, accentColor }));
  };

  const handleChangeLanguage = (language: string) => {
    setSettings(prev => ({ ...prev, language }));
  };

  const handleTogglePushNotifications = () => {
    setSettings(prev => ({
      ...prev,
      notifications: { ...prev.notifications, pushEnabled: !prev.notifications.pushEnabled },
    }));
  };

  const handleToggleEmailNotifications = () => {
    setSettings(prev => ({
      ...prev,
      notifications: { ...prev.notifications, emailEnabled: !prev.notifications.emailEnabled },
    }));
  };

  const handleChangeDigestFrequency = (digestFrequency: 'daily' | 'weekly' | 'never') => {
    setSettings(prev => ({
      ...prev,
      notifications: { ...prev.notifications, digestFrequency },
    }));
  };

  const handleToggleTwoFactor = () => {
    setSettings(prev => ({
      ...prev,
      security: { ...prev.security, twoFactorEnabled: !prev.security.twoFactorEnabled },
    }));
  };

  const getAccentColorHex = () => {
    switch (settings.accentColor) {
      case 'purple': return '#a855f7';
      case 'emerald': return '#10b981';
      case 'amber': return '#f59e0b';
      case 'rose': return '#f43f5e';
      default: return '#3b82f6';
    }
  };

  const activeAccent = getAccentColorHex();

  return (
    <div className="flex-1 overflow-y-auto bg-[#07090d] text-slate-100 p-8 space-y-8 font-sans">
      
      {/* Top Header Block */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800/50 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 uppercase tracking-widest">
            <span>PREFERENCES TERMINAL</span>
            <span>•</span>
            <span style={{ color: activeAccent }}>CALIBRATION PANEL</span>
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-white mt-1">
            System Settings
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">
            Optimize, skin, and calibrate the Velocity Dark Suite engine to fit your workflow.
          </p>
        </div>
      </div>

      {/* Main Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
        
        {/* Card 1: Appearance & Themes */}
        <div className="bg-[#0c0f16] border border-slate-800/60 p-6 rounded-2xl space-y-5">
          <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2 border-b border-slate-800/40 pb-3">
            <Palette className="w-4 h-4 text-blue-500" style={{ color: activeAccent }} /> Appearance Theme
          </h3>

          <div className="space-y-3">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">Visual Base Profile</span>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'obsidian', label: 'Obsidian Dark', desc: 'True Black canvas' },
                { id: 'slate', label: 'Slate Blue', desc: 'Deep cosmic slate' },
                { id: 'light', label: 'Pure Light', desc: 'Clean high contrast' },
              ].map((themeItem) => (
                <button
                  key={themeItem.id}
                  onClick={() => handleChangeTheme(themeItem.id as AppSettings['theme'])}
                  className={`p-3.5 border rounded-xl text-left transition-all cursor-pointer flex flex-col justify-between h-20 ${
                    settings.theme === themeItem.id
                      ? 'bg-slate-900 border-blue-500/80 shadow-md'
                      : 'bg-[#07090d] border-slate-800/60 hover:border-slate-700/40'
                  }`}
                  style={{
                    borderColor: settings.theme === themeItem.id ? activeAccent : undefined
                  }}
                >
                  <span className="text-xs font-semibold text-slate-200 block">{themeItem.label}</span>
                  <span className="text-[9px] text-slate-500 block leading-tight">{themeItem.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">Accent Highlight Color</span>
            <div className="flex flex-wrap gap-2.5">
              {[
                { id: 'blue', color: 'bg-blue-500', label: 'Blue' },
                { id: 'purple', color: 'bg-purple-500', label: 'Purple' },
                { id: 'emerald', color: 'bg-emerald-500', label: 'Emerald' },
                { id: 'amber', color: 'bg-amber-500', label: 'Amber' },
                { id: 'rose', color: 'bg-rose-500', label: 'Rose' },
              ].map((accentItem) => (
                <button
                  key={accentItem.id}
                  onClick={() => handleChangeAccent(accentItem.id)}
                  className={`h-9 px-3 rounded-xl border flex items-center gap-2 text-xs font-mono transition-all cursor-pointer ${
                    settings.accentColor === accentItem.id
                      ? 'bg-slate-900 text-white'
                      : 'bg-[#07090d] text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                  style={{
                    borderColor: settings.accentColor === accentItem.id ? activeAccent : undefined
                  }}
                >
                  <span className={`h-2.5 w-2.5 rounded-full ${accentItem.color}`} />
                  <span>{accentItem.label.toUpperCase()}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Card 2: Layout & Language */}
        <div className="bg-[#0c0f16] border border-slate-800/60 p-6 rounded-2xl space-y-5">
          <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2 border-b border-slate-800/40 pb-3">
            <Layout className="w-4 h-4 text-emerald-500" /> Layout & Language
          </h3>

          {/* Density selection */}
          <div className="space-y-3">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">Grid Padding & Spacing presets</span>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'compact', label: 'Compact', desc: 'Sub-4px offsets' },
                { id: 'standard', label: 'Standard', desc: 'Balanced default' },
                { id: 'cozy', label: 'Cozy', desc: 'Generous spaces' },
              ].map((denseItem) => (
                <button
                  key={denseItem.id}
                  onClick={() => handleChangeDensity(denseItem.id as AppSettings['density'])}
                  className={`p-3.5 border rounded-xl text-left transition-all cursor-pointer flex flex-col justify-between h-20 ${
                    settings.density === denseItem.id
                      ? 'bg-slate-900 border-blue-500/80 shadow-md'
                      : 'bg-[#07090d] border-slate-800/60 hover:border-slate-700/40'
                  }`}
                  style={{
                    borderColor: settings.density === denseItem.id ? activeAccent : undefined
                  }}
                >
                  <span className="text-xs font-semibold text-slate-200 block">{denseItem.label}</span>
                  <span className="text-[9px] text-slate-500 block leading-tight">{denseItem.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Language selection */}
          <div className="space-y-3">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">
              <Globe className="w-3 h-3 inline-block mr-1" /> Interface Language
            </span>
            <div className="grid grid-cols-2 gap-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleChangeLanguage(lang.code)}
                  className={`px-3 py-2.5 border rounded-xl text-left transition-all cursor-pointer ${
                    settings.language === lang.code
                      ? 'bg-slate-900 border-blue-500/80 shadow-md'
                      : 'bg-[#07090d] border-slate-800/60 hover:border-slate-700/40'
                  }`}
                  style={{
                    borderColor: settings.language === lang.code ? activeAccent : undefined
                  }}
                >
                  <span className="text-xs font-semibold text-slate-200 block">{lang.native}</span>
                  <span className="text-[9px] text-slate-500 block">{lang.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Card 3: Notifications */}
        <div className="bg-[#0c0f16] border border-slate-800/60 p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2 border-b border-slate-800/40 pb-3">
            <Bell className="w-4 h-4 text-amber-500" /> Notification Preferences
          </h3>

          <div className="space-y-3">
            {/* Push notifications toggle */}
            <div className="p-3 bg-[#07090d] border border-slate-800/80 rounded-xl flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-slate-200 block flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-slate-500" /> Push Notifications
                </span>
                <span className="text-[10px] text-slate-500 block">Receive alerts for due tasks and project updates</span>
              </div>
              <button
                onClick={handleTogglePushNotifications}
                className={`w-11 h-6 rounded-full p-1 transition-colors cursor-pointer ${
                  settings.notifications.pushEnabled ? 'bg-blue-500' : 'bg-slate-800'
                }`}
                style={{
                  backgroundColor: settings.notifications.pushEnabled ? activeAccent : undefined
                }}
              >
                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  settings.notifications.pushEnabled ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>

            {/* Email notifications toggle */}
            <div className="p-3 bg-[#07090d] border border-slate-800/80 rounded-xl flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-slate-200 block flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-500" /> Email Notifications
                </span>
                <span className="text-[10px] text-slate-500 block">Get email updates for task assignments and mentions</span>
              </div>
              <button
                onClick={handleToggleEmailNotifications}
                className={`w-11 h-6 rounded-full p-1 transition-colors cursor-pointer ${
                  settings.notifications.emailEnabled ? 'bg-blue-500' : 'bg-slate-800'
                }`}
                style={{
                  backgroundColor: settings.notifications.emailEnabled ? activeAccent : undefined
                }}
              >
                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  settings.notifications.emailEnabled ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>

            {/* Digest frequency */}
            <div className="p-3 bg-[#07090d] border border-slate-800/80 rounded-xl">
              <span className="text-xs font-semibold text-slate-200 block mb-2 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-slate-500" /> Digest Frequency
              </span>
              <div className="flex gap-2">
                {(['daily', 'weekly', 'never'] as const).map((freq) => (
                  <button
                    key={freq}
                    onClick={() => handleChangeDigestFrequency(freq)}
                    className={`flex-1 py-1.5 px-2 rounded-lg text-[10px] font-mono transition-all cursor-pointer capitalize ${
                      settings.notifications.digestFrequency === freq
                        ? 'bg-slate-800 text-slate-200 border border-slate-700'
                        : 'bg-slate-900/40 text-slate-500 border border-slate-800/40 hover:text-slate-300'
                    }`}
                    style={{
                      borderColor: settings.notifications.digestFrequency === freq ? activeAccent : undefined
                    }}
                  >
                    {freq}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: Security */}
        <div className="bg-[#0c0f16] border border-slate-800/60 p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2 border-b border-slate-800/40 pb-3">
            <Shield className="w-4 h-4 text-red-500" /> Security & Authentication
          </h3>

          <div className="space-y-3">
            {/* Two-factor toggle */}
            <div className="p-3 bg-[#07090d] border border-slate-800/80 rounded-xl flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-slate-200 block flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-slate-500" /> Two-Factor Authentication
                </span>
                <span className="text-[10px] text-slate-500 block">Add an extra layer of security to your account</span>
              </div>
              <button
                onClick={handleToggleTwoFactor}
                className={`w-11 h-6 rounded-full p-1 transition-colors cursor-pointer ${
                  settings.security.twoFactorEnabled ? 'bg-blue-500' : 'bg-slate-800'
                }`}
                style={{
                  backgroundColor: settings.security.twoFactorEnabled ? activeAccent : undefined
                }}
              >
                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  settings.security.twoFactorEnabled ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>

            <div className="p-3 bg-slate-900/40 rounded-xl border border-slate-800/40">
              <span className="text-[10px] font-mono text-slate-500 block leading-relaxed">
                <Shield className="w-3 h-3 inline-block mr-1 text-emerald-500" />
                Your account is secured with JWT-based authentication. Sessions expire after 15 minutes of inactivity.
              </span>
            </div>
          </div>
        </div>

        {/* Card 5: Advanced UI Hardware Toggles */}
        <div className="bg-[#0c0f16] border border-slate-800/60 p-6 rounded-2xl space-y-4 md:col-span-2">
          <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2 border-b border-slate-800/40 pb-3">
            <Sliders className="w-4 h-4 text-purple-500" /> Advanced Physics & Graphics
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-[#07090d] border border-slate-800/80 rounded-xl flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-slate-200 block">Glassmorphism Backdrop</span>
                <span className="text-[10px] text-slate-500 block">Blur backdrop filter effects</span>
              </div>
              <button
                onClick={handleToggleGlassmorphism}
                className={`w-11 h-6 rounded-full p-1 transition-colors cursor-pointer ${
                  settings.glassmorphism ? 'bg-blue-500' : 'bg-slate-800'
                }`}
                style={{
                  backgroundColor: settings.glassmorphism ? activeAccent : undefined
                }}
              >
                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  settings.glassmorphism ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>

            <div className="p-4 bg-[#07090d] border border-slate-800/80 rounded-xl flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-slate-200 block">Focus Soundboard Effects</span>
                <span className="text-[10px] text-slate-500 block">Ticking and synthesizer audios</span>
              </div>
              <button
                onClick={handleToggleSoundEffects}
                className={`w-11 h-6 rounded-full p-1 transition-colors cursor-pointer ${
                  settings.soundEffects ? 'bg-blue-500' : 'bg-slate-800'
                }`}
                style={{
                  backgroundColor: settings.soundEffects ? activeAccent : undefined
                }}
              >
                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  settings.soundEffects ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>

            <div className="p-4 bg-[#07090d] border border-slate-800/80 rounded-xl flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-slate-200 block">Micro Transitions</span>
                <span className="text-[10px] text-slate-500 block">Smooth frame tab movements</span>
              </div>
              <button
                onClick={handleToggleSmartTransitions}
                className={`w-11 h-6 rounded-full p-1 transition-colors cursor-pointer ${
                  settings.smartTransitions ? 'bg-blue-500' : 'bg-slate-800'
                }`}
                style={{
                  backgroundColor: settings.smartTransitions ? activeAccent : undefined
                }}
              >
                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  settings.smartTransitions ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
