import React from 'react';
import { Home, Wallet, Receipt, Plane, Wifi, Battery, Signal, MessageCircle } from 'lucide-react';
import { ViewState } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeView: ViewState;
  onNavigate: (view: ViewState) => void;
}

export function Layout({ children, activeView, onNavigate }: LayoutProps) {
  const navItems: { id: ViewState; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Beranda', icon: <Home className="w-6 h-6" /> },
    { id: 'simpanan', label: 'Simpanan', icon: <Wallet className="w-6 h-6" /> },
    { id: 'pembiayaan', label: 'Pembiayaan', icon: <Receipt className="w-6 h-6" /> },
    { id: 'haji', label: 'Haji & Umroh', icon: <Plane className="w-6 h-6" /> },
  ];

  return (
    <div className="flex justify-center min-h-screen bg-gray-100">
      {/* Mobile container constraint to simulate mobile app on desktop */}
      <div className="w-full max-w-md bg-gray-50 min-h-screen relative shadow-2xl overflow-hidden flex flex-col">
        
        {/* Mock OS Status Bar */}
        <div className="absolute top-0 inset-x-0 h-10 px-5 flex items-center justify-between text-[11px] font-semibold z-50 pointer-events-none text-gray-900 mix-blend-difference opacity-80" style={{ color: 'white' }}>
          <span>09:41</span>
          <div className="flex gap-1.5 items-center">
            <Signal className="w-3.5 h-3.5 fill-current" />
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4 fill-current" />
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto pb-24 scroll-smooth pb-[100px]">
          {children}
        </main>

        {/* WhatsApp AI Assistant FAB */}
        {activeView !== 'assistant' && (
          <div className="absolute bottom-24 right-4 z-40">
            <button 
              onClick={() => onNavigate('assistant')}
              className="bg-[#25D366] hover:bg-[#128C7E] text-white p-3.5 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center relative group"
            >
              <MessageCircle className="w-6 h-6" />
              {/* Online Indicator Dot */}
              <span className="absolute top-1 right-1 w-3 h-3 bg-white border-2 border-[#25D366] rounded-full"></span>
              
              {/* Tooltip */}
              <span className="absolute right-full mr-3 bg-white text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-xl shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-gray-100">
                Tanya CS AI
              </span>
            </button>
          </div>
        )}

        {/* Bottom Navigation */}
        <nav className="absolute bottom-0 w-full bg-white border-t border-gray-200 px-2 py-3 rounded-t-2xl shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-50">
          <ul className="flex justify-between items-center">
            {navItems.map((item) => {
              const isActive = activeView === item.id;
              return (
                <li key={item.id} className="flex-1">
                  <button
                    onClick={() => onNavigate(item.id)}
                    className={`w-full flex flex-col items-center justify-center gap-1 transition-colors duration-200 ${
                      isActive ? 'text-primary-700' : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <div className={`p-1.5 rounded-xl transition-all duration-300 ${isActive ? 'bg-primary-50' : 'bg-transparent'}`}>
                      {item.icon}
                    </div>
                    <span className={`text-[10px] font-medium ${isActive ? 'font-semibold' : ''}`}>
                      {item.label}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
}
