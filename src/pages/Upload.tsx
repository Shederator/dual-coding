import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { uploadFHIRBundle } from '@/lib/api';
import { 
  Upload as UploadIcon, 
  FileText, 
  CheckCircle, 
  AlertCircle,
  Clock,
  Database
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Upload() {
  const [bundleContent, setBundleContent] = useState('');
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResponse, setUploadResponse] = useState<any>(null);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setBundleContent(e.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  const validateFHIRBundle = (content: string) => {
    try {
      const parsed = JSON.parse(content);
      return parsed.resourceType === 'Bundle';
    } catch {
      return false;
    }
  };

  const handleUpload = async () => {
    if (!bundleContent.trim()) {
      toast({
        title: "No Content",
        description: "Please provide FHIR bundle content to upload.",
        variant: "destructive",
      });
      return;
    }

    if (!validateFHIRBundle(bundleContent)) {
      toast({
        title: "Invalid Bundle",
        description: "The content is not a valid FHIR Bundle.",
        variant: "destructive",
      });
      return;
    }

    setUploadStatus('uploading');
    setUploadProgress(0);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      const bundle = JSON.parse(bundleContent);
      const response = await uploadFHIRBundle(bundle);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      setUploadStatus('success');
      setUploadResponse(response);
      
      toast({
        title: "Upload Successful",
        description: "FHIR bundle has been uploaded successfully.",
      });
    } catch (error) {
      clearInterval(progressInterval);
      setUploadStatus('error');
      setUploadResponse({ 
        status: 'error', 
        message: 'Failed to upload FHIR bundle. Please try again.' 
      });
      
      toast({
        title: "Upload Failed",
        description: "Failed to upload FHIR bundle. Please check your content and try again.",
        variant: "destructive",
      });
    }
  };

  const handleReset = () => {
    setBundleContent('');
    setUploadStatus('idle');
    setUploadProgress(0);
    setUploadResponse(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">FHIR Bundle Upload</h1>
          <p className="text-muted-foreground">
            Upload FHIR bundles to the clinical data repository with audit tracking
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Panel */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UploadIcon className="h-5 w-5" />
                  Bundle Upload
                </CardTitle>
                <CardDescription>
                  Paste your FHIR bundle JSON or upload from file
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Upload from file
                  </label>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="block w-full text-sm text-muted-foreground
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-medium
                      file:bg-primary file:text-primary-foreground
                      hover:file:bg-primary/90"
                  />
                </div>

                {/* Text Input */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Or paste JSON content
                  </label>
                  <Textarea
                    value={bundleContent}
                    onChange={(e) => setBundleContent(e.target.value)}
                    placeholder="Paste your FHIR Bundle JSON here..."
                    className="min-h-[200px] font-mono text-xs"
                  />
                </div>

                {/* Upload Progress */}
                {uploadStatus === 'uploading' && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} />
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    onClick={handleUpload}
                    disabled={!bundleContent.trim() || uploadStatus === 'uploading'}
                    className="flex-1"
                  >
                    {uploadStatus === 'uploading' ? (
                      <>
                        <Clock className="h-4 w-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <UploadIcon className="h-4 w-4 mr-2" />
                        Upload Bundle
                      </>
                    )}
                  </Button>
                  
                  {bundleContent && (
                    <Button variant="outline" onClick={handleReset}>
                      Reset
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Status Panel */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Upload Status
                </CardTitle>
                <CardDescription>
                  Real-time status and audit information
                </CardDescription>
              </CardHeader>
              <CardContent>
                {uploadStatus === 'idle' && (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Ready to upload</h3>
                    <p className="text-muted-foreground">
                      Provide a FHIR bundle to begin the upload process
                    </p>
                  </div>
                )}

                {uploadStatus === 'uploading' && (
                  <div className="text-center py-12">
                    <Clock className="h-12 w-12 text-primary mx-auto mb-4 animate-spin" />
                    <h3 className="text-lg font-medium mb-2">Uploading bundle</h3>
                    <p className="text-muted-foreground">
                      Please wait while your bundle is being processed
                    </p>
                  </div>
                )}

                {uploadStatus === 'success' && uploadResponse && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-success">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-medium">Upload Successful</span>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Bundle ID:</span>
                        <Badge variant="outline">{uploadResponse.bundleId}</Badge>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Provenance ID:</span>
                        <Badge variant="outline">{uploadResponse.provenanceId}</Badge>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Status:</span>
                        <Badge className="bg-success">{uploadResponse.status}</Badge>
                      </div>
                      
                      <div className="pt-2 border-t">
                        <p className="text-sm text-muted-foreground">
                          {uploadResponse.message}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {uploadStatus === 'error' && uploadResponse && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-destructive">
                      <AlertCircle className="h-5 w-5" />
                      <span className="font-medium">Upload Failed</span>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Status:</span>
                        <Badge variant="destructive">{uploadResponse.status}</Badge>
                      </div>
                      
                      <div className="pt-2 border-t">
                        <p className="text-sm text-muted-foreground">
                          {uploadResponse.message}
                        </p>
                      </div>
                    </div>
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