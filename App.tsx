import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import MachineList from './components/MachineList';
import MaintenanceLogView from './components/MaintenanceLog';
import IndustrialIndicators from './components/IndustrialIndicators';
import RightPanel from './components/RightPanel';
import AIAssistant from './components/AIAssistant';
import Login from './components/Login'; 
import { INITIAL_MACHINES, INITIAL_LOGS, INITIAL_NOTIFICATIONS, INITIAL_REPORTS, INITIAL_OPERATIONAL_LOGS } from './constants';
import { MaintenanceLog, Machine, Notification, ReportEntry, OperationalLog } from './types';
import { Search, Bot } from 'lucide-react';

const App: React.FC = () => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState('guest'); 
  const [userName, setUserName] = useState(''); 

  // Theme State
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const [currentView, setCurrentView] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [logs, setLogs] = useState<MaintenanceLog[]>(INITIAL_LOGS);
  const [machines, setMachines] = useState<Machine[]>(INITIAL_MACHINES);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [reportHistory, setReportHistory] = useState<ReportEntry[]>(INITIAL_REPORTS);
  const [operationalLogs, setOperationalLogs] = useState<OperationalLog[]>(INITIAL_OPERATIONAL_LOGS);
  const [showAI, setShowAI] = useState(false);
  
  // Lifted state for machine navigation
  const [selectedMachineId, setSelectedMachineId] = useState<string | null>(null);

  // Apply Theme to HTML Body
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleLogin = (role: string, name: string) => {
    setUserRole(role);
    setUserName(name);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole('guest');
    setUserName('');
  };

  const handleAddLog = (newLog: MaintenanceLog) => {
    setLogs(prev => [newLog, ...prev]);
  };

  const handleUpdateLog = (updatedLog: MaintenanceLog) => {
    setLogs(prev => prev.map(log => log.id === updatedLog.id ? updatedLog : log));
  };

  const handleDeleteLog = (logId: string) => {
    setLogs(prev => prev.filter(log => log.id !== logId));
  };

  const handleAddReport = (report: ReportEntry) => {
    setReportHistory(prev => [report, ...prev]);
  };

  const handleAddOperationalLog = (log: OperationalLog) => {
    setOperationalLogs(prev => [log, ...prev]);
  };

  const handleMachineSelect = (id: string) => {
    setSelectedMachineId(id);
    setCurrentView('maquinas');
  };

  const handleViewChange = (view: string) => {
    setCurrentView(view);
    // Reset selection if navigating to the list view via menu
    if (view === 'maquinas') {
      setSelectedMachineId(null);
    }
  };

  // Notification Handlers
  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleClearNotifications = () => {
    setNotifications([]);
  };

  // Render Login Screen if not authenticated
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} theme={theme} toggleTheme={toggleTheme} />;
  }

  const renderContent = () => {
    switch (currentView) {
      case 'home':
        return (
            <Dashboard 
                machines={machines} 
                logs={logs} 
                notifications={notifications}
                onMachineSelect={handleMachineSelect} 
                onOpenAI={() => setShowAI(true)} 
                onNavigate={handleViewChange}
                onMarkAsRead={handleMarkAsRead}
                onClearNotifications={handleClearNotifications}
            />
        );
      case 'indicadores':
         return <IndustrialIndicators machines={machines} logs={logs} onUpdateLog={handleUpdateLog} />;
      case 'maquinas':
        return (
          <MachineList 
            machines={machines} 
            setMachines={setMachines} 
            selectedMachineId={selectedMachineId}
            setSelectedMachineId={setSelectedMachineId}
            onAddOperationalLog={handleAddOperationalLog}
            operationalLogs={operationalLogs}
            currentUser={userName}
            userRole={userRole}
          />
        );
      case 'prisma':
        return (
            <MaintenanceLogView 
                logs={logs} 
                machines={machines} 
                currentUser={userName}
                onAddLog={handleAddLog} 
                onUpdateLog={handleUpdateLog}
                onDeleteLog={handleDeleteLog}
                onAddReport={handleAddReport}
            />
        );
      default:
        return (
            <Dashboard 
                machines={machines} 
                logs={logs} 
                notifications={notifications}
                onMachineSelect={handleMachineSelect} 
                onOpenAI={() => setShowAI(true)} 
                onNavigate={handleViewChange}
                onMarkAsRead={handleMarkAsRead}
                onClearNotifications={handleClearNotifications}
            />
        );
    }
  };

  return (
    <div className="flex h-screen overflow-hidden font-sans bg-transparent selection:bg-theme-accent-solid selection:text-white transition-colors duration-300">
      <Navbar 
        currentView={currentView} 
        setCurrentView={handleViewChange}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        userName={userName}
        userRole={userRole}
        onLogout={handleLogout}
        theme={theme}
        toggleTheme={toggleTheme}
      />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        
        {/* Main Header (Hidden on Home to match custom design) */}
        {currentView !== 'home' && (
            <header className="px-8 py-6 flex items-center justify-between shrink-0">
                {/* Search Bar */}
                <div className="relative w-full max-w-xl hidden md:block">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search size={20} className="text-theme-text-muted" />
                    </div>
                    <input 
                        type="text" 
                        placeholder="Search" 
                        className="w-full pl-11 pr-4 py-3 bg-theme-input rounded-[20px] text-sm font-medium text-theme-text-main placeholder-theme-text-muted outline-none focus:ring-1 focus:ring-theme-accent-solid shadow-soft transition-all border border-theme-border"
                    />
                </div>
                
                {/* Mobile Title */}
                <div className="md:hidden font-bold text-theme-text-main text-lg">Dashboard</div>
            </header>
        )}

        {/* Scrollable Content Grid */}
        <div className={`flex-1 overflow-y-auto overflow-x-hidden px-4 md:px-8 pb-8 flex gap-8 scroll-container ${currentView === 'home' ? 'pt-8' : ''}`}>
            {/* Center Column - Expand on Home */}
            <div className={`flex-1 w-full mx-auto transition-all duration-300 ${currentView === 'home' ? 'max-w-full pr-4' : 'max-w-7xl'}`}>
                {renderContent()}
            </div>

            {/* Right Panel - Hidden on Home View and smaller screens */}
            {currentView !== 'home' && (
                <div className="hidden xl:block w-80 shrink-0 sticky top-0 h-fit pb-8">
                    <RightPanel />
                </div>
            )}
        </div>

        {/* AI Assistant Floating Button */}
        <button 
          onClick={() => setShowAI(!showAI)}
          className="fixed bottom-6 right-6 z-50 bg-gradient-accent text-white p-4 rounded-full shadow-glow hover:scale-110 transition-transform md:hidden"
        >
          <Bot size={24} />
        </button>

        {/* AI Modal for Mobile/Desktop if needed */}
        {showAI && (
           <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="w-full max-w-lg h-[600px] bg-theme-card rounded-3xl overflow-hidden relative shadow-2xl border border-theme-border">
                 <button onClick={() => setShowAI(false)} className="absolute top-4 right-4 z-10 p-2 bg-theme-input rounded-full hover:bg-theme-hover text-theme-text-muted">✕</button>
                 <AIAssistant />
              </div>
           </div>
        )}

      </div>
    </div>
  );
};

export default App;