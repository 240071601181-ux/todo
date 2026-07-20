import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  X, 
  Sliders, 
  Zap, 
  Maximize2,
  CheckCircle2,
  Radio
} from 'lucide-react';
import { AppSettings, UserProfile } from '../types';

interface FocusScreenProps {
  settings: AppSettings;
  setActiveTab: (tab: string) => void;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
}

export default function FocusScreen({ settings, setActiveTab, setUser }: FocusScreenProps) {
  // Timer State
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [totalStartSeconds, setTotalStartSeconds] = useState(25 * 60);

  // Sound States (simulated)
  const [rainVolume, setRainVolume] = useState(40);
  const [rainActive, setRainActive] = useState(false);
  const [droneVolume, setDroneVolume] = useState(60);
  const [droneActive, setDroneActive] = useState(true);
  const [noiseVolume, setNoiseVolume] = useState(20);
  const [noiseActive, setNoiseActive] = useState(false);

  const [focusCompleted, setFocusCompleted] = useState(false);

  // Ref to hold interval
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Interval hook
  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setSeconds((prevSeconds) => {
          if (prevSeconds === 0) {
            if (minutes === 0) {
              // Timer finished!
              setIsActive(false);
              setFocusCompleted(true);
              clearInterval(intervalRef.current!);
              
              // Award XP
              setUser(u => {
                const addedXp = 400; // Large XP award for deep focus
                let newXp = u.xp + addedXp;
                let newLevel = u.level;
                if (newXp >= u.nextLevelXp) {
                  newXp = newXp - u.nextLevelXp;
                  newLevel += 1;
                }
                return {
                  ...u,
                  xp: newXp,
                  level: newLevel,
                  productivityScore: u.productivityScore + 100 // large boost
                };
              });

              return 0;
            } else {
              setMinutes((m) => m - 1);
              return 59;
            }
          }
          return prevSeconds - 1;
        });
      }, 1000);
    } else if (!isActive && intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, minutes]);

  // Adjust default presets
  const handleSetPreset = (presetMins: number) => {
    setIsActive(false);
    setMinutes(presetMins);
    setSeconds(0);
    setTotalStartSeconds(presetMins * 60);
    setFocusCompleted(false);
  };

  const handleTogglePlay = () => {
    setIsActive(!isActive);
  };

  const handleResetTimer = () => {
    setIsActive(false);
    setMinutes(Math.floor(totalStartSeconds / 60));
    setSeconds(0);
    setFocusCompleted(false);
  };

  // Derive progress
  const currentTotalSeconds = minutes * 60 + seconds;
  const progressPercent = totalStartSeconds > 0 
    ? Math.round(((totalStartSeconds - currentTotalSeconds) / totalStartSeconds) * 100) 
    : 0;

  const formatTime = (m: number, s: number) => {
    const minStr = m < 10 ? `0${m}` : `${m}`;
    const secStr = s < 10 ? `0${s}` : `${s}`;
    return `${minStr}:${secStr}`;
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
    <div id="focus-container" className="min-h-screen w-full bg-[#05060a] text-slate-100 flex flex-col justify-between p-8 relative overflow-hidden font-sans">
      
      {/* Absolute floating orbs */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-slate-900/40 rounded-full blur-3xl opacity-20 pointer-events-none"></div>

      {/* Top action block */}
      <div className="flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full animate-ping bg-red-500"></span>
          <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase">
            Deep Focus Terminal Active
          </span>
        </div>

        <button 
          onClick={() => setActiveTab('dashboard')}
          className="p-2 bg-slate-900/60 hover:bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition-all cursor-pointer flex items-center gap-1 text-xs font-mono"
        >
          <X className="w-4 h-4" /> ESC // EXIT FOCUS
        </button>
      </div>

      {/* Centered Timer Segment */}
      <div className="flex flex-col items-center justify-center z-10 max-w-lg mx-auto py-12 space-y-8">
        
        {/* Presets Row */}
        <div className="flex bg-slate-950/80 border border-slate-900/60 p-1.5 rounded-2xl gap-1">
          {[
            { mins: 15, label: '15M SHORT' },
            { mins: 25, label: '25M DEFAULT' },
            { mins: 50, label: '50M EXTREME' },
          ].map((preset) => (
            <button
              key={preset.mins}
              onClick={() => handleSetPreset(preset.mins)}
              className={`px-4 py-2 text-[10px] font-mono tracking-wider rounded-xl transition-all cursor-pointer ${
                totalStartSeconds === preset.mins * 60
                  ? 'bg-slate-900 text-white font-bold border border-slate-800/80'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Large Countdown circle */}
        <div className="relative h-64 w-64 flex items-center justify-center bg-slate-950/30 rounded-full border border-slate-900/40 shadow-inner group">
          {/* Progress SVG Ring */}
          <svg className="absolute inset-0 w-full h-full transform -rotate-90">
            <circle
              cx="128"
              cy="128"
              r="114"
              className="stroke-slate-900/40"
              strokeWidth="5"
              fill="transparent"
            />
            <circle
              cx="128"
              cy="128"
              r="114"
              className="transition-all duration-300"
              style={{ stroke: activeAccent }}
              strokeWidth="5"
              fill="transparent"
              strokeDasharray={716.2}
              strokeDashoffset={716.2 - (716.2 * progressPercent) / 100}
              strokeLinecap="round"
            />
          </svg>

          {/* Core readout */}
          <div className="text-center space-y-1 z-10 select-none">
            {focusCompleted ? (
              <motion.div 
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="flex flex-col items-center gap-1.5"
              >
                <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest font-bold">INTERVAL RESOLVED</span>
                <span className="text-[10px] text-slate-500 font-mono">+400 XP RECONCILED</span>
              </motion.div>
            ) : (
              <>
                <h2 className="text-5xl font-black font-display tracking-tighter text-white">
                  {formatTime(minutes, seconds)}
                </h2>
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">
                  {isActive ? 'COMPILING FOCUS' : 'TIMER SUSPENDED'}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Action controllers buttons */}
        <div className="flex items-center gap-4">
          {/* Reset */}
          <button
            onClick={handleResetTimer}
            className="p-3.5 bg-slate-950/80 border border-slate-900 text-slate-400 hover:text-white rounded-2xl hover:bg-slate-900 transition-all cursor-pointer shadow-md"
            title="Reset timer interval"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Primary Play / Pause */}
          <button
            onClick={handleTogglePlay}
            disabled={focusCompleted}
            className="p-5 text-white rounded-full cursor-pointer transition-all shadow-xl hover:scale-105 active:scale-95 disabled:opacity-30"
            style={{ 
              backgroundColor: activeAccent,
              boxShadow: `0 4px 20px ${activeAccent}25`
            }}
          >
            {isActive ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
          </button>

          {/* Maximize mock or visual toggle */}
          <button
            onClick={() => alert("Simulated ambient fullscreen mode initialized.")}
            className="p-3.5 bg-slate-950/80 border border-slate-900 text-slate-400 hover:text-white rounded-2xl hover:bg-slate-900 transition-all cursor-pointer shadow-md"
            title="Toggle Fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Immersive Soundboard panel */}
      <div className="max-w-xl mx-auto w-full bg-[#0c0f16]/60 border border-slate-900/80 rounded-2xl p-5 z-10">
        <h4 className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
          <Radio className="w-4 h-4 text-slate-500" /> Synthesizer Soundboard
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Rain Sound */}
          <div className="space-y-2 bg-[#05060a]/80 p-3 rounded-xl border border-slate-900/60">
            <div className="flex justify-between items-center">
              <span className={`text-[10px] font-mono uppercase tracking-wider ${
                rainActive ? 'text-blue-400 font-bold' : 'text-slate-500'
              }`}>Rainfall Loop</span>
              <button
                onClick={() => setRainActive(!rainActive)}
                className={`text-[9px] font-mono px-2 py-0.5 rounded cursor-pointer transition-colors ${
                  rainActive ? 'bg-blue-500/10 text-blue-400' : 'bg-slate-950 text-slate-600'
                }`}
              >
                {rainActive ? 'ON' : 'OFF'}
              </button>
            </div>
            <input 
              type="range" 
              min="0" 
              max="100" 
              disabled={!rainActive}
              value={rainVolume}
              onChange={(e) => setRainVolume(Number(e.target.value))}
              className="w-full accent-blue-500 h-1.5 bg-slate-800 rounded appearance-none cursor-pointer disabled:opacity-20"
            />
          </div>

          {/* Space Drone Sound */}
          <div className="space-y-2 bg-[#05060a]/80 p-3 rounded-xl border border-slate-900/60">
            <div className="flex justify-between items-center">
              <span className={`text-[10px] font-mono uppercase tracking-wider ${
                droneActive ? 'text-purple-400 font-bold' : 'text-slate-500'
              }`}>Space Drone</span>
              <button
                onClick={() => setDroneActive(!droneActive)}
                className={`text-[9px] font-mono px-2 py-0.5 rounded cursor-pointer transition-colors ${
                  droneActive ? 'bg-purple-500/10 text-purple-400' : 'bg-slate-950 text-slate-600'
                }`}
              >
                {droneActive ? 'ON' : 'OFF'}
              </button>
            </div>
            <input 
              type="range" 
              min="0" 
              max="100" 
              disabled={!droneActive}
              value={droneVolume}
              onChange={(e) => setDroneVolume(Number(e.target.value))}
              className="w-full accent-purple-500 h-1.5 bg-slate-800 rounded appearance-none cursor-pointer disabled:opacity-20"
            />
          </div>

          {/* White Noise Sound */}
          <div className="space-y-2 bg-[#05060a]/80 p-3 rounded-xl border border-slate-900/60">
            <div className="flex justify-between items-center">
              <span className={`text-[10px] font-mono uppercase tracking-wider ${
                noiseActive ? 'text-amber-400 font-bold' : 'text-slate-500'
              }`}>White Noise</span>
              <button
                onClick={() => setNoiseActive(!noiseActive)}
                className={`text-[9px] font-mono px-2 py-0.5 rounded cursor-pointer transition-colors ${
                  noiseActive ? 'bg-amber-500/10 text-amber-400' : 'bg-slate-950 text-slate-600'
                }`}
              >
                {noiseActive ? 'ON' : 'OFF'}
              </button>
            </div>
            <input 
              type="range" 
              min="0" 
              max="100" 
              disabled={!noiseActive}
              value={noiseVolume}
              onChange={(e) => setNoiseVolume(Number(e.target.value))}
              className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded appearance-none cursor-pointer disabled:opacity-20"
            />
          </div>
        </div>
      </div>

    </div>
  );
}
