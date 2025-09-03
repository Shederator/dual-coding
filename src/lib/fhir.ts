import { DiagnosisEntry, FHIRBundle } from '@/types/medical';

export function generateFHIRBundle(diagnoses: DiagnosisEntry[]): FHIRBundle {
  const bundleId = crypto.randomUUID();
  const timestamp = new Date().toISOString();

  const bundle: FHIRBundle = {
    resourceType: "Bundle",
    id: bundleId,
    meta: {
      lastUpdated: timestamp
    },
    type: "collection",
    entry: diagnoses.map((diagnosis, index) => ({
      resource: {
        resourceType: "Condition",
        id: `condition-${index + 1}`,
        code: {
          coding: [
            {
              system: diagnosis.namaste.system || "http://namaste.gov.in/terminology",
              code: diagnosis.namaste.code,
              display: diagnosis.namaste.display
            },
            {
              system: diagnosis.icd11.system || "http://id.who.int/icd/release/11/2024-01",
              code: diagnosis.icd11.code,
              display: diagnosis.icd11.display
            }
          ]
        }
      }
    }))
  };

  return bundle;
}