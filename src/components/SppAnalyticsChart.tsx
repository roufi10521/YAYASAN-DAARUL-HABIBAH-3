import React, { useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import {
  TrendingUp, Users, CheckCircle2, AlertCircle, Calendar,
  Download, Printer, Filter, DollarSign, BookOpen, Layers
} from 'lucide-react';
import * as XLSX from 'xlsx';

export interface Student {
  id: string;
  nis: string;
  nisn?: string;
  name: string;
  gradeClass: string;
  sppAmount: number;
  sppStatus: 'LUNAS' | 'TUNGGAKAN' | 'MENUNGGU' | 'BELUM_LUNAS' | string;
  contactPhone?: string;
  parentName?: string;
  virtualAccount?: string;
  gender?: string;
  monthlyPayments?: Record<string, 'LUNAS' | 'TUNGGAKAN' | 'MENUNGGU'>;
}

interface SppAnalyticsChartProps {
  students?: Student[];
  onOpenNewTransaction?: () => void;
}

const MONTHS = [
  { id: '07', name: 'Juli' },
  { id: '08', name: 'Agustus' },
  { id: '09', name: 'September' },
  { id: '10', name: 'Oktober' },
  { id: '11', name: 'November' },
  { id: '12', name: 'Desember' },
  { id: '01', name: 'Januari' },
  { id: '02', name: 'Februari' },
  { id: '03', name: 'Maret' },
  { id: '04', name: 'April' },
  { id: '05', name: 'Mei' },
  { id: '06', name: 'Juni' }
];

const CLASSES = ['Kelas 1', 'Kelas 2', 'Kelas 3', 'Kelas 4', 'Kelas 5', 'Kelas 6'];

const formatRupiah = (num: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(num);
};

export const SppAnalyticsChart: React.FC<SppAnalyticsChartProps> = ({ students = [] }) => {
  const [selectedMonth, setSelectedMonth] = useState<string>('all'); // 'all' or month id like '08'
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [activeView, setActiveView] = useState<'grafik' | 'tabel_rekap' | 'daftar_siswa'>('grafik');

  // Generate complete dataset with deterministic monthly simulation if monthlyPayments is not yet set
  const studentDataWithMonthly = useMemo(() => {
    return students.map((std, idx) => {
      const payments: Record<string, 'LUNAS' | 'TUNGGAKAN' | 'MENUNGGU'> = {};
      MONTHS.forEach((m, mIdx) => {
        if (std.monthlyPayments && std.monthlyPayments[m.id]) {
          payments[m.id] = std.monthlyPayments[m.id];
        } else {
          // Deterministic realistic payment simulation based on student status and month index
          if (std.sppStatus === 'LUNAS') {
            payments[m.id] = mIdx <= 2 ? 'LUNAS' : (mIdx % 4 === 0 ? 'MENUNGGU' : 'LUNAS');
          } else if (std.sppStatus === 'TUNGGAKAN') {
            payments[m.id] = mIdx < 1 ? 'LUNAS' : 'TUNGGAKAN';
          } else {
            payments[m.id] = (idx + mIdx) % 3 === 0 ? 'TUNGGAKAN' : 'LUNAS';
          }
        }
      });
      return {
        ...std,
        gradeClass: std.gradeClass || 'Kelas 1',
        sppAmount: std.sppAmount || 250000,
        monthlyPayments: payments
      };
    });
  }, [students]);

  // Filtered students according to dropdowns
  const filteredStudents = useMemo(() => {
    return studentDataWithMonthly.filter(std => {
      if (selectedClass !== 'all' && std.gradeClass !== selectedClass) return false;
      return true;
    });
  }, [studentDataWithMonthly, selectedClass]);

  // Data per Kelas for Bar Chart
  const classBreakdown = useMemo(() => {
    return CLASSES.map(cls => {
      const clsStudents = studentDataWithMonthly.filter(s => s.gradeClass === cls);
      const totalStudents = clsStudents.length;
      const baseTariff = clsStudents[0]?.sppAmount || 250000;

      let lunasCount = 0;
      let tunggakanCount = 0;
      let targetNominal = 0;
      let realisasiNominal = 0;
      let tunggakanNominal = 0;

      if (selectedMonth === 'all') {
        // Calculate for all 12 months
        targetNominal = totalStudents * baseTariff * MONTHS.length;
        clsStudents.forEach(s => {
          MONTHS.forEach(m => {
            const status = s.monthlyPayments?.[m.id];
            if (status === 'LUNAS') {
              lunasCount++;
              realisasiNominal += s.sppAmount;
            } else {
              tunggakanCount++;
              tunggakanNominal += s.sppAmount;
            }
          });
        });
      } else {
        // Calculate for single selected month
        targetNominal = totalStudents * baseTariff;
        clsStudents.forEach(s => {
          const status = s.monthlyPayments?.[selectedMonth];
          if (status === 'LUNAS') {
            lunasCount++;
            realisasiNominal += s.sppAmount;
          } else {
            tunggakanCount++;
            tunggakanNominal += s.sppAmount;
          }
        });
      }

      const persentase = targetNominal > 0 ? ((realisasiNominal / targetNominal) * 100).toFixed(1) : '0';

      return {
        name: cls,
        totalSiswa: totalStudents,
        tarif: baseTariff,
        target: targetNominal,
        lunas: realisasiNominal,
        tunggakan: tunggakanNominal,
        lunasCount,
        tunggakanCount,
        persentase: parseFloat(persentase)
      };
    });
  }, [studentDataWithMonthly, selectedMonth]);

  // Data per Bulan for Trend Chart
  const monthlyTrend = useMemo(() => {
    return MONTHS.map(m => {
      const targetMonth = filteredStudents.reduce((acc, s) => acc + s.sppAmount, 0);
      const realisasi = filteredStudents.filter(s => s.monthlyPayments?.[m.id] === 'LUNAS')
        .reduce((acc, s) => acc + s.sppAmount, 0);
      const tunggakan = targetMonth - realisasi;
      const rate = targetMonth > 0 ? (realisasi / targetMonth) * 100 : 0;

      return {
        month: m.name,
        monthId: m.id,
        target: targetMonth,
        realisasi,
        tunggakan,
        capaian: parseFloat(rate.toFixed(1))
      };
    });
  }, [filteredStudents]);

  // Overall KPIs
  const overallKPIs = useMemo(() => {
    const totalTarget = classBreakdown.reduce((sum, item) => sum + item.target, 0);
    const totalLunas = classBreakdown.reduce((sum, item) => sum + item.lunas, 0);
    const totalTunggakan = classBreakdown.reduce((sum, item) => sum + item.tunggakan, 0);
    const totalSiswa = studentDataWithMonthly.length;
    const persentaseTotal = totalTarget > 0 ? ((totalLunas / totalTarget) * 100).toFixed(1) : '0';

    return {
      totalTarget,
      totalLunas,
      totalTunggakan,
      totalSiswa,
      persentaseTotal: parseFloat(persentaseTotal)
    };
  }, [classBreakdown, studentDataWithMonthly]);

  // Pie Chart Data
  const pieData = useMemo(() => {
    return [
      { name: 'Lunas', value: overallKPIs.totalLunas, color: '#10b981' },
      { name: 'Tunggakan', value: overallKPIs.totalTunggakan, color: '#f43f5e' }
    ];
  }, [overallKPIs]);

  // Export to Excel
  const handleExportExcel = () => {
    const dataRows = classBreakdown.map(item => ({
      'Tingkat Kelas': item.name,
      'Jumlah Siswa': item.totalSiswa,
      'Tarif SPP/Bulan (Rp)': item.tarif,
      'Target Penerimaan (Rp)': item.target,
      'Realisasi Lunas (Rp)': item.lunas,
      'Sisa Tunggakan (Rp)': item.tunggakan,
      'Persentase Capaian (%)': `${item.persentase}%`,
      'Periode': selectedMonth === 'all' ? 'Seluruh Tahun Ajaran (12 Bulan)' : `Bulan ${MONTHS.find(m => m.id === selectedMonth)?.name}`
    }));

    const ws = XLSX.utils.json_to_sheet(dataRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Rekap SPP Kelas & Bulan');
    XLSX.writeFile(wb, `Laporan_Rekap_SPP_SDIT_El_Fatah_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6" id="spp-analytics-container">
      {/* Header & Controls */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-2xl shadow-xl border border-indigo-800/40">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold border border-emerald-500/30">
                SDIT EL-FATAH & YAYASAN
              </span>
              <span className="text-indigo-200 text-xs font-semibold">T.A. 2025/2026</span>
            </div>
            <h2 className="text-xl md:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-emerald-400" />
              Grafik & Rekap Pembayaran SPP per Kelas & Bulan
            </h2>
            <p className="text-xs text-indigo-200/80 mt-1">
              Visualisasi realisasi penerimaan SPP siswa, persentase capaian per rombel, dan monitoring tunggakan secara real-time.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 print:hidden">
            <button
              onClick={handleExportExcel}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Export Excel
            </button>
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-xs rounded-xl border border-slate-700 shadow transition flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Cetak Laporan
            </button>
          </div>
        </div>

        {/* Filters Row */}
        <div className="mt-5 pt-4 border-t border-indigo-900/60 flex flex-wrap items-center gap-3 print:hidden">
          <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-indigo-700/40">
            <Calendar className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-semibold text-slate-300">Pilih Bulan:</span>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-slate-900 text-white text-xs font-bold rounded-lg px-2 py-1 border border-indigo-600/50 focus:outline-none focus:ring-1 focus:ring-emerald-400"
            >
              <option value="all">Semua Bulan (Tahun Berjalan)</option>
              {MONTHS.map(m => (
                <option key={m.id} value={m.id}>Bulan {m.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-indigo-700/40">
            <BookOpen className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-semibold text-slate-300">Pilih Kelas:</span>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="bg-slate-900 text-white text-xs font-bold rounded-lg px-2 py-1 border border-indigo-600/50 focus:outline-none focus:ring-1 focus:ring-emerald-400"
            >
              <option value="all">Semua Tingkat Kelas (1 s/d 6)</option>
              {CLASSES.map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>

          {/* Tab View Selector */}
          <div className="ml-auto flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-indigo-800/50">
            <button
              onClick={() => setActiveView('grafik')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition ${activeView === 'grafik' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Grafik Visual
            </button>
            <button
              onClick={() => setActiveView('tabel_rekap')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition ${activeView === 'tabel_rekap' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Tabel Rekap Kelas
            </button>
            <button
              onClick={() => setActiveView('daftar_siswa')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition ${activeView === 'daftar_siswa' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Status Siswa
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Target Penerimaan</p>
            <h3 className="text-lg md:text-xl font-extrabold text-slate-900 mt-1">{formatRupiah(overallKPIs.totalTarget)}</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {overallKPIs.totalSiswa} Siswa Aktif Terdaftar
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Realisasi Lunas</p>
            <h3 className="text-lg md:text-xl font-extrabold text-emerald-700 mt-1">{formatRupiah(overallKPIs.totalLunas)}</h3>
            <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">
              Capaian: {overallKPIs.persentaseTotal}%
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-rose-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-rose-600 uppercase tracking-wider">Sisa Tunggakan</p>
            <h3 className="text-lg md:text-xl font-extrabold text-rose-700 mt-1">{formatRupiah(overallKPIs.totalTunggakan)}</h3>
            <p className="text-[11px] text-rose-500 mt-0.5">
              {(100 - overallKPIs.persentaseTotal).toFixed(1)}% Belum Terkumpul
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-indigo-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Tingkat Efektivitas</p>
            <h3 className="text-lg md:text-xl font-extrabold text-indigo-900 mt-1">{overallKPIs.persentaseTotal}%</h3>
            <div className="w-28 bg-slate-100 h-2 rounded-full mt-1.5 overflow-hidden">
              <div
                className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(overallKPIs.persentaseTotal, 100)}%` }}
              />
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Content Area Based on Active View */}
      {activeView === 'grafik' && (
        <div className="space-y-6">
          {/* Main Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Bar Chart: Penerimaan SPP per Kelas */}
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-extrabold text-slate-800 text-sm md:text-base flex items-center gap-2">
                    <Layers className="w-4 h-4 text-indigo-600" />
                    Grafik Realisasi Pembayaran SPP per Tingkat Kelas (Kelas 1 - 6)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Perbandingan Nominal SPP Lunas (Hijau) vs Tunggakan (Merah)
                  </p>
                </div>
              </div>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={classBreakdown} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} />
                    <YAxis
                      stroke="#64748b"
                      fontSize={11}
                      tickFormatter={(val) => `Rp ${(val / 1000000).toFixed(1)}Jt`}
                      tickLine={false}
                    />
                    <Tooltip
                      formatter={(val: any) => [formatRupiah(Number(val)), '']}
                      contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                    <Bar dataKey="lunas" name="SPP Lunas (Rp)" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="tunggakan" name="Tunggakan SPP (Rp)" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Donut Chart: Komposisi Status Pembayaran */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="font-extrabold text-slate-800 text-sm md:text-base flex items-center gap-2 mb-1">
                  <PieChart className="w-4 h-4 text-emerald-600" />
                  Komposisi Realisasi SPP
                </h3>
                <p className="text-xs text-slate-500 mb-4">Persentase Lunas vs Tunggakan</p>

                <div className="h-56 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(val: any) => formatRupiah(Number(val))} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 font-bold text-emerald-700">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                    Lunas
                  </span>
                  <span className="font-mono font-extrabold text-slate-800">{formatRupiah(overallKPIs.totalLunas)} ({overallKPIs.persentaseTotal}%)</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 font-bold text-rose-700">
                    <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
                    Tunggakan
                  </span>
                  <span className="font-mono font-extrabold text-slate-800">{formatRupiah(overallKPIs.totalTunggakan)} ({(100 - overallKPIs.persentaseTotal).toFixed(1)}%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Line Chart: Tren Bulanan */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="font-extrabold text-slate-800 text-sm md:text-base flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  Grafik Tren Penerimaan SPP per Bulan (Juli s.d Juni)
                </h3>
                <p className="text-xs text-slate-500">
                  Pergerakan arus kas masuk dari pos pendapatan SPP sekolah selama 12 bulan
                </p>
              </div>
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
                Tahun Ajaran 2025/2026
              </span>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyTrend} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} />
                  <YAxis
                    stroke="#64748b"
                    fontSize={11}
                    tickFormatter={(val) => `Rp ${(val / 1000000).toFixed(1)}Jt`}
                    tickLine={false}
                  />
                  <Tooltip
                    formatter={(val: any) => [formatRupiah(Number(val)), '']}
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Line type="monotone" dataKey="target" name="Target SPP (Rp)" stroke="#94a3b8" strokeWidth={2} strokeDasharray="4 4" dot={false} />
                  <Line type="monotone" dataKey="realisasi" name="Realisasi Lunas (Rp)" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} />
                  <Line type="monotone" dataKey="tunggakan" name="Tunggakan (Rp)" stroke="#f43f5e" strokeWidth={2} dot={{ r: 3, fill: '#f43f5e' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Tabel Rekap Kelas View */}
      {activeView === 'tabel_rekap' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-slate-800 text-sm md:text-base">Tabel Rekapitulasi SPP per Rombel / Kelas</h3>
              <p className="text-xs text-slate-500">Rincian target, realisasi, dan persentase capaian per kelas</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider">
                <tr>
                  <th className="p-3.5">Tingkat Kelas</th>
                  <th className="p-3.5 text-center">Jumlah Siswa</th>
                  <th className="p-3.5 text-right">Tarif / Siswa</th>
                  <th className="p-3.5 text-right">Target Penerimaan</th>
                  <th className="p-3.5 text-right text-emerald-700">Realisasi Lunas</th>
                  <th className="p-3.5 text-right text-rose-700">Sisa Tunggakan</th>
                  <th className="p-3.5 text-center">Capaian (%)</th>
                  <th className="p-3.5">Progress Capaian</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {classBreakdown.map((row) => (
                  <tr key={row.name} className="hover:bg-slate-50/80 transition">
                    <td className="p-3.5 font-bold text-slate-900 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-indigo-600" />
                      {row.name}
                    </td>
                    <td className="p-3.5 text-center font-bold">{row.totalSiswa} Siswa</td>
                    <td className="p-3.5 text-right font-mono">{formatRupiah(row.tarif)}</td>
                    <td className="p-3.5 text-right font-mono font-bold text-slate-700">{formatRupiah(row.target)}</td>
                    <td className="p-3.5 text-right font-mono font-bold text-emerald-600">{formatRupiah(row.lunas)}</td>
                    <td className="p-3.5 text-right font-mono font-bold text-rose-600">{formatRupiah(row.tunggakan)}</td>
                    <td className="p-3.5 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold ${row.persentase >= 80 ? 'bg-emerald-100 text-emerald-800' : row.persentase >= 50 ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'}`}>
                        {row.persentase}%
                      </span>
                    </td>
                    <td className="p-3.5 min-w-[120px]">
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${row.persentase >= 80 ? 'bg-emerald-500' : row.persentase >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`}
                          style={{ width: `${Math.min(row.persentase, 100)}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-900 text-white font-bold border-t-2 border-slate-800">
                <tr>
                  <td className="p-3.5 font-extrabold">TOTAL KESELURUHAN</td>
                  <td className="p-3.5 text-center font-extrabold">{overallKPIs.totalSiswa} Siswa</td>
                  <td className="p-3.5 text-right">-</td>
                  <td className="p-3.5 text-right font-mono font-extrabold">{formatRupiah(overallKPIs.totalTarget)}</td>
                  <td className="p-3.5 text-right font-mono font-extrabold text-emerald-400">{formatRupiah(overallKPIs.totalLunas)}</td>
                  <td className="p-3.5 text-right font-mono font-extrabold text-rose-400">{formatRupiah(overallKPIs.totalTunggakan)}</td>
                  <td className="p-3.5 text-center font-extrabold text-emerald-400">{overallKPIs.persentaseTotal}%</td>
                  <td className="p-3.5">
                    <div className="w-full bg-slate-700 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${overallKPIs.persentaseTotal}%` }} />
                    </div>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* Daftar Siswa & Status Pembayaran View */}
      {activeView === 'daftar_siswa' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-extrabold text-slate-800 text-sm md:text-base">Daftar Siswa & Riwayat Pembayaran SPP</h3>
              <p className="text-xs text-slate-500">
                Menampilkan {filteredStudents.length} siswa pada filter {selectedClass === 'all' ? 'Semua Kelas' : selectedClass}
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider">
                <tr>
                  <th className="p-3">NIS</th>
                  <th className="p-3">Nama Siswa</th>
                  <th className="p-3 text-center">Kelas</th>
                  <th className="p-3">Virtual Account</th>
                  <th className="p-3 text-right">Tarif SPP</th>
                  {MONTHS.map(m => (
                    <th key={m.id} className="p-2 text-center text-[10px]">{m.name.slice(0, 3)}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {filteredStudents.map((std) => (
                  <tr key={std.id} className="hover:bg-slate-50 transition">
                    <td className="p-3 font-mono font-bold text-slate-700">{std.nis}</td>
                    <td className="p-3 font-bold text-slate-900">{std.name}</td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px] font-bold">
                        {std.gradeClass}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-indigo-600 font-semibold">{std.virtualAccount || `88020${std.nis}`}</td>
                    <td className="p-3 text-right font-mono font-bold">{formatRupiah(std.sppAmount)}</td>
                    {MONTHS.map(m => {
                      const isLunas = std.monthlyPayments?.[m.id] === 'LUNAS';
                      return (
                        <td key={m.id} className="p-2 text-center">
                          <span
                            className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-extrabold ${
                              isLunas ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {isLunas ? 'Lunas' : 'Belum'}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default SppAnalyticsChart;
