// Standar Indikator Baku Lampiran Excel Penilaian Kinerja Guru SDIT EL-FATAH
// Mengacu resmi pada dokumen lampiran Excel Sasaran Kerja & Ukuran Prestasi Kerja

export const OFFICIAL_KPI_INDICATORS = [
  {
    no: 1,
    category: "Kinerja",
    targetGoal: "Perencanaan Pembelajaran dalam jurnal",
    code: "01.00",
    description: "Menyusun Modul Ajar dan Alur Tujuan Pembelajaran (ATP) yang sesuai dengan karakteristik serta fase perkembangan peserta didik.",
    weight: 10,
    weightPercent: "10%",
    weightDecimal: 0.10,
    rowSpanGoal: 2,
    rowSpanCat: 7,
    isFirstInGoal: true,
    isFirstInCat: true
  },
  {
    no: 1,
    category: "Kinerja",
    targetGoal: "Perencanaan Pembelajaran dalam jurnal",
    code: "01.01",
    description: "Merancang materi esensial yang memberikan waktu fleksibel untuk pengembangan kompetensi dasar, seperti literasi dan numeras",
    weight: 5,
    weightPercent: "5%",
    weightDecimal: 0.05,
    rowSpanGoal: 0,
    rowSpanCat: 0,
    isFirstInGoal: false,
    isFirstInCat: false
  },
  {
    no: 2,
    category: "Kinerja",
    targetGoal: "Pelaksanaan Pembelajaran",
    code: "02.01",
    description: "Menerapkan pembelajaran berdiferensiasi yang disesuaikan dengan tahap pencapaian kemampuan siswa yang beragam",
    weight: 10,
    weightPercent: "10%",
    weightDecimal: 0.10,
    rowSpanGoal: 3,
    rowSpanCat: 0,
    isFirstInGoal: true,
    isFirstInCat: false
  },
  {
    no: 2,
    category: "Kinerja",
    targetGoal: "Pelaksanaan Pembelajaran",
    code: "02.02",
    description: "Melibatkan siswa secara aktif dalam Projek Penguatan Profil Pelajar Pancasila (P5) untuk membentuk karakter intrapersonal dan ekstrinsik",
    weight: 10,
    weightPercent: "10%",
    weightDecimal: 0.10,
    rowSpanGoal: 0,
    rowSpanCat: 0,
    isFirstInGoal: false,
    isFirstInCat: false
  },
  {
    no: 2,
    category: "Kinerja",
    targetGoal: "Pelaksanaan Pembelajaran",
    code: "02.03",
    description: "Mengelola kelas secara efektif dengan fokus pada 8 indikator kinerja guru seperti keteraturan suasana kelas, penerapan disiplin positif, dan umpan balik konstruktif",
    weight: 5,
    weightPercent: "5%",
    weightDecimal: 0.05,
    rowSpanGoal: 0,
    rowSpanCat: 0,
    isFirstInGoal: false,
    isFirstInCat: false
  },
  {
    no: 3,
    category: "Kinerja",
    targetGoal: "Asesmen dan Evaluasi",
    code: "03.01",
    description: "Melakukan asesmen diagnostik di awal pembelajaran untuk memetakan posisi dan kebutuhan belajar peserta didik.",
    weight: 5,
    weightPercent: "5%",
    weightDecimal: 0.05,
    rowSpanGoal: 2,
    rowSpanCat: 0,
    isFirstInGoal: true,
    isFirstInCat: false
  },
  {
    no: 3,
    category: "Kinerja",
    targetGoal: "Asesmen dan Evaluasi",
    code: "03.02",
    description: "Menggunakan portofolio dan asesmen autentik secara sistematis guna mengukur kemajuan belajar secara berkelanjutan",
    weight: 5,
    weightPercent: "5%",
    weightDecimal: 0.05,
    rowSpanGoal: 0,
    rowSpanCat: 0,
    isFirstInGoal: false,
    isFirstInCat: false
  },
  {
    no: 4,
    category: "Perilaku",
    targetGoal: "Amanah - Berintegritas & dapat dipercaya",
    code: "04.02",
    description: "Menjaga dan melaksanakan KBM dengan nilai diatas standar capaian siswa",
    weight: 5,
    weightPercent: "5%",
    weightDecimal: 0.05,
    rowSpanGoal: 1,
    rowSpanCat: 6,
    isFirstInGoal: true,
    isFirstInCat: true
  },
  {
    no: 5,
    category: "Perilaku",
    targetGoal: "Kompeten -Cakap pada bidang pelajaran",
    code: "05.02",
    description: "Memenuhi kegiatan belajar dengan tuntas",
    weight: 5,
    weightPercent: "5%",
    weightDecimal: 0.05,
    rowSpanGoal: 1,
    rowSpanCat: 0,
    isFirstInGoal: true,
    isFirstInCat: false
  },
  {
    no: 6,
    category: "Perilaku",
    targetGoal: "Harmonis - Saling mendukung kegiatan",
    code: "06.02",
    description: "Memberikan usulan atau pendapat pada ruang rapat serta memberikan solusi untuk lembaga dan rekan kerja.",
    weight: 10,
    weightPercent: "10%",
    weightDecimal: 0.10,
    rowSpanGoal: 1,
    rowSpanCat: 0,
    isFirstInGoal: true,
    isFirstInCat: false
  },
  {
    no: 7,
    category: "Perilaku",
    targetGoal: "Loyal - Berkomitmen dan Berdedikasi",
    code: "07.02",
    description: "Setiap tugas yang diberikan selalu dilaksanakan sesuai waktu yang ditetapkan",
    weight: 10,
    weightPercent: "10%",
    weightDecimal: 0.10,
    rowSpanGoal: 1,
    rowSpanCat: 0,
    isFirstInGoal: true,
    isFirstInCat: false
  },
  {
    no: 8,
    category: "Perilaku",
    targetGoal: "Adaptif - Inovasi Berkesinambungan",
    code: "08.02",
    description: "Inovasi yang dimunculkan dalam small group activity dengan improve yang berkelanjutan serta melibatkan siswa",
    weight: 10,
    weightPercent: "10%",
    weightDecimal: 0.10,
    rowSpanGoal: 1,
    rowSpanCat: 0,
    isFirstInGoal: true,
    isFirstInCat: false
  },
  {
    no: 9,
    category: "Perilaku",
    targetGoal: "Kolaboratif - Bekerja Sama",
    code: "09.02",
    description: "Kerjasama dengan unit lain dalam program sekolah dan komunikasi dengan orang tua siswa dalam hal update capaian prestasi siswa",
    weight: 10,
    weightPercent: "10%",
    weightDecimal: 0.10,
    rowSpanGoal: 1,
    rowSpanCat: 0,
    isFirstInGoal: true,
    isFirstInCat: false
  }
];

// Calculate score from 13 indicator sub-scores dictionary
export const calculateOfficialKpiScore = (subScores = {}) => {
  let totalScore = 0;
  let kinerjaScore = 0;
  let perilakuScore = 0;

  OFFICIAL_KPI_INDICATORS.forEach(ind => {
    const rawVal = Number(subScores[ind.code]) || 0;
    const clampedVal = Math.max(0, Math.min(100, rawVal));
    const valContribution = clampedVal * (ind.weight / 100);
    totalScore += valContribution;
    if (ind.category === "Kinerja") {
      kinerjaScore += valContribution;
    } else {
      perilakuScore += valContribution;
    }
  });

  return {
    totalScore: Math.round(totalScore * 100) / 100,
    kinerjaScore: Math.round(kinerjaScore * 100) / 100,
    perilakuScore: Math.round(perilakuScore * 100) / 100
  };
};

export const formatCurrency = (num) => {
  return "Rp " + Number(num || 0).toLocaleString("id-ID");
};

export const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  } catch (e) {
    return dateStr;
  }
};

export const getKpiGradeInfo = (score) => {
  const s = Number(score) || 0;
  if (s >= 90) return { label: "Sangat Memuaskan (Guru Teladan)", short: "Sangat Memuaskan", badge: "bg-emerald-100 text-emerald-800 border-emerald-300", color: "text-emerald-600", dot: "bg-emerald-500" };
  if (s >= 80) return { label: "Memuaskan (Sesuai Standar)", short: "Memuaskan", badge: "bg-blue-100 text-blue-800 border-blue-300", color: "text-blue-600", dot: "bg-blue-500" };
  if (s >= 70) return { label: "Cukup (Standar Minimal)", short: "Cukup", badge: "bg-amber-100 text-amber-800 border-amber-300", color: "text-amber-600", dot: "bg-amber-500" };
  return { label: "Perlu Pembinaan Khusus", short: "Perlu Pembinaan", badge: "bg-rose-100 text-rose-800 border-rose-300", color: "text-rose-600", dot: "bg-rose-500" };
};

// Initial benchmark sample evaluations matching the 13 indicators
export const INITIAL_OFFICIAL_EVALUATIONS = [
  {
    id: "kpi-1",
    teacherId: "tch-1",
    teacherName: "Uyat Sukriyati, S.Pd",
    teacherNip: "1991051005",
    teacherRole: "Guru Wali Kelas 1",
    rombel: "Kelas 1 (Fathurrahman)",
    period: "Semester Ganjil 2026/2027",
    academicYear: "2026/2027",
    subScores: {
      "01.00": 98,
      "01.01": 95,
      "02.01": 96,
      "02.02": 95,
      "02.03": 94,
      "03.01": 95,
      "03.02": 94,
      "04.02": 96,
      "05.02": 95,
      "06.02": 95,
      "07.02": 98,
      "08.02": 94,
      "09.02": 96
    },
    totalScore: 95.7,
    kinerjaScore: 47.7,
    perilakuScore: 48.0,
    grade: "Sangat Memuaskan",
    rewardStatus: "DISETUJUI_YAYASAN",
    rewardTitle: "Juara 1 Guru Teladan & Berprestasi",
    rewardDetail: "Uang Pembinaan Yayasan Rp 1.500.000 + Piagam Penghargaan Resmi + Prioritas Tunjangan",
    rewardAmount: 1500000,
    evaluatorName: "Masykur Rohana, S.Sos (Kepala Sekolah)",
    acknowledgedBy: "Drs. H. M. Syukri, M.M (Ketua Yayasan)",
    evaluationDate: "2026-12-18",
    notes: "Prestasi luar biasa dalam modul ajar, diferensiasi siswa baru kelas 1, disiplin jurnal 100% dan komunikasi orang tua sangat harmonis."
  },
  {
    id: "kpi-2",
    teacherId: "tch-2",
    teacherName: "Iis Rohmayanti, S.Pd",
    teacherNip: "1990041502",
    teacherRole: "Guru Wali Kelas 4",
    rombel: "Kelas 4 (Ibnu Khaldun)",
    period: "Semester Ganjil 2026/2027",
    academicYear: "2026/2027",
    subScores: {
      "01.00": 96,
      "01.01": 94,
      "02.01": 95,
      "02.02": 94,
      "02.03": 92,
      "03.01": 92,
      "03.02": 94,
      "04.02": 95,
      "05.02": 94,
      "06.02": 94,
      "07.02": 96,
      "08.02": 94,
      "09.02": 93
    },
    totalScore: 94.3,
    kinerjaScore: 47.1,
    perilakuScore: 47.2,
    grade: "Sangat Memuaskan",
    rewardStatus: "DISETUJUI_YAYASAN",
    rewardTitle: "Juara 2 Guru Inovatif & Berprestasi",
    rewardDetail: "Uang Pembinaan Yayasan Rp 1.000.000 + Piagam Penghargaan Resmi",
    rewardAmount: 1000000,
    evaluatorName: "Masykur Rohana, S.Sos (Kepala Sekolah)",
    acknowledgedBy: "Drs. H. M. Syukri, M.M (Ketua Yayasan)",
    evaluationDate: "2026-12-18",
    notes: "Daya serap siswa sangat tinggi, penerapan metode saintifik dan literasi digital di kelas 4 berjalan sangat sukses."
  },
  {
    id: "kpi-3",
    teacherId: "tch-3",
    teacherName: "Mega Andini Putri, S.Pd",
    teacherNip: "1992082003",
    teacherRole: "Guru Wali Kelas 6",
    rombel: "Kelas 6 (Imam Bukhari)",
    period: "Semester Ganjil 2026/2027",
    academicYear: "2026/2027",
    subScores: {
      "01.00": 94,
      "01.01": 92,
      "02.01": 92,
      "02.02": 94,
      "02.03": 90,
      "03.01": 90,
      "03.02": 92,
      "04.02": 92,
      "05.02": 92,
      "06.02": 92,
      "07.02": 95,
      "08.02": 90,
      "09.02": 94
    },
    totalScore: 92.5,
    kinerjaScore: 46.1,
    perilakuScore: 46.4,
    grade: "Sangat Memuaskan",
    rewardStatus: "DISETUJUI_YAYASAN",
    rewardTitle: "Juara 3 Guru Inspiratif Kesiswaan",
    rewardDetail: "Uang Pembinaan Yayasan Rp 750.000 + Piagam Penghargaan Resmi",
    rewardAmount: 750000,
    evaluatorName: "Masykur Rohana, S.Sos (Kepala Sekolah)",
    acknowledgedBy: "Drs. H. M. Syukri, M.M (Ketua Yayasan)",
    evaluationDate: "2026-12-18",
    notes: "Berhasil membimbing persiapan Asesmen Nasional & pembentukan karakter kepemimpinan siswa kelas 6 dengan sangat inspiratif."
  },
  {
    id: "kpi-4",
    teacherId: "tch-4",
    teacherName: "Setia Widi Mawaddah, S.Pd",
    teacherNip: "1993071206",
    teacherRole: "Guru Wali Kelas 2",
    rombel: "Kelas 2 (Ibnu Sina)",
    period: "Semester Ganjil 2026/2027",
    academicYear: "2026/2027",
    subScores: {
      "01.00": 90,
      "01.01": 88,
      "02.01": 90,
      "02.02": 88,
      "02.03": 88,
      "03.01": 88,
      "03.02": 88,
      "04.02": 90,
      "05.02": 88,
      "06.02": 90,
      "07.02": 92,
      "08.02": 88,
      "09.02": 90
    },
    totalScore: 89.4,
    kinerjaScore: 44.6,
    perilakuScore: 44.8,
    grade: "Memuaskan",
    rewardStatus: "DISETUJUI_YAYASAN",
    rewardTitle: "Insentif Kinerja & Apresiasi Yayasan",
    rewardDetail: "Insentif Pencapaian Kinerja Rp 500.000 + Sertifikat Apresiasi",
    rewardAmount: 500000,
    evaluatorName: "Masykur Rohana, S.Sos (Kepala Sekolah)",
    acknowledgedBy: "Drs. H. M. Syukri, M.M (Ketua Yayasan)",
    evaluationDate: "2026-12-18",
    notes: "Kinerja stabil dan tertib. Sangat baik dalam mengkondisikan ketertiban anak di kelas 2."
  },
  {
    id: "kpi-5",
    teacherId: "tch-5",
    teacherName: "Ahmad Fauzi, S.Pd",
    teacherNip: "1989022008",
    teacherRole: "Guru PJOK 1-6",
    rombel: "Kelas 1-6 (PJOK)",
    period: "Semester Ganjil 2026/2027",
    academicYear: "2026/2027",
    subScores: {
      "01.00": 88,
      "01.01": 86,
      "02.01": 88,
      "02.02": 90,
      "02.03": 88,
      "03.01": 88,
      "03.02": 88,
      "04.02": 90,
      "05.02": 90,
      "06.02": 88,
      "07.02": 94,
      "08.02": 88,
      "09.02": 88
    },
    totalScore: 88.9,
    kinerjaScore: 44.3,
    perilakuScore: 44.6,
    grade: "Memuaskan",
    rewardStatus: "DISETUJUI_YAYASAN",
    rewardTitle: "Insentif Kinerja & Apresiasi Yayasan",
    rewardDetail: "Insentif Pencapaian Kinerja Rp 500.000 + Sertifikat Apresiasi",
    rewardAmount: 500000,
    evaluatorName: "Masykur Rohana, S.Sos (Kepala Sekolah)",
    acknowledgedBy: "Drs. H. M. Syukri, M.M (Ketua Yayasan)",
    evaluationDate: "2026-12-18",
    notes: "Aktivitas fisik siswa berlangsung semarak dan aman. Kehadiran sangat disiplin."
  },
  {
    id: "kpi-6",
    teacherId: "tch-6",
    teacherName: "Nurbibiyatillah",
    teacherNip: "1994011507",
    teacherRole: "Guru Wali Kelas 5",
    rombel: "Kelas 5 (Al-Biruni)",
    period: "Semester Ganjil 2026/2027",
    academicYear: "2026/2027",
    subScores: {
      "01.00": 86,
      "01.01": 86,
      "02.01": 88,
      "02.02": 86,
      "02.03": 85,
      "03.01": 86,
      "03.02": 86,
      "04.02": 88,
      "05.02": 86,
      "06.02": 88,
      "07.02": 92,
      "08.02": 85,
      "09.02": 86
    },
    totalScore: 86.9,
    kinerjaScore: 43.1,
    perilakuScore: 43.8,
    grade: "Memuaskan",
    rewardStatus: "DISETUJUI_YAYASAN",
    rewardTitle: "Insentif Kinerja & Apresiasi Yayasan",
    rewardDetail: "Insentif Pencapaian Kinerja Rp 500.000 + Sertifikat Apresiasi",
    rewardAmount: 500000,
    evaluatorName: "Masykur Rohana, S.Sos (Kepala Sekolah)",
    acknowledgedBy: "Drs. H. M. Syukri, M.M (Ketua Yayasan)",
    evaluationDate: "2026-12-18",
    notes: "Pengelolaan kelas 5 kondusif dan pencapaian akademik sesuai target kurikulum."
  },
  {
    id: "kpi-7",
    teacherId: "tch-7",
    teacherName: "Subihat, S.Pd",
    teacherNip: "1992090912",
    teacherRole: "Guru Koord BPI",
    rombel: "Bina Pribadi Islam",
    period: "Semester Ganjil 2026/2027",
    academicYear: "2026/2027",
    subScores: {
      "01.00": 88,
      "01.01": 88,
      "02.01": 86,
      "02.02": 88,
      "02.03": 86,
      "03.01": 86,
      "03.02": 88,
      "04.02": 88,
      "05.02": 86,
      "06.02": 88,
      "07.02": 92,
      "08.02": 86,
      "09.02": 88
    },
    totalScore: 87.8,
    kinerjaScore: 43.5,
    perilakuScore: 44.3,
    grade: "Memuaskan",
    rewardStatus: "DISETUJUI_YAYASAN",
    rewardTitle: "Insentif Kinerja & Apresiasi Yayasan",
    rewardDetail: "Insentif Pencapaian Kinerja Rp 500.000 + Sertifikat Apresiasi",
    rewardAmount: 500000,
    evaluatorName: "Masykur Rohana, S.Sos (Kepala Sekolah)",
    acknowledgedBy: "Drs. H. M. Syukri, M.M (Ketua Yayasan)",
    evaluationDate: "2026-12-18",
    notes: "Koordinasi program Bina Pribadi Islam dan pembiasaan sholat dhuha/dzuhur berjalan istiqomah."
  }
];
