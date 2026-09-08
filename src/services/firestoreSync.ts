/**
 * Layanan Sinkronisasi Cloud Firestore
 * Terhubung ke Firebase Firestore ID: ai-studio-sistemerpkeuanga-ebc02a01-fbf7-4914-af7f-2b6e0340f907
 */

import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase';

export interface SyncStatus {
  isOnline: boolean;
  isSyncing: boolean;
  lastSyncedAt: Date | null;
  error: string | null;
  collectionsSynced: {
    students: number;
    teachers: number;
    ppdb: number;
    sppPayments: number;
    raports: number;
    journals: number;
  };
}

// Koleksi-koleksi utama
export const COLLECTIONS = {
  STUDENTS: 'students',
  TEACHERS: 'teachers',
  PPDB: 'ppdb_registrations',
  SPP_PAYMENTS: 'spp_payments',
  RAPORTS: 'student_reports',
  JOURNALS: 'journal_entries',
  APP_CONFIG: 'app_config',
} as const;

/**
 * Menyimpan atau memperbarui dokumen di Firestore
 */
export async function saveDocument(collectionName: string, docId: string, data: any): Promise<boolean> {
  try {
    const docRef = doc(db, collectionName, docId);
    await setDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    }, { merge: true });
    return true;
  } catch (error) {
    console.warn(`[Firestore] Gagal menyimpan dokumen ${collectionName}/${docId}:`, error);
    return false;
  }
}

/**
 * Mengambil semua dokumen dalam suatu koleksi
 */
export async function getCollectionDocs<T = any>(collectionName: string): Promise<T[]> {
  try {
    const colRef = collection(db, collectionName);
    const snap = await getDocs(colRef);
    const items: T[] = [];
    snap.forEach((docSnap) => {
      items.push({ id: docSnap.id, ...docSnap.data() } as T);
    });
    return items;
  } catch (error) {
    console.warn(`[Firestore] Gagal mengambil koleksi ${collectionName}:`, error);
    return [];
  }
}

/**
 * Menghapus dokumen di Firestore
 */
export async function deleteDocument(collectionName: string, docId: string): Promise<boolean> {
  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.warn(`[Firestore] Gagal menghapus dokumen ${collectionName}/${docId}:`, error);
    return false;
  }
}

/**
 * Berlangganan (realtime listener) ke koleksi Firestore
 */
export function subscribeToCollection<T = any>(
  collectionName: string,
  onUpdate: (data: T[]) => void,
  onError?: (err: any) => void
): () => void {
  try {
    const colRef = collection(db, collectionName);
    const unsub = onSnapshot(colRef, (snap) => {
      const items: T[] = [];
      snap.forEach((docSnap) => {
        items.push({ id: docSnap.id, ...docSnap.data() } as T);
      });
      onUpdate(items);
    }, (err) => {
      console.warn(`[Firestore] Snapshot error pada ${collectionName}:`, err);
      if (onError) onError(err);
    });
    return unsub;
  } catch (error) {
    console.warn(`[Firestore] Setup subscriber error pada ${collectionName}:`, error);
    return () => {};
  }
}

/**
 * Sinkronisasi batch data lokal ke cloud Firestore (seeding / initial sync)
 */
export async function syncLocalBatchToFirestore(
  collectionName: string,
  items: any[],
  idKey: string = 'id'
): Promise<number> {
  if (!Array.isArray(items) || items.length === 0) return 0;
  let successCount = 0;
  for (const item of items) {
    const docId = String(item[idKey] || item.nis || item.nomorRegistrasi || `item-${Date.now()}-${Math.random()}`);
    const ok = await saveDocument(collectionName, docId, item);
    if (ok) successCount++;
  }
  return successCount;
}
