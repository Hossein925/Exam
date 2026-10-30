import React from 'react';
import {
  X, Sparkles, BookOpen, Clock, AlertCircle, CheckCircle2,
  Smartphone, Monitor, Apple, Check, ShieldCheck, Heart
} from 'lucide-react';

interface HelpGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpGuideModal: React.FC<HelpGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-[#FFFDF9] w-full max-w-2xl rounded-2xl border-2 border-[#D8C9B3] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header with App Icon */}
        <div className="bg-[#F6EFE3] px-5 py-4 border-b border-[#E3D7C5] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl overflow-hidden border border-[#8C6B43]/30 bg-white shadow-xs">
              <img
                src="/assets/aistudio/image_b8a02c98.png"
                alt="لوگوی برنامه"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-[#2C2117]">
                راهنمای جامع آزمون و افزودن برنامه به دستگاه
              </h3>
              <span className="text-[11px] text-[#786452]">نکات طلایی جمع‌بندی + آموزش نصب PWA</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#7A6755] hover:text-[#2C2117] hover:bg-[#EFE5D5] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-xs sm:text-sm text-[#4D3C2C] leading-relaxed">
          
          {/* Section 1: Rapid Cram Strategy */}
          <div className="bg-[#FAF3E5] p-4 rounded-xl border border-[#E3D1B4] space-y-2">
            <div className="font-bold text-[#8C5D23] flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>استراتژی اولویت‌بندی در فرصت اندک باقی‌مانده:</span>
            </div>
            <p className="text-[#59442E]">
              اگر کمتر از ۳۰ روز تا آزمون فرصت دارید، خواندن کتب مرجع قطور را کنار بگذارید و تمرکز ۱۰۰٪ خود را بر حل، تحلیل و تثبیت تست‌های سال‌های ۹۷ تا ۱۴۰۴ متمرکز کنید. بیش از ۶۵٪ مباحث و الگوهای تستی به شکل چرخشی در آزمون‌های وزارت بهداشت تکرار می‌شوند.
            </p>
          </div>

          {/* Section 2: Subject Breakdown */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-[#2C2117] flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#8C6B43]" />
              <span>بودجه‌بندی دروس پرتکرار در آزمون لیسانس به پزشکی (دوره ۱۸):</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              <div className="bg-[#FAF5EC] p-2.5 rounded-xl border border-[#E2D5C3]">
                <strong className="block text-[#2C2117]">علوم تشریح (آناتومی):</strong>
                <span className="text-[#8C6B43] font-bold">۵۰ سوال</span>
              </div>
              <div className="bg-[#FAF5EC] p-2.5 rounded-xl border border-[#E2D5C3]">
                <strong className="block text-[#2C2117]">فیزیولوژی پزشکی:</strong>
                <span className="text-[#8C6B43] font-bold">۳۵ سوال</span>
              </div>
              <div className="bg-[#FAF5EC] p-2.5 rounded-xl border border-[#E2D5C3]">
                <strong className="block text-[#2C2117]">بیوشیمی بالینی:</strong>
                <span className="text-[#8C6B43] font-bold">۲۰ سوال</span>
              </div>
              <div className="bg-[#FAF5EC] p-2.5 rounded-xl border border-[#E2D5C3]">
                <strong className="block text-[#2C2117]">تفکر نقاد و استدلال:</strong>
                <span className="text-[#8C6B43] font-bold">۲۰ سوال</span>
              </div>
              <div className="bg-[#FAF5EC] p-2.5 rounded-xl border border-[#E2D5C3]">
                <strong className="block text-[#2C2117]">باکتری و ویروس‌شناسی:</strong>
                <span className="text-[#8C6B43] font-bold">۲۰ سوال</span>
              </div>
              <div className="bg-[#FAF5EC] p-2.5 rounded-xl border border-[#E2D5C3]">
                <strong className="block text-[#2C2117]">اصول خدمات سلامت:</strong>
                <span className="text-[#8C6B43] font-bold">۲۰ سوال</span>
              </div>
            </div>
          </div>

          {/* Section 3: Study Recommendations */}
          <div className="space-y-2">
            <h4 className="font-bold text-[#2C2117] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#206935]" />
              <span>نحوه بهره‌برداری حداکثری از امکانات سامانه:</span>
            </h4>
            <ul className="list-disc list-inside space-y-1.5 text-[#5C4A3A]">
              <li><strong>حالت مرور سریع (Flash Cram):</strong> سوال و گزینه صحیح را بلافاصله ببینید، نکته طلایی را بخوانید و با زدن دکمه «مسلط شدم» به تست بعدی بروید.</li>
              <li><strong>جعبه لایتنر ۵ مرحله‌ای:</strong> سوالاتی که در پاسخ به آنها شک دارید را نشانه‌گذاری کنید تا بر اساس فواصل زمانی مشخص در صف تمرین قرار گیرند.</li>
              <li><strong>مدیریت نمره منفی:</strong> در بخش شبیه‌ساز آزمون، نمره منفی (-۱/۳) اعمال می‌شود؛ تست‌هایی که نسبت به آن‌ها هیچ آگاهی ندارید را سفید رها کنید.</li>
            </ul>
          </div>

          {/* Section 4: ADDING APP TO DIFFERENT DEVICES (User Requirement) */}
          <div className="pt-4 border-t-2 border-[#E3D7C5] space-y-4">
            
            <div className="bg-[#F4ECE0] p-3.5 rounded-xl border border-[#DECDB7] flex items-center gap-2.5">
              <Smartphone className="w-5 h-5 text-[#8C6B43] shrink-0" />
              <div>
                <h4 className="font-extrabold text-[#2C2117] text-sm">
                  نحوه افزودن و نصب برنامه روی دستگاه‌های مختلف (Add to Home Screen)
                </h4>
                <p className="text-[11px] text-[#786452]">
                  بدون نیاز به نصب از بازار یا گوگل‌پلی؛ برنامه را مستقیماً روی صفحه گوشی یا کامپیوتر خود نصب کنید
                </p>
              </div>
            </div>

            <div className="space-y-3">
              
              {/* Android Guide */}
              <div className="bg-[#FAF6EE] p-3.5 rounded-xl border border-[#E2D5C3] space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-[#2D2117]">
                  <Smartphone className="w-4 h-4 text-[#34A853]" />
                  <span>برای گوشی‌های اندروید (Android - سامسونگ، شیائومی و...):</span>
                </div>
                <p className="text-xs text-[#5C4A3A] leading-relaxed pr-6">
                  ۱. در مرورگر <strong>Google Chrome</strong>، روی آیکون <strong>سه نقطه (⋮)</strong> در گوشه بالا کلیک کنید.<br />
                  ۲. گزینه <strong>«افزودن به صفحه اصلی» (Add to Home screen)</strong> یا <strong>«نصب برنامه» (Install app)</strong> را انتخاب کنید.<br />
                  ۳. نام برنامه را تایید کنید تا آیکون آن فوراً روی صفحه اصلی گوشی شما مانند یک اپلیکیشن واقعی قرار گیرد.
                </p>
              </div>

              {/* iOS Guide */}
              <div className="bg-[#FAF6EE] p-3.5 rounded-xl border border-[#E2D5C3] space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-[#2D2117]">
                  <Apple className="w-4 h-4 text-[#555555]" />
                  <span>برای گوشی‌های آیفون و آیپد (iOS / Safari):</span>
                </div>
                <p className="text-xs text-[#5C4A3A] leading-relaxed pr-6">
                  ۱. برنامه را حتماً در مرورگر <strong>Safari</strong> باز کنید.<br />
                  ۲. در نوار پایین صفحه، دکمه <strong>اشتراک‌گذاری (Share - آیکون مربع با فلش رو به بالا ⎋)</strong> را لمس کنید.<br />
                  ۳. در منوی باز شده به پایین اسکرول کرده و گزینه <strong>«Add to Home Screen» (افزودن به صفحه اصلی)</strong> را انتخاب کنید.<br />
                  ۴. در گوشه بالا دکمه <strong>Add</strong> را بزنید. برنامه با آیکون اختصاصی روی صفحه آیفون شما ست می‌شود.
                </p>
              </div>

              {/* Desktop Windows/Mac Guide */}
              <div className="bg-[#FAF6EE] p-3.5 rounded-xl border border-[#E2D5C3] space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-[#2D2117]">
                  <Monitor className="w-4 h-4 text-[#0078D4]" />
                  <span>برای کامپیوتر و لپ‌تاپ (Windows و macOS):</span>
                </div>
                <p className="text-xs text-[#5C4A3A] leading-relaxed pr-6">
                  در مرورگر <strong>Chrome</strong> یا <strong>Edge</strong>، در سمت راست نوار آدرس، روی آیکون <strong>نصب برنامه (Install App یا علامت کامپیوتر کوچک)</strong> کلیک کنید تا برنامه در یک پنجره مستقل و بدون حاشیه مرورگر اجرا شود.
                </p>
              </div>

            </div>

            {/* AUTHOR / EDITOR SIGNATURE (Mandatory User Requirement) */}
            <div className="mt-4 pt-4 border-t border-[#DFD3C0] flex items-center justify-center">
              <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#F5ECE0] via-[#EFE4D3] to-[#F5ECE0] border border-[#D5C4AC] shadow-xs text-center">
                <span className="w-2 h-2 rounded-full bg-[#8C6B43] animate-pulse" />
                <span className="text-sm font-extrabold text-[#2C2117] tracking-wide">
                  تهیه و تنظیم: حسین نصاری
                </span>
                <span className="w-2 h-2 rounded-full bg-[#8C6B43] animate-pulse" />
              </div>
            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="bg-[#F6EFE3] px-6 py-3 border-t border-[#E3D7C5] flex items-center justify-between">
          <span className="text-xs font-semibold text-[#7A6755]">
            مدیکال‌پلاس · همراه داوطلبان لیسانس به پزشکی
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-white bg-[#8C6B43] hover:bg-[#785934] rounded-xl transition-colors cursor-pointer"
          >
            بستن راهنما
          </button>
        </div>

      </div>
    </div>
  );
};
