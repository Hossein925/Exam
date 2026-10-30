import React, { useState, useEffect, useMemo } from 'react';
import { Question } from '../data/types';
import {
  CheckCircle2, XCircle, Star, ArrowRight, ArrowLeft,
  Sparkles, BookOpen, RotateCcw, Eye, Layers,
  ChevronDown, FileText
} from 'lucide-react';

interface RapidCramModeProps {
  questions: Question[];
  bookmarks: string[];
  mastered: string[];
  reviewNeeded: string[];
  onToggleBookmark: (id: string) => void;
  onMarkMastered: (id: string) => void;
  onMarkReviewNeeded: (id: string) => void;
  onOpenPdf: (pdfPath: string, page?: number) => void;
}

export const RapidCramMode: React.FC<RapidCramModeProps> = ({
  questions,
  bookmarks,
  mastered,
  reviewNeeded,
  onToggleBookmark,
  onMarkMastered,
  onMarkReviewNeeded,
  onOpenPdf
}) => {
  const [selectedYear, setSelectedYear] = useState<number | 'all'>(1404);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'unseen' | 'review' | 'starred' | 'mastered'>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [autoAdvance, setAutoAdvance] = useState(true);
  const [showPalette, setShowPalette] = useState(false);

  // Available categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    questions.forEach(q => set.add(q.category));
    return Array.from(set);
  }, [questions]);

  // Filtered questions
  const filteredQuestions = useMemo(() => {
    return questions.filter(q => {
      if (selectedYear !== 'all' && q.year !== selectedYear) return false;
      if (selectedCategory !== 'all' && q.category !== selectedCategory) return false;
      if (filterStatus === 'starred' && !bookmarks.includes(q.id)) return false;
      if (filterStatus === 'mastered' && !mastered.includes(q.id)) return false;
      if (filterStatus === 'review' && !reviewNeeded.includes(q.id)) return false;
      if (filterStatus === 'unseen' && (mastered.includes(q.id) || reviewNeeded.includes(q.id))) return false;
      return true;
    });
  }, [questions, selectedYear, selectedCategory, filterStatus, bookmarks, mastered, reviewNeeded]);

  // Reset index if out of range
  useEffect(() => {
    if (currentIndex >= filteredQuestions.length) {
      setCurrentIndex(0);
    }
    setRevealed(false);
    setSelectedOption(null);
  }, [selectedYear, selectedCategory, filterStatus, filteredQuestions.length]);

  const currentQ = filteredQuestions[currentIndex];

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.code === 'Space') {
        e.preventDefault();
        setRevealed(prev => !prev);
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handleNext();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === '1') {
        handleSelectOption(0);
      } else if (e.key === '2') {
        handleSelectOption(1);
      } else if (e.key === '3') {
        handleSelectOption(2);
      } else if (e.key === '4') {
        handleSelectOption(3);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, filteredQuestions.length, revealed]);

  const handleNext = () => {
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setRevealed(false);
      setSelectedOption(null);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setRevealed(false);
      setSelectedOption(null);
    }
  };

  const handleSelectOption = (idx: number) => {
    setSelectedOption(idx);
    setRevealed(true);
  };

  const handleMasteredClick = () => {
    if (!currentQ) return;
    onMarkMastered(currentQ.id);
    if (autoAdvance) {
      handleNext();
    }
  };

  const handleReviewClick = () => {
    if (!currentQ) return;
    onMarkReviewNeeded(currentQ.id);
    if (autoAdvance) {
      handleNext();
    }
  };

  if (!currentQ) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-full bg-[#EFE5D5] flex items-center justify-center text-[#8C6B43]">
          <Layers className="w-8 h-8" />
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-[#2D2218]">هیچ سوالی با این فیلترها یافت نشد</h2>
        <p className="text-xs sm:text-sm text-[#7A6755]">لطفاً فیلتر دوره یا درس را تغییر دهید تا سوالات نمایش داده شوند.</p>
        <button
          onClick={() => { setSelectedYear('all'); setSelectedCategory('all'); setFilterStatus('all'); }}
          className="px-4 py-2 text-xs font-semibold text-white bg-[#8C6B43] rounded-lg cursor-pointer"
        >
          حذف تمام فیلترها
        </button>
      </div>
    );
  }

  const isBookmarked = bookmarks.includes(currentQ.id);
  const isMastered = mastered.includes(currentQ.id);
  const isReviewNeeded = reviewNeeded.includes(currentQ.id);

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
      
      {/* Top Filter Bar */}
      <div className="bg-[#FFFDF9] rounded-2xl p-3 sm:p-4 border-2 border-[#DFD3C0] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        
        {/* Year Filter Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap w-full sm:w-auto">
          <span className="font-bold text-[#7A6755] ml-1">دوره:</span>
          {[1405, 1404, 1402, 1401, 1400, 'all'].map((y) => (
            <button
              key={String(y)}
              onClick={() => setSelectedYear(y as any)}
              className={`px-2.5 py-1.5 rounded-lg transition-all font-bold cursor-pointer ${
                selectedYear === y
                  ? 'bg-[#8C6B43] text-white shadow-xs font-extrabold'
                  : 'bg-[#F4ECE0] text-[#5C4938] hover:bg-[#EAE0D1]'
              }`}
            >
              {y === 'all' ? 'همه دوره‌ها' : y === 1405 ? 'بانک تألیفی ۱۴۰۵' : `سال ${y}`}
            </button>
          ))}
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5 flex-wrap w-full sm:w-auto">
          <span className="font-bold text-[#7A6755] ml-1">وضعیت:</span>
          {[
            { id: 'all', label: 'همه' },
            { id: 'unseen', label: 'نخوانده' },
            { id: 'review', label: 'نیاز مرور' },
            { id: 'mastered', label: 'مسلط' },
            { id: 'starred', label: 'ستاره‌دار' },
          ].map(st => (
            <button
              key={st.id}
              onClick={() => setFilterStatus(st.id as any)}
              className={`px-2.5 py-1.5 rounded-lg transition-all font-bold cursor-pointer ${
                filterStatus === st.id
                  ? 'bg-[#8C6B43] text-white shadow-xs font-extrabold'
                  : 'bg-[#F4ECE0] text-[#5C4938] hover:bg-[#EAE0D1]'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>

      </div>

      {/* Subject Filter Chips */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1.5 rounded-xl whitespace-nowrap shrink-0 transition-all font-bold cursor-pointer ${
            selectedCategory === 'all'
              ? 'bg-[#4A3B2C] text-white font-extrabold shadow-xs'
              : 'bg-[#EDE4D4] text-[#695645] hover:bg-[#E2D6C3]'
          }`}
        >
          تمام دروس ({filteredQuestions.length})
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap shrink-0 transition-all font-bold cursor-pointer ${
              selectedCategory === cat
                ? 'bg-[#4A3B2C] text-white font-extrabold shadow-xs'
                : 'bg-[#EDE4D4] text-[#695645] hover:bg-[#E2D6C3]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Question Card */}
      <div className="bg-[#FFFDF9] rounded-2xl border-2 border-[#DFD3C0] shadow-sm overflow-hidden">
        
        {/* Card Header */}
        <div className="bg-[#F8F2E6] px-4 sm:px-5 py-3 border-b border-[#E3D7C5] flex flex-wrap items-center justify-between gap-2.5">
          
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-[#8C6B43] text-white flex items-center justify-center font-extrabold text-sm tabular-nums shadow-xs shrink-0">
              {currentQ.number}
            </span>
            <div className="flex items-center gap-1.5 sm:gap-2 text-xs font-bold text-[#3D2F22] flex-wrap">
              <span className="text-[#8C6B43]">{currentQ.category}</span>
              <span className="text-[#8C6B43]" aria-hidden="true">·</span>
              <span className="text-[#7A6755]">{currentQ.examName}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            
            {/* Source PDF Link */}
            {currentQ.sourcePdf && (
              <button
                onClick={() => onOpenPdf(currentQ.sourcePdf)}
                className="text-xs text-[#7A6755] hover:text-[#2D2218] px-2.5 py-1.5 rounded-lg bg-[#EDE4D4] hover:bg-[#E5DAC7] transition-colors flex items-center gap-1 cursor-pointer font-semibold"
                title="مشاهده در فایل اصلی آزمون"
              >
                <FileText className="w-3.5 h-3.5 text-[#8C6B43]" />
                <span className="hidden xs:inline">فایل PDF</span>
              </button>
            )}

            {/* Bookmark */}
            <button
              onClick={() => onToggleBookmark(currentQ.id)}
              className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                isBookmarked
                  ? 'bg-[#F9EED9] border-[#D9BC82] text-[#B07B1A]'
                  : 'bg-[#FAF4EA] border-[#E0D3C1] text-[#7A6755] hover:text-[#2D2218]'
              }`}
              title={isBookmarked ? 'نشان‌شده' : 'نشان کردن برای مرور'}
            >
              <Star className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>

            {/* Quick jump palette button */}
            <button
              onClick={() => setShowPalette(!showPalette)}
              className="px-2.5 py-1.5 text-xs font-bold bg-[#FAF4EA] border border-[#E0D3C1] text-[#5C4937] hover:bg-[#EFE5D5] rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>{currentIndex + 1} از {filteredQuestions.length}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

          </div>

        </div>

        {/* Question Palette Dropdown - Responsive Grid */}
        {showPalette && (
          <div className="p-3 sm:p-4 bg-[#F5EFE3] border-b border-[#E3D7C5] max-h-52 overflow-y-auto">
            <div className="text-xs font-bold text-[#4D3D2F] mb-2">پرش به شماره تست:</div>
            <div className="grid grid-cols-6 sm:grid-cols-10 md:grid-cols-15 lg:grid-cols-20 gap-1.5">
              {filteredQuestions.map((q, idx) => {
                const isM = mastered.includes(q.id);
                const isR = reviewNeeded.includes(q.id);
                const isCur = idx === currentIndex;
                return (
                  <button
                    key={`palette-${q.id}-${idx}`}
                    onClick={() => { setCurrentIndex(idx); setShowPalette(false); }}
                    className={`text-xs py-1.5 rounded-lg font-bold cursor-pointer transition-all ${
                      isCur
                        ? 'bg-[#8C6B43] text-white ring-2 ring-[#4A3B2C]'
                        : isM
                        ? 'bg-[#DDEEDF] text-[#1D5E2F] border border-[#BBD7BF]'
                        : isR
                        ? 'bg-[#FBE8E5] text-[#8C342C] border border-[#E5BCB5]'
                        : 'bg-white text-[#4A3B2C] border border-[#E0D4C2] hover:bg-[#ECE1D0]'
                    }`}
                  >
                    {q.number}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Question Content */}
        <div className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
          
          {/* Question Text */}
          <div className="text-base sm:text-lg md:text-xl font-bold text-[#2A2016] leading-relaxed break-words">
            {currentQ.question}
          </div>

          {/* 4 Options Grid */}
          <div className="grid grid-cols-1 gap-2.5 sm:gap-3">
            {currentQ.options.map((opt, oIdx) => {
              const letters = ['الف', 'ب', 'ج', 'د'];
              const isCorrect = oIdx === currentQ.correctOption;
              const isChosen = selectedOption === oIdx;

              let btnStyle = 'bg-[#FAF6EE] border-[#DFD3C0] text-[#3B2F23] hover:bg-[#F3ECE0] hover:border-[#CFBEA5]';

              if (revealed) {
                if (isCorrect) {
                  btnStyle = 'bg-[#EBF5EC] border-2 border-[#82BF8E] text-[#1B572B] ring-1 ring-[#34884B]/20 font-bold';
                } else if (isChosen && !isCorrect) {
                  btnStyle = 'bg-[#FDF0EE] border border-[#E8BFB9] text-[#9A382F] font-semibold';
                } else {
                  btnStyle = 'bg-[#F9F5EC] border-[#E5DAC9] text-[#7A6958] opacity-80';
                }
              }

              return (
                <button
                  key={oIdx}
                  onClick={() => handleSelectOption(oIdx)}
                  className={`w-full text-right p-3.5 sm:p-4 rounded-xl border transition-all flex items-start gap-3 cursor-pointer min-h-[44px] ${btnStyle}`}
                >
                  <span className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center font-extrabold text-xs shrink-0 ${
                    revealed && isCorrect
                      ? 'bg-[#2E7A43] text-white'
                      : revealed && isChosen && !isCorrect
                      ? 'bg-[#9A382F] text-white'
                      : 'bg-[#E8DDCE] text-[#4F3E2F]'
                  }`}>
                    {letters[oIdx]}
                  </span>

                  <span className="text-xs sm:text-sm md:text-base leading-relaxed flex-1 pt-0.5 break-words">
                    {opt}
                  </span>

                  {revealed && isCorrect && (
                    <span className="shrink-0 flex items-center gap-1 text-[11px] font-extrabold text-[#206935] bg-[#DCF0DE] px-2 py-0.5 rounded-md">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>پاسخ صحیح</span>
                    </span>
                  )}

                  {revealed && isChosen && !isCorrect && (
                    <span className="shrink-0 flex items-center gap-1 text-[11px] font-extrabold text-[#9A382F] bg-[#FCE6E3] px-2 py-0.5 rounded-md">
                      <XCircle className="w-3.5 h-3.5" />
                      <span>انتخاب شما</span>
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Reveal Button if not yet revealed */}
          {!revealed && (
            <div className="flex justify-center pt-2">
              <button
                onClick={() => setRevealed(true)}
                className="w-full sm:w-auto px-6 py-3 text-xs sm:text-sm font-bold text-[#8C6B43] bg-[#F5ECE0] hover:bg-[#EFE2D2] border border-[#DECFBA] rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs min-h-[44px]"
              >
                <Eye className="w-4 h-4 shrink-0" />
                <span>مشاهده پاسخ، نکته طلایی و تحلیل تشریحی</span>
              </button>
            </div>
          )}

          {/* High-Yield Note & Detailed Explanation Box */}
          {revealed && (
            <div className="space-y-3 pt-3 border-t border-[#E8DDCC]">
              
              {/* High Yield Note */}
              <div className="bg-[#FAF3E5] p-3.5 sm:p-4 rounded-xl border border-[#E3D1B4] space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-[#8A5B22]">
                  <Sparkles className="w-4 h-4 text-[#C48427] shrink-0" />
                  <span>نکته طلایی و دام تستی این پرسش:</span>
                </div>
                <p className="text-xs sm:text-sm text-[#4D3A24] leading-relaxed font-medium break-words">
                  {currentQ.highYieldTip}
                </p>
              </div>

              {/* Detailed Conceptual Explanation */}
              <div className="bg-[#F6F1E6] p-3.5 sm:p-4 rounded-xl border border-[#E0D5C3] space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-[#4A3B2D]">
                  <BookOpen className="w-4 h-4 text-[#8C6B43] shrink-0" />
                  <span>تحلیل تشریحی بر اساس مراجع آزمون:</span>
                </div>
                <p className="text-xs sm:text-sm text-[#5C4A3A] leading-relaxed whitespace-pre-line break-words">
                  {currentQ.explanation}
                </p>
              </div>

            </div>
          )}

        </div>

        {/* Card Footer Action Bar - Mobile Optimized */}
        <div className="bg-[#F8F2E6] px-4 sm:px-5 py-3.5 border-t border-[#E3D7C5] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          
          {/* Quick Mastery Flags */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleMasteredClick}
              className={`flex-1 sm:flex-initial px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer min-h-[44px] ${
                isMastered
                  ? 'bg-[#2E7A43] text-white shadow-xs'
                  : 'bg-[#E3EFE4] text-[#246237] hover:bg-[#D5E9D7] border border-[#BCD8C1]'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{isMastered ? 'مسلط شدم ✓' : 'مسلط هستم'}</span>
            </button>

            <button
              onClick={handleReviewClick}
              className={`flex-1 sm:flex-initial px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer min-h-[44px] ${
                isReviewNeeded
                  ? 'bg-[#A84A3F] text-white shadow-xs'
                  : 'bg-[#F9ECE9] text-[#9A382F] hover:bg-[#F3DFDB] border border-[#E8C1BB]'
              }`}
            >
              <RotateCcw className="w-4 h-4 shrink-0" />
              <span>{isReviewNeeded ? 'در صف مرور' : 'مرور مجدد'}</span>
            </button>

            <label className="hidden md:flex items-center gap-1.5 text-xs text-[#7A6755] cursor-pointer mr-2">
              <input
                type="checkbox"
                checked={autoAdvance}
                onChange={(e) => setAutoAdvance(e.target.checked)}
                className="rounded border-[#D0C0A8] text-[#8C6B43] focus:ring-[#8C6B43]"
              />
              <span>پرش خودکار</span>
            </label>
          </div>

          {/* Prev / Next navigation */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="flex-1 sm:flex-initial px-4 py-2.5 text-xs font-bold bg-[#EDE4D4] hover:bg-[#E5DAC7] disabled:opacity-40 disabled:pointer-events-none text-[#4A3B2D] rounded-xl transition-colors flex items-center justify-center gap-1 cursor-pointer min-h-[44px]"
            >
              <ArrowRight className="w-4 h-4 shrink-0" />
              <span>سوال قبلی</span>
            </button>

            <button
              onClick={handleNext}
              disabled={currentIndex === filteredQuestions.length - 1}
              className="flex-1 sm:flex-initial px-5 py-2.5 text-xs font-extrabold text-white bg-[#8C6B43] hover:bg-[#785934] disabled:opacity-40 disabled:pointer-events-none rounded-xl transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-xs min-h-[44px]"
            >
              <span>سوال بعدی</span>
              <ArrowLeft className="w-4 h-4 shrink-0" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
