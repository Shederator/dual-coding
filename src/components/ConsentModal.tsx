import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DiagnosisEntry } from '@/types/medical';
import { 
  Shield, 
  User, 
  FileText, 
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';

interface ConsentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  diagnoses: DiagnosisEntry[];
  patientInfo?: {
    name: string;
    abhaId: string;
    consentId: string;
  };
}

export function ConsentModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  diagnoses,
  patientInfo = {
    name: "Demo Patient",
    abhaId: "12-3456-7890-1234",
    consentId: "consent-demo-001"
  }
}: ConsentModalProps) {
  const [dataConsent, setDataConsent] = useState(false);
  const [sharingConsent, setSharingConsent] = useState(false);
  const [abhaConsent, setAbhaConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const allConsentsGiven = dataConsent && sharingConsent && abhaConsent;

  const handleConfirm = async () => {
    if (!allConsentsGiven) return;
    
    setIsSubmitting(true);
    // Simulate consent processing delay
    setTimeout(() => {
      onConfirm();
      setIsSubmitting(false);
      handleClose();
    }, 1500);
  };

  const handleClose = () => {
    setDataConsent(false);
    setSharingConsent(false);
    setAbhaConsent(false);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Patient Consent & Data Sharing Authorization
          </DialogTitle>
          <DialogDescription>
            Review and confirm consent for uploading medical data to the clinical repository
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Patient Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <User className="h-4 w-4 text-primary" />
              <h3 className="font-semibold">Patient Information</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Patient Name:</span>
                <span className="text-sm font-medium">{patientInfo.name}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">ABHA ID:</span>
                <Badge variant="outline">{patientInfo.abhaId}</Badge>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Consent ID:</span>
                <Badge variant="outline">{patientInfo.consentId}</Badge>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Session Time:</span>
                <span className="text-sm font-medium">
                  {new Date().toLocaleString()}
                </span>
              </div>
            </div>

            <Separator />

            {/* Consent Checkboxes */}
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                Required Consents
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="data-consent"
                    checked={dataConsent}
                    onCheckedChange={(checked) => setDataConsent(checked as boolean)}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="data-consent"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Data Collection & Processing
                    </label>
                    <p className="text-xs text-muted-foreground">
                      I consent to the collection and processing of my medical data 
                      for clinical care and research purposes.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="sharing-consent"
                    checked={sharingConsent}
                    onCheckedChange={(checked) => setSharingConsent(checked as boolean)}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="sharing-consent"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Data Sharing Authorization
                    </label>
                    <p className="text-xs text-muted-foreground">
                      I authorize sharing of coded medical data with healthcare 
                      providers within the authorized network.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="abha-consent"
                    checked={abhaConsent}
                    onCheckedChange={(checked) => setAbhaConsent(checked as boolean)}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="abha-consent"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      ABHA Compliance
                    </label>
                    <p className="text-xs text-muted-foreground">
                      I confirm compliance with ABHA (Ayushman Bharat Health Account) 
                      data governance requirements.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Diagnosis Data Preview */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-4 w-4 text-primary" />
              <h3 className="font-semibold">
                Data to be Uploaded ({diagnoses.length} diagnoses)
              </h3>
            </div>

            <ScrollArea className="h-[300px] border rounded-md p-4">
              <div className="space-y-4">
                {diagnoses.map((diagnosis) => (
                  <div key={diagnosis.id} className="border-l-2 border-l-primary pl-4">
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">
                        {diagnosis.namaste.display}
                      </h4>
                      
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="outline" className="text-xs bg-primary/10">
                          NAMASTE: {diagnosis.namaste.code}
                        </Badge>
                        <Badge variant="outline" className="text-xs bg-accent/10">
                          ICD-11: {diagnosis.icd11.code}
                        </Badge>
                      </div>
                      
                      <p className="text-xs text-muted-foreground">
                        <strong>Biomedical:</strong> {diagnosis.icd11.display}
                      </p>
                      
                      <p className="text-xs text-muted-foreground">
                        <strong>Added:</strong> {new Date(diagnosis.dateAdded).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Data Usage Notice */}
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                <div className="text-xs text-muted-foreground">
                  <p className="font-medium mb-1">Data Usage Notice:</p>
                  <p>
                    This data will be stored in compliance with healthcare data 
                    protection regulations. Dual coding ensures interoperability 
                    between traditional and modern medical systems.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button 
            onClick={handleConfirm} 
            disabled={!allConsentsGiven || isSubmitting}
            className="min-w-[120px]"
          >
            {isSubmitting ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Confirm Upload
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}