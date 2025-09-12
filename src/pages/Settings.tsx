import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useMedical } from '@/contexts/MedicalContext';
import type { AdminStatus } from '@/types/medical';
import { 
  Settings as SettingsIcon, 
  Database, 
  RefreshCw, 
  CheckCircle,
  AlertTriangle,
  Clock,
  Globe,
  Shield,
  User
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Settings() {
  const [adminStatus, setAdminStatus] = useState<AdminStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [useSandbox, setUseSandbox] = useState(true);
  const { demoMode, setDemoMode } = useMedical();
  const { toast } = useToast();

  useEffect(() => {
    loadAdminStatus();
  }, []);

  const loadAdminStatus = async () => {
    try {
      // Mock admin status
      const mockStatus = {
        namasteLastIngest: "2025-09-01T10:30:00Z",
        whoLastSync: "2025-08-30T14:15:00Z",
        systemHealth: 'healthy' as const
      };
      setAdminStatus(mockStatus);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load system status.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      // Mock sync response
      const mockResponse = {
        status: 'success' as const,
        message: 'Synchronization completed successfully'
      };
      
      if (mockResponse.status === 'success') {
        toast({
          title: "Sync Successful",
          description: mockResponse.message,
        });
        await loadAdminStatus(); // Refresh status
      }
    } catch (error) {
      toast({
        title: "Sync Failed",
        description: "Failed to synchronize terminology databases.",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const getStatusIcon = (health: string) => {
    switch (health) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (health: string) => {
    switch (health) {
      case 'healthy': return 'bg-success';
      case 'warning': return 'bg-yellow-500';
      case 'error': return 'bg-destructive';
      default: return 'bg-muted-foreground';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">System Settings</h1>
          <p className="text-muted-foreground">
            Configure terminology sync, API settings, and monitor system health
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* System Status */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  System Status
                </CardTitle>
                <CardDescription>
                  Current health and last synchronization information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoading ? (
                  <div className="text-center py-8">
                    <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">Loading system status...</p>
                  </div>
                ) : adminStatus ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">System Health</span>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(adminStatus.systemHealth)}
                        <Badge className={getStatusColor(adminStatus.systemHealth)}>
                          {adminStatus.systemHealth}
                        </Badge>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">NAMASTE Last Ingest:</span>
                        <span className="text-sm font-medium">
                          {new Date(adminStatus.namasteLastIngest).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">WHO ICD Last Sync:</span>
                        <span className="text-sm font-medium">
                          {new Date(adminStatus.whoLastSync).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <Separator />

                    <Button 
                      onClick={handleSync} 
                      disabled={isSyncing}
                      className="w-full"
                    >
                      {isSyncing ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Synchronizing...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Trigger Sync
                        </>
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <AlertTriangle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">Failed to load system status</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* User Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  User Information
                </CardTitle>
                <CardDescription>
                  Current user session and ABHA token status
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">User ID:</span>
                    <span className="text-sm font-medium">demo-user-001</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">ABHA Token:</span>
                    <Badge variant="outline" className="bg-success/10">
                      Valid
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Role:</span>
                    <span className="text-sm font-medium">Healthcare Provider</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Configuration */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <SettingsIcon className="h-5 w-5" />
                  API Configuration
                </CardTitle>
                <CardDescription>
                  Configure API endpoints and environment settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="text-sm font-medium">Use Demo Mode</label>
                    <p className="text-xs text-muted-foreground">
                      Use mock data only (recommended for demonstrations)
                    </p>
                  </div>
                  <Switch
                    checked={demoMode}
                    onCheckedChange={setDemoMode}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="text-sm font-medium">Use Sandbox Environment</label>
                    <p className="text-xs text-muted-foreground">
                      Toggle between sandbox and production APIs
                    </p>
                  </div>
                  <Switch
                    checked={useSandbox}
                    onCheckedChange={setUseSandbox}
                    disabled={demoMode}
                  />
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Current Endpoints:</span>
                  </div>
                  
                    <div className="space-y-2 pl-6 text-xs">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Mode:</span>
                        <Badge variant="outline" className="text-xs">
                          {demoMode ? 'Demo Only' : (useSandbox ? 'Sandbox' : 'Production')}
                        </Badge>
                      </div>
                    
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">NAMASTE API:</span>
                        <Badge variant="outline" className="text-xs">
                          {demoMode ? 'Mock Data' : (useSandbox ? 'Sandbox' : 'Production')}
                        </Badge>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">WHO ICD API:</span>
                        <Badge variant="outline" className="text-xs">
                          {demoMode ? 'Mock Data' : (useSandbox ? 'Sandbox' : 'Production')}
                        </Badge>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">FHIR Server:</span>
                        <Badge variant="outline" className="text-xs">
                          {demoMode ? 'Mock Data' : (useSandbox ? 'Test' : 'Live')}
                        </Badge>
                      </div>
                    </div>
                </div>
              </CardContent>
            </Card>

            {/* Security */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security & Audit
                </CardTitle>
                <CardDescription>
                  Security settings and audit trail configuration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Audit Logging:</span>
                    <Badge className="bg-success">Enabled</Badge>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Data Encryption:</span>
                    <Badge className="bg-success">AES-256</Badge>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Session Timeout:</span>
                    <span className="text-sm font-medium">8 hours</span>
                  </div>
                </div>

                <Separator />

                <Button variant="outline" className="w-full">
                  View Audit Logs
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}