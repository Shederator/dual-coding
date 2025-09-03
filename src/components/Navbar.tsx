import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useTheme } from 'next-themes';
import { 
  Home, 
  Search, 
  FileText, 
  Upload, 
  Settings,
  Shield,
  Moon,
  Sun
} from 'lucide-react';

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Search', href: '/search', icon: Search },
  { name: 'Problem List', href: '/problems', icon: FileText },
  { name: 'Upload', href: '/upload', icon: Upload },
  { name: 'Audit', href: '/audit', icon: Shield },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Navbar() {
  const location = useLocation();
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                <span className="text-sm font-bold text-primary-foreground">EMR</span>
              </div>
              <span className="font-semibold text-lg hidden sm:block">
                Dual-Coding EMR
              </span>
            </Link>
            
            <div className="hidden md:flex space-x-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                
                return (
                  <Button
                    key={item.name}
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    asChild
                    className={isActive ? "bg-primary shadow-medical" : ""}
                  >
                    <Link to={item.href} className="flex items-center space-x-2">
                      <Icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Link>
                  </Button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Sun className="h-4 w-4" />
              <Switch
                checked={theme === 'dark'}
                onCheckedChange={toggleTheme}
                aria-label="Toggle dark mode"
              />
              <Moon className="h-4 w-4" />
            </div>
          </div>
        </div>

        {/* Mobile navigation */}
        <div className="md:hidden pb-4">
          <div className="flex space-x-1 overflow-x-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <Button
                  key={item.name}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  asChild
                  className={`flex-shrink-0 ${isActive ? "bg-primary shadow-medical" : ""}`}
                >
                  <Link to={item.href} className="flex items-center space-x-1">
                    <Icon className="h-4 w-4" />
                    <span className="text-xs">{item.name}</span>
                  </Link>
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}