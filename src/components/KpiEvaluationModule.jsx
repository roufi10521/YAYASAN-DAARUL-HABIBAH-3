import ReactModule, { useState as fallbackUseState, useMemo as fallbackUseMemo, useRef as fallbackUseRef } from "react";
import * as XLSX from "xlsx";
import {
  Trophy,
  Award,
  Medal,
  CheckCircle2,
  TrendingUp,
  Download,
  Upload,
  FileSpreadsheet,
  Printer,
  Edit3,
  Trash2,
  Plus,
  Search,
  Filter,
  Users,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  Info,
  Calendar,
  Layers,
  Sparkles,
  FileText,
  AlertCircle,
  Copy,
  RotateCcw,
  Check,
  Building,
  UserCheck,
  X,
  ExternalLink,
  Eye
} from "lucide-react";
import {
  OFFICIAL_KPI_INDICATORS,
  INITIAL_OFFICIAL_EVALUATIONS,
  calculateOfficialKpiScore,
  getKpiGradeInfo,
  formatCurrency,
  formatDate
} from "./kpiData";

export const initialKpiEvaluations = INITIAL_OFFICIAL_EVALUATIONS;
export const KPI_INDICATOR_STANDARDS = OFFICIAL_KPI_INDICATORS;

export default function KpiEvaluationModule(props = {}) {
  const ActiveReact = props?.React || (typeof window !== "undefined" && window.__AppReact) || ReactModule;
  const useState = ActiveReact.useState || fallbackUseState;
  const useMemo = ActiveReact.useMemo || fallbackUseMemo;
  const useRef = ActiveReact.useRef || fallbackUseRef;

  const {
    kpiList: externalKpiList,
    teachers = [],
    currentRole = "KEPALA_SEKOLAH",
    onAddKpi,
    onUpdateKpi,
    onDeleteKpi,
    onBulkSetKpi,
    foundationProfile
  } = props;
  // Local fallback if parent state is empty
  const [localKpiList, setLocalKpiList] = useState(() => {
    if (externalKpiList && externalKpiList.length > 0) return externalKpiList;
    try {
      const saved = localStorage.getItem("yayasan_kpis_v2");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_OFFICIAL_EVALUATIONS;
  });

  const activeKpiList = (externalKpiList && externalKpiList.length > 0) ? externalKpiList : localKpiList;

  const updateKpiState = (newList) => {
    setLocalKpiList(newList);
    try {
      localStorage.setItem("yayasan_kpis_v2", JSON.stringify(newList));
    } catch (e) {
      console.error(e);
    }
    if (onBulkSetKpi) {
      onBulkSetKpi(newList);
    }
  };

  // Active View Tab: 'matrix' (Lembar Tabel Excel), 'rekap' (Daftar & Ranking), 'rubrik' (Standar Baku)
  const [activeTab, setActiveTab] = useState("matrix");
  
  // Selected Teacher for the Matrix Evaluation Table
  const [selectedTeacherId, setSelectedTeacherId] = useState(() => {
    if (activeKpiList.length > 0) return activeKpiList[0].teacherId || activeKpiList[0].id;
    if (teachers.length > 0) return teachers[0].id;
    return "tch-1";
  });

  // Working scores state for current selected teacher in the Matrix Table
  const [currentScores, setCurrentScores] = useState(() => {
    const existing = activeKpiList.find(k => (k.teacherId === selectedTeacherId || k.id === selectedTeacherId));
    if (existing && existing.subScores) return { ...existing.subScores };
    return {
      "01.00": 90, "01.01": 90,
      "02.01": 90, "02.02": 90, "02.03": 90,
      "03.01": 90, "03.02": 90,
      "04.02": 90, "05.02": 90, "06.02": 90,
      "07.02": 90, "08.02": 90, "09.02": 90
    };
  });

  const [evaluationNotes, setEvaluationNotes] = useState(() => {
    const existing = activeKpiList.find(k => (k.teacherId === selectedTeacherId || k.id === selectedTeacherId));
    return existing ? existing.notes || "" : "";
  });

  const [saveSuccessNotice, setSaveSuccessNotice] = useState(false);

  // Search & Filter in Rekap
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPeriod, setFilterPeriod] = useState("ALL");
  const [filterGrade, setFilterGrade] = useState("ALL");

  // Modal States
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importPreviewData, setImportPreviewData] = useState(null);
  const [importError, setImportError] = useState(null);
  const [importNotice, setImportNotice] = useState(null);
  const fileInputRef = useRef(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [printTargetEvaluation, setPrintTargetEvaluation] = useState(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // Synchronize currentScores when selected teacher changes
  const handleSelectTeacher = (tId) => {
    setSelectedTeacherId(tId);
    const existing = activeKpiList.find(k => (k.teacherId === tId || k.id === tId));
    if (existing && existing.subScores) {
      setCurrentScores({ ...existing.subScores });
      setEvaluationNotes(existing.notes || "");
    } else {
      // Default scores
      const def = {};
      OFFICIAL_KPI_INDICATORS.forEach(ind => {
        def[ind.code] = 90;
      });
      setCurrentScores(def);
      setEvaluationNotes("");
    }
  };

  // Find active teacher info
  const selectedTeacherObj = useMemo(() => {
    const fromTeachers = teachers.find(t => t.id === selectedTeacherId);
    if (fromTeachers) return fromTeachers;
    const fromKpi = activeKpiList.find(k => (k.teacherId === selectedTeacherId || k.id === selectedTeacherId));
    if (fromKpi) {
      return {
        id: fromKpi.teacherId || fromKpi.id,
        name: fromKpi.teacherName,
        nip: fromKpi.teacherNip,
        role: fromKpi.teacherRole,
        gradeClass: fromKpi.rombel
      };
    }
    return {
      id: "tch-1",
      name: "Uyat Sukriyati, S.Pd",
      nip: "1991051005",
      role: "Guru Wali Kelas 1",
      gradeClass: "Kelas 1 (Fathurrahman)"
    };
  }, [selectedTeacherId, teachers, activeKpiList]);

  // Live Score calculations for current matrix table
  const liveCalculation = useMemo(() => {
    return calculateOfficialKpiScore(currentScores);
  }, [currentScores]);

  const liveGradeInfo = useMemo(() => {
    return getKpiGradeInfo(liveCalculation.totalScore);
  }, [liveCalculation.totalScore]);

  // Handle Score Input Change in Matrix Table
  const handleScoreChange = (code, value) => {
    let val = Number(value);
    if (isNaN(val)) val = 0;
    if (val > 100) val = 100;
    if (val < 0) val = 0;
    setCurrentScores(prev => ({
      ...prev,
      [code]: val
    }));
  };

  const handleQuickBatchSet = (scoreVal) => {
    const updated = {};
    OFFICIAL_KPI_INDICATORS.forEach(ind => {
      updated[ind.code] = scoreVal;
    });
    setCurrentScores(updated);
  };

  // Save current teacher scores into evaluation list
  const handleSaveCurrentTeacherEvaluation = () => {
    const calc = calculateOfficialKpiScore(currentScores);
    const gradeObj = getKpiGradeInfo(calc.totalScore);

    const existingIndex = activeKpiList.findIndex(k => (k.teacherId === selectedTeacherId || k.id === selectedTeacherId));
    
    let rewardTitle = "Apresiasi Kinerja Yayasan";
    let rewardAmount = 500000;
    let rewardDetail = "Insentif Pencapaian Kinerja Rp 500.000 + Sertifikat";

    if (calc.totalScore >= 95) {
      rewardTitle = "Juara 1 Guru Teladan & Berprestasi";
      rewardAmount = 1500000;
      rewardDetail = "Uang Pembinaan Yayasan Rp 1.500.000 + Piagam Penghargaan Resmi";
    } else if (calc.totalScore >= 93) {
      rewardTitle = "Juara 2 Guru Inovatif & Berprestasi";
      rewardAmount = 1000000;
      rewardDetail = "Uang Pembinaan Yayasan Rp 1.000.000 + Piagam Penghargaan Resmi";
    } else if (calc.totalScore >= 90) {
      rewardTitle = "Juara 3 Guru Inspiratif Kesiswaan";
      rewardAmount = 750000;
      rewardDetail = "Uang Pembinaan Yayasan Rp 750.000 + Piagam Penghargaan Resmi";
    }

    const newEvalRecord = {
      id: existingIndex >= 0 ? activeKpiList[existingIndex].id : `kpi-${Date.now()}`,
      teacherId: selectedTeacherObj.id || selectedTeacherId,
      teacherName: selectedTeacherObj.name,
      teacherNip: selectedTeacherObj.nip || "-",
      teacherRole: selectedTeacherObj.role || selectedTeacherObj.position || "Guru Kelas",
      rombel: selectedTeacherObj.gradeClass || "Semua Rombel",
      period: "Semester Ganjil 2026/2027",
      academicYear: "2026/2027",
      subScores: { ...currentScores },
      totalScore: calc.totalScore,
      kinerjaScore: calc.kinerjaScore,
      perilakuScore: calc.perilakuScore,
      grade: gradeObj.short,
      rewardStatus: "DISETUJUI_YAYASAN",
      rewardTitle,
      rewardDetail,
      rewardAmount,
      evaluatorName: "Masykur Rohana, S.Sos (Kepala Sekolah)",
      acknowledgedBy: "Drs. H. M. Syukri, M.M (Ketua Yayasan)",
      evaluationDate: new Date().toISOString().split("T")[0],
      notes: evaluationNotes || `Penilaian KPI resmi berdasarkan 13 butir indikator Sasaran Kinerja & Perilaku.`
    };

    let updatedList;
    if (existingIndex >= 0) {
      updatedList = [...activeKpiList];
      updatedList[existingIndex] = newEvalRecord;
    } else {
      updatedList = [newEvalRecord, ...activeKpiList];
    }

    updateKpiState(updatedList);
    setSaveSuccessNotice(true);
    setTimeout(() => setSaveSuccessNotice(false), 3000);
  };

  // Ranked List for Leaderboard
  const rankedKpiList = useMemo(() => {
    const list = [...activeKpiList];
    list.sort((a, b) => (Number(b.totalScore) || 0) - (Number(a.totalScore) || 0));
    return list;
  }, [activeKpiList]);

  // Filtered List for Rekap Table
  const filteredList = useMemo(() => {
    return rankedKpiList.filter(item => {
      const matchSearch = (item.teacherName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (item.teacherNip || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (item.rombel || "").toLowerCase().includes(searchQuery.toLowerCase());
      const matchPeriod = filterPeriod === "ALL" || item.period === filterPeriod;
      const matchGrade = filterGrade === "ALL" || item.grade === filterGrade;
      return matchSearch && matchPeriod && matchGrade;
    });
  }, [rankedKpiList, searchQuery, filterPeriod, filterGrade]);

  // Navigation between teachers in Matrix view
  const currentTeacherIndex = teachers.findIndex(t => t.id === selectedTeacherId);
  const handlePrevTeacher = () => {
    if (teachers.length <= 1) return;
    const prevIdx = (currentTeacherIndex - 1 + teachers.length) % teachers.length;
    handleSelectTeacher(teachers[prevIdx].id);
  };
  const handleNextTeacher = () => {
    if (teachers.length <= 1) return;
    const nextIdx = (currentTeacherIndex + 1) % teachers.length;
    handleSelectTeacher(teachers[nextIdx].id);
  };

  // EXCEL IMPORT HANDLER (Parses both Matrix format & Rekap table format)
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportError(null);
    setImportNotice(null);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target?.result);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const rawRows = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: "" });

        if (!rawRows || rawRows.length < 2) {
          setImportError("File Excel kosong atau tidak memiliki baris data yang cukup.");
          return;
        }

        // Try to detect if it's the 13-indicator matrix sheet or a multi-teacher rekap sheet
        let detectedScores = {};
        let isMatrixFormat = false;

        // Check if any row contains codes like "01.00", "01.01", etc.
        rawRows.forEach(row => {
          if (!Array.isArray(row)) return;
          const rowStr = row.join(" ");
          OFFICIAL_KPI_INDICATORS.forEach(ind => {
            if (rowStr.includes(ind.code)) {
              isMatrixFormat = true;
              // Look for score number in subsequent columns
              for (let c = 0; c < row.length; c++) {
                const cellVal = Number(row[c]);
                if (!isNaN(cellVal) && cellVal > 0 && cellVal <= 100 && row[c] !== ind.no && row[c] !== ind.weight) {
                  detectedScores[ind.code] = cellVal;
                }
              }
            }
          });
        });

        if (isMatrixFormat && Object.keys(detectedScores).length > 0) {
          // It is a direct 13-indicator matrix sheet!
          setCurrentScores(prev => ({ ...prev, ...detectedScores }));
          setImportNotice(`Berhasil membaca ${Object.keys(detectedScores).length} nilai butir indikator dari lampiran Excel! Nilai telah dimasukkan ke lembar penilaian.`);
          setImportPreviewData([{
            type: "matrix",
            detectedCount: Object.keys(detectedScores).length,
            scores: detectedScores
          }]);
        } else {
          // Parse as multi-teacher list table
          // Find header row with keywords
          let headerRowIndex = 0;
          let highestScore = 0;
          const keywords = ["nama", "guru", "nip", "total", "skor", "nilai", "kinerja", "perilaku", "predikat", "rombel"];

          rawRows.slice(0, 15).forEach((row, rIdx) => {
            const matches = row.filter(cell => {
              const str = String(cell).toLowerCase();
              return keywords.some(k => str.includes(k));
            }).length;
            if (matches > highestScore) {
              highestScore = matches;
              headerRowIndex = rIdx;
            }
          });

          const headers = rawRows[headerRowIndex].map(h => String(h).trim().toLowerCase());
          const nameColIdx = headers.findIndex(h => h.includes("nama") || h.includes("guru"));
          const scoreColIdx = headers.findIndex(h => h.includes("total") || h.includes("skor") || h.includes("nilai"));

          const parsedEvaluations = [];
          for (let r = headerRowIndex + 1; r < rawRows.length; r++) {
            const row = rawRows[r];
            if (!row || row.length === 0) continue;
            const teacherName = nameColIdx >= 0 ? String(row[nameColIdx] || "").trim() : String(row[1] || "").trim();
            if (!teacherName || teacherName.toLowerCase().includes("total") || teacherName.toLowerCase().includes("rata-rata")) continue;

            const score = scoreColIdx >= 0 ? (Number(row[scoreColIdx]) || 88) : 88;
            const gradeInfo = getKpiGradeInfo(score);

            parsedEvaluations.push({
              id: `kpi-import-${r}-${Date.now()}`,
              teacherId: `tch-imp-${r}`,
              teacherName: teacherName,
              teacherNip: String(row[2] || "-"),
              teacherRole: "Guru Pengajar",
              rombel: "Kelas SDIT",
              period: "Semester Ganjil 2026/2027",
              academicYear: "2026/2027",
              subScores: {
                "01.00": score, "01.01": score, "02.01": score, "02.02": score, "02.03": score,
                "03.01": score, "03.02": score, "04.02": score, "05.02": score, "06.02": score,
                "07.02": score, "08.02": score, "09.02": score
              },
              totalScore: score,
              kinerjaScore: Math.round(score * 0.5 * 10) / 10,
              perilakuScore: Math.round(score * 0.5 * 10) / 10,
              grade: gradeInfo.short,
              rewardStatus: "DISETUJUI_YAYASAN",
              rewardTitle: score >= 90 ? "Juara Guru Berprestasi" : "Apresiasi Kinerja Yayasan",
              rewardDetail: "Insentif Pencapaian Kinerja",
              rewardAmount: score >= 90 ? 1000000 : 500000,
              evaluatorName: "Masykur Rohana, S.Sos (Kepala Sekolah)",
              acknowledgedBy: "Drs. H. M. Syukri, M.M (Ketua Yayasan)",
              evaluationDate: new Date().toISOString().split("T")[0],
              notes: "Data diimpor dari file lampiran Excel."
            });
          }

          if (parsedEvaluations.length === 0) {
            setImportError("Tidak dapat mengenali baris data guru pada file Excel. Pastikan terdapat kolom Nama Guru dan Nilai.");
            return;
          }

          setImportPreviewData(parsedEvaluations);
          setImportNotice(`Berhasil membaca ${parsedEvaluations.length} data evaluasi guru dari file Excel!`);
        }
      } catch (err) {
        console.error(err);
        setImportError("Gagal membaca file Excel. Pastikan format file .xlsx / .xls valid.");
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleApplyImport = () => {
    if (!importPreviewData) return;
    if (importPreviewData[0]?.type === "matrix") {
      handleSaveCurrentTeacherEvaluation();
      setIsImportModalOpen(false);
      setImportPreviewData(null);
      return;
    }

    const merged = [...importPreviewData, ...activeKpiList.filter(k => !importPreviewData.some(p => p.teacherName.toLowerCase() === k.teacherName.toLowerCase()))];
    updateKpiState(merged);
    setIsImportModalOpen(false);
    setImportPreviewData(null);
  };

  // EXPORT TO EXCEL (.xlsx)
  const handleExportExcel = () => {
    try {
      const wb = XLSX.utils.book_new();

      // Sheet 1: Rekapitulasi Seluruh Guru
      const rekapRows = [
        ["REKAPITULASI PENILAIAN KINERJA GURU (KPI)"],
        ["YAYASAN PENDIDIKAN DAARUL HABIBAH - SDIT EL-FATAH"],
        [`Periode: Semester Ganjil 2026/2027 | Tanggal Ekspor: ${new Date().toLocaleDateString("id-ID")}`],
        [],
        ["Peringkat", "Nama Guru", "NIPY", "Jabatan / Rombel", "Skor Kinerja (50%)", "Skor Perilaku (50%)", "Total Nilai Akhir", "Predikat Mutu", "Apresiasi / Hadiah", "Catatan Evaluasi"]
      ];

      rankedKpiList.forEach((item, idx) => {
        rekapRows.push([
          idx + 1,
          item.teacherName,
          item.teacherNip || "-",
          item.rombel || item.teacherRole || "-",
          item.kinerjaScore || 0,
          item.perilakuScore || 0,
          item.totalScore || 0,
          item.grade || "-",
          item.rewardTitle || "-",
          item.notes || "-"
        ]);
      });

      const wsRekap = XLSX.utils.aoa_to_sheet(rekapRows);
      XLSX.utils.book_append_sheet(wb, wsRekap, "Rekapitulasi_KPI");

      // Sheet 2: Matriks 13 Indikator Resmi Guru Terpilih
      const matrixRows = [
        ["LEMBAR PENILAIAN INDIKATOR KPI GURU (FORMAT RESMI 13 BUTIR)"],
        [`Nama Guru: ${selectedTeacherObj.name} | NIP: ${selectedTeacherObj.nip || "-"} | Rombel: ${selectedTeacherObj.gradeClass || "-"}`],
        [],
        ["NO", "KLP", "Sasaran Kerja", "Kode", "Ukuran Prestasi Kerja", "Bobot (%)", "Skor (0-100)", "Nilai"]
      ];

      OFFICIAL_KPI_INDICATORS.forEach(ind => {
        const rawScore = Number(currentScores[ind.code]) || 0;
        const nilai = Math.round((rawScore * (ind.weight / 100)) * 100) / 100;
        matrixRows.push([
          ind.no,
          ind.category,
          ind.targetGoal,
          ind.code,
          ind.description,
          `${ind.weight}%`,
          rawScore,
          nilai
        ]);
      });

      matrixRows.push([]);
      matrixRows.push(["", "", "", "", "TOTAL BOBOT & NILAI AKHIR", "100%", "", liveCalculation.totalScore]);
      matrixRows.push(["", "", "", "", "PREDIKAT CAPAIAN", "", "", liveGradeInfo.short]);

      const wsMatrix = XLSX.utils.aoa_to_sheet(matrixRows);
      XLSX.utils.book_append_sheet(wb, wsMatrix, "Matriks_13_Indikator");

      XLSX.writeFile(wb, `Standar_KPI_Guru_SDIT_ELFATAH_${new Date().toISOString().split("T")[0]}.xlsx`);
    } catch (e) {
      console.error("Gagal export Excel", e);
    }
  };

  // DOWNLOAD TEMPLATE EXCEL
  const handleDownloadTemplate = () => {
    try {
      const wb = XLSX.utils.book_new();
      const templateRows = [
        ["NO", "KLP", "Sasaran Kerja", "Kode", "Ukuran Prestasi Kerja", "Bobot", "Skor (diisi Kepsek)", "Nilai"]
      ];

      OFFICIAL_KPI_INDICATORS.forEach(ind => {
        templateRows.push([
          ind.no,
          ind.category,
          ind.targetGoal,
          ind.code,
          ind.description,
          `${ind.weight}%`,
          90,
          `=F${templateRows.length + 1}*G${templateRows.length + 1}`
        ]);
      });

      const ws = XLSX.utils.aoa_to_sheet(templateRows);
      XLSX.utils.book_append_sheet(wb, ws, "Template_KPI_13_Indikator");
      XLSX.writeFile(wb, "Template_Standar_KPI_Guru_13_Indikator.xlsx");
    } catch (e) {
      console.error(e);
    }
  };

  // Helper to open a dedicated print window with full styling (works 100% reliably across all iframes and browsers)
  const openPrintWindow = (target) => {
    try {
      const printWindow = window.open("", "_blank", "width=900,height=800");
      if (!printWindow) {
        // If popup was blocked, fallback to standard window.print()
        window.print();
        return;
      }

      const scoreDict = target.subScores || currentScores;
      const rowsHtml = OFFICIAL_KPI_INDICATORS.map((ind) => {
        const s = Number(scoreDict[ind.code]) || 0;
        const val = Math.round((s * (ind.weight / 100)) * 100) / 100;
        return `
          <tr>
            <td style="border: 1px solid #1e293b; padding: 6px 8px; text-align: center; font-weight: bold;">${ind.no}</td>
            <td style="border: 1px solid #1e293b; padding: 6px 8px; text-align: center; font-size: 8.5pt;">${ind.category}</td>
            <td style="border: 1px solid #1e293b; padding: 6px 8px; font-weight: 600;">${ind.targetGoal}</td>
            <td style="border: 1px solid #1e293b; padding: 6px 8px; text-align: center; font-family: monospace; font-weight: bold;">${ind.code}</td>
            <td style="border: 1px solid #1e293b; padding: 6px 8px; font-size: 8.5pt; line-height: 1.35;">${ind.description}</td>
            <td style="border: 1px solid #1e293b; padding: 6px 8px; text-align: center;">${ind.weightPercent}</td>
            <td style="border: 1px solid #1e293b; padding: 6px 8px; text-align: center; font-weight: bold;">${s}</td>
            <td style="border: 1px solid #1e293b; padding: 6px 8px; text-align: center; font-weight: bold; background-color: #f8fafc;">${val.toFixed(2)}</td>
          </tr>
        `;
      }).join("");

      const printHtml = `
        <!DOCTYPE html>
        <html lang="id">
        <head>
          <meta charset="utf-8">
          <title>Lembar Penilaian KPI - ${target.teacherName}</title>
          <style>
            @page {
              size: A4 portrait;
              margin: 15mm;
            }
            body {
              font-family: "Times New Roman", Times, serif;
              color: #0f172a;
              background: #fff;
              margin: 0;
              padding: 10px;
              font-size: 10pt;
              line-height: 1.4;
            }
            .header {
              text-align: center;
              border-bottom: 2px solid #000;
              padding-bottom: 8px;
              margin-bottom: 12px;
            }
            .header h2 { margin: 0; font-size: 13pt; letter-spacing: 0.5px; }
            .header h1 { margin: 2px 0; font-size: 16pt; font-weight: bold; }
            .header p { margin: 0; font-size: 9pt; font-style: italic; color: #334155; }
            .title-box { text-align: center; margin-bottom: 12px; }
            .title-box h3 { margin: 0; font-size: 12pt; text-decoration: underline; }
            .title-box p { margin: 2px 0 0; font-size: 9.5pt; }
            .meta-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 12px;
              border: 1px solid #000;
              padding: 10px;
              margin-bottom: 14px;
              font-size: 9.5pt;
            }
            .meta-grid div p { margin: 3px 0; }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 14px;
              font-size: 8.5pt;
            }
            th {
              background-color: #e2e8f0;
              border: 1px solid #1e293b;
              padding: 6px 8px;
              text-align: center;
              font-weight: bold;
            }
            .footer-row {
              background-color: #f1f5f9;
              font-weight: bold;
              font-size: 9.5pt;
            }
            .notes-box {
              border: 1px solid #000;
              padding: 8px 10px;
              margin-bottom: 16px;
              font-size: 9pt;
            }
            .signatures {
              display: grid;
              grid-template-columns: 1fr 1fr;
              text-align: center;
              margin-top: 20px;
              page-break-inside: avoid;
              font-size: 9.5pt;
            }
            .sign-space {
              height: 55px;
              display: flex;
              align-items: center;
              justify-content: center;
              color: #94a3b8;
              font-family: monospace;
              font-size: 8pt;
            }
            .action-bar {
              margin-bottom: 15px;
              padding: 10px;
              background: #f8fafc;
              border: 1px solid #cbd5e1;
              border-radius: 8px;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            @media print {
              .action-bar { display: none !important; }
              body { padding: 0 !important; }
            }
          </style>
        </head>
        <body>
          <div class="action-bar">
            <span><strong>Lembar Penilaian Kinerja Guru (KPI 13 Indikator)</strong> — Siap Cetak</span>
            <button onclick="window.print()" style="background:#2563eb;color:#fff;border:none;padding:8px 16px;border-radius:6px;font-weight:bold;cursor:pointer;">
              🖨️ Cetak / Simpan PDF Sekarang
            </button>
          </div>

          <div class="header">
            <h2>YAYASAN PENDIDIKAN DAARUL HABIBAH</h2>
            <h1>SDIT EL-FATAH</h1>
            <p>Jl. Raya Kresek No. 12, Sukamulya, Kab. Tangerang, Banten 15610 | Email: sdit.elfatah@gmail.com</p>
          </div>

          <div class="title-box">
            <h3>LEMBAR PENILAIAN INDIKATOR KINERJA GURU (KPI) RESMI</h3>
            <p>Tahun Ajaran 2026/2027 — Semester Ganjil</p>
          </div>

          <div class="meta-grid">
            <div>
              <p><strong>Nama Guru:</strong> ${target.teacherName}</p>
              <p><strong>NIPY:</strong> ${target.teacherNip || "-"}</p>
              <p><strong>Jabatan/Tugas:</strong> ${target.teacherRole || "Guru Pengajar"}</p>
            </div>
            <div>
              <p><strong>Rombongan Belajar:</strong> ${target.rombel || "-"}</p>
              <p><strong>Tanggal Penilaian:</strong> ${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p>
              <p><strong>Pejabat Penilai:</strong> Masykur Rohana, S.Sos (Kepala Sekolah)</p>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th style="width: 30px;">NO</th>
                <th style="width: 55px;">KLP</th>
                <th style="width: 140px;">Sasaran Kerja</th>
                <th style="width: 45px;">Kode</th>
                <th>Ukuran Prestasi Kerja (Indikator)</th>
                <th style="width: 45px;">Bobot</th>
                <th style="width: 45px;">Skor</th>
                <th style="width: 50px;">Nilai</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
            <tfoot>
              <tr class="footer-row">
                <td colspan="5" style="border: 1px solid #1e293b; padding: 6px 8px; text-align: right; text-transform: uppercase;">
                  Total Akumulasi Bobot & Nilai Akhir :
                </td>
                <td style="border: 1px solid #1e293b; padding: 6px 8px; text-align: center;">100%</td>
                <td style="border: 1px solid #1e293b; padding: 6px 8px; text-align: center;">-</td>
                <td style="border: 1px solid #1e293b; padding: 6px 8px; text-align: center; font-size: 10pt; background: #e0f2fe;">
                  ${Number(target.totalScore || 0).toFixed(2)}
                </td>
              </tr>
              <tr class="footer-row">
                <td colspan="5" style="border: 1px solid #1e293b; padding: 6px 8px; text-align: right; text-transform: uppercase;">
                  Predikat Mutu & Status Apresiasi :
                </td>
                <td colspan="3" style="border: 1px solid #1e293b; padding: 6px 8px; text-align: center; font-size: 10pt;">
                  ${target.grade || "Sangat Baik (A)"} (${target.rewardTitle || "Apresiasi Yayasan"})
                </td>
              </tr>
            </tfoot>
          </table>

          <div class="notes-box">
            <strong>Catatan & Rekomendasi Kepala Sekolah:</strong>
            <p style="margin: 4px 0 0; font-style: italic;">
              "${target.notes || "Kinerja sangat baik dan memenuhi standar yayasan."}"
            </p>
          </div>

          <div class="signatures">
            <div>
              <p>Guru yang Dinilai,</p>
              <div class="sign-space">[ Tanda Tangan Digital ]</div>
              <p><strong><u>${target.teacherName}</u></strong></p>
              <p style="font-size: 8.5pt;">NIPY. ${target.teacherNip || "-"}</p>
            </div>
            <div>
              <p>Tangerang, ${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p>
              <p>Kepala Sekolah SDIT EL-FATAH,</p>
              <div class="sign-space">[ CAP RESMI & TTD DIGITAL ]</div>
              <p><strong><u>Masykur Rohana, S.Sos</u></strong></p>
              <p style="font-size: 8.5pt;">NIPY. 20190701</p>
            </div>
          </div>

          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 400);
            };
          </script>
        </body>
        </html>
      `;

      printWindow.document.open();
      printWindow.document.write(printHtml);
      printWindow.document.close();
    } catch (err) {
      console.warn("Direct popup print fallback to window.print:", err);
      window.print();
    }
  };

  // PRINT OFFICIAL EVALUATION SHEET
  const handlePrint = (itemToPrint) => {
    const target = itemToPrint || {
      teacherName: selectedTeacherObj.name,
      teacherNip: selectedTeacherObj.nip,
      teacherRole: selectedTeacherObj.role,
      rombel: selectedTeacherObj.gradeClass,
      period: "Semester Ganjil 2026/2027",
      academicYear: "2026/2027",
      subScores: currentScores,
      totalScore: liveCalculation.totalScore,
      kinerjaScore: liveCalculation.kinerjaScore,
      perilakuScore: liveCalculation.perilakuScore,
      grade: liveGradeInfo.short,
      rewardTitle: liveCalculation.totalScore >= 95 ? "Juara 1 Guru Teladan & Berprestasi" : "Apresiasi Kinerja Yayasan",
      rewardAmount: liveCalculation.totalScore >= 95 ? 1500000 : 500000,
      notes: evaluationNotes || "Telah memenuhi standar evaluasi kinerja yayasan dengan sangat baik."
    };

    setPrintTargetEvaluation(target);
    setIsPrintModalOpen(true);
  };

  const handleExecutePrint = () => {
    if (printTargetEvaluation) {
      openPrintWindow(printTargetEvaluation);
    } else {
      window.print();
    }
  };

  return (
    <div id="kpi-module-container" className="space-y-6 pb-12 font-sans">
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                <FileSpreadsheet className="w-3.5 h-3.5 text-blue-400" /> Standar Baku Lampiran Excel
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 13 Butir Indikator Resmi
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30">
                <Trophy className="w-3.5 h-3.5 text-amber-400" /> Insentif & Juara Guru
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <Award className="w-8 h-8 text-amber-400 shrink-0" />
              Penilaian Kinerja Guru (KPI) Standar Excel Resmi
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
              Modul evaluasi terintegrasi SDIT EL-FATAH berbasis 13 butir matriks indikator Sasaran Kinerja (50%) dan Perilaku Kerja (50%) sesuai lampiran format Excel yayasan.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsImportModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <Upload className="w-4 h-4" /> Impor Excel
            </button>
            <button
              onClick={handleExportExcel}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <Download className="w-4 h-4" /> Ekspor Excel (.xlsx)
            </button>
            <button
              onClick={() => handlePrint()}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <Printer className="w-4 h-4 text-slate-300" /> Cetak Lembar Resmi
            </button>
          </div>
        </div>

        {saveSuccessNotice && (
          <div className="mt-4 p-3.5 bg-emerald-950/80 border border-emerald-500/60 rounded-xl text-emerald-200 text-sm flex items-center justify-between gap-3 animate-fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span><strong>Berhasil!</strong> Penilaian 13 butir KPI guru <strong>{selectedTeacherObj.name}</strong> telah disimpan ke database yayasan.</span>
            </div>
            <button onClick={() => setSaveSuccessNotice(false)} className="text-emerald-400 hover:text-white font-bold text-xs">TUTUP</button>
          </div>
        )}
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab("matrix")}
          className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "matrix"
              ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
              : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" /> Lembar Matriks Tabel Excel (13 Indikator)
        </button>
        <button
          onClick={() => setActiveTab("rekap")}
          className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "rekap"
              ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
              : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
          }`}
        >
          <Trophy className="w-4 h-4" /> Rekapitulasi & Podium Guru ({rankedKpiList.length})
        </button>
        <button
          onClick={() => setActiveTab("rubrik")}
          className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "rubrik"
              ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
              : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
          }`}
        >
          <Layers className="w-4 h-4" /> Standar Baku & Bobot Yayasan
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: LEMBAR MATRIKS TABEL EXCEL RESMI (13 INDIKATOR) */}
      {/* ========================================================================= */}
      {activeTab === "matrix" && (
        <div className="space-y-6 animate-fade-in">
          {/* TEACHER PICKER & CONTROLLER BAR */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Pilih Guru Yang Dinilai:
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <select
                    value={selectedTeacherId}
                    onChange={(e) => handleSelectTeacher(e.target.value)}
                    className="px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {teachers.length > 0
                      ? teachers.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.name} ({t.role || t.position || "Guru"} - {t.gradeClass || "Kelas"})
                          </option>
                        ))
                      : activeKpiList.map((k) => (
                          <option key={k.id} value={k.teacherId || k.id}>
                            {k.teacherName} ({k.rombel || "Guru"})
                          </option>
                        ))}
                  </select>
                  
                  <div className="flex items-center gap-1">
                    <button
                      onClick={handlePrevTeacher}
                      title="Guru Sebelumnya"
                      className="p-2 border border-slate-200 hover:bg-slate-100 rounded-lg text-slate-600 cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleNextTeacher}
                      title="Guru Berikutnya"
                      className="p-2 border border-slate-200 hover:bg-slate-100 rounded-lg text-slate-600 cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* QUICK BATCH SCORING SHORTCUTS */}
            <div className="flex flex-wrap items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-slate-500 px-2">Set Cepat Semua Butir:</span>
              {[100, 95, 90, 85, 80].map((scoreVal) => (
                <button
                  key={scoreVal}
                  onClick={() => handleQuickBatchSet(scoreVal)}
                  className="px-2.5 py-1 text-xs font-bold rounded-lg bg-white border border-slate-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 text-slate-700 transition cursor-pointer"
                >
                  {scoreVal}
                </button>
              ))}
              <button
                onClick={() => handleQuickBatchSet(90)}
                title="Reset ke Standar 90"
                className="p-1 text-slate-400 hover:text-slate-700 rounded cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* TEACHER IDENTITY & SCORE SUMMARY CARD */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm grid grid-cols-1 lg:grid-cols-4 gap-6 items-center">
            <div className="lg:col-span-2 space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                  {selectedTeacherObj.role || "Guru Pengajar"}
                </span>
                <span className="text-xs text-slate-500">
                  NIP: <strong className="text-slate-700">{selectedTeacherObj.nip || "-"}</strong>
                </span>
              </div>
              <h2 className="text-xl font-black text-slate-900">
                {selectedTeacherObj.name}
              </h2>
              <p className="text-xs text-slate-500 flex items-center gap-2">
                <span>Rombel: <strong>{selectedTeacherObj.gradeClass || "Semua Rombel"}</strong></span>
                <span>•</span>
                <span>Periode: <strong>Semester Ganjil 2026/2027</strong></span>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-center">
                <span className="text-[11px] font-bold text-blue-700 uppercase">Subtotal Kinerja</span>
                <div className="text-lg font-black text-blue-900 mt-0.5">
                  {liveCalculation.kinerjaScore.toFixed(2)}
                  <span className="text-xs text-blue-500 font-normal"> / 50</span>
                </div>
              </div>
              <div className="p-3 bg-purple-50/70 border border-purple-200 rounded-xl text-center">
                <span className="text-[11px] font-bold text-purple-700 uppercase">Subtotal Perilaku</span>
                <div className="text-lg font-black text-purple-900 mt-0.5">
                  {liveCalculation.perilakuScore.toFixed(2)}
                  <span className="text-xs text-purple-500 font-normal"> / 50</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-200 rounded-2xl flex flex-col justify-center items-center text-center">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Nilai Akhir</span>
              <div className="text-3xl font-black text-indigo-700 tracking-tight my-0.5">
                {liveCalculation.totalScore.toFixed(2)}
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${liveGradeInfo.badge}`}>
                {liveGradeInfo.short}
              </span>
            </div>
          </div>

          {/* THE OFFICIAL 13-ROW EXCEL MATRIX TABLE */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-base flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
                  Tabel Format Lampiran Excel (13 Indikator Standar Yayasan)
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Setiap skor butir (0-100) langsung dikalikan dengan bobot untuk menghasilkan nilai akumulatif otomatis.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadTemplate}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold flex items-center gap-1.5 border border-slate-700 transition cursor-pointer"
                  title="Unduh Template Excel Format Ini"
                >
                  <Download className="w-3.5 h-3.5" /> Unduh Template
                </button>
                <button
                  onClick={handleSaveCurrentTeacherEvaluation}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md transition active:scale-95 cursor-pointer"
                >
                  <Check className="w-4 h-4" /> Simpan Nilai Guru Ini
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 uppercase font-black tracking-wider text-[11px] border-b border-slate-300">
                    <th className="py-3 px-2 text-center border-r border-slate-300 w-12">NO</th>
                    <th className="py-3 px-3 text-center border-r border-slate-300 w-24">KLP</th>
                    <th className="py-3 px-3 border-r border-slate-300 w-48">Sasaran Kerja</th>
                    <th className="py-3 px-2 text-center border-r border-slate-300 w-16">Kode</th>
                    <th className="py-3 px-4 border-r border-slate-300">Ukuran Prestasi Kerja (Indikator)</th>
                    <th className="py-3 px-3 text-center border-r border-slate-300 w-20">Bobot</th>
                    <th className="py-3 px-3 text-center border-r border-slate-300 w-32 bg-amber-50 text-amber-900">
                      Skor (0-100)<br/><span className="text-[9px] font-normal lowercase">(diisi Kepsek)</span>
                    </th>
                    <th className="py-3 px-3 text-center w-24 bg-blue-50 text-blue-900">Nilai</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {OFFICIAL_KPI_INDICATORS.map((ind, idx) => {
                    const currentScore = Number(currentScores[ind.code]) || 0;
                    const calculatedValue = Math.round((currentScore * (ind.weight / 100)) * 100) / 100;

                    return (
                      <tr
                        key={ind.code}
                        className={`hover:bg-blue-50/40 transition-colors ${
                          ind.category === "Kinerja" ? "bg-white" : "bg-slate-50/40"
                        }`}
                      >
                        {/* NO */}
                        {ind.isFirstInGoal && (
                          <td
                            rowSpan={ind.rowSpanGoal}
                            className="py-3 px-2 text-center font-bold text-slate-800 border-r border-slate-200 align-middle bg-slate-50/80"
                          >
                            {ind.no}
                          </td>
                        )}

                        {/* KLP */}
                        {ind.isFirstInCat && (
                          <td
                            rowSpan={ind.rowSpanCat}
                            className={`py-3 px-3 text-center font-black border-r border-slate-200 align-middle ${
                              ind.category === "Kinerja"
                                ? "text-blue-700 bg-blue-50/40"
                                : "text-purple-700 bg-purple-50/40"
                            }`}
                          >
                            <div className="flex flex-col items-center justify-center gap-1">
                              <span className="text-xs">{ind.category}</span>
                              <span className="text-[10px] font-semibold opacity-75">(50%)</span>
                            </div>
                          </td>
                        )}

                        {/* Sasaran Kerja */}
                        {ind.isFirstInGoal && (
                          <td
                            rowSpan={ind.rowSpanGoal}
                            className="py-3 px-3 font-bold text-slate-800 border-r border-slate-200 align-middle leading-snug"
                          >
                            {ind.targetGoal}
                          </td>
                        )}

                        {/* Kode */}
                        <td className="py-3 px-2 text-center font-mono font-bold text-indigo-700 border-r border-slate-200 bg-slate-50/50">
                          {ind.code}
                        </td>

                        {/* Ukuran Prestasi Kerja (Description) */}
                        <td className="py-3 px-4 text-slate-700 border-r border-slate-200 leading-relaxed font-normal">
                          {ind.description}
                        </td>

                        {/* Bobot */}
                        <td className="py-3 px-3 text-center font-bold text-slate-800 border-r border-slate-200">
                          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 font-mono text-xs">
                            {ind.weightPercent}
                          </span>
                        </td>

                        {/* Skor (Input diisi Kepsek) */}
                        <td className="py-2.5 px-3 border-r border-slate-200 bg-amber-50/40 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <input
                              type="number"
                              min={0}
                              max={100}
                              step={1}
                              value={currentScore}
                              onChange={(e) => handleScoreChange(ind.code, e.target.value)}
                              className="w-16 px-2 py-1.5 text-center font-black text-sm text-slate-900 bg-white border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-inner"
                            />
                          </div>
                        </td>

                        {/* Nilai (Bobot * Skor) */}
                        <td className="py-3 px-3 text-center font-mono font-black text-sm text-blue-800 bg-blue-50/30">
                          {calculatedValue.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>

                {/* TABLE FOOTER (TOTALS) */}
                <tfoot>
                  <tr className="bg-slate-900 text-white font-bold text-xs border-t-2 border-slate-950">
                    <td colSpan={5} className="py-3.5 px-4 text-right uppercase tracking-wider text-slate-300">
                      Total Akumulasi Bobot & Nilai Akhir KPI :
                    </td>
                    <td className="py-3.5 px-3 text-center font-mono font-black text-emerald-400 border-x border-slate-800">
                      100%
                    </td>
                    <td className="py-3.5 px-3 text-center font-semibold text-slate-400 border-r border-slate-800 text-[11px]">
                      (13 Butir)
                    </td>
                    <td className="py-3.5 px-3 text-center font-mono font-black text-base text-amber-400 bg-slate-950">
                      {liveCalculation.totalScore.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* EVALUATION NOTES & ACTIONS */}
            <div className="p-5 bg-slate-50 border-t border-slate-200 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Catatan Supervisi, Umpan Balik & Rekomendasi Kepala Sekolah:
                </label>
                <textarea
                  rows={2}
                  value={evaluationNotes}
                  onChange={(e) => setEvaluationNotes(e.target.value)}
                  placeholder="Tuliskan catatan khusus terkait pencapaian modul ajar, diferensiasi kelas, kedisiplinan, atau apresiasi penghargaan yayasan..."
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                <div className="text-xs text-slate-500 flex items-center gap-2">
                  <Info className="w-4 h-4 text-blue-500 shrink-0" />
                  <span>Tekan tombol <strong>"Simpan Nilai Guru Ini"</strong> untuk memperbarui rekapitulasi dan urutan peringkat guru.</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePrint()}
                    className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5 text-slate-500" /> Cetak Lembar Ini
                  </button>
                  <button
                    onClick={handleSaveCurrentTeacherEvaluation}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition active:scale-95 cursor-pointer"
                  >
                    <Check className="w-4 h-4" /> Simpan Nilai Guru Ini
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: REKAPITULASI & PODIUM GURU BERPRESTASI */}
      {/* ========================================================================= */}
      {activeTab === "rekap" && (
        <div className="space-y-6 animate-fade-in">
          {/* PODIUM TOP 3 GURU TELADAN */}
          {rankedKpiList.length >= 3 && (
            <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 text-white shadow-xl border border-slate-800">
              <div className="text-center max-w-xl mx-auto mb-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 mb-2">
                  <Trophy className="w-3.5 h-3.5" /> Podium Kehormatan Yayasan
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  Guru Teladan & Berprestasi Semester Ini
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Berdasarkan akumulasi nilai tertinggi 13 butir indikator Sasaran Kinerja & Perilaku.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end max-w-4xl mx-auto pt-2">
                {/* JUARA 2 */}
                {rankedKpiList[1] && (
                  <div className="order-2 md:order-1 bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 text-center flex flex-col items-center relative hover:border-slate-500 transition shadow-lg">
                    <div className="w-10 h-10 rounded-full bg-slate-300 text-slate-900 font-black text-base flex items-center justify-center mb-2 shadow-md">
                      2
                    </div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Juara 2 Guru Inovatif</span>
                    <h4 className="text-base font-bold text-white mt-1 leading-snug">{rankedKpiList[1].teacherName}</h4>
                    <span className="text-xs text-slate-400">{rankedKpiList[1].rombel || "Guru"}</span>
                    <div className="text-2xl font-black text-slate-200 mt-2">{Number(rankedKpiList[1].totalScore).toFixed(1)}</div>
                    <span className="text-[11px] text-emerald-400 font-semibold mt-1">Uang Pembinaan Rp 1.000.000</span>
                    <button
                      onClick={() => {
                        handleSelectTeacher(rankedKpiList[1].teacherId || rankedKpiList[1].id);
                        setActiveTab("matrix");
                      }}
                      className="mt-3 text-xs text-blue-400 hover:text-blue-300 font-bold underline cursor-pointer"
                    >
                      Buka Lembar Nilai →
                    </button>
                  </div>
                )}

                {/* JUARA 1 (CENTER HIGHER) */}
                {rankedKpiList[0] && (
                  <div className="order-1 md:order-2 bg-gradient-to-b from-amber-500/20 to-slate-800/90 border-2 border-amber-400/70 rounded-3xl p-6 text-center flex flex-col items-center relative -translate-y-2 hover:border-amber-300 transition shadow-2xl">
                    <div className="absolute -top-3 px-3 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] tracking-wider uppercase shadow-md flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> JUARA 1 UTAMA
                    </div>
                    <div className="w-14 h-14 rounded-full bg-amber-400 text-slate-950 font-black text-xl flex items-center justify-center mb-2 shadow-xl ring-4 ring-amber-400/30">
                      1
                    </div>
                    <span className="text-xs font-black text-amber-300 uppercase tracking-wider">Guru Teladan Nomor 1</span>
                    <h4 className="text-lg font-extrabold text-white mt-1 leading-snug">{rankedKpiList[0].teacherName}</h4>
                    <span className="text-xs text-slate-300">{rankedKpiList[0].rombel || "Guru"}</span>
                    <div className="text-3xl font-black text-amber-300 mt-2">{Number(rankedKpiList[0].totalScore).toFixed(1)}</div>
                    <span className="text-xs text-emerald-300 font-bold mt-1">Uang Pembinaan Rp 1.500.000 + Piagam</span>
                    <button
                      onClick={() => {
                        handleSelectTeacher(rankedKpiList[0].teacherId || rankedKpiList[0].id);
                        setActiveTab("matrix");
                      }}
                      className="mt-4 px-4 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl transition shadow-md cursor-pointer"
                    >
                      Buka Lembar Penilaian →
                    </button>
                  </div>
                )}

                {/* JUARA 3 */}
                {rankedKpiList[2] && (
                  <div className="order-3 bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 text-center flex flex-col items-center relative hover:border-slate-500 transition shadow-lg">
                    <div className="w-10 h-10 rounded-full bg-amber-700 text-white font-black text-base flex items-center justify-center mb-2 shadow-md">
                      3
                    </div>
                    <span className="text-[11px] font-bold text-amber-400/90 uppercase tracking-wider">Juara 3 Guru Inspiratif</span>
                    <h4 className="text-base font-bold text-white mt-1 leading-snug">{rankedKpiList[2].teacherName}</h4>
                    <span className="text-xs text-slate-400">{rankedKpiList[2].rombel || "Guru"}</span>
                    <div className="text-2xl font-black text-slate-200 mt-2">{Number(rankedKpiList[2].totalScore).toFixed(1)}</div>
                    <span className="text-[11px] text-emerald-400 font-semibold mt-1">Uang Pembinaan Rp 750.000</span>
                    <button
                      onClick={() => {
                        handleSelectTeacher(rankedKpiList[2].teacherId || rankedKpiList[2].id);
                        setActiveTab("matrix");
                      }}
                      className="mt-3 text-xs text-blue-400 hover:text-blue-300 font-bold underline cursor-pointer"
                    >
                      Buka Lembar Nilai →
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* FILTER & SEARCH BAR */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="w-full md:w-80 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari nama guru, NIP, atau rombel..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 focus:bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
              <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                <Filter className="w-4 h-4 text-slate-500" />
                <span className="text-xs font-medium text-slate-600">Predikat:</span>
                <select
                  value={filterGrade}
                  onChange={(e) => setFilterGrade(e.target.value)}
                  className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none"
                >
                  <option value="ALL">Semua Predikat</option>
                  <option value="Sangat Memuaskan">Sangat Memuaskan (≥ 90)</option>
                  <option value="Memuaskan">Memuaskan (80 - 89)</option>
                  <option value="Cukup">Cukup (70 - 79)</option>
                  <option value="Perlu Pembinaan">Perlu Pembinaan (&lt; 70)</option>
                </select>
              </div>

              <button
                onClick={handleExportExcel}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> Ekspor Tabel
              </button>
            </div>
          </div>

          {/* REKAPITULASI TABLE */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  Daftar Peringkat & Hasil Evaluasi KPI Seluruh Guru
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Menampilkan {filteredList.length} dari total {rankedKpiList.length} guru yang terdaftar dalam sistem evaluasi.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 uppercase font-black tracking-wider text-[11px] border-b border-slate-300">
                    <th className="py-3 px-3 text-center w-12">Rank</th>
                    <th className="py-3 px-4">Nama Guru & NIP</th>
                    <th className="py-3 px-3">Rombel / Jabatan</th>
                    <th className="py-3 px-3 text-center">Kinerja (50%)</th>
                    <th className="py-3 px-3 text-center">Perilaku (50%)</th>
                    <th className="py-3 px-3 text-center bg-indigo-50/60 text-indigo-900">Total Skor</th>
                    <th className="py-3 px-3 text-center">Predikat Mutu</th>
                    <th className="py-3 px-3">Apresiasi Yayasan</th>
                    <th className="py-3 px-4 text-center w-36">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredList.length > 0 ? (
                    filteredList.map((item, idx) => {
                      const gradeInfo = getKpiGradeInfo(item.totalScore);
                      return (
                        <tr key={item.id} className="hover:bg-blue-50/30 transition-colors">
                          <td className="py-3.5 px-3 text-center font-black text-slate-700">
                            {idx === 0 && <span className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 inline-flex items-center justify-center font-bold text-xs shadow-sm">1</span>}
                            {idx === 1 && <span className="w-6 h-6 rounded-full bg-slate-300 text-slate-900 inline-flex items-center justify-center font-bold text-xs shadow-sm">2</span>}
                            {idx === 2 && <span className="w-6 h-6 rounded-full bg-amber-700 text-white inline-flex items-center justify-center font-bold text-xs shadow-sm">3</span>}
                            {idx > 2 && <span className="text-slate-500">#{idx + 1}</span>}
                          </td>
                          <td className="py-3.5 px-4 font-bold text-slate-900">
                            <div className="text-sm font-bold text-slate-900">{item.teacherName}</div>
                            <div className="text-[11px] text-slate-500 font-normal">NIP: {item.teacherNip || "-"}</div>
                          </td>
                          <td className="py-3.5 px-3 text-slate-700 font-medium">
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px]">
                              {item.rombel || item.teacherRole || "Guru"}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 text-center font-mono font-bold text-blue-700">
                            {Number(item.kinerjaScore || 0).toFixed(1)}
                          </td>
                          <td className="py-3.5 px-3 text-center font-mono font-bold text-purple-700">
                            {Number(item.perilakuScore || 0).toFixed(1)}
                          </td>
                          <td className="py-3.5 px-3 text-center font-mono font-black text-sm text-indigo-700 bg-indigo-50/40">
                            {Number(item.totalScore || 0).toFixed(1)}
                          </td>
                          <td className="py-3.5 px-3 text-center">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${gradeInfo.badge}`}>
                              {gradeInfo.short}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 text-slate-700 text-xs">
                            <div className="font-bold text-emerald-700">{item.rewardTitle || "-"}</div>
                            <div className="text-[11px] text-slate-500">{formatCurrency(item.rewardAmount)}</div>
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => {
                                  handleSelectTeacher(item.teacherId || item.id);
                                  setActiveTab("matrix");
                                }}
                                title="Buka Tabel 13 Indikator"
                                className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-bold transition cursor-pointer"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handlePrint(item)}
                                title="Cetak Lembar Resmi"
                                className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition cursor-pointer"
                              >
                                <Printer className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={9} className="py-12 text-center text-slate-500">
                        Tidak ada data evaluasi yang sesuai dengan filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: STANDAR BAKU & BOBOT RESMI YAYASAN */}
      {/* ========================================================================= */}
      {activeTab === "rubrik" && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                Pedoman Operasional Standar (POS) Penilaian Kinerja Guru
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-1">
                Struktur Pembobotan & 13 Butir Indikator Baku
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Penilaian KPI guru di lingkungan Yayasan Pendidikan Daarul Habibah & SDIT EL-FATAH mengacu pada 2 pilar utama dengan proporsi seimbang:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50/40 rounded-2xl border border-blue-200 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-blue-900 text-base flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" /> 1. Sasaran Kinerja (Bobot 50%)
                  </h4>
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-600 text-white font-black text-xs">7 Butir</span>
                </div>
                <p className="text-xs text-blue-800 leading-relaxed">
                  Mengukur kompetensi teknis pedagogik dalam merancang Modul Ajar/ATP (01.00 & 01.01), pembelajaran berdiferensiasi & Projek P5 (02.01, 02.02, 02.03), serta pelaksanaan asesmen diagnostik & portofolio autentik (03.01 & 03.02).
                </p>
              </div>

              <div className="p-5 bg-gradient-to-br from-purple-50 to-pink-50/40 rounded-2xl border border-purple-200 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-purple-900 text-base flex items-center gap-2">
                    <Award className="w-5 h-5 text-purple-600" /> 2. Sasaran Perilaku (Bobot 50%)
                  </h4>
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-600 text-white font-black text-xs">6 Butir</span>
                </div>
                <p className="text-xs text-purple-800 leading-relaxed">
                  Mengukur nilai BerAKHLAK Islami: Amanah (04.02), Kompeten tuntas (05.02), Harmonis solutif (06.02), Loyal tepat waktu (07.02), Adaptif inovatif (08.02), dan Kolaboratif dengan wali murid/unit lain (09.02).
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200">
              <h4 className="font-bold text-slate-900 text-sm mb-3">Daftar Rinci Seluruh 13 Butir Indikator:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {OFFICIAL_KPI_INDICATORS.map((ind) => (
                  <div key={ind.code} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-xs text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                        Kode: {ind.code}
                      </span>
                      <span className="font-bold text-xs text-slate-600 bg-slate-200 px-2 py-0.5 rounded-full">
                        Bobot {ind.weightPercent}
                      </span>
                    </div>
                    <div className="font-bold text-xs text-slate-900">{ind.targetGoal}</div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">{ind.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: IMPORT EXCEL */}
      {/* ========================================================================= */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-6 h-6 text-emerald-600" />
                <h3 className="text-lg font-bold text-slate-900">Impor Penilaian dari File Excel (.xlsx)</h3>
              </div>
              <button
                onClick={() => {
                  setIsImportModalOpen(false);
                  setImportPreviewData(null);
                  setImportError(null);
                  setImportNotice(null);
                }}
                className="text-slate-400 hover:text-slate-700 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 space-y-2">
                <p className="font-bold text-emerald-900">Petunjuk Impor Format Excel:</p>
                <p>
                  Sistem mendukung pembacaan file Excel format tabel 13 butir (seperti lampiran resmi) maupun file daftar rekapitulasi nilai guru.
                </p>
                <button
                  onClick={handleDownloadTemplate}
                  className="inline-flex items-center gap-1 font-bold underline text-emerald-700 hover:text-emerald-900 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" /> Unduh Format Template Excel Baku (.xlsx)
                </button>
              </div>

              {importError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>{importError}</span>
                </div>
              )}

              {importNotice && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{importNotice}</span>
                </div>
              )}

              <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center space-y-3 bg-slate-50 hover:bg-slate-100/60 transition cursor-pointer">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".xlsx,.xls,.csv"
                  className="hidden"
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center justify-center space-y-2"
                >
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div className="text-sm font-bold text-slate-800">
                    Klik untuk memilih file Excel dari komputer
                  </div>
                  <div className="text-xs text-slate-500">Mendukung format .xlsx, .xls, dan .csv</div>
                </div>
              </div>

              {importPreviewData && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="text-xs font-bold text-slate-700">Pratinjau Data Terbaca:</div>
                  <div className="text-xs text-slate-600">
                    Siap menerapkan data penilaian ke dalam sistem.
                  </div>
                </div>
              )}
            </div>

            <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
              <button
                onClick={() => {
                  setIsImportModalOpen(false);
                  setImportPreviewData(null);
                }}
                className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleApplyImport}
                disabled={!importPreviewData}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white rounded-xl text-xs font-bold shadow-md transition active:scale-95 cursor-pointer"
              >
                Terapkan Data Penilaian
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PRINT PREVIEW & ACTION MODAL */}
      {/* ========================================================================= */}
      {isPrintModalOpen && printTargetEvaluation && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto no-print">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-fade-in">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300">
                  <Printer className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">
                    Cetak Lembar Penilaian KPI (13 Indikator)
                  </h3>
                  <p className="text-xs text-slate-300">
                    Guru: {printTargetEvaluation.teacherName} ({printTargetEvaluation.rombel || "Guru SDIT EL-FATAH"})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsPrintModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body - Sheet Preview */}
            <div className="p-6 overflow-y-auto space-y-4 bg-slate-100 flex-1">
              <div className="bg-white p-6 sm:p-8 rounded-2xl shadow border border-slate-300 max-w-3xl mx-auto font-serif text-slate-900 space-y-4">
                {/* KOP PREVIEW */}
                <div className="text-center border-b-2 border-slate-900 pb-3">
                  <h2 className="text-xs font-bold uppercase tracking-widest text-slate-800">
                    YAYASAN PENDIDIKAN DAARUL HABIBAH
                  </h2>
                  <h1 className="text-lg font-black uppercase tracking-wider text-slate-950">
                    SDIT EL-FATAH
                  </h1>
                  <p className="text-[10px] italic text-slate-600">
                    Jl. Raya Kresek No. 12, Sukamulya, Kab. Tangerang, Banten 15610 | Email: sdit.elfatah@gmail.com
                  </p>
                </div>

                <div className="text-center py-1">
                  <h3 className="text-sm font-black underline uppercase text-slate-900">
                    LEMBAR PENILAIAN INDIKATOR KINERJA GURU (KPI) RESMI
                  </h3>
                  <p className="text-xs text-slate-600">
                    Tahun Ajaran 2026/2027 — Semester Ganjil
                  </p>
                </div>

                {/* INFO GURU */}
                <div className="grid grid-cols-2 gap-3 text-xs border border-slate-400 p-3 rounded-lg bg-slate-50/50">
                  <div className="space-y-1">
                    <div><strong>Nama Guru:</strong> {printTargetEvaluation.teacherName}</div>
                    <div><strong>NIPY:</strong> {printTargetEvaluation.teacherNip || "-"}</div>
                    <div><strong>Jabatan:</strong> {printTargetEvaluation.teacherRole || "Guru Pengajar"}</div>
                  </div>
                  <div className="space-y-1">
                    <div><strong>Rombel:</strong> {printTargetEvaluation.rombel || "-"}</div>
                    <div><strong>Tanggal:</strong> {new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</div>
                    <div><strong>Penilai:</strong> Masykur Rohana, S.Sos (Kepala Sekolah)</div>
                  </div>
                </div>

                {/* TABLE PREVIEW */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[11px] border border-slate-400 border-collapse">
                    <thead>
                      <tr className="bg-slate-200 border-b border-slate-400 text-center font-bold text-slate-900">
                        <th className="border border-slate-400 p-1 w-6">NO</th>
                        <th className="border border-slate-400 p-1 w-14">KLP</th>
                        <th className="border border-slate-400 p-1">Sasaran Kerja & Indikator</th>
                        <th className="border border-slate-400 p-1 w-10">Kode</th>
                        <th className="border border-slate-400 p-1 w-10">Bobot</th>
                        <th className="border border-slate-400 p-1 w-10">Skor</th>
                        <th className="border border-slate-400 p-1 w-12">Nilai</th>
                      </tr>
                    </thead>
                    <tbody>
                      {OFFICIAL_KPI_INDICATORS.map((ind) => {
                        const scoreDict = printTargetEvaluation.subScores || currentScores;
                        const s = Number(scoreDict[ind.code]) || 0;
                        const val = Math.round((s * (ind.weight / 100)) * 100) / 100;
                        return (
                          <tr key={ind.code} className="border-b border-slate-300 hover:bg-blue-50/20">
                            <td className="border border-slate-300 p-1 text-center font-bold">{ind.no}</td>
                            <td className="border border-slate-300 p-1 text-center text-[10px]">{ind.category}</td>
                            <td className="border border-slate-300 p-1">
                              <span className="font-semibold text-slate-900">{ind.targetGoal}:</span> <span className="text-slate-700">{ind.description}</span>
                            </td>
                            <td className="border border-slate-300 p-1 text-center font-mono font-bold text-[10px]">{ind.code}</td>
                            <td className="border border-slate-300 p-1 text-center font-medium">{ind.weightPercent}</td>
                            <td className="border border-slate-300 p-1 text-center font-bold text-slate-900">{s}</td>
                            <td className="border border-slate-300 p-1 text-center font-bold text-blue-900 bg-blue-50/30">{val.toFixed(2)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr className="bg-slate-100 font-bold border-t-2 border-slate-800">
                        <td colSpan={4} className="border border-slate-400 p-1.5 text-right uppercase text-slate-800">
                          Total Akumulasi Bobot & Nilai Akhir :
                        </td>
                        <td className="border border-slate-400 p-1.5 text-center text-emerald-700 font-black">100%</td>
                        <td className="border border-slate-400 p-1.5 text-center">-</td>
                        <td className="border border-slate-400 p-1.5 text-center text-xs font-black text-blue-800 bg-blue-100">
                          {Number(printTargetEvaluation.totalScore || 0).toFixed(2)}
                        </td>
                      </tr>
                      <tr className="bg-slate-100 font-bold">
                        <td colSpan={4} className="border border-slate-400 p-1.5 text-right uppercase text-slate-800">
                          Predikat Mutu & Status Apresiasi :
                        </td>
                        <td colSpan={3} className="border border-slate-400 p-1.5 text-center text-xs font-bold text-indigo-900">
                          {printTargetEvaluation.grade || liveGradeInfo.short} — {printTargetEvaluation.rewardTitle || "Apresiasi Yayasan"}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* NOTES PREVIEW */}
                <div className="border border-slate-400 p-2.5 rounded-lg text-xs bg-amber-50/40">
                  <strong>Catatan & Rekomendasi Kepala Sekolah:</strong>
                  <p className="italic mt-0.5 text-slate-700">
                    "{printTargetEvaluation.notes || "Kinerja sangat baik dan memenuhi standar yayasan."}"
                  </p>
                </div>

                {/* SIGNATURES */}
                <div className="pt-4 grid grid-cols-2 text-center text-xs">
                  <div>
                    <p>Guru yang Dinilai,</p>
                    <div className="h-12 flex items-center justify-center font-mono text-[9px] text-slate-400">
                      [ Tanda Tangan Digital ]
                    </div>
                    <p className="font-bold underline">{printTargetEvaluation.teacherName}</p>
                    <p className="text-[10px] text-slate-600">NIPY. {printTargetEvaluation.teacherNip || "-"}</p>
                  </div>
                  <div>
                    <p>Tangerang, {new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p>
                    <p>Kepala Sekolah SDIT EL-FATAH,</p>
                    <div className="h-12 flex items-center justify-center font-mono text-[9px] text-slate-400">
                      [ CAP RESMI & TTD DIGITAL ]
                    </div>
                    <p className="font-bold underline">Masykur Rohana, S.Sos</p>
                    <p className="text-[10px] text-slate-600">NIPY. 20190701</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer with Dual Actions */}
            <div className="px-6 py-4 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-slate-500">
                Pilih opsi cetak langsung ke printer fisik atau simpan sebagai format PDF.
              </div>
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setIsPrintModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Tutup
                </button>
                <button
                  onClick={handleExecutePrint}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 flex items-center gap-2 transition active:scale-95 cursor-pointer"
                >
                  <Printer className="w-4 h-4" /> Cetak / Unduh PDF Sekarang
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* HIDDEN OFFICIAL PRINTABLE DOCUMENT (RENDERED ONLY ON PRINT) */}
      {/* ========================================================================= */}
      <div id="printable-kpi" className="hidden print:block font-serif text-black p-4 space-y-4 printable-area">
        {/* KOP SURAT */}
        <div className="text-center border-b-2 border-black pb-3">
          <h2 className="text-base font-bold uppercase tracking-wide">
            YAYASAN PENDIDIKAN DAARUL HABIBAH
          </h2>
          <h1 className="text-xl font-extrabold uppercase tracking-wide">
            SDIT EL-FATAH
          </h1>
          <p className="text-[10pt] italic">
            Jl. Raya Kresek No. 12, Sukamulya, Kab. Tangerang, Banten 15610 | Email: sdit.elfatah@gmail.com
          </p>
        </div>

        <div className="text-center py-2">
          <h3 className="text-base font-bold underline uppercase">
            LEMBAR PENILAIAN INDIKATOR KINERJA GURU (KPI) RESMI
          </h3>
          <p className="text-[10pt]">
            Tahun Ajaran 2026/2027 — Semester Ganjil
          </p>
        </div>

        {/* IDENTITAS GURU */}
        <div className="grid grid-cols-2 gap-4 text-[10pt] border border-black p-3">
          <div>
            <div><strong>Nama Guru:</strong> {printTargetEvaluation?.teacherName || selectedTeacherObj.name}</div>
            <div><strong>NIPY:</strong> {printTargetEvaluation?.teacherNip || selectedTeacherObj.nip || "-"}</div>
            <div><strong>Jabatan/Tugas:</strong> {printTargetEvaluation?.teacherRole || selectedTeacherObj.role || "Guru Pengajar"}</div>
          </div>
          <div>
            <div><strong>Rombongan Belajar:</strong> {printTargetEvaluation?.rombel || selectedTeacherObj.gradeClass || "-"}</div>
            <div><strong>Tanggal Penilaian:</strong> {new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</div>
            <div><strong>Pejabat Penilai:</strong> Masykur Rohana, S.Sos (Kepala Sekolah)</div>
          </div>
        </div>

        {/* 13 INDICATOR TABLE */}
        <table className="w-full text-left text-[9pt] border border-black border-collapse">
          <thead>
            <tr className="bg-slate-200 border-b border-black text-center font-bold">
              <th className="border border-black p-1 w-8">NO</th>
              <th className="border border-black p-1 w-16">KLP</th>
              <th className="border border-black p-1 w-32">Sasaran Kerja</th>
              <th className="border border-black p-1 w-12">Kode</th>
              <th className="border border-black p-1">Ukuran Prestasi Kerja (Indikator)</th>
              <th className="border border-black p-1 w-12">Bobot</th>
              <th className="border border-black p-1 w-14">Skor</th>
              <th className="border border-black p-1 w-14">Nilai</th>
            </tr>
          </thead>
          <tbody>
            {OFFICIAL_KPI_INDICATORS.map((ind) => {
              const scoreDict = printTargetEvaluation?.subScores || currentScores;
              const s = Number(scoreDict[ind.code]) || 0;
              const val = Math.round((s * (ind.weight / 100)) * 100) / 100;
              return (
                <tr key={ind.code} className="border-b border-black">
                  <td className="border border-black p-1 text-center font-bold">{ind.no}</td>
                  <td className="border border-black p-1 text-center">{ind.category}</td>
                  <td className="border border-black p-1 font-semibold">{ind.targetGoal}</td>
                  <td className="border border-black p-1 text-center font-mono">{ind.code}</td>
                  <td className="border border-black p-1 leading-snug">{ind.description}</td>
                  <td className="border border-black p-1 text-center">{ind.weightPercent}</td>
                  <td className="border border-black p-1 text-center font-bold">{s}</td>
                  <td className="border border-black p-1 text-center font-bold">{val.toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-black font-bold">
              <td colSpan={5} className="border border-black p-1.5 text-right uppercase">
                Total Akumulasi Bobot & Nilai Akhir:
              </td>
              <td className="border border-black p-1.5 text-center">100%</td>
              <td className="border border-black p-1.5 text-center">-</td>
              <td className="border border-black p-1.5 text-center text-[10pt]">
                {(printTargetEvaluation?.totalScore || liveCalculation.totalScore).toFixed(2)}
              </td>
            </tr>
            <tr className="font-bold">
              <td colSpan={5} className="border border-black p-1.5 text-right uppercase">
                Predikat Mutu & Status Apresiasi:
              </td>
              <td colSpan={3} className="border border-black p-1.5 text-center text-[10pt]">
                {printTargetEvaluation?.grade || liveGradeInfo.short} ({printTargetEvaluation?.rewardTitle || "Apresiasi Yayasan"})
              </td>
            </tr>
          </tfoot>
        </table>

        {/* CATATAN */}
        <div className="border border-black p-2 text-[9pt]">
          <strong>Catatan & Rekomendasi Kepala Sekolah:</strong>
          <p className="italic mt-0.5">
            "{printTargetEvaluation?.notes || evaluationNotes || "Kinerja sangat baik dan memenuhi standar yayasan."}"
          </p>
        </div>

        {/* TANDA TANGAN */}
        <div className="pt-6 grid grid-cols-2 text-center text-[10pt] break-inside-avoid">
          <div>
            <p>Guru yang Dinilai,</p>
            <div className="h-16 flex items-center justify-center font-mono text-[8pt] text-slate-400">
              [ Tanda Tangan Digital ]
            </div>
            <p className="font-bold underline">{printTargetEvaluation?.teacherName || selectedTeacherObj.name}</p>
            <p className="text-[9pt]">NIPY. {printTargetEvaluation?.teacherNip || selectedTeacherObj.nip || "-"}</p>
          </div>

          <div>
            <p>Tangerang, {new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p>
            <p>Kepala Sekolah SDIT EL-FATAH,</p>
            <div className="h-16 flex items-center justify-center font-mono text-[8pt] text-slate-400">
              [ CAP RESMI & TTD DIGITAL ]
            </div>
            <p className="font-bold underline">Masykur Rohana, S.Sos</p>
            <p className="text-[9pt]">NIPY. 20190701</p>
          </div>
        </div>
      </div>
    </div>
  );
}
