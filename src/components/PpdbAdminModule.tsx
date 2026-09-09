import React, { useState as fallbackUseState } from 'react';
import {
  Users,
  Search,
  CheckCircle,
  Clock,
  UserPlus,
  FileSpreadsheet,
  Printer,
  FileText,
  Phone,
  GraduationCap,
  ShieldCheck,
  Check,
  UserCheck,
  Building,
  School
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { saveDocument } from '../services/firestoreSync';

export interface PpdbApplicant {
  id: string;
  nomorRegistrasi: string;
  namaLengkap: string;
  nisnAsal?: string;
  nik?: string;
  tempatLahir?: string;
  tanggalLahir?: string;
  jenisKelamin?: 'L' | 'P';
  sekolahAsal?: string;
  pilihanJurusanKelas: string;
  jalurPendaftaran?: 'Reguler' | 'Tahfidz & Qur\'an' | 'Prestasi Akademik' | 'Afirmasi';
  namaOrangTua: string;
  pekerjaanOrangTua?: string;
  noHpOrangTua: string;
  alamat?: string;
  tanggalDaftar: string;
  status: 'Menunggu Verifikasi' | 'Berkas Lengkap' | 'Lulus Seleksi' | 'Diterima' | 'Ditolak';
  berkas: {
    ijazah?: boolean;
    kk?: boolean;
    akta?: boolean;
    pasFoto?: boolean;
  };
  catatanPanitia?: string;
}

interface PpdbAdminModuleProps {
  React?: any;
  ppdbList: PpdbApplicant[];
  onUpdateApplicant: (applicant: PpdbApplicant) => void;
  onAddApplicant: (applicant: PpdbApplicant) => void;
  onAdmitToStudents: (applicant: PpdbApplicant, assignedClass: string) => void;
  foundationProfile?: any;
  currentRole: string;
}

export const PpdbAdminModule: React.FC<PpdbAdminModuleProps> = (props) => {
  const {
    ppdbList,
    onUpdateApplicant,
    onAddApplicant,
    onAdmitToStudents,
    foundationProfile,
    currentRole
  } = props;

  const ActiveReact = props?.React || (typeof window !== "undefined" && (window as any).__AppReact) || React;
  const useState = ActiveReact?.useState ? ActiveReact.useState.bind(ActiveReact) : fallbackUseState;

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('SEMUA');
  const [filterJalur, setFilterJalur] = useState<string>('SEMUA');
  const [selectedApplicant, setSelectedApplicant] = useState<PpdbApplicant | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAdmitModal, setShowAdmitModal] = useState(false);
  const [applicantToAdmit, setApplicantToAdmit] = useState<PpdbApplicant | null>(null);
  const [assignedClass, setAssignedClass] = useState('Kelas 1 A');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form Tambah Baru Manual
  const [newApplicant, setNewApplicant] = useState<Partial<PpdbApplicant>>({
    namaLengkap: '',
    nisnAsal: '',
    nik: '',
    jenisKelamin: 'L',
    tempatLahir: 'Serang',
    tanggalLahir: '2019-05-10',
    sekolahAsal: 'TK / RA Setempat',
    pilihanJurusanKelas: 'SDIT - Kelas 1 (Tahfidz & Coding)',
    jalurPendaftaran: 'Reguler',
    namaOrangTua: '',
    noHpOrangTua: '',
    alamat: '',
    status: 'Menunggu Verifikasi',
    berkas: { ijazah: false, kk: false, akta: false, pasFoto: false }
  });

  // Filtered List
  const filteredList = ppdbList.filter((item) => {
    const matchesSearch =
      item.namaLengkap.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.nomorRegistrasi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.nisnAsal && item.nisnAsal.includes(searchQuery)) ||
      item.namaOrangTua.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.noHpOrangTua && item.noHpOrangTua.includes(searchQuery));

    const matchesStatus = filterStatus === 'SEMUA' || item.status === filterStatus;
    const matchesJalur = filterJalur === 'SEMUA' || item.jalurPendaftaran === filterJalur;

    return matchesSearch && matchesStatus && matchesJalur;
  });

  // Statistics
  const totalApplicants = ppdbList.length;
  const countMenunggu = ppdbList.filter((a) => a.status === 'Menunggu Verifikasi').length;
  const countBerkasLengkap = ppdbList.filter((a) => a.status === 'Berkas Lengkap').length;
  const countLulus = ppdbList.filter((a) => a.status === 'Lulus Seleksi').length;
  const countDiterima = ppdbList.filter((a) => a.status === 'Diterima').length;
  const countDitolak = ppdbList.filter((a) => a.status === 'Ditolak').length;

  // Ubah status cepat
  const handleStatusChange = async (applicant: PpdbApplicant, newStatus: PpdbApplicant['status']) => {
    const updated = { ...applicant, status: newStatus };
    onUpdateApplicant(updated);
    // Simpan juga ke Firestore
    await saveDocument('ppdb_registrations', updated.id, updated);
  };

  // Toggle Berkas
  const handleToggleBerkas = async (applicant: PpdbApplicant, docKey: keyof PpdbApplicant['berkas']) => {
    const updatedBerkas = {
      ...applicant.berkas,
      [docKey]: !applicant.berkas?.[docKey]
    };
    const updated = { ...applicant, berkas: updatedBerkas };
    onUpdateApplicant(updated);
    await saveDocument('ppdb_registrations', updated.id, updated);
  };

  // Ekspor Excel
  const handleExportExcel = () => {
    const dataToExport = ppdbList.map((item, index) => ({
      'No': index + 1,
      'No. Registrasi': item.nomorRegistrasi,
      'Tanggal Daftar': item.tanggalDaftar,
      'Nama Calon Siswa': item.namaLengkap,
      'Jenis Kelamin': item.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan',
      'NISN': item.nisnAsal || '-',
      'NIK': item.nik || '-',
      'Tempat, Tanggal Lahir': `${item.tempatLahir || '-'}, ${item.tanggalLahir || '-'}`,
      'Asal Sekolah': item.sekolahAsal || '-',
      'Jalur': item.jalurPendaftaran || 'Reguler',
      'Pilihan Kelas': item.pilihanJurusanKelas,
      'Nama Orang Tua / Wali': item.namaOrangTua,
      'No. HP / WhatsApp': item.noHpOrangTua,
      'Alamat': item.alamat || '-',
      'Status': item.status,
      'Ijazah': item.berkas?.ijazah ? 'Ada' : 'Belum',
      'Kartu Keluarga': item.berkas?.kk ? 'Ada' : 'Belum',
      'Akta Kelahiran': item.berkas?.akta ? 'Ada' : 'Belum',
      'Pas Foto': item.berkas?.pasFoto ? 'Ada' : 'Belum'
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Pendaftar PPDB 2026');
    XLSX.writeFile(wb, `Data_Pendaftar_PPDB_SDIT_El_Fatah_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  // Cetak Lembar Kelulusan / Formulir
  const handlePrintApplicant = (applicant: PpdbApplicant) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const schoolName = foundationProfile?.name || 'SDIT EL FATAH';
    const yayasanName = foundationProfile?.foundationName || 'YAYASAN PENDIDIKAN DAARUL HABIBAH';
    const address = foundationProfile?.address || 'Jl. Raya Serang - Pandeglang Km. 5, Kota Serang, Banten';
    const phone = foundationProfile?.phone || '(0254) 8241234';

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Bukti Pendaftaran & Hasil Seleksi PPDB - ${applicant.namaLengkap}</title>
        <style>
          @page { size: A4 portrait; margin: 15mm; }
          body { font-family: 'Times New Roman', Times, serif; font-size: 12pt; line-height: 1.4; color: #000; margin: 0; padding: 20px; }
          .kop { text-align: center; border-bottom: 3px double #000; padding-bottom: 8px; margin-bottom: 20px; }
          .kop h2 { margin: 0; font-size: 15pt; font-weight: bold; }
          .kop h1 { margin: 2px 0; font-size: 18pt; font-weight: bold; color: #065f46; }
          .kop p { margin: 0; font-size: 9.5pt; }
          .title { text-align: center; font-size: 14pt; font-weight: bold; text-decoration: underline; margin-bottom: 4px; }
          .subtitle { text-align: center; font-size: 11pt; margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
          td { padding: 6px 4px; vertical-align: top; }
          .label { width: 35%; font-weight: bold; }
          .val { width: 65%; }
          .badge-status { display: inline-block; padding: 4px 12px; font-weight: bold; font-size: 12pt; border: 2px solid #000; text-transform: uppercase; }
          .ttd-box { margin-top: 40px; display: flex; justify-content: space-between; text-align: center; }
          .ttd-col { width: 45%; }
          .qr-placeholder { border: 1px solid #ccc; width: 80px; height: 80px; display: inline-flex; align-items: center; justify-content: center; font-size: 8pt; }
        </style>
      </head>
      <body>
        <div class="kop">
          <h2>${yayasanName}</h2>
          <h1>${schoolName}</h1>
          <p>${address} | Telp: ${phone} | Email: sdit.elfatah@daarulhabibah.sch.id</p>
          <p>NPSN: 69981234 | NSS: 102280401001 | Status Akreditasi: A (Unggul)</p>
        </div>

        <div class="title">LEMBAR BUKTI PENDAFTARAN & KELULUSAN PPDB</div>
        <div class="subtitle">TAHUN AJARAN 2026 / 2027</div>

        <table>
          <tr>
            <td class="label">Nomor Registrasi PPDB</td>
            <td class="val"><strong>${applicant.nomorRegistrasi}</strong></td>
          </tr>
          <tr>
            <td class="label">Tanggal Pendaftaran</td>
            <td class="val">${applicant.tanggalDaftar}</td>
          </tr>
          <tr>
            <td class="label">Jalur Pendaftaran</td>
            <td class="val">${applicant.jalurPendaftaran || 'Reguler'}</td>
          </tr>
          <tr>
            <td class="label">Nama Lengkap Calon Siswa</td>
            <td class="val"><strong>${applicant.namaLengkap}</strong></td>
          </tr>
          <tr>
            <td class="label">Jenis Kelamin</td>
            <td class="val">${applicant.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</td>
          </tr>
          <tr>
            <td class="label">NISN / NIK</td>
            <td class="val">${applicant.nisnAsal || '-'} / ${applicant.nik || '-'}</td>
          </tr>
          <tr>
            <td class="label">Tempat, Tanggal Lahir</td>
            <td class="val">${applicant.tempatLahir || '-'}, ${applicant.tanggalLahir || '-'}</td>
          </tr>
          <tr>
            <td class="label">Asal Satuan TK / RA</td>
            <td class="val">${applicant.sekolahAsal || '-'}</td>
          </tr>
          <tr>
            <td class="label">Nama Orang Tua / Wali</td>
            <td class="val">${applicant.namaOrangTua}</td>
          </tr>
          <tr>
            <td class="label">Kontak HP / WhatsApp</td>
            <td class="val">${applicant.noHpOrangTua}</td>
          </tr>
          <tr>
            <td class="label">Alamat Tinggal</td>
            <td class="val">${applicant.alamat || '-'}</td>
          </tr>
          <tr>
            <td class="label">Status Verifikasi & Seleksi</td>
            <td class="val">
              <span class="badge-status">${applicant.status}</span>
            </td>
          </tr>
        </table>

        <div style="background-color: #f9f9f9; border: 1px solid #ddd; padding: 10px; font-size: 10pt; margin-top: 15px;">
          <strong>Kelengkapan Berkas Persyaratan:</strong><br/>
          • Surat Keterangan Lulus / Ijazah: ${applicant.berkas?.ijazah ? '✓ Lengkap' : '✗ Belum Diserahkan'}<br/>
          • Fotokopi Kartu Keluarga (KK): ${applicant.berkas?.kk ? '✓ Lengkap' : '✗ Belum Diserahkan'}<br/>
          • Fotokopi Akta Kelahiran: ${applicant.berkas?.akta ? '✓ Lengkap' : '✗ Belum Diserahkan'}<br/>
          • Pas Foto Berwarna 3x4: ${applicant.berkas?.pasFoto ? '✓ Lengkap' : '✗ Belum Diserahkan'}
        </div>

        <div class="ttd-box">
          <div class="ttd-col">
            <p>Orang Tua / Wali Calon Siswa,</p>
            <br/><br/><br/>
            <p><strong>( ${applicant.namaOrangTua} )</strong></p>
          </div>
          <div class="ttd-col">
            <p>Kota Serang, ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}<br/>Ketua Panitia PPDB,</p>
            <br/><br/><br/>
            <p><strong>( H. Ahmad Fathoni, M.Pd. )</strong><br/>NIPY: 198507122010011001</p>
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

  // Submit Tambah Baru
  const handleAddNewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newApplicant.namaLengkap || !newApplicant.namaOrangTua) {
      alert('Mohon isi nama calon siswa dan nama orang tua.');
      return;
    }

    const regNo = `PPDB-2026-${String(ppdbList.length + 101).padStart(3, '0')}`;
    const applicant: PpdbApplicant = {
      id: `ppdb-${Date.now()}`,
      nomorRegistrasi: regNo,
      namaLengkap: newApplicant.namaLengkap || '',
      nisnAsal: newApplicant.nisnAsal || '',
      nik: newApplicant.nik || '',
      jenisKelamin: newApplicant.jenisKelamin || 'L',
      tempatLahir: newApplicant.tempatLahir || 'Serang',
      tanggalLahir: newApplicant.tanggalLahir || '2019-05-10',
      sekolahAsal: newApplicant.sekolahAsal || '',
      pilihanJurusanKelas: newApplicant.pilihanJurusanKelas || 'SDIT - Kelas 1 (Tahfidz & Coding)',
      jalurPendaftaran: newApplicant.jalurPendaftaran || 'Reguler',
      namaOrangTua: newApplicant.namaOrangTua || '',
      noHpOrangTua: newApplicant.noHpOrangTua || '',
      alamat: newApplicant.alamat || '',
      tanggalDaftar: new Date().toISOString().slice(0, 10),
      status: (newApplicant.status as any) || 'Menunggu Verifikasi',
      berkas: newApplicant.berkas || { ijazah: false, kk: false, akta: false, pasFoto: false }
    };

    onAddApplicant(applicant);
    await saveDocument('ppdb_registrations', applicant.id, applicant);

    setShowAddModal(false);
    setNewApplicant({
      namaLengkap: '',
      nisnAsal: '',
      nik: '',
      jenisKelamin: 'L',
      tempatLahir: 'Serang',
      tanggalLahir: '2019-05-10',
      sekolahAsal: 'TK / RA Setempat',
      pilihanJurusanKelas: 'SDIT - Kelas 1 (Tahfidz & Coding)',
      jalurPendaftaran: 'Reguler',
      namaOrangTua: '',
      noHpOrangTua: '',
      alamat: '',
      status: 'Menunggu Verifikasi',
      berkas: { ijazah: false, kk: false, akta: false, pasFoto: false }
    });
  };

  // Konfirmasi Penerimaan Siswa ke Master Data
  const handleConfirmAdmit = async () => {
    if (!applicantToAdmit) return;
    onAdmitToStudents(applicantToAdmit, assignedClass);
    await handleStatusChange(applicantToAdmit, 'Diterima');
    setShowAdmitModal(false);
    setApplicantToAdmit(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-emerald-800 to-slate-900 text-white p-6 md:p-8 rounded-3xl shadow-xl border border-emerald-700/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold mb-2 border border-emerald-400/30">
            <School className="w-3.5 h-3.5" /> Modul Administrasi PPDB Online
          </div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight">
            Layar Admin & Verifikasi PPDB
          </h2>
          <p className="text-xs md:text-sm text-emerald-100/80 mt-1 max-w-2xl">
            Pusat verifikasi berkas, penetapan kelulusan seleksi, pencatatan otomatis ke database Firestore, dan konversi resmi calon pendaftar ke Master Data Siswa SDIT El Fatah.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <UserPlus className="w-4 h-4" />
            <span>Tambah Pendaftar</span>
          </button>
          <button
            onClick={handleExportExcel}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-xs rounded-xl border border-slate-600 transition flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Ekspor Excel</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-500 block uppercase">Total Pendaftar</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-slate-900">{totalApplicants}</span>
            <span className="text-[10px] text-slate-400">calon siswa</span>
          </div>
        </div>
        <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200 shadow-sm">
          <span className="text-[11px] font-bold text-amber-700 block uppercase flex items-center gap-1">
            <Clock className="w-3 h-3" /> Menunggu
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-amber-900">{countMenunggu}</span>
            <span className="text-[10px] text-amber-700">belum diverifikasi</span>
          </div>
        </div>
        <div className="bg-blue-50/60 p-4 rounded-2xl border border-blue-200 shadow-sm">
          <span className="text-[11px] font-bold text-blue-700 block uppercase flex items-center gap-1">
            <FileText className="w-3 h-3" /> Berkas Lengkap
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-blue-900">{countBerkasLengkap}</span>
            <span className="text-[10px] text-blue-700">siap seleksi</span>
          </div>
        </div>
        <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200 shadow-sm">
          <span className="text-[11px] font-bold text-emerald-700 block uppercase flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> Lulus Seleksi
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-emerald-900">{countLulus}</span>
            <span className="text-[10px] text-emerald-700">lulus tes</span>
          </div>
        </div>
        <div className="bg-indigo-50/60 p-4 rounded-2xl border border-indigo-200 shadow-sm">
          <span className="text-[11px] font-bold text-indigo-700 block uppercase flex items-center gap-1">
            <GraduationCap className="w-3 h-3" /> Resmi Siswa Baru
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-indigo-900">{countDiterima}</span>
            <span className="text-[10px] text-indigo-700">masuk rombel</span>
          </div>
        </div>
        <div className="bg-rose-50/60 p-4 rounded-2xl border border-rose-200 shadow-sm">
          <span className="text-[11px] font-bold text-rose-700 block uppercase flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> Tidak Lulus
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-rose-900">{countDitolak}</span>
            <span className="text-[10px] text-rose-700">ditolak/gugur</span>
          </div>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama, no registrasi, NISN, wali..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span>Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-emerald-600 cursor-pointer"
            >
              <option value="SEMUA">Semua Status ({ppdbList.length})</option>
              <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
              <option value="Berkas Lengkap">Berkas Lengkap</option>
              <option value="Lulus Seleksi">Lulus Seleksi</option>
              <option value="Diterima">Diterima (Resmi Siswa Baru)</option>
              <option value="Ditolak">Ditolak</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span>Jalur:</span>
            <select
              value={filterJalur}
              onChange={(e) => setFilterJalur(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-emerald-600 cursor-pointer"
            >
              <option value="SEMUA">Semua Jalur</option>
              <option value="Reguler">Reguler</option>
              <option value="Tahfidz & Qur'an">Tahfidz & Qur'an</option>
              <option value="Prestasi Akademik">Prestasi Akademik</option>
              <option value="Afirmasi">Afirmasi</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table of PPDB Registrations */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-900 text-white font-bold text-[11px] uppercase tracking-wider">
                <th className="p-3.5 text-center w-10">No</th>
                <th className="p-3.5">No. Registrasi</th>
                <th className="p-3.5">Calon Peserta Didik</th>
                <th className="p-3.5">Jalur & Pilihan</th>
                <th className="p-3.5">Orang Tua / Kontak</th>
                <th className="p-3.5 text-center">Kelengkapan Dokumen</th>
                <th className="p-3.5 text-center">Status Kelulusan</th>
                <th className="p-3.5 text-center">Aksi & Keputusan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500 italic">
                    Tidak ada pendaftar PPDB yang sesuai kriteria pencarian.
                  </td>
                </tr>
              ) : (
                filteredList.map((item, idx) => {
                  const berkas = item.berkas || {};
                  const berkasCount = [berkas.ijazah, berkas.kk, berkas.akta, berkas.pasFoto].filter(Boolean).length;

                  return (
                    <tr key={item.id} className="hover:bg-slate-50 transition">
                      <td className="p-3.5 text-center font-bold text-slate-400">{idx + 1}</td>

                      <td className="p-3.5 whitespace-nowrap">
                        <span className="font-mono font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                          {item.nomorRegistrasi}
                        </span>
                        <span className="block text-[10px] text-slate-400 mt-1">
                          {item.tanggalDaftar}
                        </span>
                      </td>

                      <td className="p-3.5">
                        <p className="font-black text-slate-900 text-sm">{item.namaLengkap}</p>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                          <span className="font-bold text-slate-700">
                            {item.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                          </span>
                          {item.nisnAsal && <span>• NISN: {item.nisnAsal}</span>}
                          {item.sekolahAsal && <span>• Asal: {item.sekolahAsal}</span>}
                        </div>
                      </td>

                      <td className="p-3.5 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-extrabold text-[10px]">
                          {item.jalurPendaftaran || 'Reguler'}
                        </span>
                        <p className="text-[11px] text-slate-600 mt-1">{item.pilihanJurusanKelas}</p>
                      </td>

                      <td className="p-3.5">
                        <p className="font-bold text-slate-800">{item.namaOrangTua}</p>
                        {item.noHpOrangTua && (
                          <a
                            href={`https://wa.me/${item.noHpOrangTua.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 mt-0.5"
                          >
                            <Phone className="w-3 h-3" />
                            <span>{item.noHpOrangTua}</span>
                          </a>
                        )}
                      </td>

                      <td className="p-3.5 text-center whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                          <span
                            onClick={() => handleToggleBerkas(item, 'ijazah')}
                            title="Ijazah / SKL (Klik untuk toggle)"
                            className={`px-1.5 py-0.5 rounded text-[9px] font-bold cursor-pointer ${
                              berkas.ijazah ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'
                            }`}
                          >
                            SKL
                          </span>
                          <span
                            onClick={() => handleToggleBerkas(item, 'kk')}
                            title="Kartu Keluarga (Klik untuk toggle)"
                            className={`px-1.5 py-0.5 rounded text-[9px] font-bold cursor-pointer ${
                              berkas.kk ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'
                            }`}
                          >
                            KK
                          </span>
                          <span
                            onClick={() => handleToggleBerkas(item, 'akta')}
                            title="Akta Kelahiran (Klik untuk toggle)"
                            className={`px-1.5 py-0.5 rounded text-[9px] font-bold cursor-pointer ${
                              berkas.akta ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'
                            }`}
                          >
                            Akta
                          </span>
                          <span
                            onClick={() => handleToggleBerkas(item, 'pasFoto')}
                            title="Pas Foto (Klik untuk toggle)"
                            className={`px-1.5 py-0.5 rounded text-[9px] font-bold cursor-pointer ${
                              berkas.pasFoto ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'
                            }`}
                          >
                            Foto
                          </span>
                        </div>
                        <span className="block text-[10px] text-slate-500 mt-1">
                          {berkasCount}/4 dokumen
                        </span>
                      </td>

                      <td className="p-3.5 text-center whitespace-nowrap">
                        <span
                          className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase border ${
                            item.status === 'Diterima'
                              ? 'bg-indigo-100 text-indigo-800 border-indigo-300'
                              : item.status === 'Lulus Seleksi'
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : item.status === 'Berkas Lengkap'
                              ? 'bg-blue-100 text-blue-800 border-blue-300'
                              : item.status === 'Ditolak'
                              ? 'bg-rose-100 text-rose-800 border-rose-300'
                              : 'bg-amber-100 text-amber-800 border-amber-300'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>

                      <td className="p-3.5 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Tombol Lihat Detail */}
                          <button
                            onClick={() => {
                              setSelectedApplicant(item);
                              setShowDetailModal(true);
                            }}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition cursor-pointer"
                            title="Lihat Biodata Lengkap"
                          >
                            <FileText className="w-4 h-4" />
                          </button>

                          {/* Tombol Cetak Dokumen */}
                          <button
                            onClick={() => handlePrintApplicant(item)}
                            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition cursor-pointer"
                            title="Cetak Lembar Pendaftaran & Bukti"
                          >
                            <Printer className="w-4 h-4 text-emerald-400" />
                          </button>

                          {/* Opsi Keputusan Kelulusan */}
                          {item.status !== 'Diterima' && (
                            <>
                              {item.status !== 'Lulus Seleksi' && (
                                <button
                                  onClick={() => handleStatusChange(item, 'Lulus Seleksi')}
                                  className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-[10px] transition cursor-pointer"
                                  title="Nyatakan Lulus Seleksi Tes"
                                >
                                  Luluskan
                                </button>
                              )}

                              {item.status === 'Lulus Seleksi' && (
                                <button
                                  onClick={() => {
                                    setApplicantToAdmit(item);
                                    setShowAdmitModal(true);
                                  }}
                                  className="px-2 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold text-[10px] shadow transition cursor-pointer flex items-center gap-1"
                                  title="Terima & Masukkan ke Master Data Siswa Baru"
                                >
                                  <UserCheck className="w-3 h-3" />
                                  <span>Jadikan Siswa</span>
                                </button>
                              )}

                              {item.status !== 'Ditolak' && (
                                <button
                                  onClick={() => handleStatusChange(item, 'Ditolak')}
                                  className="px-2 py-1 bg-rose-100 hover:bg-rose-200 text-rose-800 rounded-lg font-bold text-[10px] transition cursor-pointer"
                                  title="Tolak Pendaftaran"
                                >
                                  Tolak
                                </button>
                              )}
                            </>
                          )}

                          {item.status === 'Diterima' && (
                            <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-1 rounded-md border border-indigo-200">
                              ✓ Terdaftar Siswa
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Detail Pendaftar */}
      {showDetailModal && selectedApplicant && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <span className="text-xs font-bold text-emerald-700 uppercase">Biodata Calon Peserta Didik</span>
                <h3 className="text-xl font-extrabold text-slate-900">{selectedApplicant.namaLengkap}</h3>
              </div>
              <span className="font-mono text-xs px-2.5 py-1 bg-blue-50 text-blue-900 rounded-lg font-bold border border-blue-200">
                {selectedApplicant.nomorRegistrasi}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block font-semibold">Jenis Kelamin:</span>
                <p className="font-bold text-slate-800">
                  {selectedApplicant.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                </p>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">NISN / NIK:</span>
                <p className="font-bold text-slate-800">
                  {selectedApplicant.nisnAsal || '-'} / {selectedApplicant.nik || '-'}
                </p>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">Tempat, Tanggal Lahir:</span>
                <p className="font-bold text-slate-800">
                  {selectedApplicant.tempatLahir || '-'}, {selectedApplicant.tanggalLahir || '-'}
                </p>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">Asal Sekolah TK/RA:</span>
                <p className="font-bold text-slate-800">{selectedApplicant.sekolahAsal || '-'}</p>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">Jalur Pendaftaran:</span>
                <p className="font-bold text-emerald-800">{selectedApplicant.jalurPendaftaran || 'Reguler'}</p>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">Pilihan Rombel/Kelas:</span>
                <p className="font-bold text-slate-800">{selectedApplicant.pilihanJurusanKelas}</p>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">Nama Orang Tua/Wali:</span>
                <p className="font-bold text-slate-800">{selectedApplicant.namaOrangTua}</p>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">No. HP / WhatsApp:</span>
                <p className="font-bold text-slate-800">{selectedApplicant.noHpOrangTua}</p>
              </div>
              <div className="col-span-2">
                <span className="text-slate-400 block font-semibold">Alamat Lengkap:</span>
                <p className="font-medium text-slate-800">{selectedApplicant.alamat || '-'}</p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-xs font-bold text-slate-700 block mb-2">Status Kelengkapan Berkas Fisik:</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { key: 'ijazah', label: 'Ijazah / SKL' },
                  { key: 'kk', label: 'Kartu Keluarga' },
                  { key: 'akta', label: 'Akta Kelahiran' },
                  { key: 'pasFoto', label: 'Pas Foto' },
                ].map(({ key, label }) => {
                  const isChecked = selectedApplicant.berkas?.[key as keyof PpdbApplicant['berkas']];
                  return (
                    <button
                      key={key}
                      onClick={() => handleToggleBerkas(selectedApplicant, key as keyof PpdbApplicant['berkas'])}
                      className={`p-2.5 rounded-xl border text-center font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 ${
                        isChecked
                          ? 'bg-emerald-100 border-emerald-300 text-emerald-900'
                          : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-100'
                      }`}
                    >
                      {isChecked ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : null}
                      <span>{label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => handlePrintApplicant(selectedApplicant)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4 text-emerald-400" />
                <span>Cetak Lembar Resmi</span>
              </button>

              <button
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedApplicant(null);
                }}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Jadikan Siswa Baru */}
      {showAdmitModal && applicantToAdmit && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">Konfirmasi Penerimaan Siswa Baru</h3>
                <p className="text-xs text-slate-500">
                  Calon siswa akan otomatis terdaftar di Master Data Siswa SDIT El Fatah.
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Nama Siswa:</span>
                <strong className="text-slate-900">{applicantToAdmit.namaLengkap}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">No. Registrasi:</span>
                <span className="font-mono font-bold text-blue-900">{applicantToAdmit.nomorRegistrasi}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Nama Orang Tua:</span>
                <strong className="text-slate-900">{applicantToAdmit.namaOrangTua}</strong>
              </div>
              <div className="flex justify-between items-center pt-2 border-t">
                <span className="text-slate-700 font-bold">Tempatkan di Rombel:</span>
                <select
                  value={assignedClass}
                  onChange={(e) => setAssignedClass(e.target.value)}
                  className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold focus:outline-none focus:border-indigo-600"
                >
                  <option value="Kelas 1 A">Kelas 1 A</option>
                  <option value="Kelas 1 B">Kelas 1 B</option>
                  <option value="Kelas 1 C">Kelas 1 C</option>
                  <option value="Kelas 2">Kelas 2 (Pindahan)</option>
                  <option value="Kelas 3">Kelas 3 (Pindahan)</option>
                </select>
              </div>
              <div className="flex justify-between text-slate-600 pt-1">
                <span>Tarif SPP Standar:</span>
                <span className="font-bold text-emerald-700">Rp 250.000 / bulan</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  setShowAdmitModal(false);
                  setApplicantToAdmit(null);
                }}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl transition cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmAdmit}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black rounded-xl shadow transition cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Terima & Simpan ke Master Data</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Tambah Pendaftar Manual */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 my-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-emerald-600" />
                <span>Input Data Pendaftar PPDB Manual</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddNewSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nama Lengkap Siswa *</label>
                  <input
                    type="text"
                    required
                    value={newApplicant.namaLengkap}
                    onChange={(e) => setNewApplicant({ ...newApplicant, namaLengkap: e.target.value })}
                    placeholder="Contoh: Muhammad Rayhan"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Jenis Kelamin</label>
                  <select
                    value={newApplicant.jenisKelamin}
                    onChange={(e) => setNewApplicant({ ...newApplicant, jenisKelamin: e.target.value as 'L' | 'P' })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
                  >
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">NISN / NIK</label>
                  <input
                    type="text"
                    value={newApplicant.nisnAsal}
                    onChange={(e) => setNewApplicant({ ...newApplicant, nisnAsal: e.target.value })}
                    placeholder="0012345678"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Asal TK / RA</label>
                  <input
                    type="text"
                    value={newApplicant.sekolahAsal}
                    onChange={(e) => setNewApplicant({ ...newApplicant, sekolahAsal: e.target.value })}
                    placeholder="TK Islam Terpadu El-Fatah"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nama Orang Tua / Wali *</label>
                  <input
                    type="text"
                    required
                    value={newApplicant.namaOrangTua}
                    onChange={(e) => setNewApplicant({ ...newApplicant, namaOrangTua: e.target.value })}
                    placeholder="Bpk. Hendra Pratama"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">No. WhatsApp / HP</label>
                  <input
                    type="text"
                    value={newApplicant.noHpOrangTua}
                    onChange={(e) => setNewApplicant({ ...newApplicant, noHpOrangTua: e.target.value })}
                    placeholder="081234567890"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Jalur Pendaftaran</label>
                  <select
                    value={newApplicant.jalurPendaftaran}
                    onChange={(e) => setNewApplicant({ ...newApplicant, jalurPendaftaran: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
                  >
                    <option value="Reguler">Reguler</option>
                    <option value="Tahfidz & Qur'an">Tahfidz & Qur'an</option>
                    <option value="Prestasi Akademik">Prestasi Akademik</option>
                    <option value="Afirmasi">Afirmasi</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status Awal</label>
                  <select
                    value={newApplicant.status}
                    onChange={(e) => setNewApplicant({ ...newApplicant, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
                  >
                    <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
                    <option value="Berkas Lengkap">Berkas Lengkap</option>
                    <option value="Lulus Seleksi">Lulus Seleksi</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Alamat Lengkap</label>
                  <textarea
                    rows={2}
                    value={newApplicant.alamat}
                    onChange={(e) => setNewApplicant({ ...newApplicant, alamat: e.target.value })}
                    placeholder="Jl. Raya Serang Km 5, Kota Serang..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-200 text-slate-800 font-bold rounded-xl text-xs hover:bg-slate-300"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow"
                >
                  Simpan Pendaftar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PpdbAdminModule;
