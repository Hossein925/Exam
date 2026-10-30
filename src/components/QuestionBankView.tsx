import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Question } from '../data/types';
import { categoriesData } from '../data/categoriesData';
import {
  Search, CheckCircle2, Star, BookOpen,
  Sparkles, FileText, Check, RotateCcw, Eye, EyeOff,
  ChevronRight, ChevronLeft, ChevronsRight, ChevronsLeft
} from 'lucide-react';

interface QuestionBankViewProps {
  questions: Question[];
  bookmarks: string[];
  mastered: string[];
  reviewNeeded: string[];
  onToggleBookmark: (id: string) => void;
  onMarkMastered: (id: string) => void;
  onMarkReviewNeeded: (id: string) => void;
  onOpenPdf: (pdfPath: string, page?: number) => void;
}

const PAGE_SIZE = 10; // Exactly 10 questions per page as requested

export const QuestionBankView: React.FC<QuestionBankViewProps> = ({
  questions,
  bookmarks,
  mastered,
  reviewNeeded,
  onToggleBookmark,
  onMarkMastered,
  onMarkReviewNeeded,
  onOpenPdf
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<number | 'all'>(1404);
  const [studyMode, setStudyMode] = useState<'study' | 'quiz'>('study');
  const [revealedIds, setRevealedIds] = useState<Record<string, boolean>>({});
  const [currentPage, setCurrentPage] = useState<number>(1);

  const topListRef = useRef<HTMLDivElement>(null);

  const toggleReveal = (id: string) => {
    setRevealedIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Filtered list
  const filtered = useMemo(() => {
    return questions.filter(q => {
      if (selectedYear !== 'all' && q.year !== selectedYear) return false;
      if (selectedCategory !== 'all' && q.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        const inQ = q.question.toLowerCase().includes(query);
        const inOpts = q.options.some(opt => opt.toLowerCase().includes(query));
        const inSub = q.subject.toLowerCase().includes(query);
        if (!inQ && !inOpts && !inSub) return false;
      }
      return true;
    });
  }, [questions, selectedYear, selectedCategory, searchQuery]);

  // Reset to page 1 on filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedYear, selectedCategory, searchQuery]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * PAGE_SIZE;
  const endIndex = Math.min(startIndex + PAGE_SIZE, filtered.length);
  const paginatedQuestions = filtered.slice(startIndex, endIndex);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    if (topListRef.current) {
      topListRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Generate pagination numbers with ellipsis
  const pageNumbers = useMemo(() => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (safePage > 3) pages.push('...');
      const start = Math.max(2, safePage - 1);
      const end = Math.min(totalPages - 1, safePage + 1);
      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }
      if (safePage < totalPages - 2) pages.push('...');
      if (!pages.includes(totalPages)) pages.push(totalPages);
    }
    return pages;
  }, [totalPages, safePage]);

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-5 sm:space-y-6">
      
      {/* Top Header & Study Mode Selector */}
      <div className="bg-[#FFFDF9] rounded-2xl p-4 sm:p-5 border-2 border-[#D8C9B3] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-base sm:text-xl font-extrabold text-[#2C2117] flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#8C6B43] shrink-0" />
            <span>بانک سوالات طبقه‌بندی شده آزمون لیسانس به پزشکی</span>
          </h2>
          <p className="text-[11px] sm:text-xs text-[#7A6451] mt-1">
            مشاهده تست‌ها در دسته‌های ۱۰ تایی با گزینه‌ها، کلید تایید شده و نکات طلایی
          </p>
        </div>

        {/* Study Mode Switcher & TXT Download */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <a
            href="/سوالات-و-پاسخنامه-جامع-لیسانس-به-پزشکی.txt"
            download="سوالات-و-پاسخنامه-جامع-لیسانس-به-پزشکی.txt"
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#FAF4EA] hover:bg-[#EFE5D5] text-[#4A3827] border border-[#D5C6B0] transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs w-full sm:w-auto"
            title="دانلود فایل متنی کامل سوالات و پاسخ‌ها"
          >
            <FileText className="w-4 h-4 text-[#8C6B43] shrink-0" />
            <span>دانلود کل سوالات و پاسخ‌ها (TXT)</span>
          </a>

          <div className="flex items-center gap-1.5 p-1 bg-[#EFE6D6] rounded-xl border border-[#D5C6B0] flex-1 sm:flex-initial">
            <button
              onClick={() => setStudyMode('study')}
              className={`flex-1 sm:flex-initial px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                studyMode === 'study'
                  ? 'bg-[#8C6B43] text-white shadow-xs'
                  : 'text-[#695645] hover:text-[#2C2117]'
              }`}
            >
              <Eye className="w-3.5 h-3.5 shrink-0" />
              <span>مطالعه (پاسخ‌ها باز)</span>
            </button>

            <button
              onClick={() => setStudyMode('quiz')}
              className={`flex-1 sm:flex-initial px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                studyMode === 'quiz'
                  ? 'bg-[#8C6B43] text-white shadow-xs'
                  : 'text-[#695645] hover:text-[#2C2117]'
              }`}
            >
              <EyeOff className="w-3.5 h-3.5 shrink-0" />
              <span>خودآزمایی</span>
            </button>
          </div>
        </div>
      </div>

      {/* Year Selection Tabs */}
      <div className="bg-[#FFFDF9] rounded-2xl p-3 sm:p-4 border-2 border-[#D8C9B3] shadow-xs">
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
          <span className="text-xs font-extrabold text-[#4D3B2C] ml-1 shrink-0">دوره آزمون:</span>
          {[
            { id: 1405, label: 'بانک تألیفی (۱۴۰۵)' },
            { id: 1404, label: 'دوره ۱۸ (۱۴۰۴)' },
            { id: 1402, label: 'دوره ۱۶ (۱۴۰۲)' },
            { id: 1401, label: 'دوره ۱۵ (۱۴۰۱)' },
            { id: 1400, label: 'دوره ۱۴ (۱۴۰۰)' },
            { id: 'all', label: 'همه دوره‌ها' }
          ].map(yr => (
            <button
              key={String(yr.id)}
              onClick={() => setSelectedYear(yr.id as any)}
              className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                selectedYear === yr.id
                  ? 'bg-[#8C6B43] text-white shadow-xs ring-1 ring-[#73532F]'
                  : 'bg-[#F2ECE1] text-[#5C4937] hover:bg-[#E5DAC7] border border-[#DDD0BC]'
              }`}
            >
              {yr.label}
            </button>
          ))}
        </div>
      </div>

      {/* Subject Categories Bar */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
        {categoriesData.map(cat => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 sm:py-2 rounded-xl whitespace-nowrap shrink-0 transition-all font-bold cursor-pointer flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-[#4A3B2C] text-white shadow-xs'
                  : 'bg-[#FFFDF9] text-[#5A4736] hover:bg-[#F2ECE1] border border-[#D8C9B3]'
              }`}
            >
              <span>{cat.title}</span>
              <span className={`text-[10px] sm:text-[11px] px-1.5 py-0.5 rounded-md tabular-nums ${
                isSelected ? 'bg-white/20 text-white' : 'bg-[#EFE5D5] text-[#8C6B43]'
              }`}>
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search Bar */}
      <div className="relative w-full">
        <Search className="w-4 h-4 absolute right-3.5 top-3.5 text-[#9A8775]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="جستجوی کلیدواژه در صورت سوال یا گزینه‌ها (مثلاً: قلب، کبد، هورمون، باکتری، مغالطه...)"
          className="w-full pr-10 pl-16 py-2.5 sm:py-3 rounded-xl bg-[#FFFDF9] border-2 border-[#D8C9B3] text-xs sm:text-sm text-[#2C2117] placeholder-[#9C8A79] focus:outline-hidden focus:ring-1 focus:ring-[#8C6B43]"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute left-3 top-2.5 sm:top-3 text-xs text-[#9C8A79] hover:text-[#2C2117] cursor-pointer"
          >
            پاک کردن
          </button>
        )}
      </div>

      {/* Active Page Reference marker */}
      <div ref={topListRef} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-bold text-[#6D5845] pt-1">
        <div>
          <span>نمایش سوالات <strong className="text-[#2C2117] tabular-nums">{filtered.length > 0 ? startIndex + 1 : 0}</strong> تا <strong className="text-[#2C2117] tabular-nums">{endIndex}</strong> از کل <strong className="text-[#2C2117] tabular-nums">{filtered.length}</strong> تست</span>
          {selectedCategory !== 'all' && (
            <span className="text-[#8C6B43] mr-2">({selectedCategory})</span>
          )}
        </div>
        <div className="text-[11px] text-[#8C6B43] bg-[#EFE6D6] px-2.5 py-1 rounded-lg border border-[#D5C6B0] self-start sm:self-auto font-mono">
          صفحه {safePage} از {totalPages} (۱۰ سوال در هر صفحه)
        </div>
      </div>

      {/* 10 Questions Per Page List */}
      <div className="space-y-4 sm:space-y-5">
        {paginatedQuestions.map((q, idx) => {
          const isMastered = mastered.includes(q.id);
          const isBookmarked = bookmarks.includes(q.id);
          const isReview = reviewNeeded.includes(q.id);
          const isRevealed = studyMode === 'study' || !!revealedIds[q.id];

          return (
            <div
              key={`bank-q-${q.id}-${idx}`}
              className={`bg-[#FFFDF9] rounded-2xl border-2 transition-all shadow-xs p-4 sm:p-6 space-y-3 sm:space-y-4 ${
                isMastered
                  ? 'border-[#B8D8BC]'
                  : isReview
                  ? 'border-[#E8BDB7]'
                  : 'border-[#DFD3C0]'
              }`}
            >
              
              {/* Question Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 sm:pb-3 border-b border-[#EDE3D4]">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#8C6B43] text-white flex items-center justify-center font-extrabold text-xs sm:text-sm tabular-nums shadow-xs shrink-0">
                    {q.number}
                  </span>
                  <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-bold text-[#4D3B2C] flex-wrap">
                    <span className="text-[#8C6B43] bg-[#FAF3E5] px-2 py-0.5 rounded-lg border border-[#E3D1B4]">
                      {q.category}
                    </span>
                    <span>{q.examName}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onToggleBookmark(q.id)}
                    className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                      isBookmarked
                        ? 'bg-[#F9EED9] border-[#D9BC82] text-[#B07B1A]'
                        : 'bg-[#FAF4EA] border-[#E0D3C1] text-[#7A6755] hover:text-[#2D2218]'
                    }`}
                    title="نشان کردن"
                  >
                    <Star className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                  </button>

                  {q.sourcePdf && (
                    <button
                      onClick={() => onOpenPdf(q.sourcePdf)}
                      className="p-1.5 text-[#7A6755] hover:text-[#2D2218] bg-[#FAF4EA] hover:bg-[#EFE5D5] rounded-lg border border-[#E0D3C1] transition-colors cursor-pointer"
                      title="مشاهده در فایل PDF اصلی"
                    >
                      <FileText className="w-4 h-4 text-[#8C6B43]" />
                    </button>
                  )}
                </div>
              </div>

              {/* Question Stem Text */}
              <div className="text-sm sm:text-base md:text-lg font-bold text-[#2A1F15] leading-relaxed break-words">
                {q.question}
              </div>

              {/* 4 Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5 pt-1">
                {q.options.map((opt, oIdx) => {
                  const letters = ['الف', 'ب', 'ج', 'د'];
                  const isCorrect = oIdx === q.correctOption;

                  return (
                    <div
                      key={oIdx}
                      className={`p-3 sm:p-3.5 rounded-xl border text-xs sm:text-sm flex items-start gap-2.5 transition-colors ${
                        isRevealed && isCorrect
                          ? 'bg-[#EBF5EC] border-2 border-[#82BF8E] text-[#145325] font-bold shadow-xs'
                          : 'bg-[#FAF6EE] border border-[#DFD3C0] text-[#3D2F22]'
                      }`}
                    >
                      <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                        isRevealed && isCorrect ? 'bg-[#2E7A43] text-white' : 'bg-[#EAE0D0] text-[#5C4A3A]'
                      }`}>
                        {letters[oIdx]}
                      </span>
                      <span className="flex-1 leading-relaxed pt-0.5 break-words">{opt}</span>
                      {isRevealed && isCorrect && (
                        <span className="shrink-0 flex items-center gap-1 text-[10px] sm:text-[11px] font-extrabold text-[#1B572B] bg-[#DCF0DE] px-2 py-0.5 rounded-md">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>صحیح</span>
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Self-quiz toggle */}
              {studyMode === 'quiz' && !isRevealed && (
                <div className="text-center pt-1.5">
                  <button
                    onClick={() => toggleReveal(q.id)}
                    className="px-4 py-1.5 text-xs font-bold text-[#8C6B43] bg-[#F5ECE0] hover:bg-[#EFE2D2] border border-[#DECFBA] rounded-xl transition-colors cursor-pointer"
                  >
                    نمایش پاسخ و نکته تست
                  </button>
                </div>
              )}

              {/* High-Yield Note & Detailed Explanation */}
              {isRevealed && (
                <div className="pt-3 border-t border-[#EDE3D4] space-y-2">
                  <div className="bg-[#FAF3E5] p-3 rounded-xl border border-[#E3D1B4] text-xs text-[#523E28] space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-[#8C5D23]">
                      <Sparkles className="w-3.5 h-3.5 text-[#C48427] shrink-0" />
                      <span>نکته طلایی و کلیدی:</span>
                    </div>
                    <p className="leading-relaxed font-medium break-words">{q.highYieldTip}</p>
                  </div>

                  <div className="bg-[#F5EFE4] p-3 rounded-xl border border-[#DFD3C0] text-xs text-[#5C4A3A]">
                    <span className="font-bold text-[#3B2C1F] block mb-0.5">تحلیل تشریحی بر اساس مراجع:</span>
                    <p className="leading-relaxed whitespace-pre-line break-words">{q.explanation}</p>
                  </div>
                </div>
              )}

              {/* Mastery Action Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[#EDE3D4]/70">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onMarkMastered(q.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                      isMastered
                        ? 'bg-[#2E7A43] text-white shadow-xs'
                        : 'bg-[#E3EFE4] text-[#246237] hover:bg-[#D5E9D7] border border-[#BCD8C1]'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{isMastered ? 'مسلط شدم ✓' : 'مسلط هستم'}</span>
                  </button>

                  <button
                    onClick={() => onMarkReviewNeeded(q.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                      isReview
                        ? 'bg-[#A84A3F] text-white shadow-xs'
                        : 'bg-[#F9ECE9] text-[#9A382F] hover:bg-[#F3DFDB] border border-[#E8C1BB]'
                    }`}
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{isReview ? 'در صف مرور' : 'نیاز به مرور'}</span>
                  </button>
                </div>

                {q.sourcePdf ? (
                  <button
                    onClick={() => onOpenPdf(q.sourcePdf)}
                    className="text-xs text-[#8C6B43] hover:underline cursor-pointer"
                  >
                    مشاهده در دفترچه PDF
                  </button>
                ) : (
                  <span className="text-xs text-[#8C6B43]">{q.examName}</span>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* Paginator Bar (Controls 10 Questions Per Page) */}
      {totalPages > 1 && (
        <div className="bg-[#FFFDF9] rounded-2xl p-4 border-2 border-[#D8C9B3] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Previous Button */}
          <button
            onClick={() => handlePageChange(safePage - 1)}
            disabled={safePage === 1}
            className="w-full sm:w-auto px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 bg-[#EDE4D4] text-[#4A3B2D] hover:bg-[#E0D5C3] disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
          >
            <ChevronRight className="w-4 h-4 shrink-0" />
            <span>صفحه قبلی</span>
          </button>

          {/* Page Numbers */}
          <div className="flex items-center gap-1 overflow-x-auto py-1 scrollbar-none max-w-full justify-center">
            {pageNumbers.map((p, pIdx) => {
              if (p === '...') {
                return (
                  <span key={`ell-${pIdx}`} className="px-2 text-xs text-[#8A7766]">
                    ...
                  </span>
                );
              }
              const num = p as number;
              const isCurrent = num === safePage;
              return (
                <button
                  key={`page-${num}`}
                  onClick={() => handlePageChange(num)}
                  className={`w-8 h-8 rounded-xl text-xs font-bold transition-all flex items-center justify-center cursor-pointer tabular-nums ${
                    isCurrent
                      ? 'bg-[#8C6B43] text-white shadow-xs ring-1 ring-[#73532F]'
                      : 'bg-[#F2ECE1] text-[#5C4937] hover:bg-[#E5DAC7] border border-[#DDD0BC]'
                  }`}
                >
                  {num}
                </button>
              );
            })}
          </div>

          {/* Next Button */}
          <button
            onClick={() => handlePageChange(safePage + 1)}
            disabled={safePage === totalPages}
            className="w-full sm:w-auto px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 bg-[#8C6B43] text-white hover:bg-[#785934] disabled:opacity-40 disabled:pointer-events-none cursor-pointer shadow-xs"
          >
            <span>صفحه بعدی</span>
            <ChevronLeft className="w-4 h-4 shrink-0" />
          </button>

        </div>
      )}

    </div>
  );
};
