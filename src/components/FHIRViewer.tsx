import ReactJson from 'react-json-view';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Code, Download } from 'lucide-react';

interface FHIRViewerProps {
  bundle: any;
  onDownload?: () => void;
}

export function FHIRViewer({ bundle, onDownload }: FHIRViewerProps) {
  const { theme } = useTheme();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            FHIR Bundle Preview
          </span>
          {onDownload && (
            <Button size="sm" onClick={onDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          )}
        </CardTitle>
        <CardDescription>
          Interactive JSON view of your FHIR bundle with syntax highlighting
        </CardDescription>
      </CardHeader>
      <CardContent>
        {bundle ? (
          <div className="border rounded-lg p-4 bg-muted/30">
            <ReactJson
              src={bundle}
              theme={theme === 'dark' ? 'monokai' : 'rjv-default'}
              displayDataTypes={false}
              displayObjectSize={false}
              enableClipboard={true}
              collapsed={2}
              name="bundle"
              style={{
                backgroundColor: 'transparent',
                fontSize: '12px',
                fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", monospace'
              }}
            />
          </div>
        ) : (
          <div className="text-center py-12">
            <Code className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No bundle to display</h3>
            <p className="text-muted-foreground">
              Generate a FHIR bundle to see the interactive JSON view
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}