import { User, Transaction, PembiayaanItem, HajiPackage } from './types';

export const mockUser: User = {
  id: 'US-001',
  name: 'Bapak Ahmad',
  memberId: 'KOP-2023-0892',
  totalSimpanan: 15450000,
  simpananPokok: 1000000,
  simpananWajib: 4450000,
  simpananSukarela: 10000000,
};

export const recentTransactions: Transaction[] = [
  { id: 'TRX-1', date: '2026-05-28T10:30:00Z', title: 'Setoran Simpanan Wajib', type: 'in', amount: 100000, category: 'Simpanan' },
  { id: 'TRX-2', date: '2026-05-25T14:15:00Z', title: 'Angsuran Pembiayaan Motor', type: 'out', amount: 850000, category: 'Pembiayaan' },
  { id: 'TRX-3', date: '2026-05-10T09:00:00Z', title: 'Setoran Talangan Haji', type: 'in', amount: 500000, category: 'Haji & Umroh' },
  { id: 'TRX-4', date: '2026-04-28T11:20:00Z', title: 'Setoran Simpanan Wajib', type: 'in', amount: 100000, category: 'Simpanan' },
];

export const activePembiayaan: PembiayaanItem[] = [
  {
    id: 'PEM-01',
    title: 'Pembiayaan Kendaraan Bermotor (Murabahah)',
    totalAmount: 18000000,
    remainingAmount: 6800000,
    monthlyInstallment: 850000,
    nextDueDate: '2026-06-25T00:00:00Z',
    progress: 62,
    status: 'active'
  }
];

export const userHajiProgram: HajiPackage = {
  id: 'HAJI-01',
  title: 'Program Talangan Porsi Haji',
  description: 'Program percepatan porsi Haji melalui dana talangan syariah Kopsyah MUI',
  targetFund: 25000000,
  currentFund: 12500000,
  status: 'planning'
};
