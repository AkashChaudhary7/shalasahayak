import {
  SchoolProfile,
  Teacher,
  InchargeAssignment,
  StudentResult,
  StudentAnomaly,
  ICTEquipment,
  LibraryBook,
  MDMLog,
  AparIprRecord,
  AadhaarPramanikaranRecord,
  ApaarIdRecord
} from '../types';
import {
  DEFAULT_SCHOOL_PROFILE,
  DEFAULT_TEACHERS,
  DEFAULT_INCHARGES,
  DEFAULT_STUDENTS,
  DEFAULT_ANOMALIES,
  DEFAULT_ICT_ITEMS,
  DEFAULT_LIBRARY_BOOKS,
  DEFAULT_MDM_LOGS,
  DEFAULT_APAR_RECORDS,
  DEFAULT_AADHAAR_RECORDS,
  DEFAULT_APAAR_RECORDS,
  getItem,
  setItem
} from './storage';

const DB_NAME = 'ShalaSahayakDB';
const DB_VERSION = 1;
const STORE_NAME = 'school_store';

export const KEYS = {
  SCHOOL_PROFILE: 'shala_school_profile',
  TEACHERS: 'shala_teachers',
  INCHARGES: 'shala_incharges',
  STUDENTS: 'shala_students',
  ANOMALIES: 'shala_anomalies',
  ICT_ITEMS: 'shala_ict_items',
  LIBRARY_BOOKS: 'shala_library_books',
  MDM_LOGS: 'shala_mdm_logs',
  APAR_RECORDS: 'shala_apar_records',
  AADHAAR_PRAMANIKARAN: 'shala_aadhaar_pramanikaran',
  APAAR_RECORDS: 'shala_apaar_records'
};

let dbPromise: Promise<IDBDatabase> | null = null;

function getDB(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !('indexedDB' in window)) {
      reject(new Error('IndexedDB is not supported in this environment'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      console.error('IndexedDB open error:', request.error);
      reject(request.error);
    };
  });

  return dbPromise;
}

export async function idbGet<T>(key: string, defaultValue: T): Promise<T> {
  try {
    const db = await getDB();
    return new Promise<T>((resolve) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(key);

      request.onsuccess = () => {
        if (request.result !== undefined && request.result !== null) {
          resolve(request.result as T);
        } else {
          // Check localStorage as fallback / migration source
          const localVal = getItem<T | null>(key, null);
          if (localVal !== null) {
            // Write to IndexedDB for future fast access
            idbSet(key, localVal).catch(console.error);
            resolve(localVal);
          } else {
            resolve(defaultValue);
          }
        }
      };

      request.onerror = () => {
        // Fallback to localStorage
        resolve(getItem<T>(key, defaultValue));
      };
    });
  } catch (err) {
    console.warn('IndexedDB read failed, using localStorage fallback:', err);
    return getItem<T>(key, defaultValue);
  }
}

export async function idbSet<T>(key: string, value: T): Promise<void> {
  // Sync to localStorage as backup
  setItem(key, value);

  try {
    const db = await getDB();
    return new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(value, key);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn('IndexedDB write failed, persisted to localStorage only:', err);
  }
}

export async function idbRemove(key: string): Promise<void> {
  try {
    localStorage.removeItem(key);
  } catch {}

  try {
    const db = await getDB();
    return new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(key);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn('IndexedDB delete failed:', err);
  }
}

export async function idbClearAll(): Promise<void> {
  try {
    const db = await getDB();
    return new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn('IndexedDB clear failed:', err);
  }
}

// Higher-level entity storage functions
export const idbStorage = {
  getSchoolProfile: () => idbGet<SchoolProfile>(KEYS.SCHOOL_PROFILE, DEFAULT_SCHOOL_PROFILE),
  setSchoolProfile: (data: SchoolProfile) => idbSet(KEYS.SCHOOL_PROFILE, data),

  getTeachers: () => idbGet<Teacher[]>(KEYS.TEACHERS, DEFAULT_TEACHERS),
  setTeachers: (data: Teacher[]) => idbSet(KEYS.TEACHERS, data),

  getIncharges: () => idbGet<InchargeAssignment[]>(KEYS.INCHARGES, DEFAULT_INCHARGES),
  setIncharges: (data: InchargeAssignment[]) => idbSet(KEYS.INCHARGES, data),

  getStudents: () => idbGet<StudentResult[]>(KEYS.STUDENTS, DEFAULT_STUDENTS),
  setStudents: (data: StudentResult[]) => idbSet(KEYS.STUDENTS, data),

  getAnomalies: () => idbGet<StudentAnomaly[]>(KEYS.ANOMALIES, DEFAULT_ANOMALIES),
  setAnomalies: (data: StudentAnomaly[]) => idbSet(KEYS.ANOMALIES, data),

  getIctItems: () => idbGet<ICTEquipment[]>(KEYS.ICT_ITEMS, DEFAULT_ICT_ITEMS),
  setIctItems: (data: ICTEquipment[]) => idbSet(KEYS.ICT_ITEMS, data),

  getLibraryBooks: () => idbGet<LibraryBook[]>(KEYS.LIBRARY_BOOKS, DEFAULT_LIBRARY_BOOKS),
  setLibraryBooks: (data: LibraryBook[]) => idbSet(KEYS.LIBRARY_BOOKS, data),

  getMdmLogs: () => idbGet<MDMLog[]>(KEYS.MDM_LOGS, DEFAULT_MDM_LOGS),
  setMdmLogs: (data: MDMLog[]) => idbSet(KEYS.MDM_LOGS, data),

  getAparRecords: () => idbGet<AparIprRecord[]>(KEYS.APAR_RECORDS, DEFAULT_APAR_RECORDS),
  setAparRecords: (data: AparIprRecord[]) => idbSet(KEYS.APAR_RECORDS, data),

  getAadhaarRecords: () => idbGet<AadhaarPramanikaranRecord[]>(KEYS.AADHAAR_PRAMANIKARAN, DEFAULT_AADHAAR_RECORDS),
  setAadhaarRecords: (data: AadhaarPramanikaranRecord[]) => idbSet(KEYS.AADHAAR_PRAMANIKARAN, data),

  getApaarRecords: () => idbGet<ApaarIdRecord[]>(KEYS.APAAR_RECORDS, DEFAULT_APAAR_RECORDS),
  setApaarRecords: (data: ApaarIdRecord[]) => idbSet(KEYS.APAAR_RECORDS, data),
};
