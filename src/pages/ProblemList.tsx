import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useMedical } from '@/contexts/MedicalContext';
import { generateFHIRBundle } from '@/lib/fhir';
import { 
  FileText, 
  Trash2, 
  Download, 
  Code, 
  Calendar,
  StickyNote
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ProblemList() {
  const { selectedDiagnoses, removeDiagnosis, clearDiagnoses } = useMedical();
  const { toast } = useToast();
  const [showFHIRPreview, setShowFHIRPreview] = useState(false);
  const [fhirBundle, setFhirBundle] = useState<string>('');

  const handleExportFHIR = () => {
    if (selectedDiagnoses.length === 0) {
      toast({
        title: "No Diagnoses",
        description: "Add some diagnoses to your problem list before exporting.",
        variant: "destructive",
      });
      return;
    }

    const bundle = generateFHIRBundle(selectedDiagnoses);
    const bundleJson = JSON.stringify(bundle, null, 2);
    setFhirBundle(bundleJson);
    setShowFHIRPreview(true);
    
    toast({
      title: "FHIR Bundle Generated",
      description: "Your problem list has been converted to FHIR format.",
    });
  };

  const handleDownloadBundle = () => {
    const blob = new Blob([fhirBundle], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `problem-list-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download Started",
      description: "FHIR bundle is being downloaded.",
    });
  };

  const handleClearAll = () => {
    clearDiagnoses();
    setShowFHIRPreview(false);
    setFhirBundle('');
    toast({
      title: "Problem List Cleared",
      description: "All diagnoses have been removed from your problem list.",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Problem List Builder</h1>
            <p className="text-muted-foreground">
              Manage your diagnosis list with dual NAMASTE and ICD-11 coding
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={handleExportFHIR}
              disabled={selectedDiagnoses.length === 0}
            >
              <Code className="h-4 w-4 mr-2" />
              Export FHIR
            </Button>
            {selectedDiagnoses.length > 0 && (
              <Button variant="outline" onClick={handleClearAll}>
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Problem List */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Active Problem List ({selectedDiagnoses.length})
                </CardTitle>
                <CardDescription>
                  Your selected diagnoses with dual coding system references
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedDiagnoses.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No diagnoses added</h3>
                    <p className="text-muted-foreground">
                      Search for medical terms to add them to your problem list
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {selectedDiagnoses.map((diagnosis) => (
                      <Card key={diagnosis.id} className="border-l-4 border-l-primary">
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <CardTitle className="text-lg">
                                {diagnosis.namaste.display}
                              </CardTitle>
                              <div className="flex items-center gap-2 mt-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">
                                  Added {new Date(diagnosis.dateAdded).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeDiagnosis(diagnosis.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        
                        <CardContent className="pt-0">
                          <div className="space-y-3">
                            {/* Coding Information */}
                            <div className="grid grid-cols-1 gap-3">
                              <div className="flex flex-wrap gap-2">
                                <Badge variant="outline" className="bg-primary/10">
                                  NAMASTE: {diagnosis.namaste.code}
                                </Badge>
                                <Badge variant="outline" className="bg-accent/10">
                                  ICD-11: {diagnosis.icd11.code}
                                </Badge>
                              </div>
                              
                              <div className="text-sm text-muted-foreground">
                                <strong>Biomedical equivalent:</strong> {diagnosis.icd11.display}
                              </div>
                            </div>

                            {/* Notes section */}
                            {diagnosis.notes && (
                              <div className="pt-2 border-t">
                                <div className="flex items-center gap-1 mb-1">
                                  <StickyNote className="h-3 w-3 text-muted-foreground" />
                                  <span className="text-xs font-medium text-muted-foreground">Notes</span>
                                </div>
                                <p className="text-sm text-muted-foreground">{diagnosis.notes}</p>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* FHIR Preview */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    FHIR Bundle Preview
                  </span>
                  {showFHIRPreview && (
                    <Button size="sm" onClick={handleDownloadBundle}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  )}
                </CardTitle>
                <CardDescription>
                  JSON representation of your problem list in FHIR format
                </CardDescription>
              </CardHeader>
              <CardContent>
                {showFHIRPreview ? (
                  <Textarea
                    value={fhirBundle}
                    readOnly
                    className="min-h-[400px] font-mono text-xs"
                    placeholder="FHIR bundle will appear here..."
                  />
                ) : (
                  <div className="text-center py-12">
                    <Code className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No bundle generated</h3>
                    <p className="text-muted-foreground">
                      Click "Export FHIR" to generate a bundle from your problem list
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}