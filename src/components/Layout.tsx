import React from 'react';
import { Home, Wallet, Receipt, Plane } from 'lucide-react';
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
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto pb-24 scroll-smooth">
          {children}
        </main>

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
