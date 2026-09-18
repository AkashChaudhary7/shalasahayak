import { useState, useEffect, useCallback } from 'react';
import { SchoolProfile, Teacher, InchargeAssignment, StudentResult, StudentAnomaly, ICTEquipment, LibraryBook, MDMLog } from '../types';
import { storage } from '../utils/storage';
import { idbStorage } from '../utils/idbStorage';

export function useSchoolData() {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Initial state loads instantly from storage (localStorage / initial defaults)
  const [schoolProfile, setSchoolProfile] = useState<SchoolProfile>(() => storage.getSchoolProfile());
  const [teachers, setTeachers] = useState<Teacher[]>(() => storage.getTeachers());
  const [incharges, setIncharges] = useState<InchargeAssignment[]>(() => storage.getIncharges());
  const [students, setStudents] = useState<StudentResult[]>(() => storage.getStudents());
  const [anomalies, setAnomalies] = useState<StudentAnomaly[]>(() => storage.getAnomalies());
  const [ictItems, setIctItems] = useState<ICTEquipment[]>(() => storage.getIctItems());
  const [libraryBooks, setLibraryBooks] = useState<LibraryBook[]>(() => storage.getLibraryBooks());
  const [mdmLogs, setMdmLogs] = useState<MDMLog[]>(() => storage.getMdmLogs());

  // Asynchronously load datasets from IndexedDB on mount & auto-migrate if needed
  useEffect(() => {
    let isMounted = true;

    async function loadIndexedDBData() {
      try {
        const [
          profileData,
          teachersData,
          inchargesData,
          studentsData,
          anomaliesData,
          ictData,
          libraryData,
          mdmData
        ] = await Promise.all([
          idbStorage.getSchoolProfile(),
          idbStorage.getTeachers(),
          idbStorage.getIncharges(),
          idbStorage.getStudents(),
          idbStorage.getAnomalies(),
          idbStorage.getIctItems(),
          idbStorage.getLibraryBooks(),
          idbStorage.getMdmLogs()
        ]);

        if (isMounted) {
          if (profileData) setSchoolProfile(profileData);
          if (teachersData) setTeachers(teachersData);
          if (inchargesData) setIncharges(inchargesData);
          if (studentsData) setStudents(studentsData);
          if (anomaliesData) setAnomalies(anomaliesData);
          if (ictData) setIctItems(ictData);
          if (libraryData) setLibraryBooks(libraryData);
          if (mdmData) setMdmLogs(mdmData);
          setIsLoaded(true);
        }
      } catch (err) {
        console.warn('[useSchoolData] IndexedDB initial load failed:', err);
        if (isMounted) setIsLoaded(true);
      }
    }

    loadIndexedDBData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSaveProfile = useCallback((updated: SchoolProfile) => {
    setSchoolProfile(updated);
    storage.setSchoolProfile(updated);
    idbStorage.setSchoolProfile(updated).catch(console.error);
  }, []);

  const handleUpdateTeachers = useCallback((updated: Teacher[]) => {
    setTeachers(updated);
    storage.setTeachers(updated);
    idbStorage.setTeachers(updated).catch(console.error);
  }, []);

  const handleUpdateIncharges = useCallback((updated: InchargeAssignment[]) => {
    setIncharges(updated);
    storage.setIncharges(updated);
    idbStorage.setIncharges(updated).catch(console.error);
  }, []);

  const handleUpdateStudents = useCallback((updated: StudentResult[]) => {
    setStudents(updated);
    storage.setStudents(updated);
    idbStorage.setStudents(updated).catch(console.error);
  }, []);

  const handleUpdateAnomalies = useCallback((updated: StudentAnomaly[]) => {
    setAnomalies(updated);
    storage.setAnomalies(updated);
    idbStorage.setAnomalies(updated).catch(console.error);
  }, []);

  const handleUpdateIctItems = useCallback((updated: ICTEquipment[]) => {
    setIctItems(updated);
    storage.setIctItems(updated);
    idbStorage.setIctItems(updated).catch(console.error);
  }, []);

  const handleUpdateLibraryBooks = useCallback((updated: LibraryBook[]) => {
    setLibraryBooks(updated);
    storage.setLibraryBooks(updated);
    idbStorage.setLibraryBooks(updated).catch(console.error);
  }, []);

  const handleUpdateMdmLogs = useCallback((updated: MDMLog[]) => {
    setMdmLogs(updated);
    storage.setMdmLogs(updated);
    idbStorage.setMdmLogs(updated).catch(console.error);
  }, []);

  return {
    isLoaded,
    schoolProfile,
    teachers,
    incharges,
    students,
    anomalies,
    ictItems,
    libraryBooks,
    mdmLogs,
    handleSaveProfile,
    handleUpdateTeachers,
    handleUpdateIncharges,
    handleUpdateStudents,
    handleUpdateAnomalies,
    handleUpdateIctItems,
    handleUpdateLibraryBooks,
    handleUpdateMdmLogs,
  };
}

