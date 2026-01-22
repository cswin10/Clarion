'use client';

import { PDFDownloadLink } from '@react-pdf/renderer';
import { Download, Loader2 } from 'lucide-react';
import { ReportDocument } from './ReportDocument';
import { Project } from '@/lib/types';

interface Props {
  project: Project;
  size?: 'sm' | 'md' | 'lg';
}

const sizeStyles = {
  sm: 'px-3 py-1.5 text-sm gap-1.5',
  md: 'px-4 py-2.5 text-sm gap-2',
  lg: 'px-6 py-3 text-base gap-2',
};

export function PDFDownloadButton({ project, size = 'md' }: Props) {
  if (!project.results) {
    return null;
  }

  const filename = `${project.name.replace(/\s+/g, '_')}_Report.pdf`;

  return (
    <PDFDownloadLink
      document={<ReportDocument project={project} />}
      fileName={filename}
      className={`
        inline-flex items-center justify-center
        rounded-button
        font-medium font-semibold
        transition-all duration-200 ease-out
        bg-gold hover:bg-gold-dark text-navy shadow-gold hover:shadow-gold-strong
        focus:outline-none focus:ring-2 focus:ring-gold/30 focus:ring-offset-2 focus:ring-offset-navy
        ${sizeStyles[size]}
        no-underline cursor-pointer
      `}
    >
      {({ loading }) => (
        <>
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin shrink-0" />
          ) : (
            <Download className="w-4 h-4 shrink-0" />
          )}
          <span>{loading ? 'Preparing PDF...' : 'Download Report'}</span>
        </>
      )}
    </PDFDownloadLink>
  );
}

export default PDFDownloadButton;
