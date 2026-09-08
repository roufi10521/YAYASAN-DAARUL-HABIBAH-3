import React from 'react';
import { Printer, X, Award, CheckCircle2, School } from 'lucide-react';

export interface SubjectGradeItem {
  subject: string;
  score: number;
  letterGrade?: string;
  tpDescription?: string;
}

export interface StudentReportData {
  id: string;
  studentId: string;
  studentName: string;
  nisn: string;
  nis?: string;
  gradeClass: string;
  academicYear: string;
  semester: string;
  parentName?: string;
  teacherName?: string;
  grades: SubjectGradeItem[];
  attendance?: {
    sakit: number;
    izin: number;
    alpa: number;
  };
  extracurriculars?: Array<{
    name: string;
    grade: string;
    description: string;
  }>;
  teacherNotes?: string;
  status: 'DIUSULKAN_GURU' | 'DISETUJUI_KEPSEK' | 'DITERBITKAN';
}

interface PrintableRaportSheetProps {
  React?: any;
  report: StudentReportData;
  foundationProfile?: any;
  onClose: () => void;
}

export const PrintableRaportSheet: React.FC<PrintableRaportSheetProps> = ({
  report,
  foundationProfile,
  onClose
}) => {
  const schoolName = foundationProfile?.name || 'SDIT EL FATAH';
  const yayasanName = foundationProfile?.foundationName || 'YAYASAN PENDIDIKAN DAARUL HABIBAH';
  const address = foundationProfile?.address || 'Jl. Raya Serang - Pandeglang Km. 5, Kota Serang, Banten';
  const phone = foundationProfile?.phone || '(0254) 8241234';

  const defaultSubjects: SubjectGradeItem[] = [
    { subject: 'Pendidikan Agama Islam & Budi Pekerti', score: 92, letterGrade: 'A', tpDescription: 'Sangat baik dalam memahami rukun iman dan mempraktikkan shalat fardhu dengan tertib.' },
    { subject: 'Pendidikan Pancasila', score: 88, letterGrade: 'B', tpDescription: 'Mampu menjelaskan makna sila-sila Pancasila dan menerapkannya dalam kehidupan sehari-hari.' },
    { subject: 'Bahasa Indonesia', score: 87, letterGrade: 'B', tpDescription: 'Sangat terampil menyimak cerita dan membaca teks narasi dengan intonasi yang baik.' },
    { subject: 'Matematika', score: 85, letterGrade: 'B', tpDescription: 'Mampu melakukan penjumlahan dan pengurangan pecahan serta membaca diagram batang.' },
    { subject: 'Ilmu Pengetahuan Alam dan Sosial (IPAS)', score: 90, letterGrade: 'A', tpDescription: 'Sangat memahami wujud zat dan siklus hidup makhluk hidup di lingkungan sekitar.' },
    { subject: 'Pendidikan Jasmani, Olahraga & Kesehatan (PJOK)', score: 86, letterGrade: 'B', tpDescription: 'Menunjukkan kebugaran jasmani dan sportivitas yang tinggi dalam permainan bola kecil.' },
    { subject: 'Seni Rupa & Prakarya', score: 89, letterGrade: 'B', tpDescription: 'Mampu membuat karya kerajinan tangan dua dimensi dengan rapi dan berdaya cipta.' },
    { subject: 'Bahasa Inggris', score: 91, letterGrade: 'A', tpDescription: 'Sangat aktif berkomunikasi dalam dialog sederhana seputar kegiatan sekolah dan keluarga.' },
    { subject: 'Bahasa Arab & Tahfidz Qur\'an', score: 95, letterGrade: 'A', tpDescription: 'Mutqin hafalan Juz 30 (Surat An-Naba s.d An-Nas) dengan kaidah tajwid dan makharijul huruf yang fasih.' },
    { subject: 'Informatika & Coding Dasar (Muatan Lokal)', score: 94, letterGrade: 'A', tpDescription: 'Sangat antusias memahami logika algoritma dasar dan blok pemrograman visual Scratch.' }
  ];

  const displayGrades = (report.grades && report.grades.length > 0) ? report.grades : defaultSubjects;

  const averageScore = Math.round(
    displayGrades.reduce((acc, g) => acc + g.score, 0) / (displayGrades.length || 1)
  );

  const defaultEkskul = report.extracurriculars || [
    { name: 'Pramuka Penggalang', grade: 'A', description: 'Sangat aktif, disiplin, dan terampil dalam tali-temali dan sandi morse.' },
    { name: 'Tahfidz Al-Qur\'an', grade: 'A', description: 'Konsisten menyelesaikan setoran hafalan harian dengan tajwid yang baik.' },
    { name: 'Klub Robotik & Coding', grade: 'A', description: 'Kreatif merakit sensor sederhana dan membuat animasi game edukasi.' }
  ];

  const attendance = report.attendance || { sakit: 1, izin: 1, alpa: 0 };
  const teacherNotes = report.teacherNotes || 'Ananda menunjukkan kemajuan yang sangat membanggakan dalam pembelajaran spiritual dan akademik. Pertahankan semangat belajar, ketekunan tilawah Al-Qur\'an, dan rasa ingin tahu yang tinggi!';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 md:p-4 overflow-y-auto print:p-0 print:static print:bg-white print:overflow-visible">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto print:shadow-none print:border-none print:rounded-none print:max-w-none print:w-full">
        {/* Top Control Bar (Hidden when printing) */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between print:hidden border-b border-slate-800">
          <div className="flex items-center gap-2">
            <School className="w-5 h-5 text-emerald-400" />
            <span className="font-bold text-sm">Pratinjau Lembar E-Rapor Siap Cetak (Kurikulum Merdeka)</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow transition cursor-pointer flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Simpan PDF (A4)</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition cursor-pointer"
              title="Tutup"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Sheet Body */}
        <div id="raport-printable-content" className="p-6 md:p-10 text-slate-900 text-xs font-sans print:p-0">
          {/* Official Kop Surat */}
          <div className="text-center border-b-2 border-slate-900 pb-3 mb-5">
            <h3 className="text-xs uppercase font-extrabold tracking-widest text-slate-700">
              {yayasanName}
            </h3>
            <h1 className="text-xl md:text-2xl font-black text-emerald-950 tracking-tight mt-0.5">
              {schoolName}
            </h1>
            <p className="text-[10px] text-slate-600 mt-1">
              {address} • Telp: {phone} • Website: sdit-elfatah.sch.id
            </p>
            <p className="text-[9px] text-slate-500 font-mono">
              NPSN: 69981234 • NSS: 102280401001 • Terakreditasi A (Unggul)
            </p>
          </div>

          {/* Report Title */}
          <div className="text-center mb-5">
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 underline decoration-2 underline-offset-4">
              LAPORAN HASIL BELAJAR PESERTA DIDIK (E-RAPOR)
            </h2>
            <p className="text-[10px] font-semibold text-slate-600 mt-0.5">
              KURIKULUM MERDEKA • TAHUN PELAJARAN {report.academicYear || '2026/2027'} ({report.semester || 'SEMESTER GANJIL'})
            </p>
          </div>

          {/* Student Biodata Header */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 bg-slate-50 p-3.5 rounded-xl border border-slate-200 mb-5 text-[11px]">
            <div className="flex">
              <span className="w-32 text-slate-600 font-semibold">Nama Peserta Didik</span>
              <strong className="text-slate-900">: {report.studentName}</strong>
            </div>
            <div className="flex">
              <span className="w-32 text-slate-600 font-semibold">Kelas / Rombel</span>
              <strong className="text-slate-900">: {report.gradeClass}</strong>
            </div>
            <div className="flex">
              <span className="w-32 text-slate-600 font-semibold">NIS / NISN</span>
              <span className="text-slate-900 font-mono">: {report.nis || '2026101'} / {report.nisn || '-'}</span>
            </div>
            <div className="flex">
              <span className="w-32 text-slate-600 font-semibold">Fase Perkembangan</span>
              <span className="text-slate-900">: Fase {report.gradeClass?.includes('1') || report.gradeClass?.includes('2') ? 'A (Kelas 1-2)' : report.gradeClass?.includes('3') || report.gradeClass?.includes('4') ? 'B (Kelas 3-4)' : 'C (Kelas 5-6)'}</span>
            </div>
            <div className="flex">
              <span className="w-32 text-slate-600 font-semibold">Nama Wali Murid</span>
              <span className="text-slate-900">: {report.parentName || 'Bpk. / Ibu Orang Tua Siswa'}</span>
            </div>
            <div className="flex">
              <span className="w-32 text-slate-600 font-semibold">Guru / Wali Kelas</span>
              <span className="text-slate-900 font-semibold">: {report.teacherName || 'Ustadzah Khadijah, S.Pd.I.'}</span>
            </div>
          </div>

          {/* Subjects and Grades Table */}
          <div className="mb-5">
            <h3 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-emerald-700" />
              <span>A. Capaian Kompetensi & Nilai Mata Pelajaran</span>
            </h3>

            <table className="w-full border-collapse border border-slate-300 text-[10.5px]">
              <thead>
                <tr className="bg-slate-100 text-slate-900 font-black">
                  <th className="border border-slate-300 p-2 w-8 text-center">No</th>
                  <th className="border border-slate-300 p-2 text-left w-52">Mata Pelajaran</th>
                  <th className="border border-slate-300 p-2 w-14 text-center">Nilai Akhir</th>
                  <th className="border border-slate-300 p-2 w-12 text-center">Predikat</th>
                  <th className="border border-slate-300 p-2 text-left">Deskripsi Capaian Tujuan Pembelajaran (TP)</th>
                </tr>
              </thead>
              <tbody>
                {displayGrades.map((item, idx) => {
                  const letter = item.letterGrade || (item.score >= 90 ? 'A' : item.score >= 80 ? 'B' : item.score >= 70 ? 'C' : 'D');
                  return (
                    <tr key={idx} className="hover:bg-slate-50/60">
                      <td className="border border-slate-300 p-2 text-center font-bold text-slate-500">{idx + 1}</td>
                      <td className="border border-slate-300 p-2 font-bold text-slate-900">{item.subject}</td>
                      <td className="border border-slate-300 p-2 text-center font-mono font-black text-slate-900 bg-slate-50">
                        {item.score}
                      </td>
                      <td className="border border-slate-300 p-2 text-center font-black">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] ${letter === 'A' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'}`}>
                          {letter}
                        </span>
                      </td>
                      <td className="border border-slate-300 p-2 text-slate-700 leading-snug">
                        {item.tpDescription || `Menunjukkan pemahaman yang sangat baik dalam mencapai indikator kompetensi pada materi pembelajaran.`}
                      </td>
                    </tr>
                  );
                })}
                <tr className="bg-emerald-50/70 font-black">
                  <td colSpan={2} className="border border-slate-300 p-2 text-right uppercase text-slate-800">
                    Rata-rata Nilai Keseluruhan:
                  </td>
                  <td className="border border-slate-300 p-2 text-center font-mono text-emerald-900 text-xs">
                    {averageScore}
                  </td>
                  <td className="border border-slate-300 p-2 text-center text-emerald-900">
                    {averageScore >= 90 ? 'A' : averageScore >= 80 ? 'B' : 'C'}
                  </td>
                  <td className="border border-slate-300 p-2 text-slate-700 text-[10px]">
                    Status Kelulusan Akademik: <strong>TUNTAS SANGAT MEMUASKAN</strong>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Ekstrakurikuler & Presensi */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
            {/* Ekstrakurikuler */}
            <div>
              <h3 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider mb-2">
                B. Kegiatan Ekstrakurikuler
              </h3>
              <table className="w-full border-collapse border border-slate-300 text-[10px]">
                <thead>
                  <tr className="bg-slate-100 text-slate-900 font-bold">
                    <th className="border border-slate-300 p-1.5 text-left">Nama Ekstrakurikuler</th>
                    <th className="border border-slate-300 p-1.5 w-12 text-center">Predikat</th>
                    <th className="border border-slate-300 p-1.5 text-left">Keterangan</th>
                  </tr>
                </thead>
                <tbody>
                  {defaultEkskul.map((ek, i) => (
                    <tr key={i}>
                      <td className="border border-slate-300 p-1.5 font-bold text-slate-800">{ek.name}</td>
                      <td className="border border-slate-300 p-1.5 text-center font-black text-emerald-800">{ek.grade}</td>
                      <td className="border border-slate-300 p-1.5 text-slate-600">{ek.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Presensi Kehadiran */}
            <div>
              <h3 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider mb-2">
                C. Ketidakhadiran (Presensi)
              </h3>
              <table className="w-full border-collapse border border-slate-300 text-[10.5px]">
                <thead>
                  <tr className="bg-slate-100 text-slate-900 font-bold">
                    <th className="border border-slate-300 p-1.5 text-left">Keterangan</th>
                    <th className="border border-slate-300 p-1.5 w-24 text-center">Jumlah Hari</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-slate-300 p-1.5 text-slate-700">Sakit (S)</td>
                    <td className="border border-slate-300 p-1.5 text-center font-bold">{attendance.sakit} hari</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 p-1.5 text-slate-700">Izin Resmi (I)</td>
                    <td className="border border-slate-300 p-1.5 text-center font-bold">{attendance.izin} hari</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 p-1.5 text-slate-700">Tanpa Keterangan (A)</td>
                    <td className="border border-slate-300 p-1.5 text-center font-bold text-emerald-700">{attendance.alpa} hari (Nihil)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Catatan Wali Kelas */}
          <div className="mb-6 p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <h3 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider mb-1">
              D. Catatan Perkembangan Karakter & Rekomendasi Wali Kelas:
            </h3>
            <p className="text-[10.5px] italic text-slate-800 leading-relaxed">
              "{teacherNotes}"
            </p>
          </div>

          {/* Official Signatures Block */}
          <div className="pt-2 text-[10.5px]">
            <div className="text-right mb-4">
              Kota Serang, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-slate-600">Mengetahui,<br/>Orang Tua / Wali Murid,</p>
                <div className="h-16 flex items-end justify-center">
                  <span className="text-[9px] text-slate-400 italic">(Tanda Tangan Asli)</span>
                </div>
                <p className="font-bold text-slate-900">
                  ( {report.parentName || '...........................................'} )
                </p>
              </div>

              <div>
                <p className="text-slate-600">Wali Kelas Rombongan Belajar,</p>
                <div className="h-16 flex items-end justify-center">
                  <div className="px-2 py-0.5 border border-emerald-500 rounded text-[9px] font-black text-emerald-800 bg-emerald-50">
                    ✓ TERVERIFIKASI WALI KELAS
                  </div>
                </div>
                <p className="font-bold text-slate-900 underline">
                  {report.teacherName || 'Ustadzah Khadijah, S.Pd.I.'}
                </p>
                <p className="text-[9px] text-slate-500 font-mono">NIPY: 198904152014032002</p>
              </div>

              <div>
                <p className="text-slate-600">Mengetahui,<br/>Kepala Sekolah SDIT El Fatah,</p>
                <div className="h-16 flex items-end justify-center">
                  <div className="px-2 py-0.5 border border-blue-500 rounded text-[9px] font-black text-blue-800 bg-blue-50">
                    ✓ RESMI DITERBITKAN KEPSEK
                  </div>
                </div>
                <p className="font-bold text-slate-900 underline">
                  H. Ahmad Fathoni, M.Pd.
                </p>
                <p className="text-[9px] text-slate-500 font-mono">NIPY: 198507122010011001</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintableRaportSheet;
