import React from 'react';
import { ViewType } from '../types';
import { APP_ASSETS } from '../data/mockData';

interface HeaderProps {
  currentView: ViewType;
  title: string;
  subtitle?: string;
  onBack?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  onBack,
}) => {
  const showBack = Boolean(onBack);

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-50 pt-safe bg-[#fff8f6]/90 backdrop-blur-xl shadow-[0_4px_20px_-2px_rgba(45,34,30,0.05)] border-b border-[#f2ded8]/40">
      <div className="max-w-lg mx-auto h-16 px-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {showBack ? (
            <button
              onClick={onBack}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full bg-[#fff1ec] text-[#241915] transition-transform active:scale-90 hover:bg-[#feeae3]"
              aria-label="ย้อนกลับ"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back_ios_new</span>
            </button>
          ) : (
            <img
              alt="Cook & Co Chef Logo"
              className="h-8 w-auto object-contain shrink-0"
              src={APP_ASSETS.logo}
            />
          )}

          {showBack && (
            <img
              alt="Cook & Co Chef Logo"
              className="h-7 w-auto object-contain shrink-0 hidden sm:block"
              src={APP_ASSETS.logo}
            />
          )}

          <div className="flex flex-col min-w-0">
            <h1 className="font-bold text-[17px] text-[#241915] truncate max-w-[220px] leading-tight">
              {title}
            </h1>
            {subtitle && (
              <span className="text-[11px] text-[#ae3115] font-bold leading-none">
                {subtitle}
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
