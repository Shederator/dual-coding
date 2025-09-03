export interface NAMASTECode {
  code: string;
  display: string;
  system?: string;
}

export interface ICD11Code {
  code: string;
  display: string;
  system?: string;
}

export interface MedicalTerminology {
  namaste: NAMASTECode;
  icd11: ICD11Code;
  confidence?: 'exact' | 'related' | 'uncertain';
  id?: string;
}

export interface DiagnosisEntry extends MedicalTerminology {
  id: string;
  dateAdded: string;
  notes?: string;
}

export interface FHIRBundle {
  resourceType: string;
  id: string;
  meta: {
    lastUpdated: string;
  };
  type: string;
  entry: FHIRBundleEntry[];
}

export interface FHIRBundleEntry {
  resource: {
    resourceType: string;
    id: string;
    code: {
      coding: Array<{
        system: string;
        code: string;
        display: string;
      }>;
    };
  };
}

export interface UploadResponse {
  status: 'success' | 'error';
  bundleId?: string;
  provenanceId?: string;
  message?: string;
}

export interface AdminStatus {
  namasteLastIngest: string;
  whoLastSync: string;
  systemHealth: 'healthy' | 'warning' | 'error';
}