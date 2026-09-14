import React from 'react';
import { Recipe } from '../types';

interface SavedRecipesViewProps {
  savedRecipes: Recipe[];
  onSelectRecipe: (recipe: Recipe) => void;
  onStartCooking?: (recipe: Recipe) => void;
  onRemoveBookmark: (recipeId: string) => void;
  onGoToDiscover: () => void;
}

export const SavedRecipesView: React.FC<SavedRecipesViewProps> = ({
  savedRecipes,
  onSelectRecipe,
  onStartCooking,
  onRemoveBookmark,
  onGoToDiscover,
}) => {
  return (
    <div className="flex flex-col w-full gap-5 pb-32">
      {/* Header Banner */}
      <div className="bg-[#fff1ec] rounded-3xl p-4 shadow-sm border border-[#f2ded8]/60 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#ff6b4a] text-white flex items-center justify-center shadow-xs">
            <span className="material-symbols-outlined text-[22px]">bookmark_heart</span>
          </div>
          <div>
            <h2 className="font-bold text-[17px] text-[#241915]">สูตรอาหารของฉัน</h2>
            <p className="text-[12px] text-[#59413c]">
              บันทึกไว้ {savedRecipes.length} เมนูโปรด
            </p>
          </div>
        </div>
      </div>

      {savedRecipes.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 text-center border border-[#f2ded8] shadow-xs flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-[#feeae3] flex items-center justify-center text-3xl mb-3">
            📖✨
          </div>
          <h3 className="font-bold text-[18px] text-[#241915] mb-1">ยังไม่มีสูตรที่บันทึกไว้</h3>
          <p className="text-[13px] text-[#59413c] max-w-xs mb-5">
            เมื่อเจอเมนูที่ชอบ ให้กดปุ่มรูปหัวใจเพื่อบันทึกเก็บไว้ดูหรือทำซ้ำได้ตลอดเวลา
          </p>
          <button
            onClick={onGoToDiscover}
            className="px-6 py-3 rounded-full bg-[#ae3115] text-white text-[14px] font-bold shadow-xs active:scale-95 transition-all cursor-pointer hover:bg-[#962910]"
          >
            ค้นหาเมนูแนะนำ 🍽️
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {savedRecipes.map((recipe) => (
            <div
              key={recipe.id}
              className="flex bg-white rounded-3xl overflow-hidden shadow-xs border border-[#f2ded8]/60 p-3 gap-3 items-center"
            >
              <img
                alt={recipe.title}
                className="w-24 h-24 rounded-2xl object-cover shrink-0 bg-[#feeae3]"
                src={recipe.image}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-[11px] font-bold text-[#ae3115] bg-[#ffdad2] px-2 py-0.5 rounded-full">
                    {recipe.time}
                  </span>
                  <span className="text-[11px] text-[#59413c] font-bold">
                    🔥 {recipe.calories} kcal
                  </span>
                </div>
                <h4 className="font-bold text-[15px] text-[#241915] truncate">
                  {recipe.title}
                </h4>
                <p className="text-[11px] text-[#59413c] truncate mt-0.5">
                  {recipe.subtitle}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => onSelectRecipe(recipe)}
                    className="px-3 py-1 rounded-full bg-[#feeae3] text-[#ae3115] text-[12px] font-bold hover:bg-[#ffdad2] cursor-pointer"
                  >
                    ดูสูตร
                  </button>
                  <button
                    onClick={() => {
                      if (onStartCooking) {
                        onStartCooking(recipe);
                      } else {
                        onSelectRecipe(recipe);
                      }
                    }}
                    className="px-3 py-1 rounded-full bg-[#ae3115] text-white text-[12px] font-bold hover:bg-[#962910] cursor-pointer flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[14px]">skillet</span>
                    <span>ทำอาหาร</span>
                  </button>
                  <button
                    onClick={() => onRemoveBookmark(recipe.id)}
                    className="p-1 text-[#8d716a] hover:text-[#ba1a1a] cursor-pointer"
                    title="ลบออกจากรายการโปรด"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete_outline</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
