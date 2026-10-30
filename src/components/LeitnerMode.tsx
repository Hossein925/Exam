import React, { useState, useMemo } from 'react';
import { Question } from '../data/types';
import {
  Layers, CheckCircle2, RotateCcw, ArrowRight, ArrowLeft,
  Sparkles, BookOpen, Star, Trophy, AlertTriangle
} from 'lucide-react';

interface LeitnerModeProps {
  questions: Question[];
  leitnerBoxes: Record<string, number>;
  bookmarks: string[];
  onMarkMastered: (id: string) => void;
  onMarkReviewNeeded: (id: string) => void;
  onToggleBookmark: (id: string) => void;
  onOpenPdf: (pdfPath: string) => void;
}

export const LeitnerMode: React.FC<LeitnerModeProps> = ({
  questions,
  leitnerBoxes,
  bookmarks,
  onMarkMastered,
  onMarkReviewNeeded,
  onToggleBookmark,
  onOpenPdf
}) => {
  const [selectedBox, setSelectedBox] = useState<number>(1);
  const [activePracticeIndex, setActivePracticeIndex] = useState<number>(0);
  const [revealed, setRevealed] = useState<boolean>(false);

  // Group questions by box
  const boxGroups = useMemo(() => {
    const groups: Record<number, Question[]> = { 1: [], 2: [], 3: [], 4: [], 5: [] };
    questions.forEach(q => {
      const box = leitnerBoxes[q.id] || 1;
      groups[box].push(q);
    });
    return groups;
  }, [questions, leitnerBoxes]);

  const activeQuestions = boxGroups[selectedBox] || [];
  const currentQ = activeQuestions[activePracticeIndex];

  const handleNextInBox = () => {
    if (activePracticeIndex < activeQuestions.length - 1) {
      setActivePracticeIndex(prev => prev + 1);
      setRevealed(false);
    }
  };

  const handlePrevInBox = () => {
    if (activePracticeIndex > 0) {
      setActivePracticeIndex(prev => prev - 1);
      setRevealed(false);
    }
  };

  const handleKnewIt = () => {
    if (!currentQ) return;
    onMarkMastered(currentQ.id);
    setRevealed(false);
    if (activePracticeIndex >= activeQuestions.length - 1) {
      setActivePracticeIndex(0);
    }
  };

  const handleForgotIt = () => {
    if (!currentQ) return;
    onMarkReviewNeeded(currentQ.id);
    setRevealed(false);
    if (activePracticeIndex >= activeQuestions.length - 1) {
      setActivePracticeIndex(0);
    }
  };

  const boxDetails = [
    { num: 1, title: 'جعبه ۱: مرور روزانه', desc: 'سوالات جدید یا پاسخ‌های اشتباه', color: 'text-[#9A382F]' },
    { num: 2, title: 'جعبه ۲: تسلط اولیه', desc: 'مرور هر ۲ روز یکبار', color: 'text-[#8C5D23]' },
    { num: 3, title: 'جعبه ۳: تثبیت ذهنی', desc: 'مرور هر ۴ روز یکبار', color: 'text-[#5A6F2B]' },
    { num: 4, title: 'جعبه ۴: تسلط عمیق', desc: 'مرور هفتگی', color: 'text-[#206935]' },
    { num: 5, title: 'جعبه ۵: حافظه بلندمدت', desc: 'تثبیت قطعی در ذهن', color: 'text-[#155A2B]' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* Leitner Overview Header */}
      <div className="text-center space-y-2">
        <h2 className="text-xl sm:text-2xl font-bold text-[#2D2117]">
          سیستم لایتنر ۵ مرحله‌ای (فاصله‌گذاری مرور)
        </h2>
        <p className="text-xs sm:text-sm text-[#786452] max-w-xl mx-auto">
          برای یادگیری ماندگار در زمان اندک، هر سوالی را که بلد هستید به جعبه بعدی هدایت کنید و در صورت فراموشی بلافاصله به خانه اول بازگردانید.
        </p>
      </div>

      {/* 5 Boxes Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {boxDetails.map(b => {
          const count = boxGroups[b.num]?.length || 0;
          const isSelected = selectedBox === b.num;

          return (
            <button
              key={b.num}
              onClick={() => { setSelectedBox(b.num); setActivePracticeIndex(0); setRevealed(false); }}
              className={`p-3.5 rounded-2xl border text-right transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#8C6B43] text-white border-[#7A5B36] shadow-xs ring-2 ring-[#4A3B2C]/20'
                  : 'bg-[#FFFDF9] hover:bg-[#F7F1E6] text-[#4A3B2D] border-[#DFD3C0]'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-[#2D2117]'}`}>
                  جعبه {b.num}
                </span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-md tabular-nums ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-[#EFE5D5] text-[#8C6B43]'
                }`}>
                  {count}
                </span>
              </div>
              <p className={`text-[11px] font-medium ${isSelected ? 'text-[#F3EDE2]' : b.color}`}>
                {b.desc}
              </p>
            </button>
          );
        })}
      </div>

      {/* Active Question in Selected Box */}
      {currentQ ? (
        <div className="bg-[#FFFDF9] rounded-2xl border border-[#DFD3C0] shadow-sm overflow-hidden space-y-4">
          
          <div className="bg-[#F8F2E6] px-5 py-3.5 border-b border-[#E3D7C5] flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-[#3B2C1F]">
              <Layers className="w-4 h-4 text-[#8C6B43]" />
              <span>جعبه شماره {selectedBox} · تست {activePracticeIndex + 1} از {activeQuestions.length}</span>
              <span className="text-[#8C6B43]" aria-hidden="true">·</span>
              <span className="text-[#7A6755]">{currentQ.category}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onToggleBookmark(currentQ.id)}
                className="p-1.5 rounded-lg border border-[#E0D3C1] text-[#7A6755] hover:text-[#2D2218] bg-[#FAF4EA] cursor-pointer"
              >
                <Star className={`w-4 h-4 ${bookmarks.includes(currentQ.id) ? 'fill-[#C48427] text-[#C48427]' : ''}`} />
              </button>
            </div>
          </div>

          <div className="p-6 md:p-8 space-y-6">
            <div className="text-base sm:text-lg md:text-xl font-bold text-[#2C2117] leading-relaxed">
              {currentQ.question}
            </div>

            {/* 4 Options */}
            <div className="grid grid-cols-1 gap-2.5">
              {currentQ.options.map((opt, oIdx) => {
                const letters = ['الف', 'ب', 'ج', 'د'];
                const isCorrect = oIdx === currentQ.correctOption;

                return (
                  <div
                    key={oIdx}
                    className={`p-3.5 rounded-xl border text-xs sm:text-sm flex items-start gap-3 transition-colors ${
                      revealed && isCorrect
                        ? 'bg-[#EBF5EC] border-[#A8D3B0] text-[#1B572B] font-bold'
                        : 'bg-[#FAF6EE] border-[#E3D7C5] text-[#4A3B2D]'
                    }`}
                  >
                    <span className={`w-6 h-6 rounded flex items-center justify-center font-bold text-xs shrink-0 ${
                      revealed && isCorrect ? 'bg-[#2E7A43] text-white' : 'bg-[#EAE0D0] text-[#5C4A3A]'
                    }`}>
                      {letters[oIdx]}
                    </span>
                    <span className="flex-1 leading-relaxed">{opt}</span>
                    {revealed && isCorrect && (
                      <CheckCircle2 className="w-4 h-4 text-[#2E7A43] shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Reveal button */}
            {!revealed ? (
              <div className="text-center pt-2">
                <button
                  onClick={() => setRevealed(true)}
                  className="px-6 py-2.5 text-xs sm:text-sm font-bold text-[#8C6B43] bg-[#F5ECE0] hover:bg-[#EFE2D2] border border-[#DECFBA] rounded-xl transition-colors cursor-pointer"
                >
                  نمایش پاسخ و نکته تست
                </button>
              </div>
            ) : (
              <div className="space-y-3 pt-2 border-t border-[#EDE3D4]">
                <div className="bg-[#FAF3E5] p-3.5 rounded-xl border border-[#E3D1B4] text-xs text-[#523E28]">
                  <strong>نکته طلایی:</strong> {currentQ.highYieldTip}
                </div>
                <div className="bg-[#F5EFE4] p-3.5 rounded-xl border border-[#DFD3C0] text-xs text-[#5C4A3A]">
                  <strong>تحلیل:</strong> {currentQ.explanation}
                </div>
              </div>
            )}
          </div>

          {/* Action Bar */}
          <div className="bg-[#F8F2E6] px-5 py-3.5 border-t border-[#E3D7C5] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={handleKnewIt}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#E2F0E5] text-[#1D5E2F] hover:bg-[#D5E9D7] border border-[#BCD8C1] transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>بلد بودم (انتقال به جعبه {Math.min(5, selectedBox + 1)})</span>
              </button>

              <button
                onClick={handleForgotIt}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#FCE6E3] text-[#9A382F] hover:bg-[#F8DADB] border border-[#E8C1BB] transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>فراموش کردم (بازگشت به جعبه ۱)</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevInBox}
                disabled={activePracticeIndex === 0}
                className="px-3 py-1.5 text-xs bg-[#EDE4D4] hover:bg-[#E5DAC7] disabled:opacity-40 rounded-lg text-[#4A3B2D] cursor-pointer"
              >
                <ArrowRight className="w-4 h-4 inline ml-1" />
                <span>قبلی</span>
              </button>

              <button
                onClick={handleNextInBox}
                disabled={activePracticeIndex === activeQuestions.length - 1}
                className="px-3 py-1.5 text-xs bg-[#EDE4D4] hover:bg-[#E5DAC7] disabled:opacity-40 rounded-lg text-[#4A3B2D] cursor-pointer"
              >
                <span>بعدی</span>
                <ArrowLeft className="w-4 h-4 inline mr-1" />
              </button>
            </div>
          </div>

        </div>
      ) : (
        <div className="bg-[#FFFDF9] rounded-2xl border border-[#DFD3C0] p-12 text-center space-y-3">
          <Trophy className="w-12 h-12 text-[#8C6B43] mx-auto opacity-70" />
          <h3 className="text-lg font-bold text-[#2D2117]">هیچ سوالی در این جعبه وجود ندارد</h3>
          <p className="text-xs text-[#7A6755]">با مرور سوالات، سوالاتی که پاسخ می‌دهید به جعبه‌های بالاتر ارتقا پیدا می‌کنند.</p>
        </div>
      )}

    </div>
  );
};
