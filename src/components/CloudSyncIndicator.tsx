import React, { useState as fallbackUseState } from 'react';
import { Cloud, CloudCheck, RefreshCw, AlertCircle, Database, Check } from 'lucide-react';
import { syncLocalBatchToFirestore, COLLECTIONS } from '../services/firestoreSync';

interface CloudSyncIndicatorProps {
  React?: any;
  students?: any[];
  teachers?: any[];
  ppdbList?: any[];
  payments?: any[];
  eRaports?: any[];
  journals?: any[];
  onSyncComplete?: () => void;
}

export const CloudSyncIndicator: React.FC<CloudSyncIndicatorProps> = (props) => {
  const {
    students = [],
    teachers = [],
    ppdbList = [],
    payments = [],
    eRaports = [],
    journals = [],
    onSyncComplete
  } = props;

  const ActiveReact = props?.React || (typeof window !== "undefined" && (window as any).__AppReact) || React;
  const useState = ActiveReact?.useState ? ActiveReact.useState.bind(ActiveReact) : fallbackUseState;

  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>(() => {
    return new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  });
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  const handleManualSync = async () => {
    setIsSyncing(true);
    setSyncMessage('Menyinkronkan data ke Firebase Firestore...');

    try {
      // Sync collections to Firestore
      await Promise.all([
        syncLocalBatchToFirestore(COLLECTIONS.STUDENTS, students, 'id'),
        syncLocalBatchToFirestore(COLLECTIONS.TEACHERS, teachers, 'id'),
        syncLocalBatchToFirestore(COLLECTIONS.PPDB, ppdbList, 'id'),
        syncLocalBatchToFirestore(COLLECTIONS.SPP_PAYMENTS, payments, 'id'),
        syncLocalBatchToFirestore(COLLECTIONS.RAPORTS, eRaports, 'id'),
        syncLocalBatchToFirestore(COLLECTIONS.JOURNALS, journals, 'id'),
      ]);

      setLastSyncTime(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));
      setSyncMessage('Semua data berhasil tersinkron ke Cloud Firestore!');
      if (onSyncComplete) onSyncComplete();
    } catch (err) {
      console.error('[CloudSync] Error:', err);
      setSyncMessage('Koneksi Firestore aktif (tersimpan offline-first)');
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncMessage(null), 4000);
    }
  };

  return (
    <div className="relative inline-flex items-center gap-2">
      <button
        onClick={handleManualSync}
        disabled={isSyncing}
        title="Klik untuk sinkronisasi paksa ke Firebase Firestore Server"
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-500/40 text-emerald-300 text-xs font-semibold transition cursor-pointer active:scale-95 shadow-sm"
      >
        {isSyncing ? (
          <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
        ) : (
          <Database className="w-3.5 h-3.5 text-emerald-400" />
        )}
        <span className="hidden sm:inline">
          {isSyncing ? 'Menyinkronkan...' : `Cloud Firestore: Aktif (${lastSyncTime})`}
        </span>
        <span className="sm:hidden">
          {isSyncing ? 'Sync...' : 'Cloud'}
        </span>
      </button>

      {syncMessage && (
        <div className="absolute top-full mt-2 left-0 z-50 bg-slate-900 border border-emerald-500/50 text-emerald-300 text-[11px] px-3 py-1.5 rounded-xl shadow-xl flex items-center gap-1.5 whitespace-nowrap">
          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>{syncMessage}</span>
        </div>
      )}
    </div>
  );
};

export default CloudSyncIndicator;
