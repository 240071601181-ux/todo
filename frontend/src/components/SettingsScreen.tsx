import React from 'react';
import { motion } from 'motion/react';
import { 
  Sliders, 
  Palette, 
  Sparkles, 
  Layers, 
  Volume2, 
  Zap, 
  Layout, 
  Activity,
  CheckCircle2
} from 'lucide-react';
import { AppSettings } from '../types';

interface SettingsScreenProps {
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
}

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

          {/* Theme Presets */}
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
                  onClick={() => handleChangeTheme(themeItem.id as any)}
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

          {/* Accent Color Pickers */}
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
                  onClick={() => handleChangeAccent(accentItem.id as any)}
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

        {/* Card 2: Layout & Spacers */}
        <div className="bg-[#0c0f16] border border-slate-800/60 p-6 rounded-2xl space-y-5">
          <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2 border-b border-slate-800/40 pb-3">
            <Layout className="w-4 h-4 text-emerald-500" /> Layout Density Settings
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
                  onClick={() => handleChangeDensity(denseItem.id as any)}
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

          <div className="p-3 bg-slate-900/40 rounded-xl border border-slate-800/40 flex items-center gap-2.5 text-xs text-slate-400 leading-normal">
            <Activity className="w-4 h-4 text-slate-500 shrink-0" />
            <span>Density adjustments calibrate margins, paddings, and sidebar structures to prioritize higher content volume on large monitors.</span>
          </div>
        </div>

        {/* Card 3: Advanced UI Hardware Toggles */}
        <div className="bg-[#0c0f16] border border-slate-800/60 p-6 rounded-2xl space-y-4 md:col-span-2">
          <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2 border-b border-slate-800/40 pb-3">
            <Sliders className="w-4 h-4 text-purple-500" /> Advanced Physics & Graphics
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Toggle Glassmorphism */}
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

            {/* Toggle Sound Effects */}
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

            {/* Toggle Smart Transitions */}
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
