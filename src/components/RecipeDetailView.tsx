import React, { useState } from 'react';
import { Recipe } from '../types';

interface RecipeDetailViewProps {
  recipe: Recipe;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  onStartCooking: () => void;
  onShare: () => void;
}

export const RecipeDetailView: React.FC<RecipeDetailViewProps> = ({
  recipe,
  isBookmarked,
  onToggleBookmark,
  onStartCooking,
  onShare,
}) => {
  // State for ingredient checklist
  const [checkedIngredients, setCheckedIngredients] = useState<boolean[]>(
    recipe.ingredients.map(() => true)
  );

  const toggleIngredient = (index: number) => {
    setCheckedIngredients((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  const checkedCount = checkedIngredients.filter(Boolean).length;
  const totalIngredients = recipe.ingredients.length;

  return (
    <div className="flex flex-col w-full pb-32">
      {/* Dish Visual Presentation Hero Card */}
      <div className="relative w-full rounded-3xl overflow-hidden shadow-[0_12px_28px_-6px_rgba(45,34,30,0.08)] bg-white mb-4 border border-[#f2ded8]/60">
        <div className="relative h-64 w-full bg-[#feeae3]">
          <img
            alt={recipe.title}
            className="w-full h-full object-cover"
            src={recipe.image}
          />
          {/* Gradient Scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

          {/* Quick Action Badges (Top Right) */}
          <div className="absolute top-3 right-3 flex items-center gap-2">
            <button
              onClick={onToggleBookmark}
              className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-[#ae3115] shadow-xs transition-transform active:scale-90 cursor-pointer hover:bg-white"
              id="bookmark-btn"
              type="button"
              aria-label="บันทึกสูตร"
            >
              <span
                className="material-symbols-outlined text-[20px]"
                style={{ fontVariationSettings: isBookmarked ? "'FILL' 1" : "'FILL' 0" }}
              >
                {isBookmarked ? 'favorite' : 'favorite_border'}
              </span>
            </button>
            <button
              onClick={onShare}
              className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-[#241915] transition-transform active:scale-90 shadow-xs cursor-pointer hover:bg-white"
              type="button"
              aria-label="แชร์สูตร"
            >
              <span className="material-symbols-outlined text-[20px]">share</span>
            </button>
          </div>

          {/* Time & Rating Tag Overlay (Bottom) */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
            <div className="flex items-center gap-1 bg-[#ae3115]/85 backdrop-blur-sm px-3 py-1 rounded-full text-white text-[13px] font-bold shadow-xs">
              <span className="material-symbols-outlined text-[16px]">timer</span>
              <span>{recipe.time}</span>
            </div>
            <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[#241915] text-[11px] font-bold shadow-xs">
              <span className="text-[#feb700]">★</span>
              <span className="font-extrabold">{recipe.rating}</span>
              <span className="text-[#59413c] font-normal">({recipe.reviewCount} รีวิว)</span>
            </div>
          </div>
        </div>

        {/* Title & Meta Header */}
        <div className="p-4 bg-white">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full bg-[#00b251]/15 text-[#006e2f] text-[11px] font-bold">
              ● {recipe.difficulty}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#f8e4dd] text-[#59413c] text-[11px] font-bold">
              อาหารจานด่วน
            </span>
          </div>
          <h2 className="text-[22px] font-extrabold text-[#241915] tracking-tight mb-2">
            {recipe.title}
          </h2>
          <p className="text-[14px] text-[#59413c] leading-relaxed">
            {recipe.subtitle}
          </p>
        </div>
      </div>

      {/* Nutrition & Quick Info Pill Bar */}
      <div className="w-full bg-white rounded-3xl p-4 shadow-[0_4px_16px_-2px_rgba(45,34,30,0.05)] mb-6 flex flex-col gap-3 border border-[#f2ded8]/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#ff6b4a]/15 text-[#ae3115] flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">local_fire_department</span>
            </div>
            <div>
              <span className="text-[15px] font-extrabold text-[#241915]">{recipe.calories} kcal</span>
              <span className="text-[12px] text-[#59413c] ml-1">/ 1 เสิร์ฟ</span>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-[#fff1ec] px-3 py-1 rounded-full text-[#59413c] text-[12px] font-bold">
            <span className="material-symbols-outlined text-[16px] text-[#241915]">person</span>
            <span>{recipe.servings} ที่เสิร์ฟ</span>
          </div>
        </div>

        {/* Macronutrient Breakdown Grid */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          <div className="bg-[#fff1ec] rounded-2xl p-2.5 text-center">
            <span className="text-[12px] text-[#59413c] block">คาร์โบไฮเดรต</span>
            <span className="text-[15px] font-extrabold text-[#241915]">{recipe.nutrition.carbs}g</span>
          </div>
          <div className="bg-[#fff1ec] rounded-2xl p-2.5 text-center">
            <span className="text-[12px] text-[#59413c] block">โปรตีน</span>
            <span className="text-[15px] font-extrabold text-[#006e2f]">{recipe.nutrition.protein}g</span>
          </div>
          <div className="bg-[#fff1ec] rounded-2xl p-2.5 text-center">
            <span className="text-[12px] text-[#59413c] block">ไขมัน</span>
            <span className="text-[15px] font-extrabold text-[#feb700]">{recipe.nutrition.fat}g</span>
          </div>
        </div>
      </div>

      {/* Ingredients Checklist Section */}
      <div className="w-full mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#ffdea8] flex items-center justify-center text-base">
              🥢
            </div>
            <h3 className="font-bold text-[18px] text-[#241915]">วัตถุดิบที่ต้องใช้</h3>
          </div>
          <span
            className={`text-[12px] font-bold px-2.5 py-0.5 rounded-full ${
              checkedCount === totalIngredients
                ? 'text-[#006e2f] bg-[#00b251]/15'
                : 'text-[#ae3115] bg-[#ffdad2]'
            }`}
          >
            พร้อม {checkedCount}/{totalIngredients} อย่าง
          </span>
        </div>

        <div className="space-y-2">
          {recipe.ingredients.map((ing, idx) => {
            const isChecked = checkedIngredients[idx];

            return (
              <label
                key={idx}
                onClick={() => toggleIngredient(idx)}
                className="recipe-checkbox-card flex items-center justify-between p-3.5 bg-white rounded-2xl cursor-pointer transition-all active:scale-[0.99] shadow-xs select-none border border-[#f2ded8]/60 hover:border-[#ff6b4a]/30"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors shrink-0 ${
                      isChecked
                        ? 'bg-[#006e2f] text-white'
                        : 'bg-[#f8e4dd] text-transparent'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">check</span>
                  </div>
                  <div className="truncate">
                    <span
                      className={`text-[14px] block truncate font-medium ${
                        isChecked
                          ? 'line-through text-[#59413c]/60'
                          : 'text-[#241915]'
                      }`}
                    >
                      {ing.name}
                    </span>
                    <span className="text-[12px] text-[#59413c]">{ing.amount}</span>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold shrink-0 ml-2 ${
                    ing.status === 'in_fridge'
                      ? 'text-[#006e2f] bg-[#00b251]/15'
                      : ing.status === 'missing'
                      ? 'text-[#ae3115] bg-[#ffdad2]'
                      : 'text-[#59413c] bg-[#feeae3]'
                  }`}
                >
                  {ing.statusText}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Step-by-Step Cooking Guide */}
      <div className="w-full mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#ffdad2] flex items-center justify-center text-base">
              🍳
            </div>
            <h3 className="font-bold text-[18px] text-[#241915]">ขั้นตอนการทำทีละขั้นตอน</h3>
          </div>
          <span className="text-[12px] text-[#59413c] font-bold">
            {recipe.steps.length} ขั้นตอน
          </span>
        </div>

        <div className="space-y-3">
          {recipe.steps.map((step) => (
            <div
              key={step.stepNumber}
              className="bg-white rounded-2xl p-4 shadow-xs relative overflow-hidden flex gap-3.5 items-start border border-[#f2ded8]/60"
            >
              <div className="w-9 h-9 rounded-full bg-[#ff6b4a] text-white flex items-center justify-center font-extrabold text-[16px] shrink-0 shadow-xs">
                {step.stepNumber}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1 gap-1">
                  <h4 className="font-bold text-[15px] text-[#241915]">{step.title}</h4>
                  <span className="text-[11px] font-bold bg-[#feeae3] px-2 py-0.5 rounded-full text-[#59413c] shrink-0">
                    {step.duration}
                  </span>
                </div>
                <p className="text-[13px] text-[#59413c] leading-relaxed">
                  {step.instruction}
                </p>
                {step.proTip && (
                  <p className="text-[12px] text-[#ae3115] mt-1.5 font-medium bg-[#fff1ec] p-2 rounded-xl">
                    {step.proTip}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chef's Pro-Tip Box */}
      <div className="w-full bg-[#ffdea8]/30 rounded-3xl p-4 mb-8 relative overflow-hidden flex gap-3 items-start shadow-xs border border-[#ffdea8]">
        <div className="w-10 h-10 rounded-full bg-[#feb700] text-[#271900] flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-[22px]">lightbulb</span>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="font-bold text-[15px] text-[#271900]">เคล็ดลับเด็ดจากเชฟ</span>
            <span className="text-[12px] text-[#ae3115] font-extrabold">Cook & Co.</span>
          </div>
          <p className="text-[13px] text-[#5e4200] leading-relaxed">
            {recipe.chefTip}
          </p>
        </div>
      </div>

      {/* Floating Cooking Dock Action Button */}
      <div className="fixed bottom-4 left-4 right-4 z-40 max-w-lg mx-auto">
        <button
          onClick={onStartCooking}
          className="w-full h-14 bg-[#ae3115] text-white rounded-full font-bold text-[15px] flex items-center justify-center gap-2 shadow-[0_16px_32px_-4px_rgba(174,49,21,0.4)] transition-all active:scale-[0.97] hover:brightness-105 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[24px]">play_circle</span>
          <span>เริ่มทำอาหารตามเวลาจริง (โหมดทำอาหาร) ⏱️👨‍🍳</span>
        </button>
      </div>
    </div>
  );
};
