import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { 
  Search, 
  FileText, 
  Upload, 
  Settings,
  Activity,
  Code,
  Globe
} from 'lucide-react';

const navigationCards = [
  {
    title: 'Search Terminology',
    description: 'Search and browse NAMASTE and ICD-11 medical terminologies',
    icon: Search,
    href: '/search',
    color: 'bg-primary'
  },
  {
    title: 'Problem List',
    description: 'Build and manage your diagnosis problem list with dual coding',
    icon: FileText,
    href: '/problems',
    color: 'bg-accent'
  },
  {
    title: 'Upload Bundle',
    description: 'Upload FHIR bundles to the clinical data repository',
    icon: Upload,
    href: '/upload',
    color: 'bg-success'
  },
  {
    title: 'Settings',
    description: 'Configure system settings and sync terminology databases',
    icon: Settings,
    href: '/settings',
    color: 'bg-muted-foreground'
  },
];

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 mb-4">
          <Activity className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Dual-Coding EMR
          </h1>
        </div>
        <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
          Advanced Electronic Medical Record system with integrated NAMASTE and ICD-11 
          terminology mapping for Traditional Medicine and Biomedicine dual coding.
        </p>
        
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Code className="h-3 w-3" />
            NAMASTE TM2
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Globe className="h-3 w-3" />
            ICD-11 Biomedicine
          </Badge>
          <Badge variant="outline">FHIR Compatible</Badge>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {navigationCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title} className="group hover:shadow-medical transition-all duration-300">
              <CardHeader className="pb-4">
                <div className={`w-12 h-12 rounded-lg ${card.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg">{card.title}</CardTitle>
                <CardDescription className="text-sm">
                  {card.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button asChild className="w-full" variant="outline">
                  <Link to={card.href}>
                    Get Started
                  </Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              NAMASTE Terms
            </CardTitle>
            <Code className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,847</div>
            <p className="text-xs text-muted-foreground">
              Traditional medicine terminologies
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              ICD-11 Mappings
            </CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3,251</div>
            <p className="text-xs text-muted-foreground">
              Biomedical code mappings
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              System Status
            </CardTitle>
            <Activity className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">Healthy</div>
            <p className="text-xs text-muted-foreground">
              All systems operational
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}