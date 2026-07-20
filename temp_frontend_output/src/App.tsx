import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { 
  INITIAL_USER, 
  INITIAL_SETTINGS, 
  INITIAL_PROJECTS, 
  INITIAL_TASKS, 
  INITIAL_CALENDAR_EVENTS 
} from './data';
import { Task, Project, CalendarEvent, AppSettings, UserProfile } from './types';

// Subcomponents
import LoginScreen from './components/LoginScreen';
import Sidebar from './components/Sidebar';
import DashboardScreen from './components/DashboardScreen';
import TasksScreen from './components/TasksScreen';
import ProjectsScreen from './components/ProjectsScreen';
import CalendarScreen from './components/CalendarScreen';
import TaskDetailsScreen from './components/TaskDetailsScreen';
import FocusScreen from './components/FocusScreen';
import SettingsScreen from './components/SettingsScreen';
import ProfileScreen from './components/ProfileScreen';

export default function App() {
  // Authentication session
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);

  // States
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [events, setEvents] = useState<CalendarEvent[]>(INITIAL_CALENDAR_EVENTS);
  const [settings, setSettings] = useState<AppSettings>(INITIAL_SETTINGS);

  // Active view layout router
  // 'dashboard' | 'tasks' | 'projects' | 'calendar' | 'focus' | 'settings' | 'profile' | 'task-detail'
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  
  // Selected detail states
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  // Login handler
  const handleLoginSuccess = (name: string, email: string) => {
    setUser(u => ({
      ...u,
      name,
      email,
      role: name.toLowerCase().includes('lead') || name.toLowerCase().includes('architect') 
        ? "Lead Systems Architect" 
        : "Senior Fullstack Engineer"
    }));
    setIsAuthenticated(true);
  };

  // Logout handler
  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveTab('dashboard');
    setSelectedTaskId(null);
    setSelectedProjectId(null);
  };

  // Contextual Project Selection intercept
  const handleSetActiveTabIntercept = (tab: string) => {
    if (tab.startsWith('project-detail:')) {
      const projId = tab.split(':')[1];
      setSelectedProjectId(projId);
      setActiveTab('projects');
    } else {
      setActiveTab(tab);
    }
  };

  // Intercepting task selection from lists
  const handleSelectTask = (taskId: string | null) => {
    setSelectedTaskId(taskId);
  };

  // Render the selected view content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardScreen 
            user={user} 
            setUser={setUser}
            tasks={tasks} 
            setTasks={setTasks}
            projects={projects} 
            events={events} 
            settings={settings}
            setActiveTab={handleSetActiveTabIntercept}
            setSelectedTaskId={handleSelectTask}
          />
        );
      case 'tasks':
        return (
          <TasksScreen 
            tasks={tasks} 
            setTasks={setTasks}
            projects={projects} 
            setSelectedTaskId={handleSelectTask}
            setActiveTab={handleSetActiveTabIntercept}
            accentColor={settings.accentColor}
          />
        );
      case 'projects':
        return (
          <ProjectsScreen 
            projects={projects} 
            setProjects={setProjects}
            tasks={tasks}
            setSelectedTaskId={handleSelectTask}
            setActiveTab={handleSetActiveTabIntercept}
            currentProjectId={selectedProjectId}
            setCurrentProjectId={setSelectedProjectId}
            accentColor={settings.accentColor}
          />
        );
      case 'calendar':
        return (
          <CalendarScreen 
            events={events} 
            setEvents={setEvents}
            settings={settings}
          />
        );
      case 'task-detail':
        const currentTask = tasks.find(t => t.id === selectedTaskId);
        return (
          <TaskDetailsScreen 
            task={currentTask} 
            setTasks={setTasks}
            setActiveTab={handleSetActiveTabIntercept}
            setSelectedTaskId={handleSelectTask}
            accentColor={settings.accentColor}
          />
        );
      case 'focus':
        return (
          <FocusScreen 
            settings={settings} 
            setActiveTab={handleSetActiveTabIntercept} 
            setUser={setUser}
          />
        );
      case 'settings':
        return (
          <SettingsScreen 
            settings={settings} 
            setSettings={setSettings} 
          />
        );
      case 'profile':
        return (
          <ProfileScreen 
            user={user} 
            settings={settings}
            onLogout={handleLogout}
            accentColor={settings.accentColor}
          />
        );
      default:
        return (
          <div className="p-8 text-center font-mono text-xs text-slate-500">
            ERR_OUT_OF_BOUNDS // UNKNOWN MODULE INITIALIZED
          </div>
        );
    }
  };

  // Layout class mappings for themes
  const themeClasses: Record<AppSettings['theme'], string> = {
    obsidian: 'bg-[#05070a] text-slate-100',
    slate: 'bg-[#0a0f1d] text-slate-200',
    light: 'bg-slate-50 text-slate-900 light-theme'
  };

  // Layout density paddings mappings
  const densityClasses: Record<AppSettings['density'], string> = {
    compact: 'p-2 space-y-4',
    standard: 'p-6 space-y-6',
    cozy: 'p-8 space-y-8'
  };

  if (!isAuthenticated) {
    return (
      <LoginScreen 
        onLoginSuccess={handleLoginSuccess} 
        settings={settings} 
      />
    );
  }

  // If focus terminal is selected, provide absolute immersive layout without sidebar or headers
  if (activeTab === 'focus') {
    return (
      <div className="min-h-screen bg-[#05060a]">
        <FocusScreen 
          settings={settings} 
          setActiveTab={handleSetActiveTabIntercept} 
          setUser={setUser}
        />
      </div>
    );
  }

  return (
    <div 
      id="app-root-shell"
      className={`min-h-screen flex ${themeClasses[settings.theme]} font-sans overflow-hidden`}
    >
      {/* Dynamic Cyber Orbs overlay */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-900/5 rounded-full blur-3xl opacity-30 pointer-events-none"></div>

      {/* Vertical Side Navigation */}
      <Sidebar 
        activeTab={
          selectedProjectId && activeTab === 'projects' 
            ? `project-detail:${selectedProjectId}` 
            : activeTab
        } 
        setActiveTab={handleSetActiveTabIntercept} 
        user={user} 
        projects={projects}
        settings={settings}
        onLogout={handleLogout}
      />

      {/* Main Panel Frame */}
      <main id="app-main-pane" className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab + (selectedProjectId && activeTab === 'projects' ? `-${selectedProjectId}` : '')}
            initial={settings.smartTransitions ? { opacity: 0, y: 10 } : false}
            animate={settings.smartTransitions ? { opacity: 1, y: 0 } : false}
            exit={settings.smartTransitions ? { opacity: 0, y: -10 } : false}
            transition={{ duration: 0.25 }}
            className="flex-1 flex flex-col h-full overflow-hidden"
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
