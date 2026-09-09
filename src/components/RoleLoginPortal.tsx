import React, { useState as fallbackUseState } from 'react';
import {
  Shield,
  GraduationCap,
  Briefcase,
  Coins,
  Building2,
  Award,
  Lock,
  ArrowRight,
  CheckCircle2,
  UserCheck,
  School,
  LogOut,
  Info
} from 'lucide-react';

export interface UserRoleInfo {
  role: string;
  title: string;
  category: string;
  badgeColor: string;
  description: string;
  icon: any;
  defaultPass: string;
  responsibilities: string[];
  allowedTabs: string[];
}

export const OFFICIAL_ROLES: Record<string, UserRoleInfo> = {
  GURU: {
    role: 'GURU',
    title: 'Guru / Wali Kelas',
    category: 'Akademik & Pengajaran',
    badgeColor: 'bg-emerald-600 text-white',
    description: 'Akses penginputan nilai E-Rapor Kurikulum Merdeka, absensi rombel, jurnal mengajar harian, dan Sasaran Kerja Individu (SKI).',
    icon: GraduationCap,
    defaultPass: 'guru123',
    responsibilities: [
      'Input Nilai Siswa & Capaian TP E-Rapor',
      'Cetak Rapor & Leger Nilai Kelas Ampuan',
      'Jurnal Mengajar & Absensi Peserta Didik',
      'Pengisian Sasaran Kerja Individu (SKI)'
    ],
    allowedTabs: ['website', 'siswa', 'e_raport', 'arsip', 'jurnal', 'ski']
  },
  KEPALA_SEKOLAH: {
    role: 'KEPALA_SEKOLAH',
    title: 'Kepala Sekolah (SDIT El Fatah)',
    category: 'Manajerial Sekolah',
    badgeColor: 'bg-blue-600 text-white',
    description: 'Supervisi akademik sekolah, persetujuan dan penerbitan E-Rapor siap cetak, verifikasi kelulusan PPDB, evaluasi KPI guru, dan koordinasi pendidikan.',
    icon: School,
    defaultPass: 'kepsek123',
    responsibilities: [
      'Validasi & Penerbitan E-Raport Siap Cetak',
      'Layar Admin PPDB: Verifikasi & Kelulusan Calon Siswa',
      'Penilaian Kinerja Guru (KPI 13 Indikator)',
      'Supervisi Laporan Akademik & Keuangan Sekolah'
    ],
    allowedTabs: ['website', 'dashboard', 'siswa', 'ppdb_admin', 'e_raport', 'arsip', 'jurnal', 'ski', 'kpi', 'payroll', 'siplah', 'reports', 'cms', 'ai']
  },
  BENDAHARA_SEKOLAH: {
    role: 'BENDAHARA_SEKOLAH',
    title: 'Bendahara Sekolah',
    category: 'Keuangan Operasional Sekolah',
    badgeColor: 'bg-amber-600 text-white',
    description: 'Pengelolaan kasir penagihan SPP bulanan terintegrasi, cetak kuitansi resmi, pengelolaan dana BOS, dan anggaran sekolah ARKAS.',
    icon: Coins,
    defaultPass: 'bendahara123',
    responsibilities: [
      'Matriks Pembayaran SPP 12 Bulan Terintegrasi Riil',
      'Pencatatan Pembayaran & Cetak Kuitansi SPP',
      'Pengelolaan Dana Bantuan Operasional Sekolah (BOS)',
      'Penyusunan Realisasi Anggaran 1 Tahun ARKAS'
    ],
    allowedTabs: ['website', 'dashboard', 'siswa', 'ppdb_admin', 'transactions', 'arkas', 'reports', 'payroll', 'arsip', 'cms', 'ai']
  },
  BENDAHARA_YAYASAN: {
    role: 'BENDAHARA_YAYASAN',
    title: 'Bendahara Yayasan',
    category: 'Keuangan & Akuntansi Yayasan',
    badgeColor: 'bg-purple-600 text-white',
    description: 'Penyusunan akuntansi entitas nirlaba ISAK 35, buku kas umum yayasan, neraca saldo, penggajian (payroll) guru/staf, dan persetujuan pengadaan SiPLah.',
    icon: Briefcase,
    defaultPass: 'bendahara123',
    responsibilities: [
      'Laporan Keuangan ISAK 35 (Aktivitas & Arus Kas)',
      'Buku Besar, Chart of Accounts (COA) & Aset Yayasan',
      'Payroll & Penggajian Guru dan Tenaga Kependidikan',
      'Verifikasi Pengadaan Barang & Jasa SiPLah'
    ],
    allowedTabs: ['website', 'dashboard', 'siswa', 'ppdb_admin', 'reports', 'transactions', 'coa', 'payroll', 'arkas', 'siplah', 'kpi', 'pengaturan', 'hak_akses', 'ai']
  },
  KETUA_YAYASAN: {
    role: 'KETUA_YAYASAN',
    title: 'Ketua Pembina Yayasan',
    category: 'Pimpinan Yayasan Daarul Habibah',
    badgeColor: 'bg-indigo-700 text-white',
    description: 'Pengawasan eksekutif yayasan, monitoring likuiditas kas, evaluasi audit keuangan ISAK 35, persetujuan strategis pengadaan, dan KPI.',
    icon: Award,
    defaultPass: 'ketua123',
    responsibilities: [
      'Executive Overview Keuangan & Aset Yayasan',
      'Audit dan Pengawasan Laporan ISAK 35',
      'Persetujuan Akhir Pengadaan Barang Besar SiPLah',
      'Penetapan Kebijakan Strategis Lembaga Pendidikan'
    ],
    allowedTabs: ['website', 'dashboard', 'siswa', 'ppdb_admin', 'reports', 'coa', 'payroll', 'kpi', 'siplah', 'arsip', 'pengaturan', 'hak_akses', 'ai']
  },
  SUPERADMIN: {
    role: 'SUPERADMIN',
    title: 'Superadmin ERP Yayasan',
    category: 'Administrator Utama',
    badgeColor: 'bg-slate-900 text-white border border-amber-400/40',
    description: 'Akses komprehensif tanpa batas ke seluruh modul sistem: Master Data, Layar Admin PPDB, E-Rapor Siap Cetak, SPP, ISAK 35, Database Cloud Firestore, dan Hak Akses.',
    icon: Shield,
    defaultPass: 'superadmin123',
    responsibilities: [
      'Akses Penuh Seluruh Modul ERP & Akademik',
      'Manajemen Pengguna, Password, dan Hak Akses',
      'Pengaturan Sinkronisasi Database Firestore',
      'Ekspor dan Impor Cadangan Database Yayasan'
    ],
    allowedTabs: ['website', 'dashboard', 'siswa', 'ppdb_admin', 'e_raport', 'arsip', 'jurnal', 'ski', 'kpi', 'payroll', 'siplah', 'academic', 'arkas', 'reports', 'transactions', 'coa', 'assets', 'master', 'cms', 'pengaturan', 'hak_akses', 'ai']
  }
};

interface RoleLoginPortalProps {
  React?: any;
  isOpen: boolean;
  currentRole: string;
  onSelectRole: (role: string) => void;
  onClose?: () => void;
  isModal?: boolean;
}

export const RoleLoginPortal: React.FC<RoleLoginPortalProps> = (props) => {
  const {
    isOpen,
    currentRole,
    onSelectRole,
    onClose,
    isModal = false,
  } = props;

  const ActiveReact = props?.React || (typeof window !== "undefined" && (window as any).__AppReact) || React;
  const useState = ActiveReact?.useState ? ActiveReact.useState.bind(ActiveReact) : fallbackUseState;

  const [selectedRoleKey, setSelectedRoleKey] = useState<string>(currentRole || 'KEPALA_SEKOLAH');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showQuickTips, setShowQuickTips] = useState<boolean>(true);

  if (!isOpen) return null;

  const roleInfo = OFFICIAL_ROLES[selectedRoleKey] || OFFICIAL_ROLES.KEPALA_SEKOLAH;

  const handleQuickLogin = (roleKey: string) => {
    setSelectedRoleKey(roleKey);
    setPassword(OFFICIAL_ROLES[roleKey]?.defaultPass || '');
    setErrorMessage('');
    onSelectRole(roleKey);
    if (onClose) onClose();
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const targetInfo = OFFICIAL_ROLES[selectedRoleKey];
    if (!targetInfo) return;

    // Cek kecocokan password atau bypass superadmin
    if (password === targetInfo.defaultPass || password === 'admin123' || password === 'superadmin123') {
      onSelectRole(selectedRoleKey);
      if (onClose) onClose();
    } else {
      setErrorMessage(`Password tidak sesuai untuk peran ${targetInfo.title}. Password default: ${targetInfo.defaultPass}`);
    }
  };

  const content = (
    <div className="bg-slate-900/95 text-slate-100 rounded-3xl border border-slate-700/60 shadow-2xl overflow-hidden max-w-5xl w-full mx-auto backdrop-blur-xl">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-indigo-950 p-6 md:p-8 border-b border-emerald-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/20 shrink-0">
            <School className="w-8 h-8" />
          </div>
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-1 border border-emerald-400/30">
              <Shield className="w-3.5 h-3.5" /> Portal Multi-Peran Terpadu
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
              Sistem ERP Yayasan Daarul Habibah & SDIT El Fatah
            </h2>
            <p className="text-xs md:text-sm text-emerald-200/80">
              Pilih peran akses Anda untuk membuka dashboard, modul kerja, dan hak akses yang sesuai.
            </p>
          </div>
        </div>

        {isModal && onClose && (
          <button
            onClick={onClose}
            className="self-start md:self-auto px-4 py-2 bg-slate-800/80 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition cursor-pointer border border-slate-700"
          >
            Tutup
          </button>
        )}
      </div>

      {/* Main Grid: 6 Role Cards */}
      <div className="p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-emerald-400" />
            6 Peran Akses Resmi (Klik untuk Langsung Masuk / Beralih)
          </h3>
          <span className="text-xs text-slate-400">
            Peran Aktif Saat Ini: <strong className="text-emerald-400">{OFFICIAL_ROLES[currentRole]?.title || currentRole}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(OFFICIAL_ROLES).map(([key, info]) => {
            const IconComponent = info.icon;
            const isSelected = selectedRoleKey === key;
            const isCurrent = currentRole === key;

            return (
              <div
                key={key}
                onClick={() => setSelectedRoleKey(key)}
                className={`relative rounded-2xl p-5 transition-all duration-200 cursor-pointer border flex flex-col justify-between ${
                  isSelected
                    ? 'bg-slate-800/90 border-emerald-500 ring-2 ring-emerald-500/30 shadow-xl'
                    : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/70 hover:border-slate-600'
                }`}
              >
                {isCurrent && (
                  <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black uppercase tracking-wider">
                    Sedang Aktif
                  </span>
                )}

                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${info.badgeColor} shadow-md`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        {info.category}
                      </span>
                      <h4 className="text-base font-bold text-white leading-snug">
                        {info.title}
                      </h4>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2 mb-3">
                    {info.description}
                  </p>

                  <div className="space-y-1 mb-4">
                    {info.responsibilities.slice(0, 2).map((resp, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-[11px] text-emerald-300/80">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="truncate">{resp}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-700/50 flex items-center justify-between">
                  <div className="text-[11px] text-slate-400">
                    Sandi default: <code className="text-amber-400 font-mono bg-slate-900/80 px-1.5 py-0.5 rounded">{info.defaultPass}</code>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleQuickLogin(key);
                    }}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition flex items-center gap-1 shadow cursor-pointer active:scale-95"
                  >
                    <span>Masuk</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Role Form & Confirmation */}
        <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700 flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${roleInfo.badgeColor} shadow`}>
              {(() => {
                const SelectedRoleIcon = roleInfo.icon;
                return SelectedRoleIcon ? <SelectedRoleIcon className="w-6 h-6" /> : null;
              })()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-400">Login Sebagai:</span>
                <span className="text-sm font-extrabold text-white">{roleInfo.title}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700 text-slate-300">
                  {roleInfo.category}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Modul yang dapat diakses: {roleInfo.allowedTabs.join(', ')}
              </p>
            </div>
          </div>

          <form onSubmit={handlePasswordSubmit} className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={`Sandi: ${roleInfo.defaultPass}`}
                className="pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 w-44"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow transition cursor-pointer flex items-center gap-1.5 shrink-0"
            >
              <span>Verifikasi & Masuk</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin(selectedRoleKey)}
              className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold text-xs rounded-xl transition cursor-pointer shrink-0"
              title="Masuk langsung tanpa ketik sandi"
            >
              1-Klik Masuk
            </button>
          </form>
        </div>

        {errorMessage && (
          <div className="p-3.5 bg-rose-500/20 border border-rose-500/40 rounded-xl text-rose-300 text-xs flex items-center gap-2">
            <Info className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
        <div className="my-auto w-full max-w-5xl">
          {content}
        </div>
      </div>
    );
  }

  return content;
};

export default RoleLoginPortal;
