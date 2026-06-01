export type ViewState = 'home' | 'simpanan' | 'pembiayaan' | 'haji' | 'assistant';

export interface User {
  id: string;
  name: string;
  memberId: string;
  avatarUrl?: string;
  totalSimpanan: number;
  simpananPokok: number; // Simpanan Pokok
  simpananWajib: number; // Simpanan Wajib
  simpananSukarela: number; // Simpanan Sukarela
}

export interface Transaction {
  id: string;
  date: string;
  title: string;
  type: 'in' | 'out';
  amount: number;
  category: string;
}

export interface PembiayaanItem {
  id: string;
  title: string;
  totalAmount: number;
  remainingAmount: number;
  monthlyInstallment: number;
  nextDueDate: string;
  progress: number;
  status: 'active' | 'completed';
}

export interface HajiPackage {
  id: string;
  title: string;
  description: string;
  targetFund: number;
  currentFund: number;
  status: 'planning' | 'waiting_list' | 'ready';
}
