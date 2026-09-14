import React, { useState, useMemo } from 'react';
import { Recipe } from '../types';

interface DiscoverViewProps {
  recipes: Recipe[];
  savedRecipeIds: string[];
  onToggleBookmark: (recipeId: string) => void;
  onSelectRecipe: (recipe: Recipe) => void;
  onStartCookingRecipe?: (recipe: Recipe) => void;
  onGoToFridge: () => void;
}

export const DiscoverView: React.FC<DiscoverViewProps> = ({
  recipes,
  savedRecipeIds,
  onToggleBookmark,
  onSelectRecipe,
  onStartCookingRecipe,
  onGoToFridge,
}) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filterOptions = [
    { key: 'all', label: 'ทั้งหมด' },
    { key: 'quick', label: '⚡ ทำง่ายมาก (<15 นาที)' },
    { key: 'lowcal', label: '🥗 แคลน้อย (<350 kcal)' },
    { key: 'thai', label: '🌶️ อาหารไทยรสเด็ด' },
    { key: 'fusion', label: '🍜 สไตล์ฟิวชั่น/ญี่ปุ่น' },
  ];

  const filteredRecipes = useMemo(() => {
    return recipes.filter((recipe) => {
      // Category filter
      if (activeFilter !== 'all' && !recipe.filterCategories.includes(activeFilter)) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = recipe.title.toLowerCase().includes(q);
        const matchSubtitle = recipe.subtitle.toLowerCase().includes(q);
        const matchTags = recipe.tags.some((t) => t.toLowerCase().includes(q));
        const matchIngredients = recipe.ingredients.some((i) => i.name.toLowerCase().includes(q));
        return matchTitle || matchSubtitle || matchTags || matchIngredients;
      }
      return true;
    });
  }, [recipes, activeFilter, searchQuery]);

  return (
    <div className="flex flex-col w-full gap-6 pb-32">
      {/* Hero Summary Card */}
      <div className="flex flex-col bg-[#fff1ec] rounded-2xl p-4 shadow-sm relative overflow-hidden border border-[#f2ded8]/60">
        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-[#ff6b4a]/10 rounded-full blur-xl pointer-events-none" />
        <div className="flex items-center gap-2 mb-1">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#ff6b4a] text-white shadow-xs">
            <span className="material-symbols-outlined text-[18px]">restaurant_menu</span>
          </span>
          <h2 className="font-bold text-[18px] text-[#241915]">
            เมนูแนะนำจากของที่คุณมี 🍽️✨
          </h2>
        </div>
        <p className="text-[13px] text-[#59413c] flex items-center gap-1">
          <span>
            พบ <strong className="text-[#ae3115] font-bold">{filteredRecipes.length} เมนู</strong> ที่ทำได้ทันทีจากวัตถุดิบของคุณ!
          </span>
          <span>🎉</span>
        </p>

        {/* Search Input Bar */}
        <div className="mt-3 flex items-center gap-2 bg-white px-3 py-2 rounded-full shadow-xs border border-[#f2ded8]">
          <span className="material-symbols-outlined text-[#8d716a] text-[20px]">search</span>
          <input
            className="bg-transparent border-none outline-none text-[13px] text-[#241915] w-full placeholder:text-[#8d716a]/70"
            placeholder="ค้นหาเมนู, วัตถุดิบ..."
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-[#8d716a] hover:text-[#241915] p-0.5"
            >
              <span className="material-symbols-outlined text-[16px]">cancel</span>
            </button>
          )}
          <button
            className="flex items-center justify-center p-1 rounded-full bg-[#feeae3] hover:bg-[#f2ded8] text-[#59413c] transition-colors cursor-pointer"
            type="button"
            title="ตัวกรอง"
          >
            <span className="material-symbols-outlined text-[18px]">tune</span>
          </button>
        </div>
      </div>

      {/* Filter Buttons Horizontal Carousel */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-none">
        {filterOptions.map((opt) => (
          <button
            key={opt.key}
            onClick={() => setActiveFilter(opt.key)}
            className={`shrink-0 px-4 py-1.5 rounded-full text-[13px] font-bold shadow-xs transition-transform active:scale-95 cursor-pointer whitespace-nowrap ${
              activeFilter === opt.key
                ? 'bg-[#ae3115] text-white shadow-sm'
                : 'bg-white text-[#59413c] hover:bg-[#fff1ec] border border-[#f2ded8]'
            }`}
            type="button"
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Recipe Cards List */}
      <div className="flex flex-col gap-6" id="recipe-feed">
        {filteredRecipes.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-[#f2ded8]">
            <div className="text-3xl mb-2">🍳🍲</div>
            <h3 className="font-bold text-[16px] text-[#241915]">ไม่พบเมนูที่ตรงกับเงื่อนไข</h3>
            <p className="text-[13px] text-[#59413c] mt-1">ลองเปลี่ยนคำค้นหาหรือตัวกรองดูนะครับ</p>
          </div>
        ) : (
          filteredRecipes.map((recipe) => {
            const isBookmarked = savedRecipeIds.includes(recipe.id);

            return (
              <article
                key={recipe.id}
                className="flex flex-col bg-white rounded-3xl overflow-hidden shadow-[0_8px_24px_-4px_rgba(45,34,30,0.06),0_2px_6px_-1px_rgba(255,107,74,0.04)] border border-[#f2ded8]/60 transition-all duration-300 hover:shadow-[0_16px_32px_-6px_rgba(45,34,30,0.09)]"
              >
                {/* Image Container */}
                <div className="relative w-full aspect-[4/3] bg-[#feeae3] overflow-hidden">
                  <img
                    alt={recipe.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    src={recipe.image}
                  />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-white text-[11px] font-bold backdrop-blur-md shadow-xs ${
                        recipe.badgeType === 'full'
                          ? 'bg-[#00b251]'
                          : recipe.badgeType === 'substitute'
                          ? 'bg-[#feb700] text-[#271900]'
                          : recipe.badgeType === 'clean'
                          ? 'bg-[#00b251]'
                          : 'bg-[#ff6b4a]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[14px]">
                        {recipe.badgeType === 'substitute'
                          ? 'lightbulb'
                          : recipe.badgeType === 'clean'
                          ? 'eco'
                          : recipe.badgeType === 'partial'
                          ? 'bolt'
                          : 'verified'}
                      </span>
                      <span>{recipe.badge}</span>
                    </span>

                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-sm text-[#241915] text-[11px] font-bold shadow-xs">
                      <span className="material-symbols-outlined text-[14px] text-[#ae3115]">
                        schedule
                      </span>
                      <span>{recipe.time}</span>
                    </span>
                  </div>

                  {/* Bookmark Button */}
                  <button
                    onClick={() => onToggleBookmark(recipe.id)}
                    className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-[#ae3115] shadow-xs active:scale-90 transition-transform cursor-pointer hover:bg-white"
                    type="button"
                    aria-label="บันทึกสูตร"
                  >
                    <span
                      className="material-symbols-outlined text-[22px]"
                      style={{
                        fontVariationSettings: isBookmarked ? "'FILL' 1" : "'FILL' 0",
                      }}
                    >
                      {isBookmarked ? 'favorite' : 'favorite_border'}
                    </span>
                  </button>

                  {/* Calories Pill */}
                  <div className="absolute bottom-2.5 right-3">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[#241915] text-[13px] font-bold shadow-md">
                      <span>{recipe.badgeType === 'clean' || recipe.category === 'lowcal' ? '🥗' : '🔥'}</span>
                      <span className="font-extrabold">{recipe.calories} kcal</span>
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col gap-2">
                  <div>
                    <h3 className="font-bold text-[18px] text-[#241915] leading-tight">
                      {recipe.title}
                    </h3>
                    <p className="text-[13px] text-[#59413c] mt-0.5 line-clamp-2">
                      {recipe.subtitle}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap items-center gap-1.5 mt-1">
                    {recipe.tags.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-0.5 rounded-full bg-[#feeae3] text-[#59413c] text-[11px] font-bold"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Bottom Meta & Action */}
                  <div className="flex items-center justify-between pt-2 mt-1 border-t border-[#f2ded8]/40">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#ffdea8] text-[#271900] text-[11px] font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#006e2f]" />
                        {recipe.difficulty.includes('ง่าย') ? 'ง่ายมาก' : 'ปานกลาง'}
                      </span>
                      <div className="flex items-center text-[#feb700] text-[12px] font-bold gap-0.5">
                        <span
                          className="material-symbols-outlined text-[16px] text-[#feb700]"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          star
                        </span>
                        <span className="font-extrabold text-[#241915]">{recipe.rating}</span>
                        <span className="text-[#8d716a] text-[11px] font-normal">
                          ({recipe.reviewCount})
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onSelectRecipe(recipe)}
                        className="px-3 py-2 rounded-full bg-[#feeae3] text-[#ae3115] hover:bg-[#ffdad2] text-[12px] font-bold flex items-center gap-1 shadow-xs active:scale-95 transition-all cursor-pointer"
                        type="button"
                        title="ดูรายละเอียดวัตถุดิบและขั้นตอน"
                      >
                        <span>ดูวิธีทำ</span>
                        <span className="material-symbols-outlined text-[15px]">menu_book</span>
                      </button>

                      <button
                        onClick={() => {
                          if (onStartCookingRecipe) {
                            onStartCookingRecipe(recipe);
                          } else {
                            onSelectRecipe(recipe);
                          }
                        }}
                        className="px-3.5 py-2 rounded-full bg-[#ae3115] text-white text-[12px] font-bold flex items-center gap-1 shadow-xs active:scale-95 transition-all hover:bg-[#962910] cursor-pointer"
                        type="button"
                        title="เข้าสู่โหมดทำอาหารตามเวลาจริง"
                      >
                        <span className="material-symbols-outlined text-[16px]">skillet</span>
                        <span>ทำอาหาร</span>
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>

      {/* Bottom Prompt Banner */}
      <div className="flex flex-col items-center justify-center p-6 bg-[#feeae3] rounded-3xl text-center gap-2 border border-[#f2ded8]">
        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#ae3115] shadow-xs">
          <span className="material-symbols-outlined text-[28px]">kitchen</span>
        </div>
        <h4 className="font-bold text-[17px] text-[#241915]">มีของในตู้เย็นเพิ่มไหม?</h4>
        <p className="text-[13px] text-[#59413c] max-w-[260px]">
          อัปเดตของในตู้เย็นเพื่อปลดล็อกอีกกว่า 40+ เมนูที่เข้ากับคุณ
        </p>
        <button
          onClick={onGoToFridge}
          className="mt-1 px-5 py-2.5 rounded-full bg-white text-[#ae3115] text-[13px] font-bold shadow-xs active:scale-95 transition-all flex items-center gap-1 cursor-pointer hover:bg-[#fff8f6] border border-[#f2ded8]"
        >
          <span className="material-symbols-outlined text-[18px]">add_circle</span>
          <span>เพิ่มวัตถุดิบ</span>
        </button>
      </div>
    </div>
  );
};
