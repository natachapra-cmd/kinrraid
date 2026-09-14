import React from 'react';
import { ViewType } from '../types';

interface BottomNavProps {
  currentView: ViewType;
  onChangeView: (view: ViewType) => void;
  savedCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentView,
  onChangeView,
  savedCount = 0,
}) => {
  // Hide bottom nav when in cooking mode or recipe detail to maximize cooking canvas space
  if (currentView === 'cooking' || currentView === 'detail') {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 w-full z-50 pb-safe pointer-events-none">
      <div className="max-w-md mx-auto px-4 pb-3">
        <div className="pointer-events-auto bg-white/95 backdrop-blur-xl rounded-full shadow-[0_12px_36px_-6px_rgba(45,34,30,0.14),0_2px_10px_rgba(0,0,0,0.04)] p-1.5 flex items-center justify-around border border-[#f2ded8]/60">
          <button
            onClick={() => onChangeView('fridge')}
            className={`flex-1 min-h-[44px] py-1.5 px-2 rounded-full flex flex-col items-center justify-center gap-0.5 transition-all active:scale-95 ${
              currentView === 'fridge'
                ? 'bg-[#ff6b4a] text-white shadow-[0_4px_16px_-2px_rgba(255,107,74,0.4)]'
                : 'text-[#59413c] hover:text-[#ae3115]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">kitchen</span>
            <span className="text-[11px] font-bold leading-tight">วัตถุดิบ</span>
          </button>

          <button
            onClick={() => onChangeView('discover')}
            className={`flex-1 min-h-[44px] py-1.5 px-2 rounded-full flex flex-col items-center justify-center gap-0.5 transition-all active:scale-95 cursor-pointer ${
              currentView === 'discover'
                ? 'bg-[#ff6b4a] text-white shadow-[0_4px_16px_-2px_rgba(255,107,74,0.4)]'
                : 'text-[#59413c] hover:text-[#ae3115]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
            <span className="text-[11px] font-bold leading-tight">เมนูแนะนำ</span>
          </button>

          <button
            onClick={() => onChangeView('cooking')}
            className={`flex-1 min-h-[44px] py-1.5 px-2 rounded-full flex flex-col items-center justify-center gap-0.5 transition-all active:scale-95 cursor-pointer ${
              currentView === 'cooking'
                ? 'bg-[#ff6b4a] text-white shadow-[0_4px_16px_-2px_rgba(255,107,74,0.4)]'
                : 'text-[#59413c] hover:text-[#ae3115]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">skillet</span>
            <span className="text-[11px] font-bold leading-tight">โหมดทำอาหาร</span>
          </button>

          <button
            onClick={() => onChangeView('saved')}
            className={`relative flex-1 min-h-[44px] py-1.5 px-2 rounded-full flex flex-col items-center justify-center gap-0.5 transition-all active:scale-95 ${
              currentView === 'saved'
                ? 'bg-[#ff6b4a] text-white shadow-[0_4px_16px_-2px_rgba(255,107,74,0.4)]'
                : 'text-[#59413c] hover:text-[#ae3115]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">bookmark_heart</span>
            <span className="text-[11px] font-bold leading-tight">สูตรของฉัน</span>
            {savedCount > 0 && (
              <span className="absolute top-1 right-3 w-4 h-4 bg-[#ae3115] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {savedCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};
