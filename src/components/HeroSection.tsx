import React from 'react';
import { Calendar, Target, Award, ArrowLeft, BookOpen, Clock } from 'lucide-react';
import { AppTab } from './Header';

interface HeroSectionProps {
  onStartCram: () => void;
  onSelectTab: (tab: AppTab) => void;
  totalQuestions: number;
  masteredCount: number;
  remainingDays: number;
  onSetRemainingDays: (days: number) => void;
  dailyGoal: number;
  onSetDailyGoal: (goal: number) => void;
  todayStudied: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartCram,
  onSelectTab,
  totalQuestions,
  masteredCount,
  remainingDays,
  onSetRemainingDays,
  dailyGoal,
  onSetDailyGoal,
  todayStudied
}) => {
  const neededDaily = Math.ceil((totalQuestions - masteredCount) / Math.max(1, remainingDays));
  const masteryPercentage = totalQuestions > 0 ? Math.round((masteredCount / totalQuestions) * 100) : 0;
  const todayProgress = Math.min(100, Math.round((todayStudied / dailyGoal) * 100));

  return (
    <div className="relative overflow-hidden bg-[#FAF6EE] border-b border-[#E3D7C4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 md:py-6">
        
        {/* Top 2-Column Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Quick Action Navigation */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-4">
            
            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3">
              <button
                onClick={onStartCram}
                className="w-full sm:w-auto px-5 py-3 text-xs sm:text-sm font-extrabold text-white bg-[#8C6B43] hover:bg-[#785934] active:bg-[#684C2B] rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
              >
                <span>شروع مرور سریع از دوره ۱۴۰۴</span>
                <ArrowLeft className="w-4 h-4 shrink-0" />
              </button>

              <button
                onClick={() => onSelectTab('bank')}
                className="w-full sm:w-auto px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-[#5A4736] bg-[#EFE6D6] hover:bg-[#E5DBC8] active:bg-[#DCD0BB] rounded-xl border border-[#D9CCB8] transition-colors flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
              >
                <BookOpen className="w-4 h-4 text-[#8C6B43] shrink-0" />
                <span>بانک سوالات موضوعی (۱۰ تایی)</span>
              </button>

              <button
                onClick={() => onSelectTab('pdf')}
                className="w-full sm:w-auto px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-[#5A4736] bg-[#EFE6D6] hover:bg-[#E5DBC8] active:bg-[#DCD0BB] rounded-xl border border-[#D9CCB8] transition-colors flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
              >
                <span>مطالعه PDF های اصلی</span>
              </button>
            </div>

            {/* Quick Metadata info */}
            <div className="flex items-center flex-wrap gap-3 text-xs text-[#7B6856] pt-1">
              <span>مبتنی بر رفرنس‌های مصوب وزارت بهداشت</span>
              <span aria-hidden="true">·</span>
              <span>همراه با کلید تایید شده و پاسخ تشریحی</span>
            </div>

          </div>

          {/* Interactive Countdown Planner Card */}
          <div className="lg:col-span-5">
            <div className="bg-[#FFFDF9] rounded-2xl p-4 border-2 border-[#DFD3C0] shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-extrabold text-[#3B2C1F]">
                  <Clock className="w-4 h-4 text-[#8C6B43]" />
                  <span>برنامه‌ریزی فرصت اندک باقی‌مانده</span>
                </div>
                <span className="text-[11px] text-[#8C6B43] font-bold">
                  هدف: {neededDaily} سوال در روز
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-[#F6F0E4] p-2.5 rounded-xl border border-[#E4D8C5]">
                  <span className="text-[#7A6755] block mb-1">فرصت باقی‌مانده (روز):</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      max={90}
                      value={remainingDays}
                      onChange={(e) => onSetRemainingDays(Number(e.target.value))}
                      className="w-16 bg-white px-2 py-1 rounded-md border border-[#D0C0A9] text-center font-bold text-[#2D2117] text-sm focus:outline-hidden focus:ring-1 focus:ring-[#8C6B43]"
                    />
                    <span className="text-[11px] text-[#8C6B43] font-medium">روز</span>
                  </div>
                </div>

                <div className="bg-[#F6F0E4] p-2.5 rounded-xl border border-[#E4D8C5]">
                  <span className="text-[#7A6755] block mb-1">هدف مطالعه امروز:</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={10}
                      max={300}
                      step={10}
                      value={dailyGoal}
                      onChange={(e) => onSetDailyGoal(Number(e.target.value))}
                      className="w-16 bg-white px-2 py-1 rounded-md border border-[#D0C0A9] text-center font-bold text-[#2D2117] text-sm focus:outline-hidden focus:ring-1 focus:ring-[#8C6B43]"
                    />
                    <span className="text-[11px] text-[#8C6B43] font-medium">تست / روز</span>
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div>
                <div className="flex justify-between items-center text-[11px] text-[#6E5A47] mb-1 font-medium">
                  <span>پیشرفت امروز ({todayStudied} از {dailyGoal} تست)</span>
                  <span className="tabular-nums font-bold text-[#2D2117]">{todayProgress}%</span>
                </div>
                <div className="w-full h-2 bg-[#EFE7DA] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-l from-[#8C6B43] to-[#B59164] transition-all duration-300 rounded-full"
                    style={{ width: `${todayProgress}%` }}
                  />
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* 4-Column Metric Strip below */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 mt-6 pt-5 border-t border-[#DFD4C2]">
          
          <div className="bg-[#FFFDF9] p-3 rounded-xl border border-[#DFD3C0] flex items-center gap-3 shadow-xs">
            <div className="w-9 h-9 rounded-lg bg-[#EFE5D5] flex items-center justify-center text-[#8C6B43] shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="text-base sm:text-lg font-bold text-[#2C2117] tabular-nums">
                {totalQuestions.toLocaleString('fa-IR')}
              </div>
              <div className="text-[11px] text-[#7A6755]">تست طبقه‌بندی شده</div>
            </div>
          </div>

          <div className="bg-[#FFFDF9] p-3 rounded-xl border border-[#DFD3C0] flex items-center gap-3 shadow-xs">
            <div className="w-9 h-9 rounded-lg bg-[#E8F2EA] flex items-center justify-center text-[#26683B] shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-base sm:text-lg font-bold text-[#26683B] tabular-nums">
                {masteredCount.toLocaleString('fa-IR')} ({masteryPercentage}٪)
              </div>
              <div className="text-[11px] text-[#7A6755]">تست‌های تثبیت‌شده</div>
            </div>
          </div>

          <div className="bg-[#FFFDF9] p-3 rounded-xl border border-[#DFD3C0] flex items-center gap-3 shadow-xs">
            <div className="w-9 h-9 rounded-lg bg-[#F8EFE4] flex items-center justify-center text-[#A66730] shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="text-base sm:text-lg font-bold text-[#2C2117] tabular-nums">
                ۸ دوره
              </div>
              <div className="text-[11px] text-[#7A6755]">از ۱۳۹۷ تا ۱۴۰۴</div>
            </div>
          </div>

          <div className="bg-[#FFFDF9] p-3 rounded-xl border border-[#DFD3C0] flex items-center gap-3 shadow-xs">
            <div className="w-9 h-9 rounded-lg bg-[#F5ECE8] flex items-center justify-center text-[#9E3E34] shrink-0">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <div className="text-base sm:text-lg font-bold text-[#2C2117] tabular-nums">
                ۱۳ درس
              </div>
              <div className="text-[11px] text-[#7A6755]">تفکیک موضوعی کامل</div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
