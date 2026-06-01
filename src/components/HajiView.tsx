import React from 'react';
import { HajiPackage } from '../types';
import { formatCurrency } from '../lib/utils';
import { Plane, Star, ArrowRight, Menu } from 'lucide-react';
import { motion } from 'motion/react';

interface HajiViewProps {
  key?: React.Key;
  program: HajiPackage | null;
}

export function HajiView({ program }: HajiViewProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="min-h-screen bg-gray-50 pb-8"
    >
      <div className="bg-white px-6 pt-12 pb-4 shadow-sm border-b border-gray-100 flex items-center justify-between sticky top-0 z-30 relative">
        <button className="p-2 -ml-2 rounded-full hover:bg-gray-50 transition-colors">
          <Menu className="w-6 h-6 text-gray-700" />
        </button>
        <div className="absolute left-1/2 -translate-x-1/2 text-center">
          <h1 className="text-lg font-heading font-bold text-gray-900">Talangan Haji</h1>
          <p className="text-[10px] font-medium text-gray-500 uppercase tracking-widest mt-0.5">Syariah</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center">
          <Plane className="w-5 h-5" />
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        
        {program ? (
          <div className="bg-white rounded-3xl p-1 shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-sky-600 text-white rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-4 translate-y-4">
                <Plane className="w-32 h-32" />
              </div>
              <div className="relative z-10">
                <span className="inline-block bg-white/20 text-white text-[10px] font-semibold px-2 py-1 rounded-full uppercase tracking-wider mb-3">
                  Program Aktif
                </span>
                <h2 className="text-xl font-heading font-bold mb-1">{program.title}</h2>
                <p className="text-sky-100 text-xs mb-6 max-w-[250px] leading-relaxed">{program.description}</p>
                
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/20">
                  <div className="flex justify-between items-end mb-2">
                    <div>
                      <p className="text-[10px] text-sky-100 uppercase tracking-wide mb-1">Terkumpul</p>
                      <p className="font-bold text-lg leading-none">{formatCurrency(program.currentFund)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-sky-100 uppercase tracking-wide mb-1">Target</p>
                      <p className="text-sm font-medium leading-none">{formatCurrency(program.targetFund)}</p>
                    </div>
                  </div>
                  <div className="w-full bg-black/20 rounded-full h-1.5 mt-3 overflow-hidden">
                    <div 
                      className="bg-white h-1.5 rounded-full transition-all duration-1000" 
                      style={{ width: `${(program.currentFund / program.targetFund) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 grid grid-cols-2 divide-x divide-gray-100">
               <button className="flex flex-col items-center justify-center p-2 text-primary-600 hover:bg-primary-50 rounded-xl transition-colors">
                 <span className="text-sm font-medium">Setor Dana</span>
               </button>
               <button className="flex flex-col items-center justify-center p-2 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
                 <span className="text-sm font-medium">Riwayat</span>
               </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-6 border border-gray-100 text-center">
             <div className="w-16 h-16 bg-sky-50 rounded-full flex items-center justify-center mx-auto mb-4">
               <Star className="w-8 h-8 text-sky-500" />
             </div>
             <h3 className="font-semibold text-gray-900 mb-2">Belum ada Program Haji</h3>
             <p className="text-sm text-gray-500 mb-6 px-4">Mulai rencanakan perjalanan ibadah haji Anda dengan kemudahan dana talangan.</p>
             <button className="w-full bg-sky-500 hover:bg-sky-600 text-white font-medium py-3 rounded-xl transition-colors shadow-sm text-sm">
               Daftar Program Haji
             </button>
          </div>
        )}

        {/* Info Banner */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-5 text-white flex items-center justify-between group cursor-pointer border border-gray-700">
          <div>
            <h4 className="font-semibold text-sm mb-1">Paket Umroh Spesial</h4>
            <p className="text-xs text-gray-400">Keberangkatan Bulan Depan</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
            <ArrowRight className="w-4 h-4 text-white" />
          </div>
        </div>

      </div>
    </motion.div>
  );
}
