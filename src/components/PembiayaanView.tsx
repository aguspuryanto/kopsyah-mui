import React, { useState } from 'react';
import { PembiayaanItem } from '../types';
import { formatCurrency, formatDate } from '../lib/utils';
import { Receipt, CheckCircle, Clock, Calculator, Info, Landmark, Menu } from 'lucide-react';
import { motion } from 'motion/react';

interface PembiayaanViewProps {
  key?: React.Key;
  pembiayaan: PembiayaanItem[];
}

export function PembiayaanView({ pembiayaan }: PembiayaanViewProps) {
  // Calculator States
  const [akad, setAkad] = useState<'murabahah' | 'ijarah' | 'multijasa'>('murabahah');
  const [amount, setAmount] = useState<number>(10000000);
  const [tenor, setTenor] = useState<number>(12);

  // Constants
  const minAmount = 1000000;
  const maxAmount = 100000000;
  const stepAmount = 1000000;
  
  // Annual Margin equivalent
  const getMarginRate = () => {
    switch (akad) {
      case 'murabahah': return 0.09; // 9% per year flat margin
      case 'ijarah': return 0.10;    // 10% per year flat ijarah fee
      case 'multijasa': return 0.12; // 12% per year multijasa margin
    }
  };

  const marginRate = getMarginRate();
  const totalMargin = amount * marginRate * (tenor / 12);
  const totalFinancing = amount + totalMargin;
  const monthlyInstallment = Math.round(totalFinancing / tenor);

  const getAkadDescription = () => {
    switch (akad) {
      case 'murabahah':
        return 'Akad jual beli barang dengan menegaskan harga perolehan kepada pembeli dan pembeli membayarnya dengan harga lebih sebagai laba.';
      case 'ijarah':
        return 'Akad penyediaan dana dalam rangka memindahkan hak guna atau manfaat dari suatu barang atau jasa berdasarkan transaksi sewa.';
      case 'multijasa':
        return 'Pembiayaan untuk memperoleh manfaat atas suatu jasa dengan menggunakan akad kafalah atau ijarah.';
    }
  };

  const getAkadMarginLabel = () => {
    switch (akad) {
      case 'murabahah': return 'Margin Keuntungan';
      case 'ijarah': return 'Ujrah (Jasa Sewa)';
      case 'multijasa': return 'Imbalan Jasa';
    }
  };

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
          <h1 className="text-lg font-heading font-bold text-gray-900">Pembiayaan</h1>
          <p className="text-[10px] font-medium text-gray-500 uppercase tracking-widest mt-0.5">Syariah</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center">
          <Receipt className="w-5 h-5" />
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        
        {/* Active Financing Section */}
        <div>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Akun Pembiayaan Aktif</h3>
          {pembiayaan.length > 0 ? (
            pembiayaan.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-4Last">
                <div className="flex justify-between items-start mb-4">
                  <div className="pr-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide uppercase mb-2 ${
                      item.status === 'active' ? 'bg-orange-50 text-orange-700' : 'bg-green-50 text-green-700'
                    }`}>
                      {item.status === 'active' ? (
                        <><Clock className="w-3 h-3" /> Aktif</>
                      ) : (
                        <><CheckCircle className="w-3 h-3" /> Lunas</>
                      )}
                    </span>
                    <h3 className="font-semibold text-gray-900 leading-snug">{item.title}</h3>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-xs text-gray-500">Sisa Pembiayaan</span>
                    <span className="text-sm font-bold text-gray-900">{formatCurrency(item.remainingAmount)}</span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-1 overflow-hidden">
                    <div 
                      className="bg-primary-500 h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${item.progress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-400 font-medium pt-1">
                    <span>{item.progress}% Terbayar</span>
                    <span>Total {formatCurrency(item.totalAmount)}</span>
                  </div>
                </div>

                {item.status === 'active' && (
                  <div className="border-t border-dashed border-gray-200 pt-4 mt-2">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-0.5">Angsuran Bulan Ini</p>
                        <p className="font-bold text-gray-900">{formatCurrency(item.monthlyInstallment)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500 mb-0.5">Jatuh Tempo</p>
                        <p className="font-semibold text-orange-600">{formatDate(item.nextDueDate)}</p>
                      </div>
                    </div>
                    <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2.5 rounded-xl transition-colors text-sm shadow-sm flex items-center justify-center gap-2">
                      Bayar Angsuran
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="bg-white rounded-2xl p-8 border border-gray-100 flex flex-col items-center justify-center text-center">
               <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                 <Receipt className="w-8 h-8 text-gray-300" />
               </div>
               <h3 className="font-medium text-gray-900 mb-1">Tidak ada pembiayaan aktif</h3>
               <p className="text-sm text-gray-500 mb-4 text-center max-w-[200px]">Ajukan pembiayaan syariah untuk berbagai kebutuhan Anda.</p>
               <button className="bg-primary-50 text-primary-700 font-medium py-2 px-4 rounded-xl text-sm transition-colors hover:bg-primary-100">
                 Ajukan Sekarang
               </button>
            </div>
          )}
        </div>

        {/* Sharia Financing Simulator */}
        <div id="simulasi-kalkulator" className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-5">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <div className="p-1.5 bg-primary-50 text-primary-700 rounded-lg">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-gray-900">Kalkulator Simulasi</h3>
              <p className="text-[11px] text-gray-400">Estimasi pembiayaan & angsuran syariah</p>
            </div>
          </div>

          {/* Akad Picker */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">Jenis Akad Syariah</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setAkad('murabahah')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                  akad === 'murabahah'
                    ? 'bg-primary-50 border-primary-500 text-primary-700 shadow-sm'
                    : 'bg-gray-50/50 border-gray-200 text-gray-600 hover:bg-gray-100'
                }`}
              >
                Murabahah
              </button>
              <button
                type="button"
                onClick={() => setAkad('ijarah')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                  akad === 'ijarah'
                    ? 'bg-primary-50 border-primary-500 text-primary-700 shadow-sm'
                    : 'bg-gray-50/50 border-gray-200 text-gray-600 hover:bg-gray-100'
                }`}
              >
                Ijarah
              </button>
              <button
                type="button"
                onClick={() => setAkad('multijasa')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                  akad === 'multijasa'
                    ? 'bg-primary-50 border-primary-500 text-primary-700 shadow-sm'
                    : 'bg-gray-50/50 border-gray-200 text-gray-600 hover:bg-gray-100'
                }`}
              >
                Multijasa
              </button>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 mt-2 flex gap-2 items-start border border-gray-100">
              <Info className="w-4 h-4 text-primary-600 shrink-0 mt-0.5" />
              <p className="text-[10px] text-gray-500 leading-relaxed">{getAkadDescription()}</p>
            </div>
          </div>

          {/* Amount Input & Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Jumlah Pembiayaan</label>
              <span className="text-sm font-bold text-primary-700 font-heading">{formatCurrency(amount)}</span>
            </div>
            <input
              type="range"
              min={minAmount}
              max={maxAmount}
              step={stepAmount}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full accent-primary-600 h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-400 font-medium">
              <span>{formatCurrency(minAmount)}</span>
              <span>{formatCurrency(maxAmount)}</span>
            </div>
          </div>

          {/* Tenor Picker */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">Tenor Pembiayaan (Jangka Waktu)</label>
            <div className="grid grid-cols-4 gap-2">
              {[6, 12, 18, 24, 36].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setTenor(m)}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    tenor === m
                      ? 'bg-primary-600 border-primary-600 text-white shadow-sm'
                      : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {m} Bln
                </button>
              ))}
            </div>
          </div>

          {/* Calculation Summary */}
          <div className="bg-primary-950 text-white rounded-2xl p-4 space-y-3 relative overflow-hidden">
            {/* Background design */}
            <div className="absolute right-0 bottom-0 opacity-[0.03] transform translate-y-2 translate-x-2">
              <Landmark className="w-32 h-32" />
            </div>
            
            <div className="border-b border-white/10 pb-3 flex justify-between items-center relative z-10">
              <span className="text-xs text-primary-200">Nisbah / Setara Margin</span>
              <span className="text-sm font-bold font-heading text-primary-100">{(marginRate * 100).toFixed(0)}% Flat/Tahun</span>
            </div>

            <div className="space-y-2 text-xs relative z-10">
              <div className="flex justify-between text-primary-200">
                <span>Pokok Pembiayaan</span>
                <span className="font-semibold tabular-nums">{formatCurrency(amount)}</span>
              </div>
              <div className="flex justify-between text-primary-200">
                <span>{getAkadMarginLabel()}</span>
                <span className="font-semibold tabular-nums">{formatCurrency(totalMargin)}</span>
              </div>
              <div className="flex justify-between text-primary-200 border-t border-white/5 pt-2">
                <span>Total Modal Pengembalian</span>
                <span className="font-semibold tabular-nums text-primary-100">{formatCurrency(totalFinancing)}</span>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex justify-between items-center mt-3 relative z-10">
              <div>
                <p className="text-[10px] text-primary-300 uppercase tracking-widest">Estimasi Angsuran</p>
                <p className="text-xs text-primary-300">Per Bulan (Tenor {tenor} Bln)</p>
              </div>
              <div className="text-right">
                <span className="text-lg font-black font-heading text-emerald-400 tabular-nums">
                  {formatCurrency(monthlyInstallment)}
                </span>
              </div>
            </div>
          </div>

          <button className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-xl transition-all shadow-sm text-xs uppercase tracking-wider hover:shadow-md active:scale-[0.99]">
             Ajukan Pembiayaan Sekarang
          </button>
        </div>

      </div>
    </motion.div>
  );
}
