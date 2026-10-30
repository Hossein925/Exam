/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header, AppTab } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { RapidCramMode } from './components/RapidCramMode';
import { QuestionBankView } from './components/QuestionBankView';
import { MockExamMode } from './components/MockExamMode';
import { LeitnerMode } from './components/LeitnerMode';
import { PdfViewerModal } from './components/PdfViewerModal';
import { HelpGuideModal } from './components/HelpGuideModal';
import { questionsData } from './data/questionsData';
import { examsData } from './data/examsData';
import { useStudyState } from './hooks/useStudyState';
import { Calendar, Clock, Sparkles } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<AppTab>('cram');
  const [helpOpen, setHelpOpen] = useState(false);
  const [selectedPdfPath, setSelectedPdfPath] = useState<string | null>(null);

  // Live Persian clock & date
  const [currentDate, setCurrentDate] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatPersianDate = (d: Date) => {
    try {
      const weekday = new Intl.DateTimeFormat('fa-IR', { weekday: 'long' }).format(d);
      const day = new Intl.DateTimeFormat('fa-IR', { day: 'numeric' }).format(d);
      const month = new Intl.DateTimeFormat('fa-IR', { month: 'long' }).format(d);
      const year = new Intl.DateTimeFormat('fa-IR', { year: 'numeric' }).format(d);
      return `${weekday}، ${day} ${month} ${year}`;
    } catch {
      return '';
    }
  };

  const formatPersianTime = (d: Date) => {
    try {
      return new Intl.DateTimeFormat('fa-IR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }).format(d);
    } catch {
      return '';
    }
  };

  const {
    state,
    toggleBookmark,
    markMastered,
    markReviewNeeded,
    setRemainingDays,
    setDailyGoal
  } = useStudyState();

  const handleOpenPdf = (pdfPath: string) => {
    setSelectedPdfPath(pdfPath);
    setCurrentTab('pdf');
  };

  return (
    <div className="min-h-screen bg-[#F8F5EE] text-[#2C231B] flex flex-col font-sans selection:bg-[#DECDB7] selection:text-[#2C231B]">
      
      {/* Top Header with Uploaded DNA Icon & Distinct Tabs */}
      <Header
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        masteredCount={state.mastered.length}
        totalQuestions={questionsData.length}
        onOpenHelp={() => setHelpOpen(true)}
      />

      {/* Hero and Countdown Planner Section */}
      <HeroSection
        onStartCram={() => setCurrentTab('cram')}
        onSelectTab={setCurrentTab}
        totalQuestions={questionsData.length}
        masteredCount={state.mastered.length}
        remainingDays={state.examRemainingDays}
        onSetRemainingDays={setRemainingDays}
        dailyGoal={state.dailyGoal}
        onSetDailyGoal={setDailyGoal}
        todayStudied={state.todayStudiedCount}
      />

      {/* Main Study Workspace Area */}
      <main className="flex-1 pb-8">
        {currentTab === 'cram' && (
          <RapidCramMode
            questions={questionsData}
            bookmarks={state.bookmarks}
            mastered={state.mastered}
            reviewNeeded={state.reviewNeeded}
            onToggleBookmark={toggleBookmark}
            onMarkMastered={markMastered}
            onMarkReviewNeeded={markReviewNeeded}
            onOpenPdf={handleOpenPdf}
          />
        )}

        {currentTab === 'bank' && (
          <QuestionBankView
            questions={questionsData}
            bookmarks={state.bookmarks}
            mastered={state.mastered}
            reviewNeeded={state.reviewNeeded}
            onToggleBookmark={toggleBookmark}
            onMarkMastered={markMastered}
            onMarkReviewNeeded={markReviewNeeded}
            onOpenPdf={handleOpenPdf}
          />
        )}

        {currentTab === 'mock' && (
          <MockExamMode
            questions={questionsData}
            exams={examsData}
            onOpenPdf={handleOpenPdf}
          />
        )}

        {currentTab === 'leitner' && (
          <LeitnerMode
            questions={questionsData}
            leitnerBoxes={state.leitnerBoxes}
            bookmarks={state.bookmarks}
            onMarkMastered={markMastered}
            onMarkReviewNeeded={markReviewNeeded}
            onToggleBookmark={toggleBookmark}
            onOpenPdf={handleOpenPdf}
          />
        )}

        {currentTab === 'pdf' && (
          <PdfViewerModal
            exams={examsData}
            currentPdfPath={selectedPdfPath}
            onClose={() => setCurrentTab('cram')}
            onSelectPdf={setSelectedPdfPath}
          />
        )}
      </main>

      {/* Help & Add-to-device Guide Modal */}
      <HelpGuideModal
        isOpen={helpOpen}
        onClose={() => setHelpOpen(false)}
      />

      {/* Footer with Live Date & Clock and Author Attribution */}
      <footer className="mt-8 bg-[#F4EFE5] border-t-2 border-[#D8C9B3] py-5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Author attribution (Notice: app title removed as requested) */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg overflow-hidden border border-[#8C6B43]/30 bg-white shadow-xs shrink-0">
              <img
                src="/assets/aistudio/image_b8a02c98.png"
                alt="لوگوی برنامه"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-xs sm:text-sm font-bold text-[#8C6B43]">
              تهیه و تنظیم: حسین نصاری
            </div>
          </div>

          {/* Aesthetic Live Persian Calendar & Clock Widget */}
          <div className="flex items-center gap-3 bg-[#FFFDF9] px-4 py-2 rounded-2xl border-2 border-[#DFD3C0] shadow-xs">
            
            {/* Live Date */}
            <div className="flex items-center gap-2 text-[#6D5947]">
              <Calendar className="w-4 h-4 text-[#8C6B43]" />
              <span className="font-bold text-xs sm:text-sm text-[#2C2117] whitespace-nowrap">
                {formatPersianDate(currentDate)}
              </span>
            </div>

            <span className="text-[#C5B7A4] font-light" aria-hidden="true">|</span>

            {/* Live Ticking Time */}
            <div className="flex items-center gap-2 text-[#6D5947]">
              <Clock className="w-4 h-4 text-[#8C6B43]" />
              <span className="font-extrabold text-xs sm:text-sm text-[#2C2117] tabular-nums font-mono tracking-wider whitespace-nowrap">
                {formatPersianTime(currentDate)}
              </span>
            </div>

          </div>

        </div>
      </footer>

    </div>
  );
}
