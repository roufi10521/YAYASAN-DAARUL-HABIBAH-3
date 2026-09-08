import ReactModule, { useState as fallbackUseState, useMemo as fallbackUseMemo } from 'react';
import {
  Coins,
  CheckCircle2,
  AlertCircle,
  Clock,
  Printer,
  Calendar,
  Search,
  Receipt,
  CreditCard,
  Building,
  School,
  FileSpreadsheet
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { saveDocument } from '../services/firestoreSync';

export interface SppPaymentRecord {
  id: string;
  studentId: string;
  studentName: string;
  gradeClass: string;
  nis: string;
  monthsPaid: string[]; // e.g. ["Juli", "Agustus"]
  amount: number;
  date: string;
  receiptNo: string;
  paymentMethod: 'Tunai Kasir' | 'Transfer BSI' | 'Virtual Account' | 'Potongan Beasiswa';
  notes?: string;
  receivedBy: string;
}

export interface StudentSppData {
  id: string;
  nis: string;
  name: string;
  gradeClass: string;
  sppAmount: number;
  sppStatus?: 'LUNAS' | 'MENUNGGU' | 'TUNGGAKAN';
  parentName?: string;
  contactPhone?: string;
  virtualAccount?: string;
}

interface IntegratedSppModuleProps {
  React?: any;
  students: StudentSppData[];
  payments: SppPaymentRecord[];
  onAddPayment: (payment: SppPaymentRecord) => void;
  onUpdateStudentStatus: (studentId: string, status: 'LUNAS' | 'MENUNGGU' | 'TUNGGAKAN') => void;
  foundationProfile?: any;
  currentRole: string;
}

export const MONTHS_ACADEMIC = [
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni'
];

export const IntegratedSppModule: React.FC<IntegratedSppModuleProps> = (props) => {
  const {
    students,
    payments,
    onAddPayment,
    onUpdateStudentStatus,
    foundationProfile,
    currentRole
  } = props;

  const ActiveReact = props?.React || (typeof window !== "undefined" && (window as any).__AppReact) || ReactModule;
  const useState = ActiveReact?.useState ? ActiveReact.useState.bind(ActiveReact) : fallbackUseState;
  const useMemo = ActiveReact?.useMemo ? ActiveReact.useMemo.bind(ActiveReact) : fallbackUseMemo;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('SEMUA');
  const [selectedStudentForPay, setSelectedStudentForPay] = useState<StudentSppData | null>(null);
  const [selectedMonthsToPay, setSelectedMonthsToPay] = useState<string[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<SppPaymentRecord['paymentMethod']>('Transfer BSI');
  const [paymentNotes, setPaymentNotes] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedReceiptPayment, setSelectedReceiptPayment] = useState<SppPaymentRecord | null>(null);

  // Map studentId -> list of paid months derived from real payments
  const studentPaidMonthsMap = useMemo(() => {
    const map = new Map<string, Set<string>>();
    payments.forEach((p) => {
      if (!map.has(p.studentId)) {
        map.set(p.studentId, new Set<string>());
      }
      const set = map.get(p.studentId)!;
      p.monthsPaid.forEach((m) => set.add(m));
    });
    return map;
  }, [payments]);

  // Map studentId -> list of payment transactions
  const studentPaymentsMap = useMemo(() => {
    const map = new Map<string, SppPaymentRecord[]>();
    payments.forEach((p) => {
      if (!map.has(p.studentId)) {
        map.set(p.studentId, []);
      }
      map.get(p.studentId)!.push(p);
    });
    return map;
  }, [payments]);

  // Filtered Students
  const filteredStudents = useMemo(() => {
    return students.filter((st) => {
      const matchSearch =
        st.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        st.nis.includes(searchQuery) ||
        (st.parentName && st.parentName.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchClass = selectedClass === 'SEMUA' || st.gradeClass === selectedClass;
      return matchSearch && matchClass;
    });
  }, [students, searchQuery, selectedClass]);

  // Overall Stats
  const totalRevenue = useMemo(() => {
    return payments.reduce((acc, p) => acc + p.amount, 0);
  }, [payments]);

  const totalPossibleTarget = useMemo(() => {
    return students.reduce((acc, st) => acc + (st.sppAmount || 250000) * 12, 0);
  }, [students]);

  // Open Payment Modal for a Student
  const handleOpenPay = (student: StudentSppData) => {
    setSelectedStudentForPay(student);
    const paidSet = studentPaidMonthsMap.get(student.id) || new Set();
    // Cari bulan pertama yang belum lunas
    const firstUnpaid = MONTHS_ACADEMIC.find((m) => !paidSet.has(m));
    setSelectedMonthsToPay(firstUnpaid ? [firstUnpaid] : []);
    setPaymentNotes('');
    setShowPaymentModal(true);
  };

  // Toggle Month in Payment Modal
  const handleToggleMonth = (m: string) => {
    if (selectedMonthsToPay.includes(m)) {
      setSelectedMonthsToPay(selectedMonthsToPay.filter((item) => item !== m));
    } else {
      setSelectedMonthsToPay([...selectedMonthsToPay, m]);
    }
  };

  // Submit Payment
  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentForPay || selectedMonthsToPay.length === 0) {
      alert('Pilih minimal 1 bulan yang akan dibayar.');
      return;
    }

    const singleAmount = selectedStudentForPay.sppAmount || 250000;
    const totalAmount = singleAmount * selectedMonthsToPay.length;
    const receiptNo = `KWT-SPP-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(payments.length + 101).padStart(3, '0')}`;

    const newRec: SppPaymentRecord = {
      id: `pay-${Date.now()}`,
      studentId: selectedStudentForPay.id,
      studentName: selectedStudentForPay.name,
      gradeClass: selectedStudentForPay.gradeClass,
      nis: selectedStudentForPay.nis,
      monthsPaid: selectedMonthsToPay,
      amount: totalAmount,
      date: new Date().toISOString().slice(0, 10),
      receiptNo,
      paymentMethod,
      notes: paymentNotes || `Pembayaran SPP Bulan ${selectedMonthsToPay.join(', ')}`,
      receivedBy: currentRole === 'BENDAHARA_SEKOLAH' ? 'Bendahara Sekolah' : 'Kasir Keuangan SDIT'
    };

    onAddPayment(newRec);
    await saveDocument('spp_payments', newRec.id, newRec);

    // Update status student jika sudah bayar minimal s.d bulan berjalan
    const currentlyPaidCount = (studentPaidMonthsMap.get(selectedStudentForPay.id)?.size || 0) + selectedMonthsToPay.length;
    const newStatus = currentlyPaidCount >= 6 ? 'LUNAS' : currentlyPaidCount > 0 ? 'MENUNGGU' : 'TUNGGAKAN';
    onUpdateStudentStatus(selectedStudentForPay.id, newStatus);
    await saveDocument('students', selectedStudentForPay.id, { sppStatus: newStatus });

    setShowPaymentModal(false);
    setSelectedReceiptPayment(newRec);
  };

  // Cetak Kuitansi
  const handlePrintReceipt = (rec: SppPaymentRecord) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const schoolName = foundationProfile?.name || 'SDIT EL FATAH';
    const yayasanName = foundationProfile?.foundationName || 'YAYASAN PENDIDIKAN DAARUL HABIBAH';
    const address = foundationProfile?.address || 'Jl. Raya Serang - Pandeglang Km. 5, Kota Serang';

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Kuitansi Pembayaran SPP - ${rec.receiptNo}</title>
        <style>
          @page { size: A5 landscape; margin: 10mm; }
          body { font-family: Arial, sans-serif; font-size: 11pt; color: #111; margin: 0; padding: 15px; }
          .header { border-bottom: 2px solid #065f46; padding-bottom: 8px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center; }
          .title { font-size: 14pt; font-weight: bold; color: #065f46; margin: 0; }
          .sub { font-size: 9pt; color: #555; margin: 2px 0 0 0; }
          .kwt-box { border: 1px solid #ddd; background: #fafafa; padding: 15px; border-radius: 8px; margin-bottom: 15px; }
          table { width: 100%; border-collapse: collapse; }
          td { padding: 5px 4px; vertical-align: top; }
          .label { width: 30%; font-weight: bold; color: #444; }
          .amount-box { background: #ecfdf5; border: 2px solid #059669; padding: 8px 12px; font-size: 13pt; font-weight: bold; color: #065f46; display: inline-block; border-radius: 6px; }
          .footer { display: flex; justify-content: space-between; margin-top: 25px; text-align: center; }
          .ttd-box { width: 45%; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="title">${schoolName}</div>
            <div class="sub">${yayasanName} - ${address}</div>
          </div>
          <div style="text-align: right;">
            <strong style="font-size: 12pt; color: #065f46;">KUITANSI RESMI SPP</strong><br/>
            <span style="font-family: monospace; font-size: 10pt;">${rec.receiptNo}</span>
          </div>
        </div>

        <div class="kwt-box">
          <table>
            <tr>
              <td class="label">Telah Diterima Dari:</td>
              <td><strong>${rec.studentName}</strong> (NIS: ${rec.nis})</td>
            </tr>
            <tr>
              <td class="label">Rombongan Belajar:</td>
              <td>${rec.gradeClass}</td>
            </tr>
            <tr>
              <td class="label">Untuk Pembayaran:</td>
              <td><strong>SPP Bulan: ${rec.monthsPaid.join(', ')}</strong></td>
            </tr>
            <tr>
              <td class="label">Metode Pembayaran:</td>
              <td>${rec.paymentMethod}</td>
            </tr>
            <tr>
              <td class="label">Catatan Transaksi:</td>
              <td>${rec.notes || '-'}</td>
            </tr>
            <tr>
              <td class="label">Jumlah Nominal:</td>
              <td>
                <div class="amount-box">Rp ${rec.amount.toLocaleString('id-ID')}</div>
              </td>
            </tr>
          </table>
        </div>

        <div class="footer">
          <div class="ttd-box">
            <p>Penyetor / Orang Tua,</p>
            <br/><br/>
            <p>( .................................... )</p>
          </div>
          <div class="ttd-box">
            <p>Kota Serang, ${rec.date}<br/>Penerima (Kasir/Bendahara),</p>
            <br/><br/>
            <p><strong>( ${rec.receivedBy} )</strong></p>
          </div>
        </div>

        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Ekspor Excel Rekap SPP
  const handleExportSppExcel = () => {
    const data = students.map((st, i) => {
      const paidSet = studentPaidMonthsMap.get(st.id) || new Set();
      const paidCount = paidSet.size;
      const totalPaid = paidCount * (st.sppAmount || 250000);
      const arrears = (12 - paidCount) * (st.sppAmount || 250000);

      const row: any = {
        'No': i + 1,
        'NIS': st.nis,
        'Nama Siswa': st.name,
        'Kelas': st.gradeClass,
        'Tarif SPP/Bulan': st.sppAmount || 250000,
        'Bulan Terbayar': `${paidCount} dari 12 Bulan`,
        'Total Terbayar (Rp)': totalPaid,
        'Sisa Tunggakan (Rp)': arrears,
        'Status': paidCount >= 6 ? 'LUNAS' : paidCount > 0 ? 'MENUNGGU' : 'TUNGGAKAN'
      };

      MONTHS_ACADEMIC.forEach((m) => {
        row[m] = paidSet.has(m) ? 'LUNAS' : 'BELUM';
      });

      return row;
    });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Matriks SPP 12 Bulan');
    XLSX.writeFile(wb, `Rekap_Pembayaran_SPP_Terintegrasi_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-6 md:p-8 rounded-3xl shadow-xl border border-emerald-700/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold mb-2 border border-emerald-400/30">
            <Coins className="w-3.5 h-3.5" /> Modul Keuangan Terintegrasi
          </div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight">
            Matriks Pembayaran SPP 12 Bulan Terintegrasi
          </h2>
          <p className="text-xs md:text-sm text-emerald-100/80 mt-1 max-w-2xl">
            Tabel SPP kini dihitung <strong>100% dari catatan riil pembayaran di database</strong> (bukan angka perkiraan). Setiap pencatatan menghasilkan nomor kuitansi, memotong tunggakan, dan sinkron otomatis ke pembukaan E-Rapor.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={handleExportSppExcel}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-600 transition flex items-center gap-2 cursor-pointer shadow active:scale-95"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Ekspor Rekap SPP (Excel)</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-500 block uppercase">Realisasi SPP Terkumpul</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-emerald-700">
              Rp {totalRevenue.toLocaleString('id-ID')}
            </span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Dari {payments.length} transaksi pembayaran tercatat
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-500 block uppercase">Target 1 Tahun Ajaran</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-slate-900">
              Rp {totalPossibleTarget.toLocaleString('id-ID')}
            </span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {students.length} siswa x 12 bulan
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-500 block uppercase">Capaian Penerimaan</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-blue-700">
              {totalPossibleTarget > 0 ? Math.round((totalRevenue / totalPossibleTarget) * 100) : 0}%
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 mt-2">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: `${Math.min(100, (totalRevenue / (totalPossibleTarget || 1)) * 100)}%` }}
            />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-500 block uppercase">Total Transaksi Masuk</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-purple-700">{payments.length}</span>
            <span className="text-xs text-slate-400">lembar kuitansi</span>
          </div>
          <span className="text-[11px] text-emerald-600 mt-1 block font-semibold">
            ✓ Terhubung ke Jurnal Kas
          </span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama siswa, NIS, atau orang tua..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs text-slate-600 font-semibold">Rombel:</span>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-emerald-600 cursor-pointer"
          >
            <option value="SEMUA">Semua Kelas ({students.length} Siswa)</option>
            <option value="Kelas 1">Kelas 1</option>
            <option value="Kelas 2">Kelas 2</option>
            <option value="Kelas 3">Kelas 3</option>
            <option value="Kelas 4">Kelas 4</option>
            <option value="Kelas 5">Kelas 5</option>
            <option value="Kelas 6">Kelas 6</option>
          </select>
        </div>
      </div>

      {/* Student Cards with 12-Month Matrix */}
      <div className="space-y-4">
        {filteredStudents.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 text-slate-500">
            Tidak ada data siswa yang cocok dengan kriteria filter.
          </div>
        ) : (
          filteredStudents.map((st) => {
            const paidSet = studentPaidMonthsMap.get(st.id) || new Set();
            const paidCount = paidSet.size;
            const singleFee = st.sppAmount || 250000;
            const totalPaidAmount = paidCount * singleFee;
            const unpaidCount = Math.max(0, 12 - paidCount);
            const unpaidAmount = unpaidCount * singleFee;
            const stPayments = studentPaymentsMap.get(st.id) || [];

            return (
              <div
                key={st.id}
                className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 md:p-6 space-y-4 hover:shadow-md transition"
              >
                {/* Student Info Bar */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-extrabold text-xs">
                        {st.gradeClass}
                      </span>
                      <span className="font-mono text-xs text-slate-500 font-bold">
                        NIS: {st.nis}
                      </span>
                      <span
                        className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase ${
                          paidCount >= 6
                            ? 'bg-emerald-100 text-emerald-800'
                            : paidCount > 0
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        Status: {paidCount >= 6 ? 'LUNAS (E-Rapor Terbuka)' : paidCount > 0 ? 'MENUNGGU' : 'TUNGGAKAN'}
                      </span>
                    </div>

                    <h3 className="text-lg font-black text-slate-900">{st.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Orang Tua: <strong>{st.parentName || 'Bpk/Ibu Wali'}</strong> • Tarif SPP: <strong className="text-slate-800">Rp {singleFee.toLocaleString('id-ID')} / bulan</strong>
                    </p>
                  </div>

                  {/* Quick Summary Badges & Pay Button */}
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-2xl">
                      <span className="text-[10px] font-bold text-emerald-800 uppercase block">Terbayar Riil</span>
                      <span className="text-sm font-black text-emerald-700">
                        Rp {totalPaidAmount.toLocaleString('id-ID')}{' '}
                        <span className="text-xs font-semibold">({paidCount} bln)</span>
                      </span>
                    </div>

                    <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-2xl">
                      <span className="text-[10px] font-bold text-rose-800 uppercase block">Sisa Tunggakan</span>
                      <span className="text-sm font-black text-rose-700">
                        Rp {unpaidAmount.toLocaleString('id-ID')}{' '}
                        <span className="text-xs font-semibold">({unpaidCount} bln)</span>
                      </span>
                    </div>

                    <button
                      onClick={() => handleOpenPay(st)}
                      className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow transition cursor-pointer flex items-center gap-1.5 shrink-0"
                    >
                      <Receipt className="w-4 h-4" />
                      <span>Catat Pembayaran SPP</span>
                    </button>
                  </div>
                </div>

                {/* 12-Month Matrix Grid */}
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                    Matriks Realisasi 12 Bulan (T.A. 2026/2027)
                  </span>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
                    {MONTHS_ACADEMIC.map((m) => {
                      const isPaid = paidSet.has(m);
                      // cari transaksi yang membayar bulan ini
                      const matchingPayment = stPayments.find((p) => p.monthsPaid.includes(m));

                      return (
                        <div
                          key={m}
                          className={`p-3 rounded-2xl border transition flex flex-col justify-between gap-1.5 ${
                            isPaid
                              ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                              : 'bg-slate-50 border-slate-200 text-slate-500'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-xs">{m}</span>
                            {isPaid ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            ) : (
                              <Clock className="w-4 h-4 text-slate-300 shrink-0" />
                            )}
                          </div>

                          <div>
                            <span
                              className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full inline-block ${
                                isPaid ? 'bg-emerald-200 text-emerald-900' : 'bg-slate-200 text-slate-600'
                              }`}
                            >
                              {isPaid ? 'LUNAS' : 'BELUM BAYAR'}
                            </span>
                            <p className="text-[10px] font-mono font-bold mt-1 text-slate-700">
                              Rp {singleFee.toLocaleString('id-ID')}
                            </p>
                          </div>

                          {isPaid && matchingPayment && (
                            <div className="pt-1.5 border-t border-emerald-200/60 flex items-center justify-between text-[9px] text-emerald-800">
                              <span className="truncate" title={matchingPayment.receiptNo}>
                                {matchingPayment.receiptNo}
                              </span>
                              <button
                                onClick={() => handlePrintReceipt(matchingPayment)}
                                className="text-emerald-700 hover:text-emerald-900 font-bold underline"
                                title="Cetak Kuitansi"
                              >
                                Kuitansi
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* History of receipts if any */}
                {stPayments.length > 0 && (
                  <div className="bg-slate-50/80 rounded-2xl p-3.5 border border-slate-100 flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-bold text-slate-500 text-[11px]">Riwayat Kuitansi:</span>
                    {stPayments.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => handlePrintReceipt(p)}
                        className="px-2.5 py-1 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-emerald-800 rounded-lg text-[11px] font-mono font-bold transition flex items-center gap-1 cursor-pointer"
                      >
                        <Printer className="w-3 h-3 text-emerald-600" />
                        <span>{p.receiptNo} ({p.monthsPaid.join(', ')})</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Modal Catat Pembayaran SPP */}
      {showPaymentModal && selectedStudentForPay && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 my-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <span className="text-xs font-bold text-emerald-700 uppercase">Input Transaksi Kasir SPP</span>
                <h3 className="text-lg font-black text-slate-900">{selectedStudentForPay.name}</h3>
              </div>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitPayment} className="space-y-4 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex justify-between items-center">
                <div>
                  <span className="text-slate-500 block">Kelas / NIS:</span>
                  <strong className="text-slate-800">{selectedStudentForPay.gradeClass} - NIS: {selectedStudentForPay.nis}</strong>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 block">Tarif Per Bulan:</span>
                  <strong className="text-emerald-700">Rp {(selectedStudentForPay.sppAmount || 250000).toLocaleString('id-ID')}</strong>
                </div>
              </div>

              {/* Selector Bulan yang Dibayar */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  Pilih Bulan yang Dibayarkan (Bisa lebih dari 1 bulan):
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
                  {MONTHS_ACADEMIC.map((m) => {
                    const alreadyPaid = studentPaidMonthsMap.get(selectedStudentForPay.id)?.has(m);
                    const isSelected = selectedMonthsToPay.includes(m);

                    return (
                      <button
                        key={m}
                        type="button"
                        disabled={alreadyPaid}
                        onClick={() => handleToggleMonth(m)}
                        className={`p-2 rounded-xl border text-center font-bold text-xs transition cursor-pointer ${
                          alreadyPaid
                            ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed line-through'
                            : isSelected
                            ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-emerald-50'
                        }`}
                      >
                        {m}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Metode Pembayaran</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
                  >
                    <option value="Transfer BSI">Transfer Bank Syariah (BSI)</option>
                    <option value="Tunai Kasir">Tunai di Kasir Sekolah</option>
                    <option value="Virtual Account">Virtual Account Siswa</option>
                    <option value="Potongan Beasiswa">Potongan Beasiswa / Tahfidz</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Total Pembayaran</label>
                  <div className="px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 font-black text-sm">
                    Rp {((selectedStudentForPay.sppAmount || 250000) * selectedMonthsToPay.length).toLocaleString('id-ID')}
                    <span className="text-xs font-normal text-slate-500 block">
                      ({selectedMonthsToPay.length} bulan terpilih)
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Catatan Kuitansi / Keterangan</label>
                <input
                  type="text"
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  placeholder="Contoh: Pembayaran tunai via wali murid di TU"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="px-4 py-2 bg-slate-200 text-slate-800 font-bold rounded-xl text-xs hover:bg-slate-300 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl text-xs shadow transition cursor-pointer"
                >
                  Simpan Transaksi & Terbitkan Kuitansi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Cetak Kuitansi Selesai Transaksi */}
      {selectedReceiptPayment && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-lg font-black text-slate-900">Pembayaran Berhasil Dicatat!</h3>
              <p className="text-xs text-slate-500 mt-1">
                Nomor Kuitansi: <span className="font-mono font-bold text-emerald-800">{selectedReceiptPayment.receiptNo}</span>
              </p>
              <p className="text-xs text-slate-600 mt-1">
                Siswa: <strong>{selectedReceiptPayment.studentName}</strong> ({selectedReceiptPayment.monthsPaid.join(', ')})
              </p>
              <p className="text-sm font-black text-emerald-700 mt-2">
                Total: Rp {selectedReceiptPayment.amount.toLocaleString('id-ID')}
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setSelectedReceiptPayment(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl transition cursor-pointer"
              >
                Selesai
              </button>
              <button
                onClick={() => handlePrintReceipt(selectedReceiptPayment)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow transition cursor-pointer flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Kuitansi Sekarang</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IntegratedSppModule;
