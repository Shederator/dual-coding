import { MedicalTerminology, UploadResponse, AdminStatus, FHIRBundle } from '@/types/medical';

// Mock data for demonstration
const mockTerminologies: MedicalTerminology[] = [
  {
    namaste: { code: "NAM:0001", display: "Shiro-ruja", system: "http://namaste.gov.in/terminology" },
    icd11: { code: "1435254666", display: "Migraine", system: "http://id.who.int/icd/release/11/2024-01" },
    confidence: 'exact'
  },
  {
    namaste: { code: "NAM:0020", display: "Amlapitta", system: "http://namaste.gov.in/terminology" },
    icd11: { code: "1214563220", display: "Gastro-esophageal reflux disease", system: "http://id.who.int/icd/release/11/2024-01" },
    confidence: 'exact'
  },
  {
    namaste: { code: "NAM:0015", display: "Jvara", system: "http://namaste.gov.in/terminology" },
    icd11: { code: "1639084745", display: "Fever, unspecified", system: "http://id.who.int/icd/release/11/2024-01" },
    confidence: 'related'
  },
  {
    namaste: { code: "NAM:0008", display: "Kasa", system: "http://namaste.gov.in/terminology" },
    icd11: { code: "1963701687", display: "Cough", system: "http://id.who.int/icd/release/11/2024-01" },
    confidence: 'exact'
  },
  {
    namaste: { code: "NAM:0003", display: "Arsha", system: "http://namaste.gov.in/terminology" },
    icd11: { code: "1668885666", display: "Haemorrhoids", system: "http://id.who.int/icd/release/11/2024-01" },
    confidence: 'related'
  },
  {
    namaste: { code: "NAM:0025", display: "Agnimandya", system: "http://namaste.gov.in/terminology" },
    icd11: { code: "1785645132", display: "Digestive system disorder", system: "http://id.who.int/icd/release/11/2024-01" },
    confidence: 'uncertain'
  }
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function searchTerminology(query: string): Promise<MedicalTerminology[]> {
  await delay(300); // Simulate network delay
  
  if (!query.trim()) return [];
  
  const results = mockTerminologies.filter(term =>
    term.namaste.display.toLowerCase().includes(query.toLowerCase()) ||
    term.namaste.code.toLowerCase().includes(query.toLowerCase()) ||
    term.icd11.display.toLowerCase().includes(query.toLowerCase()) ||
    term.icd11.code.toLowerCase().includes(query.toLowerCase())
  );
  
  return results;
}

export async function uploadFHIRBundle(bundle: FHIRBundle): Promise<UploadResponse> {
  await delay(1000); // Simulate upload time
  
  // Mock successful upload
  return {
    status: 'success',
    bundleId: crypto.randomUUID(),
    provenanceId: crypto.randomUUID(),
    message: 'Bundle uploaded successfully'
  };
}

export async function getAdminStatus(): Promise<AdminStatus> {
  await delay(500);
  
  return {
    namasteLastIngest: "2025-09-01T10:30:00Z",
    whoLastSync: "2025-08-30T14:15:00Z",
    systemHealth: 'healthy'
  };
}

export async function triggerSync(): Promise<{ status: string; message: string }> {
  await delay(2000); // Simulate sync time
  
  return {
    status: 'success',
    message: 'Synchronization completed successfully'
  };
}