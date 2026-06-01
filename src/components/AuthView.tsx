import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, Mail, User as UserIcon, Phone, FileText, ArrowRight, Eye, EyeOff, ShieldAlert, CheckCircle2, Fingerprint } from 'lucide-react';
import { User } from '../types';

interface AuthViewProps {
  onSuccess: (user: User) => void;
}

export function AuthView({ onSuccess }: AuthViewProps) {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isAgreed, setIsAgreed] = useState(false);

  const getRegisteredUsers = (): any[] => {
    const users = localStorage.getItem('spps_users');
    return users ? JSON.parse(users) : [];
  };

  const saveUser = (newUser: any) => {
    const users = getRegisteredUsers();
    users.push(newUser);
    localStorage.setItem('spps_users', JSON.stringify(users));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Email dan Password harus diisi');
      return;
    }

    // Default demo user check
    if (email === 'demo@kopsyah.com' && password === 'safepass123') {
      const demoUser: User = {
        id: 'US-001',
        name: 'Bapak Ahmad',
        memberId: 'KOP-2023-0892',
        totalSimpanan: 15450000,
        simpananPokok: 1000000,
        simpananWajib: 4450000,
        simpananSukarela: 10000000,
      };
      onSuccess(demoUser);
      return;
    }

    const users = getRegisteredUsers();
    const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);

    if (foundUser) {
      const activeUser: User = {
        id: foundUser.id,
        name: foundUser.name,
        memberId: foundUser.memberId,
        totalSimpanan: foundUser.totalSimpanan || 0,
        simpananPokok: foundUser.simpananPokok || 0,
        simpananWajib: foundUser.simpananWajib || 0,
        simpananSukarela: foundUser.simpananSukarela || 0,
      };
      onSuccess(activeUser);
    } else {
      setError('Email atau Password tidak sesuai atau belum terdaftar.');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name || !email || !phone || !password || !confirmPassword) {
      setError('Semua bidang harus diisi.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Konformasi password tidak cocok.');
      return;
    }

    if (password.length < 6) {
      setError('Password minimal harus 6 karakter.');
      return;
    }

    if (!isAgreed) {
      setError('Anda harus menyetujui syarat & batas ketentuan syariah.');
      return;
    }

    const users = getRegisteredUsers();
    const emailExist = users.some(u => u.email.toLowerCase() === email.toLowerCase());

    if (emailExist || email === 'demo@kopsyah.com') {
      setError('Email tersebut sudah digunakan.');
      return;
    }

    const randomMemberNum = Math.floor(1000 + Math.random() * 9000);
    const newMemberId = `KOP-2026-${randomMemberNum}`;

    const newUser = {
      id: `US-${Date.now()}`,
      name,
      email,
      phone,
      password,
      memberId: newMemberId,
      totalSimpanan: 0, 
      simpananPokok: 0,
      simpananWajib: 0,
      simpananSukarela: 0,
    };

    saveUser(newUser);
    setSuccess(`Registrasi Berhasil! Nomor Anggota Anda: ${newMemberId}`);
    
    // Auto-fill login and swap state
    setTimeout(() => {
      setIsLogin(true);
      setPassword('');
      setConfirmPassword('');
      setSuccess('');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between py-8 px-6 relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 rounded-full bg-primary-100/40 opacity-70 blur-3xl"></div>
      <div className="absolute bottom-10 left-0 -ml-20 w-60 h-60 rounded-full bg-primary-50/50 opacity-80 blur-2xl"></div>

      {/* Top Brand Logo */}
      <div className="flex flex-col items-center text-center mt-6 relative z-10">
        <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl flex items-center justify-center shadow-lg text-white font-heading font-bold text-2xl mb-4 border border-primary-500/30">
          KM
        </div>
        <h1 className="text-xl font-heading font-black text-primary-900 tracking-tight">Kopsyah MUI Jatim</h1>
        <p className="text-xs font-medium text-gray-500 uppercase tracking-widest mt-1">Sistem Pelayanan Simpan Pinjam</p>
      </div>

      {/* Card Content with Motion */}
      <div className="my-auto py-8 relative z-10 w-full">
        <motion.div
          key={isLogin ? 'login-card' : 'register-card'}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold font-heading text-gray-900">
              {isLogin ? 'Masuk Akun' : 'Daftar Anggota'}
            </h2>
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setSuccess('');
              }}
              className="text-xs font-semibold text-primary-600 hover:text-primary-700 bg-primary-50 px-3 py-1.5 rounded-full transition-colors"
            >
              {isLogin ? 'Registrasi' : 'Login'}
            </button>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 text-red-700 p-3 rounded-xl flex items-start gap-2 text-xs border border-red-100 animate-shake">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 bg-green-50 text-green-800 p-3 rounded-xl flex items-start gap-2 text-xs border border-green-100">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-green-600" />
              <span className="font-medium">{success}</span>
            </div>
          )}

          {isLogin ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email Anggota</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                    <Mail className="w-5 h-5" />
                  </span>
                  <input
                    type="email"
                    placeholder="nama@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white text-sm transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Kata Sandi</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                    <Lock className="w-5 h-5" />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-11 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white text-sm transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 active:scale-95"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center pt-1 text-xs">
                <span className="text-gray-500">Demo Account?</span>
                <span className="font-semibold text-primary-600 cursor-pointer" onClick={() => {
                  setEmail('demo@kopsyah.com');
                  setPassword('safepass123');
                }}>Gunakan Demo</span>
              </div>

              <button
                type="submit"
                className="w-full mt-6 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 hover:shadow-lg hover:scale-[1.01] active:scale-[0.99]"
              >
                Masuk Ke Layanan <ArrowRight className="w-4 h-4" />
              </button>
              
              <div className="relative flex items-center justify-center mt-6">
                <span className="absolute bg-white px-2 text-xs text-gray-400">atau</span>
                <div className="w-full h-px bg-gray-100"></div>
              </div>
              
              <button
                type="button"
                onClick={() => alert('Simulasi: Verifikasi Biometrik (Face ID / Fingerprint) Berhasil!')}
                className="w-full mt-6 bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-700 font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
              >
                <Fingerprint className="w-5 h-5 text-primary-600" /> Masuk dengan Biometrik
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Nama Lengkap</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                    <UserIcon className="w-5 h-5" />
                  </span>
                  <input
                    type="text"
                    placeholder="Ahmad Fauzi"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white text-sm transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email Aktif</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                    <Mail className="w-5 h-5" />
                  </span>
                  <input
                    type="email"
                    placeholder="nama@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white text-sm transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Nomor Telefon (WA)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                    <Phone className="w-5 h-5" />
                  </span>
                  <input
                    type="tel"
                    placeholder="081234567890"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white text-sm transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Kata Sandi</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                    <Lock className="w-5 h-5" />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Minimal 6 karakter"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white text-sm transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Ulangi Sandi</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                    <Lock className="w-5 h-5" />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Ulangi kata sandi"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white text-sm transition-all"
                  />
                </div>
              </div>

              <div className="flex items-start gap-2 pt-2">
                <input
                  type="checkbox"
                  id="agree"
                  checked={isAgreed}
                  onChange={(e) => setIsAgreed(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 mt-0.5 cursor-pointer"
                />
                <label htmlFor="agree" className="text-[11px] text-gray-500 cursor-pointer select-none leading-relaxed">
                  Saya setuju dengan <span className="font-semibold text-primary-700">Syarat & Ketentuan Syariah Kopsyah MUI Jatim</span>.
                </label>
              </div>

              <button
                type="submit"
                className="w-full mt-6 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 hover:shadow-lg hover:scale-[1.01] active:scale-[0.99]"
              >
                Daftar Sekarang <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </motion.div>
      </div>

      {/* Footer Branding */}
      <div className="text-center pb-2 relative z-10">
        <p className="text-[10px] text-gray-400">Sistem Pelayanan Simpanan & Pembiayaan Syariah</p>
        <p className="text-[10.5px] font-semibold text-gray-500 mt-1">Diawasi Oleh Dewan Pengawas Syariah MUI Jatim</p>
      </div>
    </div>
  );
}
