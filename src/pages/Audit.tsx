import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  FileText, 
  Search, 
  Filter,
  Calendar,
  User,
  CheckCircle,
  Clock,
  Shield
} from 'lucide-react';

interface AuditEntry {
  id: string;
  bundleId: string;
  provenanceId: string;
  userId: string;
  userName: string;
  action: 'upload' | 'update' | 'delete';
  timestamp: string;
  status: 'success' | 'failed' | 'pending';
  resourceCount: number;
  ipAddress: string;
  userAgent: string;
}

// Mock audit data
const mockAuditEntries: AuditEntry[] = [
  {
    id: '1',
    bundleId: 'bundle-001',
    provenanceId: 'prov-001',
    userId: 'user-123',
    userName: 'Dr. Sarah Johnson',
    action: 'upload',
    timestamp: '2025-09-03T10:30:00Z',
    status: 'success',
    resourceCount: 5,
    ipAddress: 'demo-ip-001',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  },
  {
    id: '2',
    bundleId: 'bundle-002',
    provenanceId: 'prov-002',
    userId: 'user-456',
    userName: 'Dr. Rajesh Kumar',
    action: 'upload',
    timestamp: '2025-09-03T09:15:00Z',
    status: 'success',
    resourceCount: 3,
    ipAddress: 'demo-ip-002',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
  },
  {
    id: '3',
    bundleId: 'bundle-003',
    provenanceId: 'prov-003',
    userId: 'user-789',
    userName: 'Dr. Priya Sharma',
    action: 'upload',
    timestamp: '2025-09-02T16:45:00Z',
    status: 'failed',
    resourceCount: 0,
    ipAddress: 'demo-ip-003',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15'
  },
  {
    id: '4',
    bundleId: 'bundle-004',
    provenanceId: 'prov-004',
    userId: 'user-123',
    userName: 'Dr. Sarah Johnson',
    action: 'update',
    timestamp: '2025-09-02T14:20:00Z',
    status: 'success',
    resourceCount: 2,
    ipAddress: 'demo-ip-001',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  },
  {
    id: '5',
    bundleId: 'bundle-005',
    provenanceId: 'prov-005',
    userId: 'user-321',
    userName: 'Dr. Amit Patel',
    action: 'upload',
    timestamp: '2025-09-01T11:30:00Z',
    status: 'success',
    resourceCount: 7,
    ipAddress: 'demo-ip-004',
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36'
  }
];

export default function Audit() {
  const [auditEntries, setAuditEntries] = useState<AuditEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<AuditEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading audit data
    setTimeout(() => {
      setAuditEntries(mockAuditEntries);
      setFilteredEntries(mockAuditEntries);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = auditEntries;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(entry =>
        entry.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.bundleId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.userId.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(entry => entry.status === statusFilter);
    }

    setFilteredEntries(filtered);
  }, [searchQuery, statusFilter, auditEntries]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'failed':
        return <Shield className="h-4 w-4 text-destructive" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-success';
      case 'failed': return 'bg-destructive';
      case 'pending': return 'bg-yellow-500';
      default: return 'bg-muted-foreground';
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'upload': return 'bg-primary';
      case 'update': return 'bg-accent';
      case 'delete': return 'bg-destructive';
      default: return 'bg-muted-foreground';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Audit Trail</h1>
          <p className="text-muted-foreground">
            Complete audit log of all system activities with provenance tracking
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filter & Search
            </CardTitle>
            <CardDescription>
              Filter audit entries by status, user, or bundle ID
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by user, bundle ID, or user ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant={statusFilter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('all')}
                >
                  All
                </Button>
                <Button
                  variant={statusFilter === 'success' ? 'success' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('success')}
                >
                  Success
                </Button>
                <Button
                  variant={statusFilter === 'failed' ? 'destructive' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('failed')}
                >
                  Failed
                </Button>
                <Button
                  variant={statusFilter === 'pending' ? 'secondary' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('pending')}
                >
                  Pending
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Audit Entries */}
        {isLoading ? (
          <div className="text-center py-12">
            <Clock className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading audit entries...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredEntries.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No audit entries found</h3>
                <p className="text-muted-foreground">
                  No entries match your current filter criteria
                </p>
              </div>
            ) : (
              filteredEntries.map((entry) => (
                <Card key={entry.id} className="hover:shadow-medical transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-lg">
                            Bundle {entry.bundleId}
                          </CardTitle>
                          <Badge className={getActionColor(entry.action)}>
                            {entry.action.toUpperCase()}
                          </Badge>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(entry.status)}
                            <Badge className={getStatusColor(entry.status)}>
                              {entry.status}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {entry.userName}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(entry.timestamp).toLocaleString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            {entry.resourceCount} resources
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Identity Information</h4>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <div><strong>User ID:</strong> {entry.userId}</div>
                          <div><strong>Provenance ID:</strong> {entry.provenanceId}</div>
                          <div><strong>IP Address:</strong> {entry.ipAddress}</div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Technical Details</h4>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <div><strong>User Agent:</strong></div>
                          <div className="text-xs break-all">
                            {entry.userAgent.substring(0, 60)}...
                          </div>
                          <div><strong>Timestamp:</strong> {entry.timestamp}</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Entries</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredEntries.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Successful</CardTitle>
              <CheckCircle className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">
                {filteredEntries.filter(e => e.status === 'success').length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Failed</CardTitle>
              <Shield className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                {filteredEntries.filter(e => e.status === 'failed').length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Resources</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {filteredEntries.reduce((sum, entry) => sum + entry.resourceCount, 0)}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}