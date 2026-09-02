import ReactDefault from "react";
import * as XLSX from "xlsx";

const getActiveReact = () => (typeof window !== "undefined" && window.__AppReact) ? window.__AppReact : ReactDefault;
const useState = (init) => getActiveReact().useState(init);
const useMemo = (factory, deps) => getActiveReact().useMemo(factory, deps);
const useEffect = (effect, deps) => getActiveReact().useEffect(effect, deps);
const useCallback = (cb, deps) => getActiveReact().useCallback(cb, deps);
const useRef = (initial) => getActiveReact().useRef(initial);

import {
  Award,
  Trophy,
  Star,
  Users,
  CheckCircle2,
  TrendingUp,
  DollarSign,
  Calendar,
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  Printer,
  Download,
  Upload,
  FileSpreadsheet,
  BookOpen,
  MessageSquare,
  Target,
  Clock,
  Sparkles,
  X,
  ChevronRight,
  FileText,
  AlertCircle,
  HelpCircle,
  BarChart3,
  ShieldCheck,
  Zap,
  GraduationCap,
  RefreshCw,
  Check,
  Layers,
  Info,
  Clipboard,
  FileCheck,
  Sliders,
  CheckCircle,
  FolderOpen
} from "lucide-react";

// Standar Indikator & Bobot Baku Lampiran Excel Yayasan SDIT EL-FATAH
export const KPI_INDICATOR_STANDARDS = [
  {
    id: "ind-1",
    code: "IND-01",
    name: "Jurnal Mengajar & Elemen Kerja Guru",
    description: "Memenuhi seluruh elemen kerja guru yang tertulis dalam jurnal harian, modul ajar, dan administrasi kelas.",
    weight: 25,
    weightPercent: "25%",
    weightDecimal: 0.25,
    icon: BookOpen,
    color: "from-blue-500 to-indigo-600",
    rubric: [
      { score: "90 - 100", label: "Sangat Lengkap, modul ajar terbit tepat waktu & jurnal terisi 100%" },
      { score: "80 - 89", label: "Lengkap, jurnal terisi konsisten namun ada revisi minor modul" },
      { score: "70 - 79", label: "Cukup lengkap, keterlambatan jurnal 1-2 kali per bulan" },
      { score: "< 70", label: "Kurang lengkap, perlu pembinaan kurikulum yayasan" }
    ]
  },
  {
    id: "ind-2",
    code: "IND-02",
    name: "Komunikasi Prestasi Anak & Orang Tua",
    description: "Membangun komunikasi proaktif dengan anak didik dan orang tua/wali murid terkait capaian belajar & akhlak.",
    weight: 20,
    weightPercent: "20%",
    weightDecimal: 0.20,
    icon: MessageSquare,
    color: "from-emerald-500 to-teal-600",
    rubric: [
      { score: "90 - 100", label: "Sangat Intensif, fast-response, konsultasi wali murid berkala, mutabaah aktif" },
      { score: "80 - 89", label: "Responsif, update catatan berkala kepada wali murid" },
      { score: "70 - 79", label: "Cukup komunikatif, merespons hanya ketika ditanya wali murid" },
      { score: "< 70", label: "Pasif, keluhan dari wali murid terkait update prestasi" }
    ]
  },
  {
    id: "ind-3",
    code: "IND-03",
    name: "Capaian Kompetensi Kurikulum Sekolah",
    description: "Memenuhi ketercapaian target kompetensi, daya serap siswa, dan indikator mutu akademik yang dipersyaratkan.",
    weight: 30,
    weightPercent: "30%",
    weightDecimal: 0.30,
    icon: Target,
    color: "from-amber-500 to-orange-600",
    rubric: [
      { score: "90 - 100", label: "Ketuntasan siswa >= 95%, nilai rata-rata rombel di atas standar target yayasan" },
      { score: "80 - 89", label: "Ketuntasan siswa 85% - 94%, target materi tercapai tepat waktu" },
      { score: "70 - 79", label: "Ketuntasan siswa 75% - 84%, beberapa remedial diperlukan" },
      { score: "< 70", label: "Ketuntasan siswa < 75%, perlu supervisi metode pengajaran" }
    ]
  },
  {
    id: "ind-4",
    code: "IND-04",
    name: "Kehadiran Guru & Kedisiplinan",
    description: "Presensi kehadiran tepat waktu, kedisiplinan mengajar di kelas, dan keikutsertaan apel/kegiatan yayasan.",
    weight: 10,
    weightPercent: "10%",
    weightDecimal: 0.10,
    icon: Clock,
    color: "from-purple-500 to-pink-600",
    rubric: [
      { score: "90 - 100", label: "Kehadiran 98% - 100%, nihil terlambat, teladan kedisiplinan" },
      { score: "80 - 89", label: "Kehadiran 95% - 97%, izin kedinasan terkonfirmasi" },
      { score: "70 - 79", label: "Kehadiran 90% - 94%, terdapat 1-2 kali keterlambatan" },
      { score: "< 70", label: "Kehadiran < 90%, pelanggaran disiplin jam masuk" }
    ]
  },
  {
    id: "ind-5",
    code: "IND-05",
    name: "Improvisasi & Inovasi KBM",
    description: "Kreativitas menciptakan media ajar interaktif, alat peraga, variasi metode belajar, dan suasana kelas menyenangkan.",
    weight: 15,
    weightPercent: "15%",
    weightDecimal: 0.15,
    icon: Sparkles,
    color: "from-rose-500 to-red-600",
    rubric: [
      { score: "90 - 100", label: "Sangat Inovatif, menciptakan alat peraga unik, game edukasi, proyek interaktif" },
      { score: "80 - 89", label: "Inovatif, rutin menggunakan media pembelajaran digital/visual" },
      { score: "70 - 79", label: "Cukup, sesekali menggunakan variasi metode ajar" },
      { score: "< 70", label: "Monoton, pembelajaran ceramah konvensional" }
    ]
  }
];

// Helper currency formatting
export const formatCurrency = (num) => {
  return "Rp " + Number(num || 0).toLocaleString("id-ID");
};

// Helper date formatting
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

// Standar Nilai Baku Awal Yayasan
export const initialKpiEvaluations = [
  {
    id: "kpi-1",
    teacherId: "tch-1",
    teacherName: "Uyat Sukriyati, S.Pd",
    teacherNip: "1991051005",
    teacherRole: "Guru Wali Kelas 1",
    rombel: "Kelas 1 (Fathurrahman)",
    period: "Semester Ganjil 2026/2027",
    academicYear: "2026/2027",
    scoreJournal: 96,
    scoreCommunication: 95,
    scoreCompetence: 94,
    scoreAttendance: 100,
    scoreImprovisation: 94,
    totalScore: 95.3,
    grade: "Sangat Memuaskan",
    rewardStatus: "DISETUJUI_YAYASAN",
    rewardTitle: "Juara 1 Guru Teladan & Berprestasi",
    rewardDetail: "Uang Pembinaan Yayasan Rp 1.500.000 + Piagam Penghargaan Resmi + Prioritas Tunjangan",
    rewardAmount: 1500000,
    evaluatorName: "Masykur Rohana, S.Sos (Kepala Sekolah)",
    acknowledgedBy: "Drs. H. M. Syukri, M.M (Ketua Yayasan)",
    evaluationDate: "2026-12-18",
    notes: "Prestasi luar biasa dalam pendampingan adaptasi siswa baru kelas 1, jurnal 100% disiplin dan komunikasi orang tua sangat harmonis."
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
    scoreJournal: 94,
    scoreCommunication: 92,
    scoreCompetence: 96,
    scoreAttendance: 98,
    scoreImprovisation: 92,
    totalScore: 94.3,
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
    scoreJournal: 92,
    scoreCommunication: 94,
    scoreCompetence: 90,
    scoreAttendance: 95,
    scoreImprovisation: 90,
    totalScore: 91.8,
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
    scoreJournal: 88,
    scoreCommunication: 90,
    scoreCompetence: 88,
    scoreAttendance: 96,
    scoreImprovisation: 86,
    totalScore: 88.9,
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
    scoreJournal: 86,
    scoreCommunication: 88,
    scoreCompetence: 89,
    scoreAttendance: 98,
    scoreImprovisation: 88,
    totalScore: 88.8,
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
    scoreJournal: 85,
    scoreCommunication: 86,
    scoreCompetence: 87,
    scoreAttendance: 95,
    scoreImprovisation: 84,
    totalScore: 86.6,
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
    scoreJournal: 88,
    scoreCommunication: 85,
    scoreCompetence: 88,
    scoreAttendance: 96,
    scoreImprovisation: 85,
    totalScore: 87.8,
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

// Helper kalkulasi skor tertimbang formula resmi Excel Yayasan
export const calculateWeightedKpiScore = (j, c, comp, att, imp) => {
  const sJ = Number(j) || 0;
  const sC = Number(c) || 0;
  const sComp = Number(comp) || 0;
  const sAtt = Number(att) || 0;
  const sImp = Number(imp) || 0;
  const total = (sJ * 0.25) + (sC * 0.20) + (sComp * 0.30) + (sAtt * 0.10) + (sImp * 0.15);
  return Math.round(total * 100) / 100;
};

export const getKpiGradeInfo = (score) => {
  if (score >= 90) return { label: "Sangat Memuaskan (Guru Teladan)", short: "Sangat Memuaskan", badge: "bg-emerald-100 text-emerald-800 border-emerald-300", color: "text-emerald-600", dot: "bg-emerald-500" };
  if (score >= 80) return { label: "Memuaskan (Sesuai Standar)", short: "Memuaskan", badge: "bg-blue-100 text-blue-800 border-blue-300", color: "text-blue-600", dot: "bg-blue-500" };
  if (score >= 70) return { label: "Cukup (Standar Minimal)", short: "Cukup", badge: "bg-amber-100 text-amber-800 border-amber-300", color: "text-amber-600", dot: "bg-amber-500" };
  return { label: "Perlu Pembinaan Khusus", short: "Perlu Pembinaan", badge: "bg-rose-100 text-rose-800 border-rose-300", color: "text-rose-600", dot: "bg-rose-500" };
};

export default function KpiEvaluationModule({
  React: propReact,
  kpiList = [],
  teachers = [],
  currentRole = "SUPERADMIN",
  onAddKpi,
  onUpdateKpi,
  onDeleteKpi,
  onBulkSetKpi,
  foundationProfile
}) {
  if (propReact && typeof window !== "undefined") {
    window.__AppReact = propReact;
  }

  const [selectedPeriod, setSelectedPeriod] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [viewCertificate, setViewCertificate] = useState(null);
  const [showIndicatorsGuide, setShowIndicatorsGuide] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importPreviewData, setImportPreviewData] = useState([]);
  const [importMode, setImportMode] = useState("REPLACE");
  const [isProcessingImport, setIsProcessingImport] = useState(false);
  const [importFileName, setImportFileName] = useState("");
  const [toastMessage, setToastMessage] = useState(null);

  // Import Dialog advanced states
  const [importTab, setImportTab] = useState("FILE"); // "FILE" or "PASTE"
  const [pastedDataText, setPastedDataText] = useState("");
  const [availableSheets, setAvailableSheets] = useState([]);
  const [selectedSheetName, setSelectedSheetName] = useState("");
  const [currentWorkbook, setCurrentWorkbook] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef(null);

  const showToast = (msg, type = "success") => {
    setToastMessage({ msg, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Form states
  const [formTeacherId, setFormTeacherId] = useState("");
  const [formPeriod, setFormPeriod] = useState("Semester Ganjil 2026/2027");
  const [formScoreJournal, setFormScoreJournal] = useState(90);
  const [formScoreCommunication, setFormScoreCommunication] = useState(90);
  const [formScoreCompetence, setFormScoreCompetence] = useState(90);
  const [formScoreAttendance, setFormScoreAttendance] = useState(95);
  const [formScoreImprovisation, setFormScoreImprovisation] = useState(90);
  const [formRewardTitle, setFormRewardTitle] = useState("");
  const [formRewardDetail, setFormRewardDetail] = useState("");
  const [formRewardAmount, setFormRewardAmount] = useState(500000);
  const [formNotes, setFormNotes] = useState("");

  const currentCalculatedScore = calculateWeightedKpiScore(
    formScoreJournal,
    formScoreCommunication,
    formScoreCompetence,
    formScoreAttendance,
    formScoreImprovisation
  );

  // Auto recommend reward title based on score
  useEffect(() => {
    if (!editingItem) {
      if (currentCalculatedScore >= 95) {
        setFormRewardTitle("Juara 1 Guru Teladan & Berprestasi");
        setFormRewardDetail("Uang Pembinaan Yayasan Rp 1.500.000 + Piagam Penghargaan Resmi + Prioritas Tunjangan");
        setFormRewardAmount(1500000);
      } else if (currentCalculatedScore >= 93) {
        setFormRewardTitle("Juara 2 Guru Inovatif & Berprestasi");
        setFormRewardDetail("Uang Pembinaan Yayasan Rp 1.000.000 + Piagam Penghargaan Resmi");
        setFormRewardAmount(1000000);
      } else if (currentCalculatedScore >= 90) {
        setFormRewardTitle("Juara 3 Guru Inspiratif Kesiswaan");
        setFormRewardDetail("Uang Pembinaan Yayasan Rp 750.000 + Piagam Penghargaan Resmi");
        setFormRewardAmount(750000);
      } else if (currentCalculatedScore >= 80) {
        setFormRewardTitle("Insentif Kinerja & Apresiasi Yayasan");
        setFormRewardDetail("Insentif Pencapaian Kinerja Rp 500.000 + Sertifikat");
        setFormRewardAmount(500000);
      } else {
        setFormRewardTitle("Program Pembinaan & Supervisi");
        setFormRewardDetail("Pendampingan Pembelajaran & Evaluasi Bulanan");
        setFormRewardAmount(0);
      }
    }
  }, [currentCalculatedScore, editingItem]);

  const openAddModal = () => {
    setEditingItem(null);
    const firstT = teachers.find(t => (t.role || "").toLowerCase() !== "kepala sekolah") || teachers[0];
    setFormTeacherId(firstT ? firstT.id : "");
    setFormPeriod("Semester Ganjil 2026/2027");
    setFormScoreJournal(92);
    setFormScoreCommunication(90);
    setFormScoreCompetence(94);
    setFormScoreAttendance(98);
    setFormScoreImprovisation(90);
    setFormNotes("Kinerja pembelajaran sangat baik dan memenuhi indikator yayasan.");
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormTeacherId(item.teacherId);
    setFormPeriod(item.period);
    setFormScoreJournal(item.scoreJournal);
    setFormScoreCommunication(item.scoreCommunication);
    setFormScoreCompetence(item.scoreCompetence);
    setFormScoreAttendance(item.scoreAttendance);
    setFormScoreImprovisation(item.scoreImprovisation);
    setFormRewardTitle(item.rewardTitle || "");
    setFormRewardDetail(item.rewardDetail || "");
    setFormRewardAmount(item.rewardAmount || 0);
    setFormNotes(item.notes || "");
    setIsModalOpen(true);
  };

  const handleSaveForm = (ev) => {
    ev.preventDefault();
    const selTeacher = teachers.find(t => t.id === formTeacherId) || { name: "Guru", role: "Guru", nip: "-", assignedRombel: "-" };
    const total = calculateWeightedKpiScore(formScoreJournal, formScoreCommunication, formScoreCompetence, formScoreAttendance, formScoreImprovisation);
    const gradeObj = getKpiGradeInfo(total);

    const payload = {
      id: editingItem ? editingItem.id : "kpi-" + Date.now(),
      teacherId: formTeacherId,
      teacherName: selTeacher.name,
      teacherNip: selTeacher.nip || selTeacher.nipy || "-",
      teacherRole: selTeacher.role || "Guru",
      rombel: selTeacher.assignedRombel || "Kelas",
      period: formPeriod,
      academicYear: "2026/2027",
      scoreJournal: Number(formScoreJournal),
      scoreCommunication: Number(formScoreCommunication),
      scoreCompetence: Number(formScoreCompetence),
      scoreAttendance: Number(formScoreAttendance),
      scoreImprovisation: Number(formScoreImprovisation),
      totalScore: total,
      grade: gradeObj.short,
      rewardStatus: editingItem ? editingItem.rewardStatus : "DISETUJUI_YAYASAN",
      rewardTitle: formRewardTitle,
      rewardDetail: formRewardDetail,
      rewardAmount: Number(formRewardAmount) || 0,
      evaluatorName: "Masykur Rohana, S.Sos (Kepala Sekolah)",
      acknowledgedBy: "Drs. H. M. Syukri, M.M (Ketua Yayasan)",
      evaluationDate: new Date().toISOString().split("T")[0],
      notes: formNotes
    };

    if (editingItem) {
      if (onUpdateKpi) onUpdateKpi(payload);
    } else {
      if (onAddKpi) onAddKpi(payload);
    }
    setIsModalOpen(false);
    showToast("Data KPI " + payload.teacherName + " berhasil disimpan!");
  };

  // Filtered and Sorted
  const filteredList = useMemo(() => {
    return kpiList
      .filter(item => {
        const matchesPeriod = selectedPeriod === "ALL" || item.period === selectedPeriod;
        const matchesSearch =
          (item.teacherName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.rombel || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.teacherNip && item.teacherNip.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesPeriod && matchesSearch;
      })
      .sort((a, b) => b.totalScore - a.totalScore)
      .map((item, idx) => ({ ...item, rank: idx + 1 }));
  }, [kpiList, selectedPeriod, searchQuery]);

  const top3 = filteredList.slice(0, 3);

  // Statistics
  const avgScore = filteredList.length > 0 ? (filteredList.reduce((acc, curr) => acc + curr.totalScore, 0) / filteredList.length).toFixed(2) : "0";
  const totalRewardsAllocated = filteredList.reduce((acc, curr) => acc + (curr.rewardAmount || 0), 0);
  const excellentTeachersCount = filteredList.filter(t => t.totalScore >= 90).length;

  // 1. Download Master Template Excel Standar KPI Yayasan (dengan Rumus Formula Baku)
  const handleDownloadExcelTemplate = () => {
    if (!XLSX || !XLSX.utils) {
      alert("Modul Excel XLSX sedang dimuat, silakan coba lagi.");
      return;
    }

    const availableTeachers = teachers.filter(t => (t.role || "").toLowerCase() !== "kepala sekolah");
    const teachersToUse = availableTeachers.length > 0 ? availableTeachers : [
      { id: "tch-1", name: "Uyat Sukriyati, S.Pd", nip: "1991051005", role: "Guru Wali Kelas 1", assignedRombel: "Kelas 1" },
      { id: "tch-2", name: "Iis Rohmayanti, S.Pd", nip: "1990041502", role: "Guru Wali Kelas 4", assignedRombel: "Kelas 4" },
      { id: "tch-3", name: "Mega Andini Putri, S.Pd", nip: "1992082003", role: "Guru Wali Kelas 6", assignedRombel: "Kelas 6" },
      { id: "tch-4", name: "Setia Widi Mawaddah, S.Pd", nip: "1993071206", role: "Guru Wali Kelas 2", assignedRombel: "Kelas 2" },
      { id: "tch-5", name: "Ahmad Fauzi, S.Pd", nip: "1989022008", role: "Guru PJOK 1-6", assignedRombel: "Kelas 1-6" },
      { id: "tch-6", name: "Nurbibiyatillah", nip: "1994011507", role: "Guru Wali Kelas 5", assignedRombel: "Kelas 5" },
      { id: "tch-7", name: "Subihat, S.Pd", nip: "1992090912", role: "Guru Koord BPI", assignedRombel: "Bina Pribadi Islam" }
    ];

    // Build data rows for template
    const templateRows = teachersToUse.map((t, idx) => {
      const sampleScores = [
        { j: 96, c: 95, comp: 94, att: 100, imp: 94, rew: 1500000, tit: "Juara 1 Guru Teladan & Berprestasi" },
        { j: 94, c: 92, comp: 96, att: 98, imp: 92, rew: 1000000, tit: "Juara 2 Guru Inovatif & Berprestasi" },
        { j: 92, c: 94, comp: 90, att: 95, imp: 90, rew: 750000, tit: "Juara 3 Guru Inspiratif Kesiswaan" },
        { j: 88, c: 90, comp: 88, att: 96, imp: 86, rew: 500000, tit: "Insentif Kinerja & Apresiasi Yayasan" },
        { j: 86, c: 88, comp: 89, att: 98, imp: 88, rew: 500000, tit: "Insentif Kinerja & Apresiasi Yayasan" },
        { j: 85, c: 86, comp: 87, att: 95, imp: 84, rew: 500000, tit: "Insentif Kinerja & Apresiasi Yayasan" },
        { j: 88, c: 85, comp: 88, att: 96, imp: 85, rew: 500000, tit: "Insentif Kinerja & Apresiasi Yayasan" }
      ][idx % 7];

      return {
        "No": idx + 1,
        "ID Guru": t.id || "tch-" + (idx + 1),
        "Nama Lengkap Guru": t.name,
        "NIP / NIPY": t.nip || t.nipy || "-",
        "Tugas / Rombel": t.assignedRombel || t.role || "Guru",
        "Periode Evaluasi": "Semester Ganjil 2026/2027",
        "1. Jurnal Mengajar (25%)": sampleScores.j,
        "2. Komunikasi Prestasi (20%)": sampleScores.c,
        "3. Capaian Kompetensi (30%)": sampleScores.comp,
        "4. Kehadiran & Disiplin (10%)": sampleScores.att,
        "5. Improvisasi KBM (15%)": sampleScores.imp,
        "Total Skor Akhir (Formula)": calculateWeightedKpiScore(sampleScores.j, sampleScores.c, sampleScores.comp, sampleScores.att, sampleScores.imp),
        "Predikat Kinerja": getKpiGradeInfo(calculateWeightedKpiScore(sampleScores.j, sampleScores.c, sampleScores.comp, sampleScores.att, sampleScores.imp)).short,
        "Gelar Juara / Hadiah": sampleScores.tit,
        "Nominal Hadiah (Rp)": sampleScores.rew,
        "Catatan Khusus Penilai": "Kinerja terverifikasi sangat baik sesuai standar indikator yayasan.",
        "Penilai (Kepala Sekolah)": "Masykur Rohana, S.Sos",
        "Mengetahui (Ketua Yayasan)": "Drs. H. M. Syukri, M.M"
      };
    });

    const ws1 = XLSX.utils.json_to_sheet(templateRows);
    
    // Auto column widths
    const colWidths = [
      { wch: 6 },
      { wch: 12 },
      { wch: 26 },
      { wch: 16 },
      { wch: 20 },
      { wch: 24 },
      { wch: 24 },
      { wch: 26 },
      { wch: 26 },
      { wch: 24 },
      { wch: 24 },
      { wch: 24 },
      { wch: 18 },
      { wch: 32 },
      { wch: 18 },
      { wch: 35 },
      { wch: 24 },
      { wch: 24 }
    ];
    ws1["!cols"] = colWidths;

    // Sheet 2: Panduan & Bobot Standar Excel
    const guideRows = [
      { "KODE": "IND-01", "INDIKATOR STANDAR": "Memenuhi seluruh elemen kerja guru yang tertulis dalam jurnal", "BOBOT": "25%", "RENTANG SKOR": "0 - 100", "KETERANGAN": "Kelengkapan modul ajar, catatan harian, jurnal kelas" },
      { "KODE": "IND-02", "INDIKATOR STANDAR": "Membangun komunikasi dengan anak didik dan orang tua terkait prestasi", "BOBOT": "20%", "RENTANG SKOR": "0 - 100", "KETERANGAN": "Konsultasi wali murid, update mutabaah/tahfidz, respon cepat" },
      { "KODE": "IND-03", "INDIKATOR STANDAR": "Memenuhi capaian kompetensi yang dipersyaratkan oleh sekolah", "BOBOT": "30%", "RENTANG SKOR": "0 - 100", "KETERANGAN": "Ketuntasan kurikulum, daya serap siswa, pencapaian akademik" },
      { "KODE": "IND-04", "INDIKATOR STANDAR": "Kehadiran guru / Presensi & Kedisiplinan", "BOBOT": "10%", "RENTANG SKOR": "0 - 100", "KETERANGAN": "Presensi fingerprint, tepat waktu hadir di kelas & apel yayasan" },
      { "KODE": "IND-05", "INDIKATOR STANDAR": "Improvisasi Kegiatan Belajar Mengajar (KBM) & Inovasi", "BOBOT": "15%", "RENTANG SKOR": "0 - 100", "KETERANGAN": "Kreativitas alat peraga, media digital, suasana kelas interaktif" },
      { "KODE": "TOTAL", "INDIKATOR STANDAR": "RUMUS FORMULA TERTIMBANG", "BOBOT": "100%", "RENTANG SKOR": "0 - 100", "KETERANGAN": "=(Jurnal*0.25)+(Komunikasi*0.20)+(Kompetensi*0.30)+(Kehadiran*0.10)+(Inovasi*0.15)" },
      { "KODE": "REWARD-1", "INDIKATOR STANDAR": "Juara 1 Guru Teladan Yayasan", "BOBOT": "Skor >= 95", "RENTANG SKOR": "Rp 1.500.000", "KETERANGAN": "Uang Pembinaan + Piagam Penghargaan Resmi + Prioritas Insentif" },
      { "KODE": "REWARD-2", "INDIKATOR STANDAR": "Juara 2 Guru Inovatif Yayasan", "BOBOT": "Skor >= 93", "RENTANG SKOR": "Rp 1.000.000", "KETERANGAN": "Uang Pembinaan + Piagam Penghargaan Resmi" },
      { "KODE": "REWARD-3", "INDIKATOR STANDAR": "Juara 3 Guru Inspiratif Yayasan", "BOBOT": "Skor >= 90", "RENTANG SKOR": "Rp 750.000", "KETERANGAN": "Uang Pembinaan + Piagam Penghargaan Resmi" },
      { "KODE": "REWARD-4", "INDIKATOR STANDAR": "Insentif Kinerja & Apresiasi", "BOBOT": "Skor 80 - 89.9", "RENTANG SKOR": "Rp 500.000", "KETERANGAN": "Insentif Pencapaian Kinerja + Sertifikat Apresiasi" }
    ];
    const ws2 = XLSX.utils.json_to_sheet(guideRows);
    ws2["!cols"] = [{ wch: 12 }, { wch: 45 }, { wch: 15 }, { wch: 18 }, { wch: 50 }];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws1, "STANDAR_EVALUASI_KPI");
    XLSX.utils.book_append_sheet(wb, ws2, "PANDUAN_BOBOT_STANDAR");

    XLSX.writeFile(wb, "Template_Standar_KPI_Guru_SDIT_El_Fatah.xlsx");
    showToast("Template Excel Standar KPI Guru berhasil diunduh!");
  };

  // 2. Export Live Data to Excel
  const handleExportExcel = () => {
    if (!XLSX || !XLSX.utils) {
      alert("Modul XLSX belum siap.");
      return;
    }
    const dataForExport = filteredList.map((item, idx) => ({
      "Peringkat / Ranking": idx + 1,
      "Nama Guru / Staf": item.teacherName,
      "NIP / NIPY": item.teacherNip,
      "Tugas / Rombel": item.rombel,
      "Periode Evaluasi": item.period,
      "1. Jurnal Mengajar (25%)": item.scoreJournal,
      "2. Komunikasi Prestasi (20%)": item.scoreCommunication,
      "3. Capaian Kompetensi (30%)": item.scoreCompetence,
      "4. Kehadiran & Disiplin (10%)": item.scoreAttendance,
      "5. Improvisasi KBM (15%)": item.scoreImprovisation,
      "Total Skor Akhir (100%)": item.totalScore,
      "Predikat Kinerja": item.grade,
      "Gelar Juara / Hadiah": item.rewardTitle,
      "Nominal Hadiah (Rp)": item.rewardAmount,
      "Rincian Hadiah": item.rewardDetail,
      "Catatan Evaluasi Penilai": item.notes,
      "Penilai (Kepala Sekolah)": item.evaluatorName || "Masykur Rohana, S.Sos",
      "Mengetahui (Ketua Yayasan)": item.acknowledgedBy || "Drs. H. M. Syukri, M.M",
      "Tanggal Evaluasi": item.evaluationDate || new Date().toISOString().split("T")[0]
    }));

    const ws = XLSX.utils.json_to_sheet(dataForExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Rekap_KPI_Guru");
    XLSX.writeFile(wb, "Rekap_Evaluasi_KPI_Guru_SDIT_El_Fatah_" + (selectedPeriod === "ALL" ? "Semua_Periode" : selectedPeriod.replace(/[^a-zA-Z0-9]/g, "_")) + ".xlsx");
    showToast("Rekapitulasi KPI Guru berhasil diekspor ke Excel!");
  };

  // Universal Table Row Parser (Supports any SheetJS sheet or 2D Array)
  const processRawSheetRows = (sheetRows) => {
    if (!sheetRows || sheetRows.length === 0) return [];

    // 1. Scan for the header row among the first 25 rows
    let headerRowIndex = 0;
    let maxHeaderScore = 0;

    const keywords = [
      "nama", "guru", "staf", "pendidik", "ptk", "ustadz", "ustadzah", "teacher",
      "nip", "nipy", "nik", "nuptk", "id",
      "jurnal", "elemen", "kerja", "modul", "rpp", "administrasi", "ind-01", "ind 1", "ind1",
      "komunikasi", "prestasi", "ortu", "orang tua", "wali", "siswa", "ind-02", "ind 2", "ind2",
      "kompetensi", "capaian", "akademik", "kktp", "kkm", "kurikulum", "ind-03", "ind 3", "ind3",
      "kehadiran", "presensi", "hadir", "disiplin", "absen", "ind-04", "ind 4", "ind4",
      "improvisasi", "inovasi", "kbm", "kreativitas", "media", "alat peraga", "ind-05", "ind 5", "ind5",
      "total", "skor", "nilai", "predikat", "hadiah", "juara", "reward", "catatan"
    ];

    for (let r = 0; r < Math.min(sheetRows.length, 25); r++) {
      const row = sheetRows[r];
      if (!Array.isArray(row)) continue;
      let score = 0;
      row.forEach(cell => {
        const str = String(cell || "").toLowerCase().trim();
        if (!str) return;
        keywords.forEach(kw => {
          if (str.includes(kw)) score += 1;
        });
      });
      if (score > maxHeaderScore) {
        maxHeaderScore = score;
        headerRowIndex = r;
      }
    }

    const headers = (sheetRows[headerRowIndex] || []).map(h => String(h || "").trim());
    const dataRows = sheetRows.slice(headerRowIndex + 1);

    // Convert to row objects
    const parsedItems = [];

    dataRows.forEach((row, rowIndex) => {
      if (!Array.isArray(row) || row.every(c => c === "" || c === null || c === undefined)) return;

      // Build row map
      const rowObj = {};
      headers.forEach((h, colIdx) => {
        if (h) {
          rowObj[h] = row[colIdx] !== undefined ? row[colIdx] : "";
        }
        rowObj["__col_" + colIdx] = row[colIdx] !== undefined ? row[colIdx] : "";
      });

      // Flexible name matching
      let teacherName = "";
      for (const [key, val] of Object.entries(rowObj)) {
        const k = key.toLowerCase();
        if (
          k.includes("nama lengkap") ||
          k.includes("nama guru") ||
          k.includes("nama ptk") ||
          k.includes("nama staf") ||
          k.includes("nama pegawai") ||
          k.includes("nama") ||
          k.includes("guru") ||
          k.includes("teacher")
        ) {
          if (String(val).trim() && !k.includes("penilai") && !k.includes("evaluator") && !k.includes("ketua")) {
            teacherName = String(val).trim();
            break;
          }
        }
      }

      // Fallback to column index 1 or 2 if no name found
      if (!teacherName && row[1] && typeof row[1] === "string" && row[1].trim().length > 2 && isNaN(Number(row[1]))) {
        teacherName = String(row[1]).trim();
      } else if (!teacherName && row[2] && typeof row[2] === "string" && row[2].trim().length > 2 && isNaN(Number(row[2]))) {
        teacherName = String(row[2]).trim();
      } else if (!teacherName && row[0] && typeof row[0] === "string" && row[0].trim().length > 2 && isNaN(Number(row[0]))) {
        teacherName = String(row[0]).trim();
      }

      // Skip row if it looks like a subtotal, footer, or empty name
      if (
        !teacherName ||
        teacherName.toLowerCase().includes("total") ||
        teacherName.toLowerCase().includes("rata-rata") ||
        teacherName.toLowerCase().includes("mengetahui") ||
        teacherName.toLowerCase().includes("kepala sekolah") ||
        teacherName.toLowerCase().includes("ketua yayasan")
      ) {
        return;
      }

      // NIP / NIPY
      let teacherNip = "-";
      for (const [key, val] of Object.entries(rowObj)) {
        const k = key.toLowerCase();
        if (k.includes("nip") || k.includes("nipy") || k.includes("nik") || k.includes("nuptk") || k.includes("no. induk")) {
          if (String(val).trim()) {
            teacherNip = String(val).trim();
            break;
          }
        }
      }

      // Rombel / Tugas
      let rombel = "Guru";
      for (const [key, val] of Object.entries(rowObj)) {
        const k = key.toLowerCase();
        if (k.includes("rombel") || k.includes("tugas") || k.includes("kelas") || k.includes("jabatan") || k.includes("mapel")) {
          if (String(val).trim()) {
            rombel = String(val).trim();
            break;
          }
        }
      }

      // Helper pencari nilai indikator
      const findScore = (keys, fallback = 85) => {
        for (const [key, val] of Object.entries(rowObj)) {
          const k = key.toLowerCase();
          for (const searchKey of keys) {
            if (k.includes(searchKey.toLowerCase())) {
              const numVal = Number(String(val).replace(/,/g, ".").replace(/[^0-9.]/g, ""));
              if (!isNaN(numVal) && numVal > 0) return numVal;
            }
          }
        }
        return fallback;
      };

      const sJournal = findScore(["jurnal", "ind-01", "ind 1", "elemen", "modul", "rpp", "25%"], 90);
      const sComm = findScore(["komunikasi", "ind-02", "ind 2", "ortu", "orang tua", "wali", "20%"], 90);
      const sComp = findScore(["kompetensi", "ind-03", "ind 3", "capaian", "akademik", "kktp", "30%"], 90);
      const sAtt = findScore(["kehadiran", "presensi", "ind-04", "ind 4", "disiplin", "hadir", "10%"], 95);
      const sImp = findScore(["improvisasi", "inovasi", "ind-05", "ind 5", "kbm", "kreativitas", "15%"], 90);

      // Total score calculation
      let totalScore = findScore(["total skor", "total score", "nilai akhir", "skor akhir", "total", "100%"], 0);
      if (!totalScore || totalScore <= 0 || totalScore > 100) {
        totalScore = calculateWeightedKpiScore(sJournal, sComm, sComp, sAtt, sImp);
      } else {
        totalScore = Math.round(Number(totalScore) * 100) / 100;
      }

      // Match teacher from database
      const matchedTeacher = teachers.find(
        t => (t.name && t.name.toLowerCase().includes(teacherName.toLowerCase())) ||
             (t.nip && teacherNip !== "-" && t.nip === teacherNip)
      );

      const teacherId = matchedTeacher ? matchedTeacher.id : ("tch-imp-" + (rowIndex + 1));
      const finalTeacherName = matchedTeacher ? matchedTeacher.name : teacherName;
      const finalRole = matchedTeacher ? matchedTeacher.role : rombel;
      const finalNip = matchedTeacher ? (matchedTeacher.nip || matchedTeacher.nipy || teacherNip) : teacherNip;

      const gradeObj = getKpiGradeInfo(totalScore);

      // Reward & Title
      let rewardTitle = "";
      let rewardAmount = 0;
      let rewardDetail = "";

      for (const [key, val] of Object.entries(rowObj)) {
        const k = key.toLowerCase();
        if (k.includes("gelar") || k.includes("juara") || k.includes("hadiah") || k.includes("penghargaan") || k.includes("reward")) {
          if (String(val).trim() && isNaN(Number(val))) {
            rewardTitle = String(val).trim();
          }
        }
        if (k.includes("nominal") || k.includes("uang pembinaan") || k.includes("insentif (rp)") || k.includes("hadiah (rp)")) {
          const parsedNominal = Number(String(val).replace(/[^0-9]/g, ""));
          if (!isNaN(parsedNominal) && parsedNominal > 0) {
            rewardAmount = parsedNominal;
          }
        }
      }

      // Auto assign reward if empty
      if (!rewardTitle || rewardTitle.trim() === "") {
        if (totalScore >= 95) {
          rewardTitle = "Juara 1 Guru Teladan & Berprestasi";
          rewardDetail = "Uang Pembinaan Yayasan Rp 1.500.000 + Piagam Penghargaan Resmi + Prioritas Tunjangan";
          if (rewardAmount === 0) rewardAmount = 1500000;
        } else if (totalScore >= 93) {
          rewardTitle = "Juara 2 Guru Inovatif & Berprestasi";
          rewardDetail = "Uang Pembinaan Yayasan Rp 1.000.000 + Piagam Penghargaan Resmi";
          if (rewardAmount === 0) rewardAmount = 1000000;
        } else if (totalScore >= 90) {
          rewardTitle = "Juara 3 Guru Inspiratif Kesiswaan";
          rewardDetail = "Uang Pembinaan Yayasan Rp 750.000 + Piagam Penghargaan Resmi";
          if (rewardAmount === 0) rewardAmount = 750000;
        } else if (totalScore >= 80) {
          rewardTitle = "Insentif Kinerja & Apresiasi Yayasan";
          rewardDetail = "Insentif Pencapaian Kinerja Rp 500.000 + Sertifikat";
          if (rewardAmount === 0) rewardAmount = 500000;
        } else {
          rewardTitle = "Program Pembinaan Khusus";
          rewardDetail = "Supervisi & Bimbingan Pengajaran";
          rewardAmount = 0;
        }
      }

      let notes = "Kinerja sesuai standar indikator yayasan.";
      for (const [key, val] of Object.entries(rowObj)) {
        const k = key.toLowerCase();
        if (k.includes("catatan") || k.includes("keterangan") || k.includes("notes") || k.includes("evaluasi")) {
          if (String(val).trim()) {
            notes = String(val).trim();
            break;
          }
        }
      }

      parsedItems.push({
        id: "kpi-imp-" + Date.now() + "-" + rowIndex,
        teacherId,
        teacherName: finalTeacherName,
        teacherNip: finalNip,
        teacherRole: finalRole,
        rombel,
        period: "Semester Ganjil 2026/2027",
        academicYear: "2026/2027",
        scoreJournal: sJournal,
        scoreCommunication: sComm,
        scoreCompetence: sComp,
        scoreAttendance: sAtt,
        scoreImprovisation: sImp,
        totalScore,
        grade: gradeObj.short,
        rewardStatus: "DISETUJUI_YAYASAN",
        rewardTitle,
        rewardDetail,
        rewardAmount,
        evaluatorName: "Masykur Rohana, S.Sos (Kepala Sekolah)",
        acknowledgedBy: "Drs. H. M. Syukri, M.M (Ketua Yayasan)",
        evaluationDate: new Date().toISOString().split("T")[0],
        notes
      });
    });

    return parsedItems
      .sort((a, b) => b.totalScore - a.totalScore)
      .map((item, idx) => ({ ...item, rank: idx + 1 }));
  };

  // 3. Import & Parse Excel File (Lampiran Excel)
  const handleFileUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setImportFileName(file.name);
    parseExcelFile(file);
  };

  const parseExcelFile = (file) => {
    setIsProcessingImport(true);
    const reader = new FileReader();

    reader.onload = (evt) => {
      try {
        const buffer = evt.target.result;
        const data = new Uint8Array(buffer);
        const wb = XLSX.read(data, {
          type: "array",
          cellDates: true,
          raw: false
        });

        setCurrentWorkbook(wb);
        setAvailableSheets(wb.SheetNames || []);

        // Pick best sheet name
        const preferredSheet = wb.SheetNames.find(
          n => n.toUpperCase().includes("KPI") ||
               n.toUpperCase().includes("EVALUASI") ||
               n.toUpperCase().includes("STANDAR") ||
               n.toUpperCase().includes("GURU") ||
               n.toUpperCase().includes("REKAP")
        ) || wb.SheetNames[0];

        setSelectedSheetName(preferredSheet);

        const ws = wb.Sheets[preferredSheet];
        const sheetRows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });

        const parsed = processRawSheetRows(sheetRows);

        if (!parsed || parsed.length === 0) {
          alert("File Excel berhasil dibaca namun tidak ada baris data Guru yang terdeteksi. Silakan periksa isi kolom atau gunakan tab Salin-Tempel (Paste) tabel.");
          setIsProcessingImport(false);
          return;
        }

        setImportPreviewData(parsed);
        setShowImportModal(true);
        setIsProcessingImport(false);
        showToast("Berhasil membaca " + parsed.length + " data Guru dari file Excel!");
      } catch (err) {
        console.error("Gagal membaca file Excel:", err);
        alert("Gagal membaca file Excel: " + (err.message || "Pastikan format file .xlsx, .xls, atau .csv valid."));
        setIsProcessingImport(false);
      }
    };

    reader.onerror = () => {
      alert("Terjadi kesalahan sistem saat membaca file dari memori browser.");
      setIsProcessingImport(false);
    };

    reader.readAsArrayBuffer(file);
  };

  // Change sheet in current workbook
  const handleSheetChange = (sheetName) => {
    setSelectedSheetName(sheetName);
    if (!currentWorkbook || !currentWorkbook.Sheets[sheetName]) return;
    const ws = currentWorkbook.Sheets[sheetName];
    const sheetRows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });
    const parsed = processRawSheetRows(sheetRows);
    setImportPreviewData(parsed);
  };

  // Parse direct copied text from Excel / Google Sheets
  const handleParsePastedText = () => {
    if (!pastedDataText || !pastedDataText.trim()) {
      alert("Silakan tempel (Ctrl+V) data tabel Excel terlebih dahulu pada kolom teks.");
      return;
    }

    try {
      const lines = pastedDataText.trim().split(/\r?\n/);
      const sheetRows = lines.map(line => line.split(/\t|,|;/).map(cell => cell.trim()));

      const parsed = processRawSheetRows(sheetRows);
      if (!parsed || parsed.length === 0) {
        alert("Tidak ada baris data guru yang dapat dikenali dari teks yang ditempel. Pastikan minimal menyertakan kolom Nama Guru.");
        return;
      }

      setImportFileName("Tempel_Teks_Excel_Langsung.tsv");
      setImportPreviewData(parsed);
      setShowImportModal(true);
      showToast("Berhasil mengimpor " + parsed.length + " data Guru dari teks tempelan!");
    } catch (e) {
      alert("Gagal memproses teks tabel: " + e.message);
    }
  };

  // 4. Commit Import Data to State & Persistence
  const handleApplyImport = () => {
    if (!importPreviewData || importPreviewData.length === 0) return;

    let finalKpiList = [];
    if (importMode === "REPLACE") {
      finalKpiList = [...importPreviewData];
    } else {
      // Append or update existing
      const existingMap = new Map(kpiList.map(item => [item.teacherName.toLowerCase(), item]));
      importPreviewData.forEach(item => {
        existingMap.set(item.teacherName.toLowerCase(), item);
      });
      finalKpiList = Array.from(existingMap.values())
        .sort((a, b) => b.totalScore - a.totalScore)
        .map((item, idx) => ({ ...item, rank: idx + 1 }));
    }

    if (onBulkSetKpi) {
      onBulkSetKpi(finalKpiList);
    } else {
      finalKpiList.forEach(item => {
        if (onAddKpi) onAddKpi(item);
      });
    }

    setShowImportModal(false);
    setImportPreviewData([]);
    setPastedDataText("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    showToast("Sukses! " + finalKpiList.length + " data Guru dari Lampiran Excel berhasil dijadikan Standar KPI!");
  };

  // 5. Fast-Apply Benchmark Default KPI Standard
  const handleApplyOfficialStandard = () => {
    if (confirm("Apakah Anda yakin ingin menerapkan Standar Baku Excel KPI Yayasan 2026/2027 untuk seluruh Guru SDIT EL-FATAH?")) {
      if (onBulkSetKpi) {
        onBulkSetKpi(initialKpiEvaluations);
      }
      showToast("Standar Baku Excel KPI Guru Yayasan berhasil diterapkan!");
    }
  };

  // Drag & Drop event handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer && e.dataTransfer.files;
    if (files && files.length > 0) {
      setImportFileName(files[0].name);
      parseExcelFile(files[0]);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className="space-y-6 print:p-0 relative"
    >
      {/* Hidden Universal File Input for Excel Import */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept=".xlsx, .xls, .csv, .xlsm, .xlsb, .ods, .tsv, text/csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        className="hidden"
      />

      {/* Drag & Drop Visual Overlay */}
      {isDragOver && (
        <div className="fixed inset-0 z-50 bg-emerald-950/80 backdrop-blur-md flex flex-col items-center justify-center border-4 border-dashed border-emerald-400 p-6 text-white animate-in fade-in">
          <FileSpreadsheet className="w-16 h-16 text-emerald-400 mb-4 animate-bounce" />
          <h3 className="text-2xl font-black">Lepaskan File Excel di Sini</h3>
          <p className="text-sm text-emerald-200 mt-1">Mendukung format .xlsx, .xls, .csv, .xlsm, .ods</p>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5">
          <div className="w-7 h-7 bg-emerald-500/20 text-emerald-400 rounded-lg flex items-center justify-center font-black">
            ✓
          </div>
          <p className="text-xs font-bold text-slate-200">{toastMessage.msg}</p>
        </div>
      )}

      {/* 1. Header Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-indigo-900/50 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-3 relative z-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 text-amber-300 text-xs font-black rounded-full border border-amber-500/30">
              <Award className="w-4 h-4 text-amber-400" />
              Standar Baku KPI Yayasan Berdasarkan Lampiran Excel
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-500/20 text-emerald-300 text-[11px] font-bold rounded-full border border-emerald-500/30">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Akses Terbuka & Penuh (Full Access)
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Evaluasi Kinerja Guru & Penghargaan Guru Teladan
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Pengukuran objektif berbasis 5 Indikator Baku: <strong>Jurnal Mengajar (25%)</strong>, <strong>Komunikasi Prestasi Siswa & Ortu (20%)</strong>, <strong>Capaian Kompetensi (30%)</strong>, <strong>Kehadiran & Disiplin (10%)</strong>, & <strong>Inovasi KBM (15%)</strong> dengan Hadiah & Piagam Resmi Yayasan.
          </p>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap gap-2.5 relative z-10">
          <button
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
            disabled={isProcessingImport}
            className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 transition cursor-pointer active:scale-95 disabled:opacity-50"
            title="Unggah Lampiran File Excel (.xlsx / .xls / .csv) untuk dijadikan Standar Data KPI Guru"
          >
            <Upload className="w-4 h-4 text-emerald-200" />
            <span>{isProcessingImport ? "Membaca Excel..." : "Import Lampiran Excel"}</span>
          </button>

          <button
            onClick={openAddModal}
            className="px-3.5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-lg flex items-center justify-center gap-1.5 transition cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Input KPI</span>
          </button>

          <button
            onClick={handleDownloadExcelTemplate}
            className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700 font-bold text-xs rounded-xl shadow flex items-center justify-center gap-1.5 transition cursor-pointer"
            title="Unduh Template Excel Resmi dengan Rumus Baku KPI Guru"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Template Excel</span>
          </button>

          <button
            onClick={handleExportExcel}
            className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs rounded-xl shadow flex items-center justify-center gap-1.5 transition cursor-pointer"
            title="Unduh Rekapitulasi Nilai KPI ke File Excel (.xlsx)"
          >
            <Download className="w-4 h-4 text-slate-300" />
            <span>Export Rekap</span>
          </button>

          <button
            onClick={() => setShowIndicatorsGuide(!showIndicatorsGuide)}
            className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs rounded-xl shadow flex items-center justify-center gap-1.5 transition cursor-pointer"
            title="Lihat Rubrik & Rincian Bobot Indikator Excel"
          >
            <HelpCircle className="w-4 h-4 text-sky-400" />
            <span>Rubrik Bobot</span>
          </button>
        </div>
      </div>

      {/* Banner Notifikasi Sinkronisasi Standar Excel & Quick Uploader Bar */}
      <div className="bg-emerald-950/40 border border-emerald-800/60 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 text-emerald-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30 flex-shrink-0">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-black text-white flex items-center gap-2">
              <span>Standar Perhitungan Lampiran Excel Aktif</span>
              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] rounded-full border border-emerald-500/30 font-bold">100% Terkalibrasi & Terbuka</span>
            </h4>
            <p className="text-[11px] text-emerald-300/90 leading-relaxed">
              Formula tertimbang: <strong>(Jurnal × 25%) + (Komunikasi × 20%) + (Kompetensi × 30%) + (Kehadiran × 10%) + (Inovasi × 15%)</strong>. Format didukung: <strong>.xlsx, .xls, .csv, .xlsm, .ods, .tsv</strong> atau Tempel Teks.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
            className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow whitespace-nowrap cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Pilih File Excel</span>
          </button>

          <button
            onClick={handleApplyOfficialStandard}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow whitespace-nowrap cursor-pointer"
            title="Kembalikan data ke Standar Baku Excel Resmi Yayasan"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
            <span>Reset ke Standar Baku Excel</span>
          </button>
        </div>
      </div>

      {/* 2. Statistics Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500">Rata-rata Skor Yayasan</p>
            <p className="text-2xl font-black text-indigo-600 font-mono">
              {avgScore} <span className="text-xs text-slate-400 font-normal">/ 100</span>
            </p>
            <p className="text-[11px] text-emerald-600 font-bold mt-0.5">Kategori: Memuaskan</p>
          </div>
          <div className="p-3.5 bg-indigo-50 text-indigo-700 rounded-2xl">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500">Total Alokasi Hadiah & Reward</p>
            <p className="text-2xl font-black text-emerald-600 font-mono">
              {formatCurrency(totalRewardsAllocated)}
            </p>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">Disetujui Ketua Yayasan</p>
          </div>
          <div className="p-3.5 bg-emerald-50 text-emerald-700 rounded-2xl">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500">Guru Teladan & Berprestasi</p>
            <p className="text-2xl font-black text-amber-600 font-mono">
              {excellentTeachersCount} <span className="text-xs text-slate-400 font-normal">Guru (Skor ≥ 90)</span>
            </p>
            <p className="text-[11px] text-amber-600 font-bold mt-0.5">Kandidat Piagam Penghargaan</p>
          </div>
          <div className="p-3.5 bg-amber-50 text-amber-700 rounded-2xl">
            <Trophy className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500">Total Guru Tervalidasi</p>
            <p className="text-2xl font-black text-slate-800 font-mono">
              {filteredList.length} <span className="text-xs text-slate-400 font-normal">Tenaga Pendidik</span>
            </p>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">Semester Ganjil 2026/2027</p>
          </div>
          <div className="p-3.5 bg-slate-100 text-slate-700 rounded-2xl">
            <Users className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 3. Panduan Rubrik Bobot Indikator Excel (Collapsible / Modal Drawer) */}
      {showIndicatorsGuide && (
        <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-2xl space-y-6 animate-in fade-in slide-in-from-top-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-xl border border-indigo-500/30">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">Standar Rubrik & Bobot Lampiran Excel Yayasan SDIT EL-FATAH</h3>
                <p className="text-xs text-slate-400">Dasar penilaian kinerja guru yang disahkan Kepala Sekolah & Yayasan</p>
              </div>
            </div>
            <button
              onClick={() => setShowIndicatorsGuide(false)}
              className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {KPI_INDICATOR_STANDARDS.map((ind) => {
              const Icon = ind.icon;
              return (
                <div key={ind.id} className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 text-[10px] font-black rounded-md border border-indigo-500/30">
                        {ind.code}
                      </span>
                      <span className="text-xs font-black text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                        Bobot {ind.weightPercent}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <div className={"p-2 rounded-xl bg-gradient-to-br " + ind.color + " text-white shadow-sm"}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <h4 className="text-xs font-bold text-slate-200 line-clamp-2 leading-snug">
                        {ind.name}
                      </h4>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {ind.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-700/60 space-y-1.5 text-[10px]">
                    <p className="font-bold text-slate-300">Kriteria Skor:</p>
                    {ind.rubric.slice(0, 2).map((r, i) => (
                      <div key={i} className="flex items-start gap-1 text-slate-400">
                        <span className="text-emerald-400 font-bold font-mono">{r.score}:</span>
                        <span className="line-clamp-1">{r.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Reward Scale Explanation */}
          <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
            <div className="space-y-1">
              <span className="font-black text-amber-400 flex items-center gap-1.5">
                <Trophy className="w-4 h-4" /> Alokasi Hadiah Prestasi Guru Yayasan
              </span>
              <p className="text-slate-300">
                Juara 1: <strong>Rp 1.500.000 + Piagam</strong> | Juara 2: <strong>Rp 1.000.000 + Piagam</strong> | Juara 3: <strong>Rp 750.000 + Piagam</strong> | Insentif Memuaskan: <strong>Rp 500.000</strong>
              </p>
            </div>
            <button
              onClick={handleDownloadExcelTemplate}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition flex items-center gap-2 flex-shrink-0 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Unduh File Excel Standar</span>
            </button>
          </div>
        </div>
      )}

      {/* 4. Top 3 Leaderboard Guru Teladan */}
      <div className="bg-gradient-to-b from-amber-500/10 via-white to-white p-6 rounded-3xl border border-amber-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500 text-slate-950 rounded-xl shadow">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">
                Podium Penghargaan Guru Teladan Yayasan
              </h3>
              <p className="text-xs text-slate-500">
                Berdasarkan akumulasi skor 5 Indikator Baku Excel
              </p>
            </div>
          </div>
          <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs font-black rounded-full border border-amber-300">
            Top 3 Terbaik
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {top3.map((teacher, idx) => {
            const podiumColors = [
              { border: "border-amber-400", badge: "bg-amber-500 text-slate-950", title: "Juara 1 Guru Teladan", rank: "1st" },
              { border: "border-slate-300", badge: "bg-slate-300 text-slate-900", title: "Juara 2 Guru Inovatif", rank: "2nd" },
              { border: "border-amber-600", badge: "bg-amber-700 text-white", title: "Juara 3 Guru Inspiratif", rank: "3rd" }
            ][idx];

            return (
              <div
                key={teacher.id}
                className={"bg-white p-5 rounded-2xl border-2 " + podiumColors.border + " shadow-sm flex flex-col justify-between relative overflow-hidden space-y-4 hover:shadow-md transition"}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={"w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm shadow-sm " + podiumColors.badge}>
                      {podiumColors.rank}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 leading-tight">
                        {teacher.teacherName}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {teacher.rombel}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Skor Akhir:</span>
                    <span className="text-base font-black font-mono text-indigo-700">
                      {teacher.totalScore.toFixed(2)} / 100
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Hadiah Yayasan:</span>
                    <span className="font-mono font-bold text-emerald-700">
                      {formatCurrency(teacher.rewardAmount)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] font-bold text-amber-800">
                    {teacher.rewardTitle}
                  </span>
                  <button
                    onClick={() => setViewCertificate(teacher)}
                    className="p-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                    title="Cetak Piagam Penghargaan Resmi"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Piagam</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Filter & Search Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama guru, NIP, atau kelas..."
              className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">Semua Periode</option>
            <option value="Semester Ganjil 2026/2027">Semester Ganjil 2026/2027</option>
            <option value="Semester Genap 2025/2026">Semester Genap 2025/2026</option>
          </select>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
          <span>Menampilkan <strong>{filteredList.length}</strong> Guru</span>
        </div>
      </div>

      {/* 6. Main Data Table: Standar Nilai KPI Guru */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-[11px] font-black uppercase tracking-wider text-slate-700 border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4 text-center">Rank</th>
                <th className="py-3.5 px-4">Nama Guru & Tugas</th>
                <th className="py-3.5 px-3 text-center" title="Bobot 25%">
                  1. Jurnal (25%)
                </th>
                <th className="py-3.5 px-3 text-center" title="Bobot 20%">
                  2. Komunikasi (20%)
                </th>
                <th className="py-3.5 px-3 text-center" title="Bobot 30%">
                  3. Kompetensi (30%)
                </th>
                <th className="py-3.5 px-3 text-center" title="Bobot 10%">
                  4. Kehadiran (10%)
                </th>
                <th className="py-3.5 px-3 text-center" title="Bobot 15%">
                  5. Inovasi (15%)
                </th>
                <th className="py-3.5 px-4 text-center">
                  Total Skor
                </th>
                <th className="py-3.5 px-4">
                  Predikat & Hadiah
                </th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400">
                    <FileSpreadsheet className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                    <p className="font-bold">Tidak ada data KPI yang cocok.</p>
                    <p className="text-[11px] mt-1">Unggah file Excel atau klik "Reset ke Standar Baku Excel" untuk memuat data awal.</p>
                  </td>
                </tr>
              ) : (
                filteredList.map((item) => {
                  const gradeObj = getKpiGradeInfo(item.totalScore);
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition group">
                      <td className="py-4 px-4 text-center font-black">
                        {item.rank === 1 ? (
                          <span className="inline-flex items-center justify-center w-6 h-6 bg-amber-500 text-slate-950 rounded-full font-black text-xs shadow-sm">
                            1
                          </span>
                        ) : item.rank === 2 ? (
                          <span className="inline-flex items-center justify-center w-6 h-6 bg-slate-300 text-slate-900 rounded-full font-black text-xs shadow-sm">
                            2
                          </span>
                        ) : item.rank === 3 ? (
                          <span className="inline-flex items-center justify-center w-6 h-6 bg-amber-700 text-white rounded-full font-black text-xs shadow-sm">
                            3
                          </span>
                        ) : (
                          <span className="text-slate-400 font-bold">{item.rank}</span>
                        )}
                      </td>

                      <td className="py-4 px-4">
                        <div className="font-bold text-slate-900 text-xs group-hover:text-indigo-600 transition">
                          {item.teacherName}
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                          <span>NIP: {item.teacherNip}</span>
                          <span>•</span>
                          <span className="font-medium text-slate-600">{item.rombel}</span>
                        </div>
                      </td>

                      <td className="py-4 px-3 text-center font-mono font-bold text-slate-700">
                        {item.scoreJournal}
                      </td>
                      <td className="py-4 px-3 text-center font-mono font-bold text-slate-700">
                        {item.scoreCommunication}
                      </td>
                      <td className="py-4 px-3 text-center font-mono font-bold text-slate-700">
                        {item.scoreCompetence}
                      </td>
                      <td className="py-4 px-3 text-center font-mono font-bold text-slate-700">
                        {item.scoreAttendance}
                      </td>
                      <td className="py-4 px-3 text-center font-mono font-bold text-slate-700">
                        {item.scoreImprovisation}
                      </td>

                      <td className="py-4 px-4 text-center">
                        <div className="font-black text-sm text-indigo-700 font-mono">
                          {item.totalScore.toFixed(2)}
                        </div>
                        <div className="w-16 bg-slate-200 rounded-full h-1.5 mx-auto mt-1 overflow-hidden">
                          <div
                            className={"h-full " + (
                              item.totalScore >= 90
                                ? "bg-emerald-500"
                                : item.totalScore >= 80
                                ? "bg-blue-500"
                                : item.totalScore >= 70
                                ? "bg-amber-500"
                                : "bg-rose-500"
                            )}
                            style={{ width: `${Math.min(100, item.totalScore)}%` }}
                          />
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <span className={"inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black border " + gradeObj.badge}>
                          <span className={"w-1.5 h-1.5 rounded-full " + gradeObj.dot} />
                          {item.grade}
                        </span>
                        {item.rewardTitle && (
                          <div className="text-[11px] font-bold text-amber-700 mt-1 flex items-center gap-1">
                            <Trophy className="w-3 h-3 text-amber-500 flex-shrink-0" />
                            <span className="truncate max-w-[180px]">{item.rewardTitle}</span>
                          </div>
                        )}
                        {item.rewardAmount > 0 && (
                          <div className="text-[10px] font-mono font-bold text-emerald-600">
                            {formatCurrency(item.rewardAmount)}
                          </div>
                        )}
                      </td>

                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setViewCertificate(item)}
                            className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition cursor-pointer"
                            title="Cetak Piagam Penghargaan Resmi"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openEditModal(item)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                            title="Edit Nilai KPI"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm("Hapus penilaian KPI untuk " + item.teacherName + "?")) {
                                if (onDeleteKpi) onDeleteKpi(item.id);
                                showToast("Penilaian KPI " + item.teacherName + " telah dihapus.");
                              }
                            }}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                            title="Hapus Data KPI"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
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

      {/* 7. Modal Dialog Import Lampiran Excel (Universal & Multi-Format) */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-200">
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    Konfirmasi Import Lampiran Excel Standar KPI
                  </h3>
                  <p className="text-xs text-slate-500">
                    Sumber: <strong className="text-slate-800">{importFileName}</strong> • Terdeteksi <strong>{importPreviewData.length}</strong> Guru
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowImportModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sheet Selector if multiple sheets exist */}
            {availableSheets.length > 1 && (
              <div className="bg-indigo-50 p-3 rounded-xl border border-indigo-100 flex items-center justify-between gap-3 text-xs flex-shrink-0">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-600" />
                  <span className="font-bold text-indigo-900">Pilih Lembar Kerja (Sheet):</span>
                </div>
                <select
                  value={selectedSheetName}
                  onChange={(e) => handleSheetChange(e.target.value)}
                  className="px-3 py-1 bg-white border border-indigo-200 rounded-lg text-xs font-bold text-indigo-900 focus:outline-none"
                >
                  {availableSheets.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Import Mode Toggle */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs flex-shrink-0">
              <div>
                <span className="font-bold text-slate-700">Metode Penerapan Standar:</span>
                <p className="text-slate-500 text-[11px]">Pilih bagaimana data Excel ini diterapkan ke dalam sistem</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setImportMode("REPLACE")}
                  className={"px-3.5 py-1.5 rounded-xl font-bold transition cursor-pointer " + (
                    importMode === "REPLACE"
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                  )}
                >
                  Gantikan Semua Standar Lama
                </button>
                <button
                  type="button"
                  onClick={() => setImportMode("APPEND")}
                  className={"px-3.5 py-1.5 rounded-xl font-bold transition cursor-pointer " + (
                    importMode === "APPEND"
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                  )}
                >
                  Gabungkan & Update
                </button>
              </div>
            </div>

            {/* Preview Table */}
            <div className="flex-1 overflow-y-auto border border-slate-200 rounded-2xl">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-100 text-[11px] font-black text-slate-700 sticky top-0 border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3 text-center">Rank</th>
                    <th className="py-2.5 px-3">Nama Guru</th>
                    <th className="py-2.5 px-2 text-center">Jurnal (25%)</th>
                    <th className="py-2.5 px-2 text-center">Komunikasi (20%)</th>
                    <th className="py-2.5 px-2 text-center">Kompetensi (30%)</th>
                    <th className="py-2.5 px-2 text-center">Kehadiran (10%)</th>
                    <th className="py-2.5 px-2 text-center">Inovasi (15%)</th>
                    <th className="py-2.5 px-3 text-center">Total Skor</th>
                    <th className="py-2.5 px-3">Predikat & Hadiah</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {importPreviewData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-2 px-3 text-center font-bold">{idx + 1}</td>
                      <td className="py-2 px-3">
                        <div className="font-bold text-slate-900">{row.teacherName}</div>
                        <div className="text-[10px] text-slate-400">{row.rombel}</div>
                      </td>
                      <td className="py-2 px-2 text-center font-mono">{row.scoreJournal}</td>
                      <td className="py-2 px-2 text-center font-mono">{row.scoreCommunication}</td>
                      <td className="py-2 px-2 text-center font-mono">{row.scoreCompetence}</td>
                      <td className="py-2 px-2 text-center font-mono">{row.scoreAttendance}</td>
                      <td className="py-2 px-2 text-center font-mono">{row.scoreImprovisation}</td>
                      <td className="py-2 px-3 text-center font-mono font-black text-indigo-600">{row.totalScore}</td>
                      <td className="py-2 px-3">
                        <div className="font-bold text-emerald-700">{row.grade}</div>
                        <div className="text-[10px] text-amber-600 truncate max-w-[150px]">{row.rewardTitle}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100 flex-shrink-0">
              <button
                type="button"
                onClick={() => setShowImportModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleApplyImport}
                className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-black text-xs rounded-xl shadow-lg flex items-center gap-2 transition cursor-pointer active:scale-95"
              >
                <Check className="w-4 h-4" />
                <span>Terapkan Sebagai Standar KPI Guru Yayasan</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. Form Modal Input/Edit Penilaian KPI */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl border border-amber-200">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    {editingItem ? "Edit Penilaian KPI Guru" : "Input Penilaian KPI Guru Baru"}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Sistem evaluasi berbasis 5 indikator baku dengan bobot tertimbang
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Pilih Guru / Tenaga Pendidik
                  </label>
                  <select
                    value={formTeacherId}
                    onChange={(e) => setFormTeacherId(e.target.value)}
                    required
                    disabled={!!editingItem}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {teachers.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.assignedRombel || t.role || "Guru"})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Periode Evaluasi
                  </label>
                  <select
                    value={formPeriod}
                    onChange={(e) => setFormPeriod(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Semester Ganjil 2026/2027">Semester Ganjil 2026/2027</option>
                    <option value="Semester Genap 2025/2026">Semester Genap 2025/2026</option>
                  </select>
                </div>
              </div>

              {/* Sliders for 5 Indicators */}
              <div className="space-y-4 pt-2 border-t border-slate-100">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center justify-between">
                  <span>Input Nilai 5 Indikator Standar</span>
                  <span className="text-indigo-600 font-mono font-bold lowercase">skor 0 - 100</span>
                </h4>

                {/* Indikator 1 */}
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-800">1. Jurnal Mengajar & Elemen Kerja Guru</span>
                      <span className="ml-2 text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">Bobot 25%</span>
                    </div>
                    <span className="text-sm font-black font-mono text-indigo-700">{formScoreJournal}</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={formScoreJournal}
                    onChange={(e) => setFormScoreJournal(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <p className="text-[10px] text-slate-500">Kelengkapan elemen kerja jurnal, ketuntasan RPP/modul ajar, dan administrasi kelas.</p>
                </div>

                {/* Indikator 2 */}
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-800">2. Komunikasi Prestasi Anak & Orang Tua</span>
                      <span className="ml-2 text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">Bobot 20%</span>
                    </div>
                    <span className="text-sm font-black font-mono text-indigo-700">{formScoreCommunication}</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={formScoreCommunication}
                    onChange={(e) => setFormScoreCommunication(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <p className="text-[10px] text-slate-500">Proaktif membangun komunikasi dengan anak didik & wali murid terkait capaian belajar & karakter.</p>
                </div>

                {/* Indikator 3 */}
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-800">3. Capaian Kompetensi Kurikulum Sekolah</span>
                      <span className="ml-2 text-[10px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">Bobot 30%</span>
                    </div>
                    <span className="text-sm font-black font-mono text-indigo-700">{formScoreCompetence}</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={formScoreCompetence}
                    onChange={(e) => setFormScoreCompetence(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <p className="text-[10px] text-slate-500">Ketercapaian target kurikulum, daya serap siswa, dan ketuntasan materi yang dipersyaratkan.</p>
                </div>

                {/* Indikator 4 */}
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-800">4. Kehadiran Guru & Kedisiplinan</span>
                      <span className="ml-2 text-[10px] font-black text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">Bobot 10%</span>
                    </div>
                    <span className="text-sm font-black font-mono text-indigo-700">{formScoreAttendance}</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={formScoreAttendance}
                    onChange={(e) => setFormScoreAttendance(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <p className="text-[10px] text-slate-500">Presensi fingerprint tepat waktu di kelas, apel pagi, rapat, dan agenda yayasan.</p>
                </div>

                {/* Indikator 5 */}
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-800">5. Improvisasi & Inovasi KBM</span>
                      <span className="ml-2 text-[10px] font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">Bobot 15%</span>
                    </div>
                    <span className="text-sm font-black font-mono text-indigo-700">{formScoreImprovisation}</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={formScoreImprovisation}
                    onChange={(e) => setFormScoreImprovisation(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <p className="text-[10px] text-slate-500">Kreativitas membuat media ajar, alat peraga, variasi ice-breaking dan metode pembelajaran menyenangkan.</p>
                </div>
              </div>

              {/* Calculated Total Live Preview */}
              <div className="p-4 bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400">Total Skor Akhir Tertimbang:</span>
                  <p className="text-2xl font-black text-amber-400 font-mono">{currentCalculatedScore}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400">Predikat Kinerja:</span>
                  <p className="text-xs font-bold text-emerald-300">
                    {getKpiGradeInfo(currentCalculatedScore).label}
                  </p>
                </div>
              </div>

              {/* Rewards & Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Gelar Juara / Penghargaan Yayasan
                  </label>
                  <input
                    type="text"
                    value={formRewardTitle}
                    onChange={(e) => setFormRewardTitle(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                    placeholder="Contoh: Juara 1 Guru Teladan"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nominal Hadiah / Uang Pembinaan (Rp)
                  </label>
                  <input
                    type="number"
                    value={formRewardAmount}
                    onChange={(e) => setFormRewardAmount(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Catatan Apresiasi / Evaluasi Penilai
                </label>
                <textarea
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  rows={2}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                  placeholder="Catatan kelebihan dan rekomendasi pengembangan guru..."
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-lg transition cursor-pointer active:scale-95"
                >
                  Simpan Penilaian KPI
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 9. Modal Piagam Penghargaan Resmi (Siap Cetak / Print) */}
      {viewCertificate && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 max-h-[95vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 print:hidden">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                <span className="font-bold text-sm text-slate-800">Pratinjau Piagam Penghargaan Resmi</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak / Simpan PDF</span>
                </button>
                <button
                  onClick={() => setViewCertificate(null)}
                  className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Sertifikat Resmi */}
            <div className="border-8 border-double border-amber-600 p-8 sm:p-12 rounded-2xl bg-gradient-to-b from-amber-50/40 via-white to-amber-50/20 text-center relative overflow-hidden shadow-inner">
              <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-amber-600 pointer-events-none" />
              <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-amber-600 pointer-events-none" />
              <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-amber-600 pointer-events-none" />
              <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-amber-600 pointer-events-none" />

              {/* Kop Yayasan */}
              <div className="space-y-1 mb-6 border-b-2 border-amber-500/30 pb-4">
                <h4 className="text-xs font-black tracking-widest uppercase text-slate-500">
                  {foundationProfile?.name || "YAYASAN PENDIDIKAN DAARUL HABIBAH"}
                </h4>
                <h3 className="text-lg font-black text-slate-900 tracking-tight">
                  SDIT EL-FATAH PAGELARAN
                </h3>
                <p className="text-[10px] text-slate-400">
                  {foundationProfile?.address || "Jl. Raya Pagelaran, Pandeglang, Banten"}
                </p>
              </div>

              {/* Certificate Title */}
              <div className="space-y-2 mb-6">
                <div className="inline-block p-3 bg-amber-500/10 rounded-full border border-amber-500/20 mb-1">
                  <Trophy className="w-8 h-8 text-amber-600 mx-auto" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif font-black tracking-wider text-amber-800 uppercase">
                  PIAGAM PENGHARGAAN
                </h2>
                <p className="text-xs text-slate-500 font-mono tracking-widest">
                  Nomor: 088/PIAGAM-GURU/{viewCertificate.academicYear || "2026/2027"}
                </p>
              </div>

              <p className="text-xs text-slate-600 mb-3">
                Diberikan dengan penuh rasa bangga dan apresiasi setinggi-tingginya kepada:
              </p>

              {/* Nama Guru Penerima */}
              <div className="my-4 pb-2 border-b-2 border-slate-300 inline-block px-8">
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-serif">
                  {viewCertificate.teacherName}
                </h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  NIP / NIPY: {viewCertificate.teacherNip} • {viewCertificate.rombel}
                </p>
              </div>

              {/* Gelar Penghargaan */}
              <div className="my-4 space-y-1.5">
                <p className="text-xs text-slate-600">Atas dedikasi luar biasa dan pencapaian prestasi sebagai:</p>
                <div className="inline-block px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-sm rounded-xl shadow-md border border-amber-300">
                  {viewCertificate.rewardTitle || "GURU TELADAN & BERPRESTASI"}
                </div>
                <p className="text-xs text-slate-700 font-medium max-w-md mx-auto pt-2">
                  Berdasarkan Hasil Evaluasi Kinerja (KPI) Periode <strong>{viewCertificate.period}</strong> dengan Akumulasi Skor <strong>{viewCertificate.totalScore.toFixed(2)}</strong> (Predikat: <em>{viewCertificate.grade}</em>).
                </p>
                {viewCertificate.rewardAmount > 0 && (
                  <p className="text-xs font-bold text-emerald-700 font-mono">
                    Paket Apresiasi: {formatCurrency(viewCertificate.rewardAmount)}
                  </p>
                )}
              </div>

              {/* Tanda Tangan */}
              <div className="grid grid-cols-2 gap-8 mt-12 pt-4 text-xs">
                <div>
                  <p className="text-slate-500">Mengetahui,</p>
                  <p className="font-bold text-slate-800">Ketua Yayasan</p>
                  <div className="h-16 flex items-center justify-center">
                    <span className="text-slate-300 italic text-[11px] font-serif">[ Tanda Tangan & Cap ]</span>
                  </div>
                  <p className="font-black text-slate-900 underline">
                    {foundationProfile?.leaderName || "Drs. H. M. Syukri, M.M"}
                  </p>
                  <p className="text-[10px] text-slate-500">Ketua Dewan Pembina Yayasan</p>
                </div>

                <div>
                  <p className="text-slate-500">Pandeglang, {formatDate(viewCertificate.evaluationDate)}</p>
                  <p className="font-bold text-slate-800">Kepala Sekolah SDIT EL-FATAH</p>
                  <div className="h-16 flex items-center justify-center">
                    <span className="text-slate-300 italic text-[11px] font-serif">[ Tanda Tangan ]</span>
                  </div>
                  <p className="font-black text-slate-900 underline">
                    {foundationProfile?.headmasterName || "Masykur Rohana, S.Sos"}
                  </p>
                  <p className="text-[10px] text-slate-500">Kepala Satuan Pendidikan</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
