import ReactModule, {
  useState as fallbackUseState,
  useEffect as fallbackUseEffect,
  useMemo as fallbackUseMemo,
  useRef as fallbackUseRef
} from "react";
import {
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
  Eye,
  Trash2,
  Printer,
  Download,
  Search,
  Filter,
  UserCheck,
  Award,
  BookOpen,
  Calendar,
  Check,
  FileCheck,
  ExternalLink,
  Info,
  Layers,
  Sparkles,
  ChevronDown,
  X
} from "lucide-react";

// Master Standar Sasaran Kerja Individu (SKI) sesuai Dokumen Kurikulum Merdeka & Evaluasi Kinerja
export const DEFAULT_SKI_TEMPLATE = [
  {
    no: 1,
    group: "Kinerja",
    targetName: "Perencanaan Pembelajaran dalam jurnal",
    code: "01.00",
    performanceMeasure: "Menyusun Modul Ajar dan Alur Tujuan Pembelajaran (ATP) yang sesuai dengan karakteristik serta fase perkembangan peserta didik.",
    weight: 10,
    targetUnit: "Modul Ajar & ATP",
    category: "PERENCANAAN"
  },
  {
    no: 1,
    group: "Kinerja",
    targetName: "Perencanaan Pembelajaran dalam jurnal",
    code: "01.01",
    performanceMeasure: "Merancang materi esensial yang memberikan waktu fleksibel untuk pengembangan kompetensi dasar, seperti literasi dan numerasi",
    weight: 5,
    targetUnit: "Perangkat Materi Esensial",
    category: "PERENCANAAN"
  },
  {
    no: 2,
    group: "Kinerja",
    targetName: "Pelaksanaan Pembelajaran",
    code: "02.01",
    performanceMeasure: "Menerapkan pembelajaran berdiferensiasi yang disesuaikan dengan tahap pencapaian kemampuan siswa yang beragam",
    weight: 10,
    targetUnit: "RPP / Skenario Berdiferensiasi",
    category: "PELAKSANAAN"
  },
  {
    no: 2,
    group: "Kinerja",
    targetName: "Pelaksanaan Pembelajaran",
    code: "02.02",
    performanceMeasure: "Melibatkan siswa secara aktif dalam Projek Penguatan Profil Pelajar Pancasila (P5) untuk membentuk karakter intrapersonal dan ekstrinsik",
    weight: 10,
    targetUnit: "Modul Projek P5 & Dokumentasi",
    category: "PELAKSANAAN"
  },
  {
    no: 2,
    group: "Kinerja",
    targetName: "Pelaksanaan Pembelajaran",
    code: "02.03",
    performanceMeasure: "Mengelola kelas secara efektif dengan fokus pada 8 indikator kinerja guru seperti keteraturan suasana kelas, penerapan disiplin positif, dan umpan balik konstruktif",
    weight: 5,
    targetUnit: "Jurnal Kelas & Rubrik Disiplin",
    category: "PELAKSANAAN"
  },
  {
    no: 3,
    group: "Kinerja",
    targetName: "Asesmen dan Evaluasi",
    code: "03.01",
    performanceMeasure: "Melakukan asesmen diagnostik di awal pembelajaran untuk memetakan posisi dan kebutuhan belajar peserta didik.",
    weight: 5,
    targetUnit: "Instrumen & Hasil Asesmen Diagnostik",
    category: "ASESMEN"
  },
  {
    no: 3,
    group: "Kinerja",
    targetName: "Asesmen dan Evaluasi",
    code: "03.02",
    performanceMeasure: "Menggunakan portofolio dan asesmen autentik secara sistematis guna mengukur kemajuan belajar secara berkelanjutan",
    weight: 5,
    targetUnit: "Portofolio & Rekap Asesmen",
    category: "ASESMEN"
  },
  {
    no: 4,
    group: "Perilaku",
    targetName: "Amanah - Berintegritas & dapat dipercaya",
    code: "04.02",
    performanceMeasure: "Menjaga dan melaksanakan KBM dengan nilai diatas standar capaian pembelajaran",
    weight: 5,
    targetUnit: "Daftar Hadir & Ketuntasan KBM",
    category: "PERILAKU_AMANAH"
  },
  {
    no: 5,
    group: "Perilaku",
    targetName: "Kompeten - Cakap pada bidang pelajaran",
    code: "05.02",
    performanceMeasure: "Memenuhi kegiatan belajar dengan tuntas",
    weight: 5,
    targetUnit: "Laporan Ketuntasan Kurikulum",
    category: "PERILAKU_KOMPETEN"
  },
  {
    no: 6,
    group: "Perilaku",
    targetName: "Harmonis - Saling mendukung kegiatan",
    code: "06.02",
    performanceMeasure: "Memberikan usulan atau pendapat pada ruang rapat serta memberikan solusi untuk lembaga dan rekan kerja.",
    weight: 10,
    targetUnit: "Notula Rapat & Rekomendasi",
    category: "PERILAKU_HARMONIS"
  },
  {
    no: 7,
    group: "Perilaku",
    targetName: "Loyal - Berkomitmen dan Berdedikasi",
    code: "07.02",
    performanceMeasure: "Setiap tugas yang diberikan selalu dilaksanakan sesuai waktu yang ditetapkan",
    weight: 10,
    targetUnit: "Rekap Ketepatan Waktu & Tugas Tambahan",
    category: "PERILAKU_LOYAL"
  },
  {
    no: 8,
    group: "Perilaku",
    targetName: "Adaptif - Inovasi Berkesinambungan",
    code: "08.02",
    performanceMeasure: "Inovasi yang dimunculkan dalam small group activity dengan improve yang berkelanjutan serta melibatkan siswa",
    weight: 10,
    targetUnit: "Laporan Inovasi / Video KBM Kreatif",
    category: "PERILAKU_ADAPTIF"
  },
  {
    no: 9,
    group: "Perilaku",
    targetName: "Kolaboratif - Bekerja Sama",
    code: "09.02",
    performanceMeasure: "Kerjasama dengan unit lain dalam program sekolah dan komunikasi dengan orang tua siswa dalam hal update capaian prestasi siswa",
    weight: 10,
    targetUnit: "Buku Penghubung / Laporan Kolaborasi",
    category: "PERILAKU_KOLABORATIF"
  }
];

export default function SasaranKerjaIndividu(props = {}) {
  const ActiveReact = props?.React || (typeof window !== "undefined" && window.__AppReact) || ReactModule;
  const useState = ActiveReact?.useState ? ActiveReact.useState.bind(ActiveReact) : fallbackUseState;
  const useEffect = ActiveReact?.useEffect ? ActiveReact.useEffect.bind(ActiveReact) : fallbackUseEffect;
  const useMemo = ActiveReact?.useMemo ? ActiveReact.useMemo.bind(ActiveReact) : fallbackUseMemo;
  const useRef = ActiveReact?.useRef ? ActiveReact.useRef.bind(ActiveReact) : fallbackUseRef;

  const {
    teachers = [],
    currentRole = "GURU",
    foundationProfile = {},
    activeTeacherId = null
  } = props;
  // Safe teachers fallback list
  const safeTeachers = useMemo(() => {
    if (Array.isArray(teachers) && teachers.length > 0) {
      return teachers.map((t, idx) => ({
        id: t?.id || `tch-${idx + 1}`,
        name: t?.name || `Guru ${idx + 1}`,
        nip: t?.nip || t?.nipy || "1985031201",
        nipy: t?.nipy || t?.nip || "1985031201",
        role: t?.role || "Guru Kelas",
        assignedRombel: t?.assignedRombel || "Semua Rombel"
      }));
    }
    return [
      {
        id: "tch-1",
        name: "Masykur Rohana, S.Sos",
        nip: "1985031201",
        nipy: "NIPY. 1985031201",
        role: "Kepala Sekolah",
        assignedRombel: "Kepala Sekolah"
      },
      {
        id: "tch-2",
        name: "Usth. Siti Aisyah, S.Pd",
        nip: "1990041502",
        nipy: "NIPY. 1990041502",
        role: "Guru Kelas 1",
        assignedRombel: "Kelas 1"
      },
      {
        id: "tch-3",
        name: "Ust. Ahmad Dahlan, S.Pd.I",
        nip: "1988112003",
        nipy: "NIPY. 1988112003",
        role: "Guru PAI & Tahfidz",
        assignedRombel: "Kelas 2"
      }
    ];
  }, [teachers]);

  // Safe foundation profile fallback
  const safeProfile = useMemo(() => {
    const p = (foundationProfile && typeof foundationProfile === "object") ? foundationProfile : {};
    return {
      name: p.name || "Yayasan Pendidikan Daarul Habibah",
      schoolName: p.schoolName || "SDIT EL-FATAH SERANG",
      address: p.address || "Jl. Raya Serang - Pandeglang, Banten",
      phone: p.phone || "021-7890123",
      headmasterName: p.headmasterName || "Masykur Rohana, S.Sos",
      headmasterNip: p.headmasterNip || "1985031201",
      ...p
    };
  }, [foundationProfile]);

  // 1. Current Selected Teacher
  const [selectedTeacherId, setSelectedTeacherId] = useState(() => {
    if (activeTeacherId && safeTeachers.some((t) => t.id === activeTeacherId)) return activeTeacherId;
    return safeTeachers[0]?.id || "tch-1";
  });

  useEffect(() => {
    if (!safeTeachers.some((t) => t.id === selectedTeacherId)) {
      if (safeTeachers.length > 0) {
        setSelectedTeacherId(safeTeachers[0].id);
      }
    }
  }, [safeTeachers, selectedTeacherId]);

  const [academicYear, setAcademicYear] = useState("2026/2027 Semester Ganjil");
  const [filterGroup, setFilterGroup] = useState("ALL");
  const [filterAttachment, setFilterAttachment] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState(null);
  const [deleteConfirmCode, setDeleteConfirmCode] = useState(null);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // 2. Storage for SKI records per teacher & academic year
  // Record structure: { [teacherId]: { [academicYear]: { [code]: { pdfName, pdfSize, pdfData, docUrl, notes, score, status, verifiedAt, feedback } } } }
  const [skiRecords, setSkiRecords] = useState(() => {
    try {
      const saved = localStorage.getItem("yayasan_ski_records");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object" && !Array.isArray(parsed) && Object.keys(parsed).length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error("Error reading yayasan_ski_records", e);
    }
    // Seed initial mock records with sample evidence for teachers
    const initialSeed = {};
    const sampleTchIds = safeTeachers.map((t) => t.id);
    (sampleTchIds.length > 0 ? sampleTchIds : ["tch-1", "tch-2", "tch-3"]).forEach((tId) => {
      initialSeed[tId] = {
        "2026/2027 Semester Ganjil": {
          "01.00": {
            pdfName: `Modul_Ajar_Fase_B_${tId}.pdf`,
            pdfSize: "2.4 MB",
            docUrl: "https://drive.google.com/file/d/sample-modul-ajar-atp/view",
            notes: "Modul ajar kurikulum merdeka telah disesuaikan dengan asesmen awal.",
            score: 95,
            status: "VERIFIED",
            updatedAt: "2026-08-15"
          },
          "01.01": {
            pdfName: `Pemetaan_Materi_Esensial_${tId}.pdf`,
            pdfSize: "1.1 MB",
            docUrl: "https://drive.google.com/file/d/sample-materi-esensial/view",
            notes: "Materi esensial mencakup penguatan literasi membaca dan numerasi berbasis AKM.",
            score: 90,
            status: "VERIFIED",
            updatedAt: "2026-08-16"
          },
          "02.01": {
            pdfName: `RPP_Berdiferensiasi_${tId}.pdf`,
            pdfSize: "3.2 MB",
            docUrl: "",
            notes: "Pembelajaran terdiferensiasi proses dan konten untuk 3 kelompok kesiapan belajar.",
            score: 92,
            status: "SUBMITTED",
            updatedAt: "2026-08-20"
          },
          "02.02": {
            pdfName: `Modul_P5_Kewirausahaan_${tId}.pdf`,
            pdfSize: "4.8 MB",
            docUrl: "https://drive.google.com/file/d/sample-modul-p5/view",
            notes: "Dokumentasi Gelar Karya P5 tema Gaya Hidup Berkelanjutan dan Kearifan Lokal.",
            score: 94,
            status: "SUBMITTED",
            updatedAt: "2026-08-22"
          },
          "04.02": {
            pdfName: `Jurnal_KBM_Ketuntasan_${tId}.pdf`,
            pdfSize: "1.5 MB",
            docUrl: "",
            notes: "Kehadiran KBM 100% dan seluruh target capaian pembelajaran tuntas di atas KKM.",
            score: 96,
            status: "VERIFIED",
            updatedAt: "2026-08-25"
          }
        }
      };
    });
    return initialSeed;
  });

  useEffect(() => {
    try {
      localStorage.setItem("yayasan_ski_records", JSON.stringify(skiRecords));
    } catch (e) {
      console.error("Failed to save yayasan_ski_records", e);
    }
  }, [skiRecords]);

  // Selected Teacher Info
  const selectedTeacher = useMemo(() => {
    return (
      safeTeachers.find((t) => t.id === selectedTeacherId) ||
      safeTeachers[0] || {
        id: "tch-1",
        name: "Masykur Rohana, S.Sos",
        nip: "1985031201",
        nipy: "NIPY. 1985031201",
        role: "Kepala Sekolah",
        assignedRombel: "Semua Rombel"
      }
    );
  }, [safeTeachers, selectedTeacherId]);

  // Current Teacher's Data for Academic Year
  const currentTeacherEntries = useMemo(() => {
    if (!skiRecords || typeof skiRecords !== "object") return {};
    const tchData = skiRecords[selectedTeacherId];
    if (!tchData || typeof tchData !== "object") return {};
    return tchData[academicYear] || {};
  }, [skiRecords, selectedTeacherId, academicYear]);

  // Statistics Calculation
  const stats = useMemo(() => {
    let totalWeight = 0;
    let completedWeight = 0;
    let totalScoreSum = 0;
    let filledCount = 0;
    let verifiedCount = 0;

    let performanceWeight = 0;
    let performanceCompletedWeight = 0;
    let behaviorWeight = 0;
    let behaviorCompletedWeight = 0;

    DEFAULT_SKI_TEMPLATE.forEach((item) => {
      totalWeight += item.weight;
      if (item.group === "Kinerja") performanceWeight += item.weight;
      else behaviorWeight += item.weight;

      const entry = currentTeacherEntries[item.code];
      const hasAttachment = entry && (entry.pdfName || entry.docUrl);
      if (hasAttachment) {
        completedWeight += item.weight;
        filledCount += 1;
        if (item.group === "Kinerja") performanceCompletedWeight += item.weight;
        else behaviorCompletedWeight += item.weight;
      }
      if (entry && entry.status === "VERIFIED") {
        verifiedCount += 1;
      }
      const score = entry && entry.score ? entry.score : (hasAttachment ? 90 : 0);
      totalScoreSum += (score * item.weight) / 100;
    });

    return {
      totalWeight,
      completedWeight,
      progressPercent: Math.round((completedWeight / totalWeight) * 100),
      totalScoreSum: Math.round(totalScoreSum * 10) / 10,
      filledCount,
      totalCount: DEFAULT_SKI_TEMPLATE.length,
      verifiedCount,
      performanceWeight,
      performanceCompletedWeight,
      behaviorWeight,
      behaviorCompletedWeight
    };
  }, [currentTeacherEntries]);

  // Filtered List
  const filteredList = useMemo(() => {
    return DEFAULT_SKI_TEMPLATE.filter((item) => {
      // Group Filter
      if (filterGroup !== "ALL" && item.group.toUpperCase() !== filterGroup.toUpperCase()) {
        return false;
      }
      // Attachment Filter
      const entry = currentTeacherEntries[item.code];
      const hasAttachment = Boolean(entry && (entry.pdfName || entry.docUrl));
      if (filterAttachment === "ATTACHED" && !hasAttachment) return false;
      if (filterAttachment === "MISSING" && hasAttachment) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchCode = item.code.toLowerCase().includes(q);
        const matchTarget = item.targetName.toLowerCase().includes(q);
        const matchMeasure = item.performanceMeasure.toLowerCase().includes(q);
        const matchNotes = entry?.notes?.toLowerCase().includes(q);
        return matchCode || matchTarget || matchMeasure || matchNotes;
      }
      return true;
    });
  }, [filterGroup, filterAttachment, searchQuery, currentTeacherEntries]);

  // Upload / Edit Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [formNotes, setFormNotes] = useState("");
  const [formDocUrl, setFormDocUrl] = useState("");
  const [formScore, setFormScore] = useState(90);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [fileError, setFileError] = useState("");

  // Preview Modal State
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewData, setPreviewData] = useState(null);

  // Print Preview Modal State
  const [printModalOpen, setPrintModalOpen] = useState(false);

  // File Input Ref
  const fileInputRef = useRef(null);

  const openUploadModal = (item) => {
    setActiveItem(item);
    const existing = currentTeacherEntries[item.code] || {};
    setFormNotes(existing.notes || "");
    setFormDocUrl(existing.docUrl || "");
    setFormScore(existing.score || 90);
    setUploadedFile(existing.pdfName ? { name: existing.pdfName, size: existing.pdfSize || "1.8 MB", data: existing.pdfData } : null);
    setFileError("");
    setModalOpen(true);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".pdf") && !file.type.includes("pdf")) {
      setFileError("Hanya file dokumen berekstensi .PDF yang diperbolehkan!");
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setFileError("Ukuran file maksimal adalah 15 MB.");
      return;
    }

    const sizeStr = (file.size / (1024 * 1024)).toFixed(2) + " MB";
    const reader = new FileReader();
    reader.onload = () => {
      setUploadedFile({
        name: file.name,
        size: sizeStr,
        data: reader.result
      });
      setFileError("");
    };
    reader.readAsDataURL(file);
  };

  const handleSaveEntry = (e) => {
    e.preventDefault();
    if (!activeItem) return;

    const code = activeItem.code;
    setSkiRecords((prev) => {
      const tchData = prev[selectedTeacherId] || {};
      const yrData = tchData[academicYear] || {};
      const currentEntry = yrData[code] || {};

      const updatedEntry = {
        ...currentEntry,
        pdfName: uploadedFile ? uploadedFile.name : currentEntry.pdfName || "",
        pdfSize: uploadedFile ? uploadedFile.size : currentEntry.pdfSize || "",
        pdfData: uploadedFile ? uploadedFile.data : currentEntry.pdfData || null,
        docUrl: formDocUrl.trim(),
        notes: formNotes.trim(),
        score: Number(formScore) || 90,
        status: currentEntry.status || "SUBMITTED",
        updatedAt: new Date().toISOString().split("T")[0]
      };

      return {
        ...prev,
        [selectedTeacherId]: {
          ...tchData,
          [academicYear]: {
            ...yrData,
            [code]: updatedEntry
          }
        }
      };
    });

    setModalOpen(false);
    setToastMessage(`Bukti lampiran untuk kode ${code} berhasil disimpan!`);
  };

  const confirmDeleteAttachment = (code) => {
    setDeleteConfirmCode(code);
  };

  const executeDeleteAttachment = () => {
    if (!deleteConfirmCode) return;
    const code = deleteConfirmCode;

    setSkiRecords((prev) => {
      const tchData = prev[selectedTeacherId] || {};
      const yrData = tchData[academicYear] || {};
      const currentEntry = yrData[code] || {};

      const updatedEntry = {
        ...currentEntry,
        pdfName: "",
        pdfSize: "",
        pdfData: null,
        docUrl: ""
      };

      return {
        ...prev,
        [selectedTeacherId]: {
          ...tchData,
          [academicYear]: {
            ...yrData,
            [code]: updatedEntry
          }
        }
      };
    });

    setDeleteConfirmCode(null);
    setToastMessage(`Lampiran bukti kode ${code} berhasil dihapus.`);
  };

  const handleVerifyEntry = (code, approve = true) => {
    setSkiRecords((prev) => {
      const tchData = prev[selectedTeacherId] || {};
      const yrData = tchData[academicYear] || {};
      const currentEntry = yrData[code] || {};

      const updatedEntry = {
        ...currentEntry,
        status: approve ? "VERIFIED" : "REVISION",
        verifiedAt: new Date().toISOString().split("T")[0]
      };

      return {
        ...prev,
        [selectedTeacherId]: {
          ...tchData,
          [academicYear]: {
            ...yrData,
            [code]: updatedEntry
          }
        }
      };
    });
    setToastMessage(`Eviden kode ${code} ${approve ? "diverifikasi & disetujui" : "diminta perbaikan"}.`);
  };

  const openPreview = (item, entry) => {
    setPreviewData({ item, entry });
    setPreviewModalOpen(true);
  };

  const isKepsekOrAdmin = currentRole === "KEPALA_SEKOLAH" || currentRole === "SUPERADMIN" || currentRole === "KETUA_YAYASAN";

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-emerald-950 text-white p-5 sm:p-6 rounded-3xl border border-emerald-800/50 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 border border-emerald-400/40 rounded-full text-[11px] font-black text-emerald-300 uppercase tracking-wider">
              <Award className="w-3.5 h-3.5" />
              <span>Standar Sasaran Kerja Individu (SKI) Guru 100%</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Daftar Sasaran Kerja Individu (SKI) Guru & Bukti Lampiran PDF
            </h2>
            <p className="text-xs sm:text-sm text-emerald-200/90 max-w-3xl leading-relaxed">
              Modul perencanaan, pengukuran kinerja, dan verifikasi eviden/portofolio digital guru berbasis Kurikulum Merdeka & 8 Indikator Kinerja Guru SDIT EL-FATAH.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setPrintModalOpen(true)}
              className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-md flex items-center gap-2 transition cursor-pointer active:scale-95"
            >
              <Printer className="w-4 h-4 text-slate-950" />
              <span>Cetak / Pratinjau SKI (PDF)</span>
            </button>
          </div>
        </div>

        {/* Dynamic Controls Bar */}
        <div className="mt-5 pt-4 border-t border-emerald-800/50 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Teacher Selection */}
          <div className="bg-emerald-950/60 p-2.5 rounded-2xl border border-emerald-700/50">
            <label className="block text-[10px] font-bold text-emerald-300 uppercase mb-1">
              Pilih Guru / Wali Kelas:
            </label>
            <select
              value={selectedTeacherId}
              onChange={(e) => setSelectedTeacherId(e.target.value)}
              className="w-full bg-slate-900 border border-emerald-500/40 rounded-xl px-2.5 py-1.5 text-xs font-bold text-white focus:outline-none focus:border-emerald-400"
            >
              {safeTeachers.map((tch) => (
                <option key={tch.id} value={tch.id}>
                  {tch.name} ({tch.role || tch.assignedRombel})
                </option>
              ))}
            </select>
          </div>

          {/* Academic Year */}
          <div className="bg-emerald-950/60 p-2.5 rounded-2xl border border-emerald-700/50">
            <label className="block text-[10px] font-bold text-emerald-300 uppercase mb-1">
              Tahun Ajaran & Semester:
            </label>
            <select
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              className="w-full bg-slate-900 border border-emerald-500/40 rounded-xl px-2.5 py-1.5 text-xs font-bold text-white focus:outline-none focus:border-emerald-400"
            >
              <option value="2026/2027 Semester Ganjil">2026/2027 Semester Ganjil</option>
              <option value="2026/2027 Semester Genap">2026/2027 Semester Genap</option>
              <option value="2025/2026 Semester Ganjil">2025/2026 Semester Ganjil</option>
              <option value="2025/2026 Semester Genap">2025/2026 Semester Genap</option>
            </select>
          </div>

          {/* Teacher Info Card */}
          <div className="bg-emerald-950/60 p-2.5 rounded-2xl border border-emerald-700/50 sm:col-span-2 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300 font-bold shrink-0">
                <UserCheck className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-black text-amber-300 truncate">{selectedTeacher.name}</p>
                <p className="text-[11px] text-emerald-200 truncate">
                  {selectedTeacher.nipy || selectedTeacher.nip || "NIP. 1985031201"} • {selectedTeacher.role || "Guru Kelas"}
                </p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                Status: Aktif
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview Bento */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase">Total Bobot SKI</p>
            <p className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">100%</p>
            <p className="text-[10px] text-slate-400 mt-0.5">13 Indikator / 9 Aspek</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center">
            <FileCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase">Kelengkapan Eviden</p>
            <p className="text-xl sm:text-2xl font-black text-emerald-600 mt-0.5">
              {stats.filledCount} / {stats.totalCount}
            </p>
            <p className="text-[10px] text-emerald-700 font-bold mt-0.5">
              {stats.completedWeight}% Terpenuhi
            </p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center">
            <Upload className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase">Bobot Kinerja : Perilaku</p>
            <p className="text-lg sm:text-xl font-black text-slate-900 mt-0.5">
              45% : 55%
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5">
              Kin: {stats.performanceCompletedWeight}% • Prl: {stats.behaviorCompletedWeight}%
            </p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-700 border border-purple-200 flex items-center justify-center">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase">Skor Capaian SKI</p>
            <p className="text-xl sm:text-2xl font-black text-amber-600 mt-0.5">
              {stats.totalScoreSum}
            </p>
            <p className="text-[10px] text-emerald-600 font-bold mt-0.5">
              {stats.totalScoreSum >= 90 ? "Kategori: Sangat Baik" : stats.totalScoreSum >= 75 ? "Kategori: Baik" : "Kategori: Cukup"}
            </p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Group Filter */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setFilterGroup("ALL")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                filterGroup === "ALL" ? "bg-slate-900 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Semua Kategori (13)
            </button>
            <button
              type="button"
              onClick={() => setFilterGroup("KINERJA")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                filterGroup === "KINERJA" ? "bg-emerald-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Kinerja (45%)
            </button>
            <button
              type="button"
              onClick={() => setFilterGroup("PERILAKU")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                filterGroup === "PERILAKU" ? "bg-blue-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Perilaku (55%)
            </button>
          </div>

          {/* Attachment Status Filter */}
          <select
            value={filterAttachment}
            onChange={(e) => setFilterAttachment(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">Status Lampiran: Semua</option>
            <option value="ATTACHED">Sudah Ada Bukti PDF</option>
            <option value="MISSING">Belum Upload PDF</option>
          </select>
        </div>

        {/* Search */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari kode / indikator SKI..."
            className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-1.5 text-xs font-medium focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Main Table Matching the User's Image */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-800 font-extrabold text-[11px] uppercase tracking-wider border-b border-slate-200 text-center">
                <th className="p-3 border-r border-slate-200 w-12">NO</th>
                <th className="p-3 border-r border-slate-200 w-24">KLP</th>
                <th className="p-3 border-r border-slate-200 text-left min-w-[180px]">Sasaran Kerja</th>
                <th className="p-3 border-r border-slate-200 w-16">Kode</th>
                <th className="p-3 border-r border-slate-200 text-left min-w-[340px]">Ukuran Prestasi Kerja</th>
                <th className="p-3 border-r border-slate-200 w-16">Bobot</th>
                <th className="p-3 min-w-[200px]">Bukti Lampiran PDF & Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-normal text-slate-800">
              {filteredList.map((item, idx) => {
                const entry = currentTeacherEntries[item.code] || {};
                const hasPdf = Boolean(entry.pdfName);
                const hasUrl = Boolean(entry.docUrl);
                const isVerified = entry.status === "VERIFIED";

                // Check if this row is the start of a group for NO and KLP rowSpan styling
                const isKinerja = item.group === "Kinerja";

                return (
                  <tr
                    key={item.code}
                    className={`hover:bg-slate-50/80 transition ${
                      hasPdf || hasUrl ? "bg-emerald-50/15" : ""
                    }`}
                  >
                    {/* NO */}
                    <td className="p-3 border-r border-slate-200 text-center font-bold text-slate-700 align-top">
                      {item.no}
                    </td>

                    {/* KLP */}
                    <td className="p-3 border-r border-slate-200 text-center align-top">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isKinerja
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                            : "bg-blue-100 text-blue-800 border border-blue-200"
                        }`}
                      >
                        {item.group}
                      </span>
                    </td>

                    {/* Sasaran Kerja */}
                    <td className="p-3 border-r border-slate-200 align-top font-bold text-slate-900 leading-snug">
                      <div>{item.targetName}</div>
                      <span className="text-[10px] font-normal text-slate-400 block mt-0.5">
                        Target: {item.targetUnit}
                      </span>
                    </td>

                    {/* Kode */}
                    <td className="p-3 border-r border-slate-200 text-center align-top font-mono font-black text-emerald-700">
                      {item.code}
                    </td>

                    {/* Ukuran Prestasi Kerja */}
                    <td className="p-3 border-r border-slate-200 align-top text-slate-700 leading-relaxed font-medium">
                      <p>{item.performanceMeasure}</p>
                      {entry.notes && (
                        <div className="mt-1.5 p-2 bg-amber-50/80 border border-amber-200 rounded-lg text-[11px] text-amber-900 font-sans">
                          <span className="font-bold text-amber-950">Catatan Guru: </span>
                          {entry.notes}
                        </div>
                      )}
                    </td>

                    {/* Bobot */}
                    <td className="p-3 border-r border-slate-200 text-center align-top font-black text-slate-900 font-mono text-sm">
                      {item.weight}%
                    </td>

                    {/* Bukti Lampiran PDF */}
                    <td className="p-3 align-top">
                      <div className="space-y-2">
                        {hasPdf || hasUrl ? (
                          <div className="p-2.5 bg-white border border-emerald-200 rounded-xl shadow-xs space-y-1.5">
                            {hasPdf && (
                              <div className="flex items-center justify-between gap-1.5">
                                <div className="flex items-center gap-1.5 min-w-0">
                                  <FileText className="w-4 h-4 text-rose-500 shrink-0" />
                                  <span className="font-bold text-slate-900 text-xs truncate" title={entry.pdfName}>
                                    {entry.pdfName}
                                  </span>
                                </div>
                                <span className="text-[10px] font-mono text-slate-400 shrink-0">
                                  {entry.pdfSize}
                                </span>
                              </div>
                            )}

                            {hasUrl && (
                              <div className="flex items-center gap-1.5 text-[11px] text-blue-600 truncate">
                                <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                                <a
                                  href={entry.docUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="underline font-medium hover:text-blue-800 truncate"
                                >
                                  {entry.docUrl}
                                </a>
                              </div>
                            )}

                            <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                              <div className="flex items-center gap-1">
                                {isVerified ? (
                                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-md flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3" />
                                    <span>Sah (Kepsek)</span>
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-md flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    <span>Menunggu Review</span>
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => openPreview(item, entry)}
                                  className="p-1 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition"
                                  title="Pratinjau Dokumen"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => openUploadModal(item)}
                                  className="p-1 text-slate-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition"
                                  title="Edit / Ganti Lampiran"
                                >
                                  <Upload className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => confirmDeleteAttachment(item.code)}
                                  className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition"
                                  title="Hapus Lampiran"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center p-3 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 hover:bg-emerald-50/30 transition">
                            <button
                              type="button"
                              onClick={() => openUploadModal(item)}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-xs flex items-center gap-1.5 transition cursor-pointer active:scale-95"
                            >
                              <Upload className="w-3.5 h-3.5" />
                              <span>Upload PDF / Link</span>
                            </button>
                            <span className="text-[10px] text-slate-400 mt-1">Belum Dilampirkan</span>
                          </div>
                        )}

                        {/* Kepsek Quick Verification Action for Admin */}
                        {isKepsekOrAdmin && (hasPdf || hasUrl) && (
                          <div className="flex items-center gap-1.5 justify-end">
                            {!isVerified ? (
                              <button
                                type="button"
                                onClick={() => handleVerifyEntry(item.code, true)}
                                className="px-2 py-0.5 bg-emerald-700 hover:bg-emerald-600 text-white text-[10px] font-bold rounded flex items-center gap-1 shadow-xs transition"
                              >
                                <Check className="w-3 h-3" />
                                <span>Verifikasi Kepsek</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleVerifyEntry(item.code, false)}
                                className="text-[10px] text-slate-400 hover:text-amber-600 underline font-medium"
                              >
                                Batalkan Verifikasi
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-slate-100 font-extrabold text-slate-900 border-t-2 border-slate-300">
                <td colSpan={5} className="p-3 text-right text-xs uppercase tracking-wider">
                  Total Keseluruhan Bobot SKI (100% Terstandar):
                </td>
                <td className="p-3 text-center text-sm font-black text-emerald-800 font-mono">
                  100%
                </td>
                <td className="p-3 text-center text-xs text-emerald-800 font-bold">
                  {stats.filledCount} dari {stats.totalCount} Dokumen Lengkap ({stats.completedWeight}%)
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Upload & Form Modal */}
      {modalOpen && activeItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-emerald-700 uppercase bg-emerald-100 px-2 py-0.5 rounded-full">
                  Unggah Bukti Lampiran PDF / Dokumen SKI
                </span>
                <h3 className="font-extrabold text-slate-900 text-base mt-1">
                  [{activeItem.code}] {activeItem.targetName}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Bobot: <strong className="text-slate-800">{activeItem.weight}%</strong> • Target: <strong className="text-slate-800">{activeItem.targetUnit}</strong>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed font-medium">
              <strong className="text-slate-900 block mb-0.5">Ukuran Prestasi Kerja:</strong>
              {activeItem.performanceMeasure}
            </div>

            <form onSubmit={handleSaveEntry} className="space-y-4">
              {/* File Upload Box */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Upload File Dokumen / Laporan (Format .PDF)
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".pdf,application/pdf"
                  className="hidden"
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-emerald-300 hover:border-emerald-500 bg-emerald-50/40 rounded-2xl p-4 text-center cursor-pointer transition group"
                >
                  <Upload className="w-8 h-8 text-emerald-600 mx-auto group-hover:scale-110 transition" />
                  <p className="text-xs font-bold text-slate-800 mt-2">
                    {uploadedFile ? uploadedFile.name : "Klik untuk Pilih File PDF"}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {uploadedFile ? `Ukuran: ${uploadedFile.size} • Siap Disimpan` : "Maksimal ukuran file 15 MB (PDF)"}
                  </p>
                </div>
                {fileError && <p className="text-xs text-rose-600 font-bold mt-1">{fileError}</p>}
              </div>

              {/* Document URL Alternative */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tautan Google Drive / Link Berkas (Opsional):
                </label>
                <input
                  type="url"
                  value={formDocUrl}
                  onChange={(e) => setFormDocUrl(e.target.value)}
                  placeholder="https://drive.google.com/file/d/..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Uraian / Catatan Realisasi Guru:
                </label>
                <textarea
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  rows={2}
                  placeholder="Jelaskan ringkasan implementasi dan eviden ketercapaian..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Self-Score */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nilai Ketercapaian (0 - 100):
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formScore}
                    onChange={(e) => setFormScore(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Guru Pengusul:
                  </label>
                  <input
                    type="text"
                    value={selectedTeacher.name}
                    disabled
                    className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-600"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl text-xs shadow-md"
                >
                  Simpan Bukti Lampiran
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewModalOpen && previewData && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-emerald-800 uppercase bg-emerald-100 px-2 py-0.5 rounded-full">
                  Pratinjau Eviden SKI Guru
                </span>
                <h3 className="font-extrabold text-slate-900 text-base mt-1">
                  [{previewData.item.code}] {previewData.item.targetName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setPreviewModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                <p className="text-slate-500 text-[10px] uppercase font-bold">Indikator Ukuran Prestasi Kerja:</p>
                <p className="font-semibold text-slate-900 mt-0.5">{previewData.item.performanceMeasure}</p>
              </div>

              {/* PDF Mock Viewer / Document Preview Container */}
              <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800 text-white space-y-4 text-center">
                <FileText className="w-16 h-16 text-rose-400 mx-auto animate-pulse" />
                <div>
                  <h4 className="font-black text-lg text-white">
                    {previewData.entry?.pdfName || "Dokumen_Bukti_Lampiran.pdf"}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Eviden Resmi Guru: {selectedTeacher.name} • Bobot: {previewData.item.weight}%
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                  {previewData.entry?.pdfData ? (
                    <a
                      href={previewData.entry.pdfData}
                      download={previewData.entry.pdfName}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow"
                    >
                      <Download className="w-4 h-4" />
                      <span>Unduh File Asli (PDF)</span>
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        const dummyContent = `%PDF-1.4\n% Dokumen Eviden SKI: ${previewData.item.code} - ${previewData.item.targetName}\n% Guru: ${selectedTeacher.name}\n1 0 obj\n<< /Title (${previewData.item.targetName}) >>\nendobj\ntrailer\n<< /Root 1 0 R >>\n%%EOF`;
                        const blob = new Blob([dummyContent], { type: "application/pdf" });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = `Dokumen_SKI_${previewData.item.code}_${selectedTeacher.name.replace(/\s+/g, "_")}.pdf`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                        setToastMessage(`Salinan PDF eviden ${previewData.item.code} berhasil diunduh.`);
                      }}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>Unduh Salinan PDF</span>
                    </button>
                  )}

                  {previewData.entry?.docUrl && (
                    <a
                      href={previewData.entry.docUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Buka di Google Drive</span>
                    </a>
                  )}
                </div>
              </div>

              {previewData.entry?.notes && (
                <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-xs">
                  <p className="font-bold text-amber-900">Uraian / Keterangan Realisasi:</p>
                  <p className="text-amber-800 mt-0.5">{previewData.entry.notes}</p>
                </div>
              )}
            </div>

            <div className="pt-3 flex justify-end border-t border-slate-100">
              <button
                type="button"
                onClick={() => setPreviewModalOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs"
              >
                Tutup Pratinjau
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Official Print Preview Modal */}
      {printModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 shadow-2xl border border-slate-200 space-y-6 max-h-[92vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3 print:hidden">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <Printer className="w-5 h-5 text-emerald-600" />
                <span>Format Dokumen Resmi Sasaran Kerja Individu (SKI)</span>
              </h3>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak Dokumen (Print)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPrintModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Area */}
            <div id="printable-ski-doc" className="p-4 sm:p-8 bg-white border border-slate-300 rounded-xl space-y-6 text-slate-900 font-sans">
              {/* Header / Kop Sekolah */}
              <div className="text-center border-b-2 border-slate-900 pb-4 space-y-1">
                <h2 className="text-lg font-black uppercase tracking-wider">
                  YAYASAN PENDIDIKAN DAARUL HABIBAH
                </h2>
                <h1 className="text-xl font-black text-emerald-800 tracking-wide">
                  SDIT EL-FATAH SERANG
                </h1>
                <p className="text-xs text-slate-600 font-medium">
                  {safeProfile.address} • Telp: {safeProfile.phone}
                </p>
                <div className="pt-2">
                  <span className="inline-block px-4 py-1 bg-slate-100 border border-slate-300 rounded-md text-xs font-black uppercase tracking-widest">
                    FORMULIR SASARAN KERJA INDIVIDU (SKI) TENAGA PENDIDIK
                  </span>
                </div>
              </div>

              {/* Teacher Biodata Info */}
              <div className="grid grid-cols-2 text-xs gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="space-y-1.5">
                  <div className="flex">
                    <span className="w-32 font-bold text-slate-600">Nama Guru</span>
                    <span className="font-black text-slate-900">: {selectedTeacher.name}</span>
                  </div>
                  <div className="flex">
                    <span className="w-32 font-bold text-slate-600">NIP / NIPY</span>
                    <span className="font-mono font-bold text-slate-900">: {selectedTeacher.nipy || selectedTeacher.nip || "1985031201"}</span>
                  </div>
                  <div className="flex">
                    <span className="w-32 font-bold text-slate-600">Jabatan / Tugas</span>
                    <span className="font-semibold text-slate-900">: {selectedTeacher.role || "Guru Kelas"}</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex">
                    <span className="w-32 font-bold text-slate-600">Rombongan Belajar</span>
                    <span className="font-bold text-slate-900">: {selectedTeacher.assignedRombel || "Semua Kelas"}</span>
                  </div>
                  <div className="flex">
                    <span className="w-32 font-bold text-slate-600">Tahun Ajaran</span>
                    <span className="font-bold text-slate-900">: {academicYear}</span>
                  </div>
                  <div className="flex">
                    <span className="w-32 font-bold text-slate-600">Total Bobot Kinerja</span>
                    <span className="font-black text-emerald-700">: 100% (45% Kinerja + 55% Perilaku)</span>
                  </div>
                </div>
              </div>

              {/* Table */}
              <table className="w-full text-left text-[10.5px] border border-slate-900 border-collapse">
                <thead>
                  <tr className="bg-slate-200 text-slate-900 font-extrabold uppercase text-center border-b border-slate-900">
                    <th className="p-2 border-r border-slate-900 w-8">NO</th>
                    <th className="p-2 border-r border-slate-900 w-16">KLP</th>
                    <th className="p-2 border-r border-slate-900 text-left min-w-[140px]">Sasaran Kerja</th>
                    <th className="p-2 border-r border-slate-900 w-14">Kode</th>
                    <th className="p-2 border-r border-slate-900 text-left">Ukuran Prestasi Kerja</th>
                    <th className="p-2 border-r border-slate-900 w-12">Bobot</th>
                    <th className="p-2 text-center w-36">Bukti Lampiran PDF</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-400">
                  {DEFAULT_SKI_TEMPLATE.map((item) => {
                    const entry = currentTeacherEntries[item.code] || {};
                    return (
                      <tr key={item.code} className="align-top">
                        <td className="p-2 border-r border-slate-900 text-center font-bold">{item.no}</td>
                        <td className="p-2 border-r border-slate-900 text-center font-semibold">{item.group}</td>
                        <td className="p-2 border-r border-slate-900 font-bold">{item.targetName}</td>
                        <td className="p-2 border-r border-slate-900 text-center font-mono font-bold">{item.code}</td>
                        <td className="p-2 border-r border-slate-900 leading-tight">{item.performanceMeasure}</td>
                        <td className="p-2 border-r border-slate-900 text-center font-bold font-mono">{item.weight}%</td>
                        <td className="p-2 text-center text-[9.5px]">
                          {entry.pdfName ? (
                            <span className="font-bold text-emerald-800">
                              ✓ {entry.pdfName.substring(0, 18)}...
                            </span>
                          ) : entry.docUrl ? (
                            <span className="font-bold text-blue-800">✓ Tautan Drive</span>
                          ) : (
                            <span className="text-slate-400 italic">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-200 font-black border-t-2 border-slate-900">
                    <td colSpan={5} className="p-2 text-right uppercase">
                      Total Bobot Kumulatif:
                    </td>
                    <td className="p-2 text-center font-mono text-xs">100%</td>
                    <td className="p-2 text-center text-xs">
                      {stats.filledCount} / {stats.totalCount} Terlampir
                    </td>
                  </tr>
                </tfoot>
              </table>

              {/* Signatures */}
              <div className="pt-8 grid grid-cols-2 text-xs text-center">
                <div className="space-y-16">
                  <p>
                    Mengetahui,<br />
                    <strong>Kepala Sekolah SDIT EL-FATAH</strong>
                  </p>
                  <div>
                    <p className="font-black underline uppercase">
                      {safeProfile.headmasterName}
                    </p>
                    <p className="text-[10px] text-slate-500 font-mono">
                      NIPY. {safeProfile.headmasterNip}
                    </p>
                  </div>
                </div>

                <div className="space-y-16">
                  <p>
                    Serang, {new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}<br />
                    <strong>Guru Yang Bersangkutan</strong>
                  </p>
                  <div>
                    <p className="font-black underline uppercase">{selectedTeacher.name}</p>
                    <p className="text-[10px] text-slate-500 font-mono">
                      NIPY. {selectedTeacher.nipy || selectedTeacher.nip || "1985031201"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* In-app Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-950 text-emerald-100 border border-emerald-500/50 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-semibold animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="ml-2 text-emerald-400 hover:text-white p-0.5 rounded cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* In-app Delete Confirmation Modal */}
      {deleteConfirmCode && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1.5">
              <h4 className="font-black text-slate-900 text-base">Hapus Bukti Lampiran?</h4>
              <p className="text-xs text-slate-600">
                Apakah Anda yakin ingin menghapus file / tautan dokumen eviden untuk kode SKI{" "}
                <strong className="text-slate-900">{deleteConfirmCode}</strong>?
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmCode(null)}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={executeDeleteAttachment}
                className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition shadow cursor-pointer active:scale-95"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
