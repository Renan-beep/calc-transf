
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Building2, 
  Truck, 
  Calculator, 
  Menu,
  X,
  History,
  Settings as SettingsIcon,
  LogOut
} from 'lucide-react';
import { Branch, Carrier, HistoryEntry, SystemConfig } from './types';
import { db } from './database';
import HomeView from './views/Home';
import CalculatorView from './views/Calculator';
import BranchesView from './views/Branches';
import CarriersView from './views/Carriers';
import SettingsView from './views/Settings';
import LoginView from './views/Login';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'calculator' | 'branches' | 'carriers' | 'settings'>('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(db.isAuthenticated());
  
  const [branches, setBranches] = useState<Branch[]>(db.getBranches());
  const [carriers, setCarriers] = useState<Carrier[]>(db.getCarriers());
  const [history, setHistory] = useState<HistoryEntry[]>(db.getHistory());
  const [config, setConfig] = useState<SystemConfig>(db.getConfig());

  // Persistência automática ao alterar estados
  useEffect(() => { db.saveBranches(branches); }, [branches]);
  useEffect(() => { db.saveCarriers(carriers); }, [carriers]);
  useEffect(() => { db.saveConfig(config); }, [config]);

  const handleLogin = () => {
    db.setAuthenticated(true);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    if (confirm('Deseja realmente sair do sistema?')) {
      db.setAuthenticated(false);
      setIsAuthenticated(false);
    }
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const addHistoryEntry = (entry: HistoryEntry) => {
    db.addHistory(entry);
    setHistory(db.getHistory());
  };

  if (!isAuthenticated) {
    return <LoginView onLogin={handleLogin} config={config} />;
  }

  const NavItem: React.FC<{ 
    id: typeof activeTab; 
    icon: React.ElementType; 
    label: string 
  }> = ({ id, icon: Icon, label }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
        activeTab === id 
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
          : 'text-gray-400 hover:bg-gray-800 hover:text-white'
      }`}
    >
      <Icon size={20} />
      <span className={`${!isSidebarOpen && 'hidden'} font-medium`}>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen flex text-gray-900 overflow-hidden bg-slate-50">
      <aside 
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } bg-slate-900 transition-all duration-300 ease-in-out fixed h-full z-50 flex flex-col`}
      >
        <div className="p-4 flex items-center justify-between h-16 border-b border-slate-800">
          <div className={`flex items-center space-x-2 text-blue-400 overflow-hidden ${!isSidebarOpen && 'hidden'}`}>
            {config.logoUrl ? (
              <img src={config.logoUrl} alt="Logo" className="w-8 h-8 rounded object-contain bg-white p-0.5" />
            ) : (
              <Calculator size={32} />
            )}
            <span className="font-bold text-xl tracking-tight text-white truncate max-w-[120px]">{config.companyName}</span>
          </div>
          <button onClick={toggleSidebar} className="text-gray-400 hover:text-white ml-auto">
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} className="mx-auto" />}
          </button>
        </div>

        <nav className="flex-1 mt-6 px-3 space-y-1">
          <NavItem id="home" icon={LayoutDashboard} label="Dashboard Geral" />
          <NavItem id="calculator" icon={History} label="Calculadora" />
          <NavItem id="branches" icon={Building2} label="Filiais" />
          <NavItem id="carriers" icon={Truck} label="Transportadoras" />
        </nav>

        <div className="p-3 border-t border-slate-800 space-y-1">
          <NavItem id="settings" icon={SettingsIcon} label="Configurações" />
          <button
            onClick={handleLogout}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-red-400 hover:bg-red-500/10 hover:text-red-500`}
          >
            <LogOut size={20} />
            <span className={`${!isSidebarOpen && 'hidden'} font-medium`}>Sair</span>
          </button>
        </div>
      </aside>

      <main className={`${isSidebarOpen ? 'ml-64' : 'ml-20'} flex-1 flex flex-col transition-all duration-300`}>
        <header className="bg-white border-b border-gray-200 h-16 flex items-center px-8 sticky top-0 z-40 justify-between shadow-sm">
          <h1 className="text-xl font-semibold text-gray-800 capitalize">
            {activeTab === 'home' && 'Resumo de Operações'}
            {activeTab === 'calculator' && 'Simulador de Fretes'}
            {activeTab === 'branches' && 'Gestão de Filiais'}
            {activeTab === 'carriers' && 'Gestão de Transportadoras'}
            {activeTab === 'settings' && 'Configurações do Sistema'}
          </h1>
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end hidden sm:flex">
              <span className="text-sm font-bold text-gray-700">{config.companyName}</span>
              <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Ambiente Conectado</span>
            </div>
            <div 
              onClick={() => setActiveTab('settings')}
              className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center cursor-pointer hover:bg-blue-50 hover:text-blue-600 transition-all border border-transparent hover:border-blue-100 group"
            >
               <SettingsIcon size={20} className="group-hover:rotate-45 transition-transform" />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {activeTab === 'home' && (
            <HomeView 
              branchesCount={branches.length}
              carriersCount={carriers.length}
              history={history}
            />
          )}
          {activeTab === 'calculator' && (
            <CalculatorView 
              branches={branches} 
              carriers={carriers} 
              onSaveHistory={addHistoryEntry}
            />
          )}
          {activeTab === 'branches' && (
            <BranchesView 
              branches={branches} 
              onUpdate={setBranches} 
            />
          )}
          {activeTab === 'carriers' && (
            <CarriersView 
              carriers={carriers} 
              branches={branches} 
              onUpdate={setCarriers} 
            />
          )}
          {activeTab === 'settings' && (
            <SettingsView 
              config={config}
              onUpdate={setConfig}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
