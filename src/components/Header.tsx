import React from 'react';
import {
  Zap, BookOpen, Award, Layers, FileText, HelpCircle,
  CheckCircle2
} from 'lucide-react';

export type AppTab = 'cram' | 'bank' | 'mock' | 'leitner' | 'pdf';

interface HeaderProps {
  currentTab: AppTab;
  onSelectTab: (tab: AppTab) => void;
  masteredCount: number;
  totalQuestions: number;
  onOpenHelp: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  masteredCount,
  totalQuestions,
  onOpenHelp
}) => {
  const navTabs: { id: AppTab; label: string; icon: React.ReactNode }[] = [
    { id: 'cram', label: 'مرور سریع', icon: <Zap className="w-4 h-4 shrink-0" /> },
    { id: 'bank', label: 'بانک موضوعی', icon: <BookOpen className="w-4 h-4 shrink-0" /> },
    { id: 'mock', label: 'شبیه‌ساز آزمون', icon: <Award className="w-4 h-4 shrink-0" /> },
    { id: 'leitner', label: 'جعبه لایتنر', icon: <Layers className="w-4 h-4 shrink-0" /> },
    { id: 'pdf', label: 'دفترچه‌های PDF', icon: <FileText className="w-4 h-4 shrink-0" /> }
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#F4EFE5]/98 backdrop-blur-md border-b-2 border-[#D8C9B3] shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        
        {/* Top Header Row */}
        <div className="py-2.5 sm:py-3 flex items-center justify-between gap-2">
          
          {/* Brand Logo & Title with User's Uploaded DNA Icon */}
          <div
            onClick={() => onSelectTab('cram')}
            className="flex items-center gap-2.5 cursor-pointer select-none"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden border-2 border-[#8C6B43]/30 shadow-xs bg-white flex items-center justify-center shrink-0">
              <img
                src="/assets/aistudio/image_b8a02c98.png"
                alt="لوگوی آزمون لیسانس به پزشکی"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-black tracking-tight text-[#2D2117] whitespace-nowrap leading-tight">
                مدیکال‌پلاس
              </span>
              <span className="text-[10px] sm:text-[11px] text-[#7A6451] font-bold whitespace-nowrap">
                آزمون لیسانس به پزشکی
              </span>
            </div>
          </div>

          {/* Desktop Nav Tabs (lg and above) */}
          <nav className="hidden lg:flex items-center gap-1.5 p-1 bg-[#EAE1D3] rounded-xl border border-[#D5C6B0]">
            {navTabs.map(tab => {
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onSelectTab(tab.id)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-[#8C6B43] text-white shadow-xs ring-1 ring-[#73532F]'
                      : 'text-[#5C4937] hover:text-[#2B1F14] hover:bg-[#DFD3C0]'
                  }`}
                >
                  <span className={isActive ? 'text-white' : 'text-[#8C6B43]'}>
                    {tab.icon}
                  </span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Quick Actions & Help Button */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#5C4937] bg-[#EFE7D8] px-2.5 py-1.5 rounded-lg border border-[#DACDBA] font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#26683B]" />
              <span>تسلط:</span>
              <span className="text-[#2C2117] tabular-nums font-mono">
                {masteredCount} / {totalQuestions}
              </span>
            </div>


            <button
              onClick={onOpenHelp}
              className="px-2.5 sm:px-3 py-1.5 sm:py-2 text-[#5C4937] hover:text-[#2C2117] bg-[#EAE0D0] hover:bg-[#DFD3C0] border border-[#D5C6B0] rounded-xl transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold"
              title="راهنمای آزمون و نحوه نصب روی دستگاه"
            >
              <HelpCircle className="w-4 h-4 text-[#8C6B43] shrink-0" />
              <span className="hidden xs:inline">راهنما و نصب</span>
            </button>
          </div>

        </div>

        {/* Mobile / Tablet Tabs Row (Visible on screens below lg) */}
        {/* Prominent, distinct buttons with generous touch target and full visibility */}
        <div className="lg:hidden pb-2.5 pt-1 border-t border-[#DFD3C0]/80">
          <div className="grid grid-cols-5 gap-1 sm:gap-1.5">
            {navTabs.map(tab => {
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onSelectTab(tab.id)}
                  className={`py-2 px-1 rounded-xl text-[11px] sm:text-xs font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1 text-center cursor-pointer min-h-[44px] ${
                    isActive
                      ? 'bg-[#8C6B43] text-white shadow-sm ring-1 ring-[#73532F] font-black'
                      : 'bg-[#EAE0D0] text-[#524131] hover:bg-[#DFD3C0] border border-[#D5C6B0]'
                  }`}
                >
                  <span className={isActive ? 'text-white' : 'text-[#8C6B43]'}>
                    {tab.icon}
                  </span>
                  <span className="truncate w-full">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </header>
  );
};
