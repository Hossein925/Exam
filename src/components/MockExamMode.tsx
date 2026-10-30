import React, { useState, useEffect, useMemo } from 'react';
import { Question, ExamInfo } from '../data/types';
import {
  Clock, Award, AlertCircle, ArrowLeft, ArrowRight,
  CheckCircle2, XCircle, RefreshCw, BarChart3, HelpCircle,
  FileCheck
} from 'lucide-react';

interface MockExamModeProps {
  questions: Question[];
  exams: ExamInfo[];
  onOpenPdf: (pdfPath: string) => void;
}

export const MockExamMode: React.FC<MockExamModeProps> = ({
  questions,
  exams,
  onOpenPdf
}) => {
  const [examStarted, setExamStarted] = useState(false);
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [selectedExamYear, setSelectedExamYear] = useState<number>(1404);
  const [examLengthPreset, setExamLengthPreset] = useState<'full' | 'rapid50'>('full');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [secondsRemaining, setSecondsRemaining] = useState<number>(200 * 60);
  const [isTimerPaused, setIsTimerPaused] = useState(false);

  // Filter exam questions
  const examQuestions = useMemo(() => {
    let pool = questions.filter(q => q.year === selectedExamYear);
    if (pool.length === 0) pool = questions.slice(0, 150);

    if (examLengthPreset === 'rapid50') {
      return pool.slice(0, 50);
    }
    return pool;
  }, [questions, selectedExamYear, examLengthPreset]);

  // Start exam
  const handleStartExam = () => {
    const minutes = examLengthPreset === 'rapid50' ? 50 : (selectedExamYear === 1404 ? 200 : selectedExamYear === 1405 ? 180 : 150);
    setSecondsRemaining(minutes * 60);
    setUserAnswers({});
    setCurrentIdx(0);
    setExamStarted(true);
    setExamSubmitted(false);
    setIsTimerPaused(false);
  };

  // Timer countdown
  useEffect(() => {
    if (!examStarted || examSubmitted || isTimerPaused) return;

    const timer = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setExamSubmitted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [examStarted, examSubmitted, isTimerPaused]);

  // Formatter
  const formatTime = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (qId: string, optIdx: number) => {
    if (examSubmitted) return;
    setUserAnswers(prev => ({
      ...prev,
      [qId]: prev[qId] === optIdx ? -1 : optIdx // toggle unselect
    }));
  };

  // Score calculation
  const reportData = useMemo(() => {
    let correct = 0;
    let wrong = 0;
    let unanswered = 0;

    const subjectBreakdown: Record<string, { total: number; correct: number; wrong: number }> = {};

    examQuestions.forEach(q => {
      const chosen = userAnswers[q.id];
      if (!subjectBreakdown[q.category]) {
        subjectBreakdown[q.category] = { total: 0, correct: 0, wrong: 0 };
      }
      subjectBreakdown[q.category].total += 1;

      if (chosen === undefined || chosen === -1) {
        unanswered += 1;
      } else if (chosen === q.correctOption) {
        correct += 1;
        subjectBreakdown[q.category].correct += 1;
      } else {
        wrong += 1;
        subjectBreakdown[q.category].wrong += 1;
      }
    });

    const total = examQuestions.length;
    // Standard Iranian Sanjesh negative score: (Correct*3 - Wrong) / (Total*3) * 100%
    const rawScore = total > 0 ? ((correct * 3 - wrong) / (total * 3)) * 100 : 0;
    const finalScore = Math.max(0, Math.round(rawScore * 10) / 10);

    return {
      total,
      correct,
      wrong,
      unanswered,
      finalScore,
      subjectBreakdown
    };
  }, [examQuestions, userAnswers]);

  // Pre-exam Setup Screen
  if (!examStarted) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-[#8C6B43] to-[#6E4E2C] flex items-center justify-center text-white shadow-xs">
            <Award className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold text-[#2C2117]">شبیه‌ساز رسمی آزمون لیسانس به پزشکی</h2>
          <p className="text-sm text-[#786452] max-w-xl mx-auto">
            محیط شبیه‌سازی شده آزمون با احتساب نمره منفی (-۱/۳)، زمان‌بندی دقیق و صدور آنی کارنامه تحلیلی به تفکیک دروس
          </p>
        </div>

        {/* Setup Card */}
        <div className="bg-[#FFFDF9] rounded-2xl p-6 border border-[#DFD3C0] shadow-xs space-y-6">
          
          {/* Exam Selection */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-[#3B2C1F] block">
              انتخاب دفترچه آزمون:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {[
                { year: 1405, title: 'بانک تألیفی (۱۴۰۵)', count: '۱۵۴ سوال', time: '۱۸۰ دقیقه', desc: 'سؤالات فایل ورد + سؤالات جدید با پاسخ تشریحی' },
                { year: 1404, title: 'دوره ۱۸ (۱۴۰۴)', count: '۲۰۰ سوال', time: '۲۰۰ دقیقه', desc: 'جدیدترین دوره با ۹ درس' },
                { year: 1402, title: 'دوره ۱۶ (۱۴۰۲)', count: '۱۵۰ سوال', time: '۱۵۰ دقیقه', desc: 'آزمون دانشگاه تهران' },
                { year: 1401, title: 'دوره ۱۵ (۱۴۰۱)', count: '۱۵۰ سوال', time: '۱۵۰ دقیقه', desc: 'دفترچه استاندارد سنجش' },
                { year: 1400, title: 'دوره ۱۴ (۱۴۰۰)', count: '۱۵۰ سوال', time: '۱۵۰ دقیقه', desc: 'شبیه‌سازی کامل' }
              ].map(ex => (
                <button
                  key={ex.year}
                  onClick={() => setSelectedExamYear(ex.year)}
                  className={`p-4 rounded-xl border text-right transition-all cursor-pointer ${
                    selectedExamYear === ex.year
                      ? 'bg-[#F6EFE3] border-[#8C6B43] text-[#2C2117] ring-1 ring-[#8C6B43]'
                      : 'bg-[#FAF6EE] border-[#E3D7C5] text-[#5C4A3A] hover:bg-[#F2ECE0]'
                  }`}
                >
                  <div className="font-bold text-sm text-[#2C2117] mb-1">{ex.title}</div>
                  <div className="text-xs text-[#8C6B43] font-semibold">{ex.count} · {ex.time}</div>
                  <div className="text-[11px] text-[#8A7867] mt-1">{ex.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Preset format */}
          <div className="space-y-3 pt-4 border-t border-[#EDE3D4]">
            <label className="text-xs font-bold text-[#3B2C1F] block">
              حالت برگزاری:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => setExamLengthPreset('full')}
                className={`p-3.5 rounded-xl border text-right transition-all cursor-pointer ${
                  examLengthPreset === 'full'
                    ? 'bg-[#F6EFE3] border-[#8C6B43] text-[#2C2117] ring-1 ring-[#8C6B43]'
                    : 'bg-[#FAF6EE] border-[#E3D7C5] text-[#5C4A3A] hover:bg-[#F2ECE0]'
                }`}
              >
                <div className="font-bold text-sm">آزمون کامل (استاندارد زمان‌بندی)</div>
                <div className="text-xs text-[#7A6755] mt-0.5">تمام سوالات دوره انتخابی با زمان قانونی وزارت بهداشت</div>
              </button>

              <button
                onClick={() => setExamLengthPreset('rapid50')}
                className={`p-3.5 rounded-xl border text-right transition-all cursor-pointer ${
                  examLengthPreset === 'rapid50'
                    ? 'bg-[#F6EFE3] border-[#8C6B43] text-[#2C2117] ring-1 ring-[#8C6B43]'
                    : 'bg-[#FAF6EE] border-[#E3D7C5] text-[#5C4A3A] hover:bg-[#F2ECE0]'
                }`}
              >
                <div className="font-bold text-sm">آزمون کوتاه و فشرده (۵۰ سوال سریع)</div>
                <div className="text-xs text-[#7A6755] mt-0.5">۵۰ سوال برگزیده با زمان ۵۰ دقیقه برای دوران جمع‌بندی</div>
              </button>
            </div>
          </div>

          {/* Exam Rules Info */}
          <div className="bg-[#FAF3E5] p-4 rounded-xl border border-[#E3D1B4] text-xs text-[#523E28] space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-[#8C5D23]">
              <AlertCircle className="w-4 h-4 text-[#B87A24]" />
              <span>قوانین شبیه‌ساز:</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-[#665039]">
              <li>آزمون دارای نمره منفی است (هر ۳ پاسخ اشتباه، یک پاسخ درست را حذف می‌کند).</li>
              <li>می‌توانید پاسخ هر سوال را با کلیک مجدد حذف نمایید (نزده بگذارید).</li>
              <li>پس از ثبت نهایی، کارنامه تفکیکی درصد هر درس به همراه بررسی کامل سوالات نمایش داده می‌شود.</li>
            </ul>
          </div>

          {/* Start CTA */}
          <div className="pt-2 flex justify-center">
            <button
              onClick={handleStartExam}
              className="px-8 py-3.5 text-base font-bold text-white bg-[#8C6B43] hover:bg-[#785934] active:bg-[#684C2B] rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              <span>شروع آزمون شبیه‌ساز</span>
              <ArrowLeft className="w-5 h-5" />
            </button>
          </div>

        </div>

      </div>
    );
  }

  // Submitted Report Card View
  if (examSubmitted) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        
        {/* Report Card Header */}
        <div className="bg-[#FFFDF9] rounded-2xl p-6 border border-[#DFD3C0] shadow-sm space-y-6">
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-[#E3D7C5]">
            <div>
              <span className="text-xs text-[#8C6B43] font-bold">کارنامه رسمی آزمون آزمایشی</span>
              <h2 className="text-2xl font-black text-[#2C2117] mt-0.5">
                نتیجه شبیه‌ساز دوره {selectedExamYear}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setExamStarted(false)}
                className="px-4 py-2 text-xs font-semibold bg-[#EFE5D5] hover:bg-[#E5DAC7] text-[#4A3B2D] rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>آزمون جدید</span>
              </button>
            </div>
          </div>

          {/* Scores Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            
            <div className="bg-[#FAF3E5] p-4 rounded-xl border border-[#E3D1B4] text-center">
              <span className="text-xs text-[#7A6755] block mb-1">درصد کل (با نمره منفی):</span>
              <span className="text-3xl font-extrabold text-[#8C5D23] tabular-nums">
                {reportData.finalScore}٪
              </span>
            </div>

            <div className="bg-[#EBF5EC] p-4 rounded-xl border border-[#A8D3B0] text-center">
              <span className="text-xs text-[#206935] block mb-1">پاسخ‌های صحیح:</span>
              <span className="text-3xl font-extrabold text-[#1B572B] tabular-nums">
                {reportData.correct}
              </span>
            </div>

            <div className="bg-[#FDF0EE] p-4 rounded-xl border border-[#E8BFB9] text-center">
              <span className="text-xs text-[#9A382F] block mb-1">پاسخ‌های نادرست:</span>
              <span className="text-3xl font-extrabold text-[#9A382F] tabular-nums">
                {reportData.wrong}
              </span>
            </div>

            <div className="bg-[#F4EFE6] p-4 rounded-xl border border-[#E0D5C3] text-center">
              <span className="text-xs text-[#7A6755] block mb-1">سؤالات بدون پاسخ:</span>
              <span className="text-3xl font-extrabold text-[#4A3B2D] tabular-nums">
                {reportData.unanswered}
              </span>
            </div>

          </div>

          {/* Subject Breakdown Table */}
          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-bold text-[#2D2117] flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#8C6B43]" />
              <span>کارنامه تفکیکی به ازای هر درس:</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-right border-collapse">
                <thead>
                  <tr className="bg-[#F6EFE3] text-[#5C4938] border-b border-[#E3D7C5]">
                    <th className="py-2.5 px-3 font-bold">نام درس</th>
                    <th className="py-2.5 px-3 font-bold text-center">تعداد کل</th>
                    <th className="py-2.5 px-3 font-bold text-center text-[#206935]">صحیح</th>
                    <th className="py-2.5 px-3 font-bold text-center text-[#9A382F]">غلط</th>
                    <th className="py-2.5 px-3 font-bold text-center">درصد مکتسبه</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EDE3D4]">
                  {Object.entries(reportData.subjectBreakdown).map(([sub, stats]) => {
                    const subPercent = stats.total > 0
                      ? Math.max(0, Math.round(((stats.correct * 3 - stats.wrong) / (stats.total * 3)) * 100))
                      : 0;
                    return (
                      <tr key={sub} className="hover:bg-[#FAF6EE]">
                        <td className="py-2.5 px-3 font-semibold text-[#2C2117]">{sub}</td>
                        <td className="py-2.5 px-3 text-center tabular-nums">{stats.total}</td>
                        <td className="py-2.5 px-3 text-center text-[#206935] font-bold tabular-nums">{stats.correct}</td>
                        <td className="py-2.5 px-3 text-center text-[#9A382F] font-bold tabular-nums">{stats.wrong}</td>
                        <td className="py-2.5 px-3 text-center">
                          <span className={`px-2 py-0.5 rounded font-bold tabular-nums ${
                            subPercent >= 60
                              ? 'bg-[#E2F0E5] text-[#1D5E2F]'
                              : subPercent >= 40
                              ? 'bg-[#FAF0DC] text-[#8C5D23]'
                              : 'bg-[#FCE6E3] text-[#9A382F]'
                          }`}>
                            {subPercent}٪
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Question-by-Question Review */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-[#2D2117]">مرور تشریحی پاسخ‌های آزمون:</h3>
          {examQuestions.map((q, idx) => {
            const chosen = userAnswers[q.id];
            const isCorrect = chosen === q.correctOption;
            const isSkipped = chosen === undefined || chosen === -1;

            return (
              <div
                key={`examrev-${q.id}-${idx}`}
                className={`bg-[#FFFDF9] rounded-2xl border p-5 space-y-3 ${
                  isCorrect
                    ? 'border-[#B8D8BC]'
                    : isSkipped
                    ? 'border-[#DFD3C0]'
                    : 'border-[#E8BDB7]'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#8C6B43]">سوال {idx + 1} ({q.category})</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-[#7A6755]">{q.examName}</span>
                  </div>

                  <div>
                    {isCorrect && (
                      <span className="px-2 py-0.5 rounded-md bg-[#DCF0DE] text-[#206935] font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>پاسخ صحیح</span>
                      </span>
                    )}
                    {!isCorrect && !isSkipped && (
                      <span className="px-2 py-0.5 rounded-md bg-[#FCE6E3] text-[#9A382F] font-bold flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>پاسخ نادرست</span>
                      </span>
                    )}
                    {isSkipped && (
                      <span className="px-2 py-0.5 rounded-md bg-[#F2ECE1] text-[#7A6755] font-semibold">
                        پاسخ نداده
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-sm font-bold text-[#2C2117] leading-relaxed">
                  {q.question}
                </div>

                {/* 4 Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {q.options.map((opt, oIdx) => {
                    const letters = ['الف', 'ب', 'ج', 'د'];
                    const isOptionCorrect = oIdx === q.correctOption;
                    const isUserChoice = oIdx === chosen;

                    let style = 'bg-[#FAF6EE] border-[#E3D7C5] text-[#4A3B2D]';
                    if (isOptionCorrect) {
                      style = 'bg-[#EBF5EC] border-[#A8D3B0] text-[#1B572B] font-bold ring-1 ring-[#34884B]/20';
                    } else if (isUserChoice && !isOptionCorrect) {
                      style = 'bg-[#FDF0EE] border-[#E8BFB9] text-[#9A382F] font-semibold line-through';
                    }

                    return (
                      <div key={oIdx} className={`p-2.5 rounded-xl border flex items-center gap-2 ${style}`}>
                        <span className="w-5 h-5 rounded bg-black/5 flex items-center justify-center font-bold text-[11px] shrink-0">
                          {letters[oIdx]}
                        </span>
                        <span className="flex-1">{opt}</span>
                        {isOptionCorrect && <CheckCircle2 className="w-3.5 h-3.5 text-[#206935] shrink-0" />}
                      </div>
                    );
                  })}
                </div>

                {/* Note */}
                <div className="bg-[#FAF3E5] p-3 rounded-xl border border-[#E3D1B4] text-xs text-[#523E28]">
                  <strong>نکته طلایی:</strong> {q.highYieldTip}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    );
  }

  // Active Exam View
  const currentQ = examQuestions[currentIdx];
  const chosenOpt = userAnswers[currentQ?.id];

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
      
      {/* Top Floating Bar: Timer & Actions */}
      <div className="bg-[#FFFDF9] rounded-2xl p-3 sm:p-4 border-2 border-[#DFD3C0] shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        
        {/* Left: Progress */}
        <div className="flex items-center justify-between sm:justify-start gap-2 text-xs">
          <span className="font-extrabold text-[#2C2117]">سوال {currentIdx + 1} از {examQuestions.length}</span>
          <span className="text-[#8C6B43] hidden sm:inline" aria-hidden="true">·</span>
          <span className="text-[#7A6755] bg-[#FAF3E5] px-2 py-0.5 rounded-md border border-[#E3D1B4] sm:bg-transparent sm:p-0 sm:border-0">{currentQ?.category}</span>
        </div>

        {/* Center: Timer */}
        <div className={`flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-xl border font-mono font-bold text-sm tabular-nums self-center sm:self-auto ${
          secondsRemaining < 600
            ? 'bg-[#FCE6E3] border-[#E8BFB9] text-[#9A382F] animate-pulse'
            : 'bg-[#F6EFE3] border-[#E3D7C5] text-[#2C2117]'
        }`}>
          <Clock className="w-4 h-4 text-[#8C6B43]" />
          <span>{formatTime(secondsRemaining)}</span>
        </div>

        {/* Right: Submit Button */}
        <div className="flex items-center justify-end">
          <button
            onClick={() => {
              if (window.confirm('آیا برای پایان آزمون و مشاهده کارنامه تحلیلی مطمئن هستید؟')) {
                setExamSubmitted(true);
              }
            }}
            className="w-full sm:w-auto px-4 py-2 text-xs font-bold text-white bg-[#8C6B43] hover:bg-[#785934] active:bg-[#684C2B] rounded-xl shadow-xs transition-colors cursor-pointer text-center"
          >
            اتمام آزمون و صدور کارنامه
          </button>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
        
        {/* Main Question Box */}
        <div className="lg:col-span-8 bg-[#FFFDF9] rounded-2xl border-2 border-[#DFD3C0] p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 shadow-xs">
          
          <div className="flex items-center justify-between text-xs text-[#7A6755] pb-2 border-b border-[#EDE3D4]">
            <span className="font-semibold text-[#8C6B43]">{currentQ?.category}</span>
            <span>دوره {currentQ?.year} · سوال {currentQ?.number}</span>
          </div>

          <div className="text-base sm:text-lg font-bold text-[#2C2117] leading-relaxed">
            {currentQ?.question}
          </div>

          {/* Options */}
          <div className="space-y-3">
            {currentQ?.options.map((opt, oIdx) => {
              const letters = ['الف', 'ب', 'ج', 'د'];
              const isSelected = chosenOpt === oIdx;

              return (
                <button
                  key={oIdx}
                  onClick={() => handleSelectOption(currentQ.id, oIdx)}
                  className={`w-full text-right p-4 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${
                    isSelected
                      ? 'bg-[#F4ECE0] border-[#8C6B43] text-[#2C2117] ring-1 ring-[#8C6B43] font-bold'
                      : 'bg-[#FAF6EE] border-[#DFD3C0] text-[#3D2F23] hover:bg-[#F3EBE0]'
                  }`}
                >
                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                    isSelected ? 'bg-[#8C6B43] text-white' : 'bg-[#E8DDCE] text-[#4F3E2F]'
                  }`}>
                    {letters[oIdx]}
                  </span>
                  <span className="text-sm sm:text-base leading-relaxed flex-1 pt-0.5">{opt}</span>
                </button>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-[#EDE3D4]">
            <button
              onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
              disabled={currentIdx === 0}
              className="px-4 py-2 text-xs font-semibold bg-[#EDE4D4] hover:bg-[#E5DAC7] disabled:opacity-40 disabled:pointer-events-none rounded-xl text-[#4A3B2D] transition-colors flex items-center gap-1 cursor-pointer"
            >
              <ArrowRight className="w-4 h-4" />
              <span>سوال قبلی</span>
            </button>

            <button
              onClick={() => setCurrentIdx(prev => Math.min(examQuestions.length - 1, prev + 1))}
              disabled={currentIdx === examQuestions.length - 1}
              className="px-5 py-2 text-xs font-bold text-white bg-[#8C6B43] hover:bg-[#785934] disabled:opacity-40 disabled:pointer-events-none rounded-xl transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
            >
              <span>سوال بعدی</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Side Bubble Sheet (پاسخ‌برگ استاندارد) */}
        <div className="lg:col-span-4 bg-[#FFFDF9] rounded-2xl border border-[#DFD3C0] p-4 sm:p-5 space-y-4 shadow-xs flex flex-col max-h-[600px]">
          
          <div className="flex items-center justify-between pb-2 border-b border-[#EDE3D4]">
            <div className="text-xs font-bold text-[#2C2117] flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-[#8C6B43]" />
              <span>پاسخ‌برگ الکترونیکی</span>
            </div>
            <span className="text-[11px] text-[#7A6755] tabular-nums">
              {Object.values(userAnswers).filter(x => x !== undefined && x !== -1).length} از {examQuestions.length} پاسخ داده شده
            </span>
          </div>

          <div className="grid grid-cols-5 gap-1.5 overflow-y-auto flex-1 pr-1 pl-1">
            {examQuestions.map((q, idx) => {
              const ans = userAnswers[q.id];
              const isAnswered = ans !== undefined && ans !== -1;
              const isCurrent = idx === currentIdx;

              return (
                <button
                  key={`bubble-${q.id}-${idx}`}
                  onClick={() => setCurrentIdx(idx)}
                  className={`py-1.5 px-1 rounded text-center text-xs font-bold transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-[#8C6B43] text-white ring-2 ring-[#4A3B2C]'
                      : isAnswered
                      ? 'bg-[#E3EFE4] text-[#1D5E2F] border border-[#BBD7BF]'
                      : 'bg-[#F6EFE3] text-[#695645] hover:bg-[#EAE0CF]'
                  }`}
                >
                  <span className="tabular-nums">{idx + 1}</span>
                  {isAnswered && (
                    <span className="block text-[9px] font-normal opacity-90">
                      {['الف', 'ب', 'ج', 'د'][ans]}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-[#EDE3D4] flex items-center justify-between text-[11px] text-[#7A6755]">
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-[#E3EFE4] border border-[#BBD7BF] inline-block" />
              <span>پاسخ‌داده</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-[#F6EFE3] inline-block" />
              <span>سفید</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-[#8C6B43] inline-block" />
              <span>فعلی</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
