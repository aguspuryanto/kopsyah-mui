/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ViewState, User, Transaction } from './types';
import { recentTransactions, activePembiayaan, userHajiProgram } from './data';
import { Layout } from './components/Layout';
import { HomeView } from './components/HomeView';
import { SimpananView } from './components/SimpananView';
import { PembiayaanView } from './components/PembiayaanView';
import { HajiView } from './components/HajiView';
import { AuthView } from './components/AuthView';
import { AnimatePresence } from 'motion/react';

export default function App() {
  const [activeView, setActiveView] = useState<ViewState>('home');
  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Load session and transactions from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('spps_active_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('spps_active_user');
      }
    }

    const savedTrx = localStorage.getItem('spps_transactions');
    if (savedTrx) {
      try {
        setTransactions(JSON.parse(savedTrx));
      } catch (e) {
        setTransactions(recentTransactions);
      }
    } else {
      setTransactions(recentTransactions);
    }
  }, []);

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    localStorage.setItem('spps_active_user', JSON.stringify(loggedInUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('spps_active_user');
    setActiveView('home');
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('spps_active_user', JSON.stringify(updatedUser));
    
    // Also save within overall users database in localStorage so it keeps across logins
    const savedUsers = localStorage.getItem('spps_users');
    if (savedUsers) {
      try {
        const usersList = JSON.parse(savedUsers);
        const index = usersList.findIndex((u: any) => u.id === updatedUser.id);
        if (index !== -1) {
          usersList[index] = {
            ...usersList[index],
            totalSimpanan: updatedUser.totalSimpanan,
            simpananPokok: updatedUser.simpananPokok,
            simpananWajib: updatedUser.simpananWajib,
            simpananSukarela: updatedUser.simpananSukarela,
          };
          localStorage.setItem('spps_users', JSON.stringify(usersList));
        }
      } catch (e) {
        console.error("Error updating users list", e);
      }
    }
  };

  const handleSetor = (type: 'pokok' | 'wajib' | 'sukarela', amount: number) => {
    if (!user) return;

    let updatedPokok = user.simpananPokok || 0;
    let updatedWajib = user.simpananWajib || 0;
    let updatedSukarela = user.simpananSukarela || 0;
    let label = '';

    if (type === 'pokok') {
      updatedPokok += amount;
      label = 'Setoran Simpanan Pokok';
    } else if (type === 'wajib') {
      updatedWajib += amount;
      label = 'Setoran Simpanan Wajib';
    } else {
      updatedSukarela += amount;
      label = 'Setoran Simpanan Sukarela';
    }

    const updatedTotal = updatedPokok + updatedWajib + updatedSukarela;

    const updatedUser: User = {
      ...user,
      simpananPokok: updatedPokok,
      simpananWajib: updatedWajib,
      simpananSukarela: updatedSukarela,
      totalSimpanan: updatedTotal
    };

    handleUpdateUser(updatedUser);

    const newTransaction: Transaction = {
      id: `TRX-${Date.now()}`,
      date: new Date().toISOString(),
      title: label,
      type: 'in',
      amount: amount,
      category: 'Simpanan'
    };

    const updatedTrx = [newTransaction, ...transactions];
    setTransactions(updatedTrx);
    localStorage.setItem('spps_transactions', JSON.stringify(updatedTrx));
  };

  const handleTarik = (type: 'pokok' | 'wajib' | 'sukarela', amount: number) => {
    if (!user) return;

    let updatedPokok = user.simpananPokok || 0;
    let updatedWajib = user.simpananWajib || 0;
    let updatedSukarela = user.simpananSukarela || 0;
    let label = '';

    if (type === 'pokok') {
      if (updatedPokok < amount) { alert('Saldo Simpanan Pokok tidak mencukupi.'); return; }
      updatedPokok -= amount;
      label = 'Penarikan Simpanan Pokok';
    } else if (type === 'wajib') {
      if (updatedWajib < amount) { alert('Saldo Simpanan Wajib tidak mencukupi.'); return; }
      updatedWajib -= amount;
      label = 'Penarikan Simpanan Wajib';
    } else {
      if (updatedSukarela < amount) { alert('Saldo Simpanan Sukarela tidak mencukupi.'); return; }
      updatedSukarela -= amount;
      label = 'Penarikan Simpanan Sukarela';
    }

    const updatedTotal = updatedPokok + updatedWajib + updatedSukarela;

    const updatedUser: User = {
      ...user,
      simpananPokok: updatedPokok,
      simpananWajib: updatedWajib,
      simpananSukarela: updatedSukarela,
      totalSimpanan: updatedTotal
    };

    handleUpdateUser(updatedUser);

    const newTransaction: Transaction = {
      id: `TRX-${Date.now()}`,
      date: new Date().toISOString(),
      title: label,
      type: 'out',
      amount: amount,
      category: 'Simpanan'
    };

    const updatedTrx = [newTransaction, ...transactions];
    setTransactions(updatedTrx);
    localStorage.setItem('spps_transactions', JSON.stringify(updatedTrx));
  };

  if (!user) {
    return (
      <div className="flex justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md bg-gray-50 min-h-screen relative shadow-2xl overflow-hidden flex flex-col">
          <AuthView onSuccess={handleLoginSuccess} />
        </div>
      </div>
    );
  }

  const renderView = () => {
    switch (activeView) {
      case 'home':
        return (
          <HomeView
            key="home"
            user={user}
            transactions={transactions}
            pembiayaan={activePembiayaan}
            onLogout={handleLogout}
          />
        );
      case 'simpanan':
        return (
          <SimpananView 
            key="simpanan" 
            user={user} 
            transactions={transactions} 
            onSetor={handleSetor} 
            onTarik={handleTarik}
          />
        );
      case 'pembiayaan':
        return <PembiayaanView key="pembiayaan" pembiayaan={activePembiayaan} />;
      case 'haji':
        return <HajiView key="haji" program={userHajiProgram} />;
      default:
        return (
          <HomeView
            key="home"
            user={user}
            transactions={transactions}
            pembiayaan={activePembiayaan}
            onLogout={handleLogout}
          />
        );
    }
  };

  return (
    <Layout activeView={activeView} onNavigate={setActiveView}>
      <AnimatePresence mode="wait">
        {renderView()}
      </AnimatePresence>
    </Layout>
  );
}

