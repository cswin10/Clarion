'use client';

import { PDFDownloadLink } from '@react-pdf/renderer';
import { Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ReportDocument } from './ReportDocument';
import { Project } from '@/lib/types';

interface Props {
  project: Project;
  size?: 'sm' | 'md' | 'lg';
}

export function PDFDownloadButton({ project, size = 'md' }: Props) {
  if (!project.results) {
    return null;
  }

  const filename = `${project.name.replace(/\s+/g, '_')}_Report.pdf`;

  return (
    <PDFDownloadLink
      document={<ReportDocument project={project} />}
      fileName={filename}
    >
      {({ loading }) => (
        <Button
          size={size}
          disabled={loading}
          leftIcon={
            loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )
          }
        >
          {loading ? 'Preparing PDF...' : 'Download Report'}
        </Button>
      )}
    </PDFDownloadLink>
  );
}

export default PDFDownloadButton;
