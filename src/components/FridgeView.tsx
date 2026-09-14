import React, { useState, useMemo } from 'react';
import { Ingredient, Recipe } from '../types';

interface FridgeViewProps {
  ingredients: Ingredient[];
  selectedIds: string[];
  recipes?: Recipe[];
  onToggleIngredient: (id: string) => void;
  onClearAll: () => void;
  onQuickRandom: () => void;
  onFindRecipes: () => void;
}

export const FridgeView: React.FC<FridgeViewProps> = ({
  ingredients,
  selectedIds,
  recipes,
  onToggleIngredient,
  onClearAll,
  onQuickRandom,
  onFindRecipes,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Selected ingredients objects
  const selectedIngredients = useMemo(() => {
    return ingredients.filter((item) => selectedIds.includes(item.id));
  }, [ingredients, selectedIds]);

  // Matching recipe count calculation
  const matchCount = useMemo(() => {
    if (selectedIds.length === 0) return 0;
    if (!recipes || recipes.length === 0) {
      return 18;
    }
    const matched = recipes.filter((r) => {
      if (!r.coreIngredientIds || r.coreIngredientIds.length === 0) return true;
      return r.coreIngredientIds.some((id) => selectedIds.includes(id));
    });
    return Math.max(matched.length, 1);
  }, [selectedIds, recipes]);

  // Group and filter by category
  const categories = [
    { key: 'meat', title: '🥩 เนื้อสัตว์และโปรตีน' },
    { key: 'veg', title: '🥬 ผักสด & สมุนไพร' },
    { key: 'carb', title: '🌾 แป้งและคาร์บ' },
    { key: 'sauce', title: '🧈 เครื่องปรุง & ซอส' },
  ] as const;

  const filteredIngredients = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return ingredients;
    return ingredients.filter((item) => item.name.toLowerCase().includes(q));
  }, [ingredients, searchQuery]);

  return (
    <div className="flex flex-col w-full pb-32">
      {/* Friendly Chef Greeting Card */}
      <div className="bg-[#fff1ec] rounded-2xl p-4 mb-4 shadow-sm relative overflow-hidden border border-[#f2ded8]/60">
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#ffdea8] flex items-center justify-center shadow-inner shrink-0">
              <span className="text-2xl animate-bounce">👨‍🍳</span>
            </div>
            <div>
              <h2 className="font-bold text-[17px] text-[#241915] flex items-center gap-1.5">
                ตู้เย็นของฉัน 🥦🧀
              </h2>
              <p className="text-[13px] text-[#59413c]">
                จิ้มเลือกวัตถุดิบที่มี แล้วมาปรุงของอร่อยกัน!
              </p>
            </div>
          </div>
          <button
            onClick={onQuickRandom}
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-white text-[#ae3115] shadow-sm active:scale-90 transition-transform hover:bg-[#fff8f6] border border-[#f2ded8]/80 cursor-pointer"
            id="quick-random-btn"
          >
            <span className="material-symbols-outlined text-[22px]">casino</span>
            <span className="text-[10px] font-bold whitespace-nowrap">สุ่มด่วน 🎲</span>
          </button>
        </div>
        {/* Decorative faint background blob */}
        <div className="absolute -right-6 -bottom-8 w-24 h-24 rounded-full bg-[#ffdad2]/50 blur-xl pointer-events-none" />
      </div>

      {/* Search Input Container */}
      <div className="relative w-full mb-4">
        <div className="flex items-center bg-white rounded-full px-4 py-3 shadow-[0_8px_20px_-6px_rgba(45,34,30,0.06)] border border-[#f2ded8]/60">
          <span className="material-symbols-outlined text-[#ff6b4a] mr-2 text-[22px]">search</span>
          <input
            className="w-full bg-transparent text-[14px] text-[#241915] placeholder:text-[#8d716a]/70 focus:outline-none"
            id="ingredient-search"
            placeholder="ค้นหา เช่น ไข่ไก่, อกไก่, กะเพรา..."
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              className="text-[#8d716a] hover:text-[#241915] p-1 cursor-pointer"
              onClick={() => setSearchQuery('')}
            >
              <span className="material-symbols-outlined text-[18px]">cancel</span>
            </button>
          )}
        </div>
      </div>

      {/* Dynamic Selected Ingredients Tray */}
      <div className="bg-[#feeae3] rounded-2xl p-4 mb-6 shadow-sm border border-[#f2ded8]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full bg-[#ae3115] text-white text-[11px] font-bold">
              <span>{selectedIds.length}</span> อย่าง
            </span>
            <span className="text-[13px] font-bold text-[#241915]">กำลังเปิดตู้เย็นรอปรุง ✨</span>
          </div>
          {selectedIds.length > 0 && (
            <button
              onClick={onClearAll}
              className="text-[12px] font-bold text-[#ae3115] hover:opacity-80 active:scale-95 transition-transform flex items-center gap-0.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">refresh</span>
              ล้างทั้งหมด
            </button>
          )}
        </div>

        {/* Active Pills Container */}
        <div className="flex flex-wrap gap-2 pt-1 min-h-[38px] items-center">
          {selectedIngredients.length === 0 ? (
            <span className="text-[13px] text-[#59413c]/80 italic">
              ยังไม่ได้เลือกวัตถุดิบเลย ลองแตะที่การ์ดด้านล่างนะ 👇
            </span>
          ) : (
            selectedIngredients.map((item) => (
              <div
                key={item.id}
                className="inline-flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 rounded-full bg-white text-[#241915] shadow-xs text-[12px] font-bold animate-in fade-in zoom-in duration-200 border border-[#f2ded8]"
              >
                <span>{item.emoji}</span>
                <span>{item.name}</span>
                <button
                  onClick={() => onToggleIngredient(item.id)}
                  className="w-4 h-4 rounded-full bg-[#f2ded8] flex items-center justify-center text-[#59413c] hover:bg-[#ffdad6] hover:text-[#ba1a1a] ml-1 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[12px]">close</span>
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Categories */}
      {categories.map((cat) => {
        const catItems = filteredIngredients.filter((item) => item.category === cat.key);
        const allCatItems = ingredients.filter((item) => item.category === cat.key);
        const activeInCat = allCatItems.filter((item) => selectedIds.includes(item.id)).length;

        if (catItems.length === 0 && searchQuery) {
          return null;
        }

        return (
          <div key={cat.key} className="category-block mb-6">
            <div className="flex items-center justify-between mb-2.5 px-1">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-[17px] text-[#241915]">{cat.title}</span>
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    activeInCat > 0
                      ? 'bg-[#ffdad2] text-[#3d0600]'
                      : 'bg-[#feeae3] text-[#59413c]'
                  }`}
                >
                  {activeInCat}/{allCatItems.length}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {catItems.map((item) => {
                const isSelected = selectedIds.includes(item.id);

                return (
                  <button
                    key={item.id}
                    onClick={() => onToggleIngredient(item.id)}
                    type="button"
                    className={`ingredient-card flex items-center justify-between p-3 rounded-2xl shadow-xs active:scale-95 transition-all text-left cursor-pointer border ${
                      isSelected
                        ? 'bg-[#ff6b4a] text-white border-[#ff6b4a]'
                        : 'bg-white text-[#241915] border-[#f2ded8]/70 hover:border-[#ff6b4a]/30'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-2xl shrink-0">{item.emoji}</span>
                      <div className="min-w-0">
                        <p className="font-bold text-[13px] truncate">{item.name}</p>
                        <p
                          className={`text-[11px] truncate ${
                            isSelected ? 'text-white/90' : 'text-[#59413c]'
                          }`}
                        >
                          {item.subtext}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`check-icon flex items-center justify-center w-6 h-6 rounded-full shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-white text-[#ae3115]'
                          : 'bg-[#fff1ec] text-transparent'
                      }`}
                    >
                      <span
                        className="material-symbols-outlined text-[16px]"
                        style={{ fontVariationSettings: isSelected ? "'FILL' 1" : "'FILL' 0" }}
                      >
                        {isSelected ? 'check' : 'add'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Empty Search Result State */}
      {filteredIngredients.length === 0 && searchQuery && (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="w-16 h-16 rounded-full bg-[#feeae3] flex items-center justify-center text-3xl mb-3 animate-pulse">
            🔍🥗
          </div>
          <h3 className="font-bold text-[17px] text-[#241915] mb-1">
            ไม่พบวัตถุดิบที่คุณพิมพ์
          </h3>
          <p className="text-[13px] text-[#59413c] max-w-xs">
            ลองค้นหาด้วยคำง่ายๆ เช่น "หมู", "ไข่", "พริก" หรือเลือกจากหมวดหมู่ได้เลยน้า
          </p>
        </div>
      )}

      {/* Sticky CTA Floating Bar */}
      <div className="sticky bottom-20 z-40 w-full pt-2">
        <button
          onClick={onFindRecipes}
          className="w-full flex items-center justify-between px-6 py-4 rounded-full bg-[#ae3115] text-white shadow-[0_16px_36px_-6px_rgba(174,49,21,0.4)] active:scale-[0.98] transition-transform cursor-pointer hover:bg-[#962910]"
          id="submit-find-recipe-btn"
        >
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[24px] text-[#feb700] animate-pulse">
              auto_awesome
            </span>
            <div className="flex flex-col text-left">
              <span className="font-bold text-[15px] leading-tight">ค้นหาเมนูอร่อยทันที!</span>
              <span className="text-[11px] text-[#ffdad2] leading-tight" id="recipe-match-count">
                {selectedIds.length === 0
                  ? 'เลือกอย่างน้อย 1 อย่างเพื่อดูเมนู'
                  : `จับคู่ได้ ${matchCount} เมนูเด็ดจากของในตู้ 🍳`}
              </span>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
          </div>
        </button>
      </div>
    </div>
  );
};
