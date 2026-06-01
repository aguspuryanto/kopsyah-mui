import React from 'react';
import { User, Transaction, PembiayaanItem } from '../types';
import { formatCurrency, formatDate } from '../lib/utils';
import { ArrowDownLeft, ArrowUpRight, Bell, User as UserIcon, ShieldCheck, Receipt, LogOut, Smartphone, QrCode, Heart, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';

interface HomeViewProps {
  key?: React.Key;
  user: User;
  transactions: Transaction[];
  pembiayaan: PembiayaanItem[];
  onLogout: () => void;
}

export function HomeView({ user, transactions, pembiayaan, onLogout }: HomeViewProps) {
  const activePembiayaan = pembiayaan.find(p => p.status === 'active');

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex flex-col min-h-screen bg-gray-50"
    >
      {/* Header Profile Section */}
      <div className="bg-primary-700 text-white rounded-b-[2.5rem] pt-12 pb-20 px-6 relative overflow-hidden shadow-lg">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-primary-600 opacity-50 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 rounded-full bg-primary-800 opacity-50 blur-2xl"></div>

        <div className="relative z-10 flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <button className="p-2 -ml-2 text-white hover:bg-white/10 rounded-full transition-colors backdrop-blur-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" x2="21" y1="6" y2="6"/><line x1="3" x2="21" y1="12" y2="12"/><line x1="3" x2="21" y1="18" y2="18"/></svg>
            </button>
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm border border-white/30 hidden sm:flex">
              <UserIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-primary-100 font-medium tracking-wide">Ahlan Wa Sahlan,</p>
              <h1 className="text-lg font-heading font-semibold tracking-tight leading-tight">{user.name}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors backdrop-blur-sm relative">
              <Bell className="w-5 h-5 text-white" />
              <span className="absolute top-1.5 right-2 w-2 h-2 rounded-full bg-red-400 border border-primary-700"></span>
            </button>
            <button 
              onClick={onLogout}
              className="p-2 bg-red-600/25 border border-red-500/20 rounded-full hover:bg-red-600/40 transition-all backdrop-blur-sm relative"
              title="Keluar"
            >
              <LogOut className="w-5 h-5 text-red-100" />
            </button>
          </div>
        </div>

        <div className="relative z-10 text-center space-y-1">
          <p className="text-sm font-medium text-primary-100/90 tracking-wide uppercase">Total Saldo Simpanan</p>
          <h2 className="text-4xl font-bold font-heading tabular-nums tracking-tight">
            {formatCurrency(user.totalSimpanan)}
          </h2>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="px-6 -mt-10 relative z-20 space-y-6 pb-6">
        
        {/* Action Widgets - 8 Grid Menu */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 grid grid-cols-4 gap-y-6 gap-x-2">
          {/* Menu Items */}
          {[
            { icon: <ArrowDownLeft className="w-6 h-6 text-emerald-600" />, label: 'Setor', bg: 'bg-emerald-50' },
            { icon: <ArrowUpRight className="w-6 h-6 text-orange-600" />, label: 'Tarik', bg: 'bg-orange-50' },
            { icon: <QrCode className="w-6 h-6 text-blue-600" />, label: 'QRIS', bg: 'bg-blue-50' },
            { icon: <Smartphone className="w-6 h-6 text-purple-600" />, label: 'PPOB', bg: 'bg-purple-50' },
            { icon: <Receipt className="w-6 h-6 text-rose-600" />, label: 'Tagihan', bg: 'bg-rose-50' },
            { icon: <Heart className="w-6 h-6 text-red-500" />, label: 'Ziswaf', bg: 'bg-red-50' },
            { icon: <TrendingUp className="w-6 h-6 text-amber-600" />, label: 'Info SHU', bg: 'bg-amber-50' },
            { icon: <ShieldCheck className="w-6 h-6 text-sky-600" />, label: 'Keamanan', bg: 'bg-sky-50' },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center justify-center gap-2 cursor-pointer group" onClick={() => alert(`Fitur ${item.label} akan segera hadir!`)}>
              <div className={`w-12 h-12 rounded-2xl ${item.bg} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                {item.icon}
              </div>
              <span className="text-[10px] font-semibold text-gray-700 text-center leading-tight">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Active Financing Reminder */}
        {activePembiayaan && (
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Tagihan Pembiayaan</h3>
                <p className="font-semibold text-gray-900 leading-tight">{activePembiayaan.title}</p>
              </div>
              <div className="bg-orange-50 p-2 rounded-lg">
                <Receipt className="w-5 h-5 text-orange-500" />
              </div>
            </div>
            <div className="flex items-end justify-between mt-4">
              <div>
                <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">Jatuh Tempo</p>
                <p className="text-sm font-medium text-gray-900">{formatDate(activePembiayaan.nextDueDate)}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900 tabular-nums">{formatCurrency(activePembiayaan.monthlyInstallment)}</p>
              </div>
            </div>
            <button className="w-full mt-4 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2.5 rounded-xl transition-colors text-sm shadow-sm">
              Bayar Sekarang
            </button>
          </div>
        )}

        {/* SHU Estimate Banner */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-100/50 flex flex-col gap-3 relative overflow-hidden">
          <div className="absolute right-0 top-0 -mt-2 -mr-2 text-amber-500/10">
            <TrendingUp className="w-24 h-24" />
          </div>
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex gap-3 items-center">
              <div className="p-2 bg-white rounded-full text-amber-600 shadow-sm">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900">Estimasi Sisa Hasil Usaha</h4>
                <p className="text-[10px] text-gray-600 font-medium">Periode 2026 (Proyeksi)</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-gray-900 tabular-nums">Rp 1.450.000</div>
              <p className="text-[10px] text-emerald-600 font-semibold">+12.5% vs thn lalu</p>
            </div>
          </div>
        </div>

        {/* Trust Banner */}
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-4 border border-emerald-100/50 flex items-center gap-4">
           <div className="p-2 bg-white rounded-full text-emerald-600 shadow-sm">
             <ShieldCheck className="w-6 h-6" />
           </div>
           <div>
             <h4 className="text-sm font-semibold text-gray-900">Diawasi Dewan Syariah</h4>
             <p className="text-xs text-gray-600 mt-0.5">Sesuai prinsip syariah dan terpercaya</p>
           </div>
        </div>

        {/* Recent Transactions */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold font-heading text-gray-900">Mutasi Terakhir</h3>
            <button className="text-sm font-medium text-primary-600 hover:text-primary-700">Lihat Semua</button>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="divide-y divide-gray-50">
              {transactions.slice(0, 3).map((trx) => (
                <div key={trx.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      trx.type === 'in' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'
                    }`}>
                      {trx.type === 'in' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 line-clamp-1">{trx.title}</p>
                      <p className="text-xs text-gray-500">{formatDate(trx.date)}</p>
                    </div>
                  </div>
                  <div className={`text-sm font-semibold tabular-nums whitespace-nowrap ${
                    trx.type === 'in' ? 'text-green-600' : 'text-gray-900'
                  }`}>
                    {trx.type === 'in' ? '+' : '-'}{formatCurrency(trx.amount)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
      </div>
    </motion.div>
  );
}
