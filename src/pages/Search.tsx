import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useMedical } from '@/contexts/MedicalContext';
import { searchTerminology } from '@/lib/api';
import { Search as SearchIcon, Plus, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Search() {
  const [query, setQuery] = useState('');
  const { searchResults, isLoading, addDiagnosis, setSearchResults, setLoading, setError } = useMedical();
  const { toast } = useToast();

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const results = await searchTerminology(searchQuery);
      setSearchResults(results);
    } catch (error) {
      setError('Failed to search terminology');
      toast({
        title: "Search Error",
        description: "Failed to search medical terminology. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleAddDiagnosis = (terminology: any) => {
    addDiagnosis(terminology);
    toast({
      title: "Diagnosis Added",
      description: `${terminology.namaste.display} has been added to your problem list.`,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Medical Terminology Search</h1>
          <p className="text-muted-foreground">
            Search across NAMASTE Traditional Medicine and ICD-11 Biomedicine terminologies
          </p>
        </div>

        {/* Search Input */}
        <div className="relative mb-8">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search for symptoms, conditions, or diagnostic codes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 py-6 text-lg"
          />
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Searching terminology...</span>
          </div>
        )}

        {/* Search Results */}
        {!isLoading && searchResults.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">
              Search Results ({searchResults.length})
            </h2>
            {searchResults.map((result, index) => (
              <Card key={index} className="hover:shadow-medical transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">
                        {result.namaste.display}
                      </CardTitle>
                      <CardDescription className="mb-3">
                        Traditional Medicine terminology mapped to biomedical classification
                      </CardDescription>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        <Badge variant="outline" className="bg-primary/10">
                          NAMASTE: {result.namaste.code}
                        </Badge>
                        <Badge variant="outline" className="bg-accent/10">
                          ICD-11: {result.icd11.code}
                        </Badge>
                      </div>
                    </div>
                    
                    <Button
                      onClick={() => handleAddDiagnosis(result)}
                      size="sm"
                      className="ml-4"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm text-primary">Traditional Medicine</h4>
                      <p className="text-sm text-muted-foreground">
                        <strong>Code:</strong> {result.namaste.code}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        <strong>Term:</strong> {result.namaste.display}
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm text-accent">Biomedicine (ICD-11)</h4>
                      <p className="text-sm text-muted-foreground">
                        <strong>Code:</strong> {result.icd11.code}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        <strong>Term:</strong> {result.icd11.display}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* No Results */}
        {!isLoading && query && searchResults.length === 0 && (
          <div className="text-center py-12">
            <SearchIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No results found</h3>
            <p className="text-muted-foreground">
              Try different keywords or browse the terminology database
            </p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !query && (
          <div className="text-center py-12">
            <SearchIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Start searching</h3>
            <p className="text-muted-foreground">
              Enter symptoms, conditions, or diagnostic codes to find terminology mappings
            </p>
          </div>
        )}
      </div>
    </div>
  );
}