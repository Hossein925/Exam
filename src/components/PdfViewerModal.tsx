import React, { useState } from 'react';
import { ExamInfo } from '../data/types';
import { FileText, Download, ExternalLink, X, BookOpen, Layers } from 'lucide-react';

interface PdfViewerModalProps {
  exams: ExamInfo[];
  currentPdfPath: string | null;
  onClose: () => void;
  onSelectPdf: (path: string) => void;
}

export const PdfViewerModal: React.FC<PdfViewerModalProps> = ({
  exams,
  currentPdfPath,
  onClose,
  onSelectPdf
}) => {
  const [activePath, setActivePath] = useState<string>(
    currentPdfPath || exams[0]?.pdfPath || '/assets/aistudio/license-to-medical-1404_a9007616.pdf'
  );

  const activeExam = exams.find(e => e.pdfPath === activePath) || exams[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E3D7C5]">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#2D2117]">
            آرشیو رسمی دفترچه‌های آزمون لیسانس به پزشکی (PDF)
          </h2>
          <p className="text-xs sm:text-sm text-[#786452] mt-0.5">
            مشاهده، ورق‌زدن و تطبیق متن سوالات با دفترچه‌های رسمی وزارت بهداشت و دانشگاه علوم پزشکی تهران
          </p>
        </div>

        {activeExam && (
          <div className="flex items-center gap-2">
            <a
              href={activeExam.pdfPath}
              download
              className="px-3.5 py-1.5 text-xs font-semibold bg-[#EDE4D4] hover:bg-[#E5DAC7] text-[#4A3B2D] rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Download className="w-4 h-4 text-[#8C6B43]" />
              <span>دانلود PDF</span>
            </a>

            <a
              href={activeExam.pdfPath}
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#8C6B43] hover:bg-[#785934] rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <ExternalLink className="w-4 h-4" />
              <span>باز کردن در تب جدید</span>
            </a>
          </div>
        )}
      </div>

      {/* Exam Selector Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
        {exams.map(ex => {
          const isSelected = activePath === ex.pdfPath;
          return (
            <button
              key={ex.id}
              onClick={() => { setActivePath(ex.pdfPath); onSelectPdf(ex.pdfPath); }}
              className={`p-3 rounded-xl border text-right transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#8C6B43] text-white border-[#7A5B36] shadow-xs'
                  : 'bg-[#FFFDF9] hover:bg-[#F7F1E6] text-[#4A3B2D] border-[#DFD3C0]'
              }`}
            >
              <div className="text-xs font-bold truncate">{ex.title}</div>
              <div className={`text-[10px] mt-1 ${isSelected ? 'text-[#F4EDE2]' : 'text-[#8A7766]'}`}>
                {ex.totalQuestions} سوال · {ex.date}
              </div>
            </button>
          );
        })}
      </div>

      {/* Embedded PDF Viewer Frame */}
      <div className="bg-[#FFFDF9] rounded-2xl border border-[#DFD3C0] shadow-sm overflow-hidden flex flex-col h-[750px]">
        
        {/* Frame Toolbar */}
        <div className="bg-[#F8F2E6] px-5 py-3 border-b border-[#E3D7C5] flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-[#3B2C1F]">
            <FileText className="w-4 h-4 text-[#8C6B43]" />
            <span>{activeExam?.title}</span>
            <span className="text-[#8C6B43]" aria-hidden="true">·</span>
            <span className="text-[#7A6755] font-normal">{activeExam?.description}</span>
          </div>

          <span className="text-xs text-[#7A6755]">
            تعداد کل سوالات: <strong>{activeExam?.totalQuestions} تست</strong>
          </span>
        </div>

        {/* Iframe */}
        <div className="flex-1 w-full bg-[#525659]">
          <iframe
            src={`${activePath}#toolbar=1&navpanes=1`}
            title={activeExam?.title || 'نمایشگر دفترچه آزمون'}
            className="w-full h-full border-none"
          />
        </div>

      </div>

    </div>
  );
};
