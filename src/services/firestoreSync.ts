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
import { db, auth } from '../firebase';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): FirestoreErrorInfo {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid || null,
      email: auth?.currentUser?.email || null,
      emailVerified: auth?.currentUser?.emailVerified || null,
      isAnonymous: auth?.currentUser?.isAnonymous || null,
      tenantId: auth?.currentUser?.tenantId || null,
      providerInfo: auth?.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error:', JSON.stringify(errInfo));
  return errInfo;
}

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
    handleFirestoreError(error, OperationType.WRITE, `${collectionName}/${docId}`);
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
    handleFirestoreError(error, OperationType.LIST, collectionName);
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
    handleFirestoreError(error, OperationType.DELETE, `${collectionName}/${docId}`);
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
      handleFirestoreError(err, OperationType.GET, collectionName);
      if (onError) onError(err);
    });
    return unsub;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, collectionName);
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
