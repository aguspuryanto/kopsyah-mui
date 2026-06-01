import React, { useState } from 'react';
import { User, Transaction } from '../types';
import { formatCurrency, formatDate } from '../lib/utils';
import { Wallet, History, Plus, Minus, FileText, X, Check, ArrowRight, ShieldCheck, Landmark, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SimpananViewProps {
  key?: React.Key;
  user: User;
  transactions: Transaction[];
  onSetor: (type: 'pokok' | 'wajib' | 'sukarela', amount: number) => void;
  onTarik: (type: 'pokok' | 'wajib' | 'sukarela', amount: number) => void;
}

export function SimpananView({ user, transactions, onSetor, onTarik }: SimpananViewProps) {
  const simpananTransactions = transactions.filter(t => t.category === 'Simpanan');

  // Modal states
  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState<'setor' | 'tarik'>('setor');
  const [savingType, setSavingType] = useState<'pokok' | 'wajib' | 'sukarela'>('sukarela');
  const [amountInput, setAmountInput] = useState<string>('100000');
  const [paymentMethod, setPaymentMethod] = useState<string>('bsi');
  const [modalStep, setModalStep] = useState<'form' | 'success'>('form');

  const handlePresetClick = (amount: number) => {
    setAmountInput(amount.toString());
  };

  const handleOpenSetor = () => {
    setIsOpen(true);
    setModalType('setor');
    setAmountInput('100000');
    setSavingType('sukarela');
    setPaymentMethod('bsi');
    setModalStep('form');
  };

  const handleOpenTarik = () => {
    setIsOpen(true);
    setModalType('tarik');
    setAmountInput('100000');
    setSavingType('sukarela');
    setPaymentMethod('bsi');
    setModalStep('form');
  };

  const handleSubmitDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanAmount = parseInt(amountInput.replace(/\D/g, ''), 10);
    if (isNaN(cleanAmount) || cleanAmount <= 0) {
      alert('Jumlah tidak valid.');
      return;
    }

    if (modalType === 'setor') {
      onSetor(savingType, cleanAmount);
      setModalStep('success');
    } else {
      let maxAmount = 0;
      if (savingType === 'pokok') maxAmount = user.simpananPokok;
      else if (savingType === 'wajib') maxAmount = user.simpananWajib;
      else maxAmount = user.simpananSukarela;

      if (cleanAmount > maxAmount) {
        alert('Saldo tidak mencukupi untuk penarikan.');
        return;
      }
      onTarik(savingType, cleanAmount);
      setModalStep('success');
    }
  };

  const getSavingsLabel = (type: 'pokok' | 'wajib' | 'sukarela') => {
    switch (type) {
      case 'pokok': return 'Simpanan Pokok';
      case 'wajib': return 'Simpanan Wajib';
      case 'sukarela': return 'Simpanan Sukarela';
    }
  };

  const presets = [50000, 100000, 250000, 500000, 1000000, 2500000];

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
          <h1 className="text-lg font-heading font-bold text-gray-900">Simpanan</h1>
          <p className="text-[10px] font-medium text-gray-500 uppercase tracking-widest mt-0.5">Syariah</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center">
          <Wallet className="w-5 h-5" />
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        
        {/* Balance Card with dynamic values */}
        <div className="bg-gradient-to-br from-primary-700 to-primary-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Wallet className="w-24 h-24" />
          </div>
          <div className="relative z-10">
            <p className="text-primary-100/80 text-sm font-medium mb-1">Total Saldo Aktif</p>
            <h2 className="text-3xl font-bold font-heading tabular-nums tracking-tight mb-6 animate-pulse-subtle">
              {formatCurrency(user.totalSimpanan)}
            </h2>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <p className="text-primary-100/60 text-[10px] uppercase tracking-wider mb-0.5">Simpanan Pokok</p>
                <p className="font-bold text-sm tabular-nums">{formatCurrency(user.simpananPokok)}</p>
                <p className="text-[9px] text-primary-200/50 mt-1">Dibayar saat register</p>
              </div>
              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <p className="text-primary-100/60 text-[10px] uppercase tracking-wider mb-0.5">Simpanan Wajib</p>
                <p className="font-bold text-sm tabular-nums">{formatCurrency(user.simpananWajib)}</p>
                <p className="text-[9px] text-primary-200/50 mt-1">Dibayar rutin bulanan</p>
              </div>
              <div className="col-span-2 bg-white/5 p-3 rounded-xl border border-white/10 flex justify-between items-center">
                <div>
                  <p className="text-primary-100/60 text-[10px] uppercase tracking-wider mb-0.5">Simpanan Sukarela (Mudarabah)</p>
                  <p className="font-bold text-sm tabular-nums">{formatCurrency(user.simpananSukarela)}</p>
                </div>
                <span className="text-[10px] bg-primary-500/30 text-emerald-300 font-semibold px-2 py-1 rounded-md">Bagi Hasil</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-2">
          <button 
            onClick={handleOpenSetor}
            className="bg-primary-600 text-white rounded-xl p-3 flex flex-col items-center justify-center gap-1.5 text-xs font-semibold hover:bg-primary-700 transition-colors shadow-sm active:scale-95"
          >
            <Plus className="w-5 h-5" /> Setor
          </button>
          <button 
            onClick={handleOpenTarik}
            className="bg-white border border-gray-200 text-gray-700 rounded-xl p-3 flex flex-col items-center justify-center gap-1.5 text-xs font-semibold hover:bg-gray-50 transition-colors shadow-sm active:scale-95"
          >
            <Minus className="w-5 h-5" /> Tarik
          </button>
          <a
            href="#riwayat-transaksi" 
            className="bg-white border border-gray-200 text-gray-700 rounded-xl p-3 flex flex-col items-center justify-center gap-1.5 text-xs font-semibold hover:bg-gray-50 transition-colors shadow-sm active:scale-95"
          >
            <FileText className="w-5 h-5 opacity-80" /> Mutasi
          </a>
        </div>

        {/* History */}
        <div id="riwayat-transaksi">
          <div className="flex items-center gap-2 mb-4">
            <History className="w-5 h-5 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900">Riwayat Mutasi Simpanan</h3>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-50">
            {simpananTransactions.length > 0 ? (
              simpananTransactions.map((trx) => (
                <div key={trx.id} className="p-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{trx.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{formatDate(trx.date)}</p>
                  </div>
                  <div className={`text-sm font-bold tabular-nums ${trx.type === 'in' ? 'text-emerald-600' : 'text-gray-900'}`}>
                    {trx.type === 'in' ? '+' : '-'}{formatCurrency(trx.amount)}
                  </div>
                </div>
              ))
            ) : (
                <div className="p-8 text-center text-gray-500 text-sm">
                  Belum ada transaksi simpanan
                </div>
            )}
          </div>
        </div>

      </div>

      {/* Slide-Up Deposit Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm">
            {/* Modal Container */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="w-full max-w-md bg-white rounded-t-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col pb-8 px-6 max-h-[90vh] overflow-y-auto"
            >
              {modalStep === 'form' ? (
                <>
                  {/* Header */}
                  <div className="flex justify-between items-center py-5 border-b border-gray-100 sticky top-0 bg-white z-10">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-primary-50 text-primary-600 rounded-lg">
                        <Wallet className="w-5 h-5" />
                      </div>
                      <h3 className="font-heading font-bold text-gray-900 text-lg">
                        {modalType === 'setor' ? 'Setoran Simpanan' : 'Tarik Simpanan'}
                      </h3>
                    </div>
                    <button 
                      onClick={() => setIsOpen(false)}
                      className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-500 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Body Form */}
                  <form onSubmit={handleSubmitDeposit} className="space-y-5 pt-4">
                    
                    {/* Saving Type Picker */}
                    <div>
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Jenis Simpanan</label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['pokok', 'wajib', 'sukarela'] as const).map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setSavingType(type)}
                            className={`py-3 px-2 rounded-2xl text-[11px] font-bold border transition-all text-center flex flex-col gap-0.5 justify-center items-center ${
                              savingType === type
                                ? 'bg-primary-50 border-primary-500 text-primary-700 shadow-sm'
                                : 'bg-gray-50/50 border-gray-200 text-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            <span>{getSavingsLabel(type).split(' ')[1]}</span>
                            <span className="text-[9px] font-normal text-gray-400 capitalize">({type})</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Amount Input */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                        Jumlah {modalType === 'setor' ? 'Setoran' : 'Penarikan'} (IDR)
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-4 font-bold text-gray-400">Rp</span>
                        <input
                          type="number"
                          value={amountInput}
                          onChange={(e) => setAmountInput(e.target.value)}
                          placeholder="0"
                          required
                          min="1000"
                          className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white text-lg font-bold text-gray-900 transition-all text-left"
                        />
                      </div>
                      
                      {/* Presets Grid */}
                      <div className="grid grid-cols-3 gap-2 pt-1">
                        {presets.map((p) => (
                          <button
                            key={p}
                            type="button"
                            onClick={() => handlePresetClick(p)}
                            className="py-2 px-1 rounded-xl text-xs font-medium bg-gray-50 border border-gray-200/60 text-gray-600 hover:bg-gray-100 transition-all text-center"
                          >
                            {p >= 1000000 ? `${(p / 1000000).toFixed(1).replace('.0', '')} Jt` : `${p / 1000} Rb`}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Sharia Simulated Payment Gateway */}
                    <div>
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Pilih Bank Tujuan</label>
                      <div className="space-y-2">
                        <label className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all ${
                          paymentMethod === 'bsi' ? 'bg-emerald-50/50 border-emerald-500 text-primary-950 font-semibold' : 'bg-white border-gray-200 text-gray-600'
                        }`}>
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="payment"
                              value="bsi"
                              checked={paymentMethod === 'bsi'}
                              onChange={() => setPaymentMethod('bsi')}
                              className="w-4 h-4 text-primary-600 focus:ring-primary-500 cursor-pointer"
                            />
                            <div className="text-left">
                              <p className="text-sm">BSI (Bank Syariah Indonesia)</p>
                              <p className="text-[10px] text-gray-400">Simulasi Virtual Account</p>
                            </div>
                          </div>
                          <Landmark className="w-5 h-5 opacity-40" />
                        </label>

                        <label className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all ${
                          paymentMethod === 'muamalat' ? 'bg-emerald-50/50 border-emerald-500 text-primary-950 font-semibold' : 'bg-white border-gray-200 text-gray-600'
                        }`}>
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="payment"
                              value="muamalat"
                              checked={paymentMethod === 'muamalat'}
                              onChange={() => setPaymentMethod('muamalat')}
                              className="w-4 h-4 text-primary-600 focus:ring-primary-500 cursor-pointer"
                            />
                            <div className="text-left">
                              <p className="text-sm">Bank Muamalat</p>
                              <p className="text-[10px] text-gray-400">Simulasi Direct Transfer</p>
                            </div>
                          </div>
                          <Landmark className="w-5 h-5 opacity-40" />
                        </label>
                      </div>
                    </div>

                    {/* Trust Disclaimer */}
                    <div className="flex gap-2.5 bg-emerald-50/50 p-3.5 rounded-2xl border border-emerald-100/40 text-left">
                      <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      <p className="text-[10px] text-gray-500 leading-normal">
                        Semua transaksi diproses secara real-time dengan validasi syariah Kopsyah MUI Jawa Timur, bebas dari unsur riba, maysir, maupun gharar.
                      </p>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 text-sm uppercase tracking-wider active:scale-[0.98]"
                    >
                      {modalType === 'setor' ? 'Konfirmasi Setoran' : 'Konfirmasi Penarikan'} <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                </>
              ) : (
                /* Success View inside modern Modal */
                <div className="text-center pt-8 pb-3 relative">
                  <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-200 text-emerald-600 animate-bounce">
                    <Check className="w-10 h-10 stroke-[3]" />
                  </div>
                  <h3 className="text-2xl font-black font-heading text-gray-900 mb-2">
                    {modalType === 'setor' ? 'Setoran Berhasil!' : 'Penarikan Berhasil!'}
                  </h3>
                  <p className="text-sm text-gray-600 px-4 leading-relaxed mb-6">
                    Alhamdulillah, {modalType === 'setor' ? 'setoran' : 'penarikan'} <span className="font-semibold text-primary-700">{getSavingsLabel(savingType)}</span> sebesar <span className="font-bold text-gray-950">{formatCurrency(parseInt(amountInput, 10))}</span> telah berhasil dibukukan.
                  </p>

                  <div className="bg-gray-50 rounded-2xl p-4 mb-8 text-left space-y-2 border border-gray-100">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">No. Anggota:</span>
                      <span className="font-mono font-semibold text-gray-900">{user.memberId}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Jenis Simpanan:</span>
                      <span className="font-semibold text-gray-900">{getSavingsLabel(savingType)}</span>
                    </div>
                    <div className="flex justify-between text-xs pt-2 border-t border-gray-200">
                      <span className="font-medium text-gray-700">Total Saldo Baru Anda:</span>
                      <span className="font-bold text-primary-700">{formatCurrency(user.totalSimpanan)}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3.5 rounded-2xl transition-colors text-xs uppercase tracking-widest"
                  >
                    Tutup & Kembali
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
