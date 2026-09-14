/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { ViewType, Recipe } from './types';
import { INITIAL_INGREDIENTS, RECIPES } from './data/mockData';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { FridgeView } from './components/FridgeView';
import { DiscoverView } from './components/DiscoverView';
import { RecipeDetailView } from './components/RecipeDetailView';
import { CookingModeView } from './components/CookingModeView';
import { SavedRecipesView } from './components/SavedRecipesView';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>('fridge');
  // Initial empty state: no pre-selected ingredients, no saved recipes, not in cooking mode
  const [selectedIngredientIds, setSelectedIngredientIds] = useState<string[]>([]);
  const [savedRecipeIds, setSavedRecipeIds] = useState<string[]>([]);
  const [activeRecipe, setActiveRecipe] = useState<Recipe | null>(null);
  const [completedMealsCount, setCompletedMealsCount] = useState<number>(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  const handleToggleIngredient = (id: string) => {
    setSelectedIngredientIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleClearAllIngredients = () => {
    setSelectedIngredientIds([]);
    showToast('ล้างรายการวัตถุดิบทั้งหมดแล้ว 🧹');
  };

  const handleQuickRandom = () => {
    const all = [...INITIAL_INGREDIENTS];
    const shuffled = all.sort(() => 0.5 - Math.random());
    const randomSet = shuffled.slice(0, 4).map((i) => i.id);
    setSelectedIngredientIds(randomSet);
    showToast('สุ่มวัตถุดิบพร้อมปรุงแล้ว! 🎲');
  };

  const handleToggleBookmark = (recipeId: string) => {
    setSavedRecipeIds((prev) => {
      if (prev.includes(recipeId)) {
        showToast('นำออกจากสูตรโปรดแล้ว 💔');
        return prev.filter((id) => id !== recipeId);
      } else {
        showToast('บันทึกลงสูตรโปรดแล้ว ❤️');
        return [...prev, recipeId];
      }
    });
  };

  const handleSelectRecipe = (recipe: Recipe) => {
    setActiveRecipe(recipe);
    setCurrentView('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartCooking = () => {
    setCurrentView('cooking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShare = () => {
    const targetRecipe = activeRecipe || RECIPES[0];
    if (navigator.share) {
      navigator
        .share({
          title: `${targetRecipe.title} - กินไรดี? Cook & Co.`,
          text: `มาลองทำ ${targetRecipe.title} สูตรเด็ด ทำง่ายใน ${targetRecipe.time}!`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      showToast('คัดลอกลิงก์สูตรอาหารแล้ว เตรียมส่งให้เพื่อนได้เลย! 📋');
    }
  };

  // Header Title and Subtitle
  let headerTitle = 'กินไรดี? 🍳';
  let headerSubtitle: string | undefined = 'วัตถุดิบในตู้เย็น';
  let onBackHandler: (() => void) | undefined = undefined;

  if (currentView === 'fridge') {
    headerTitle = 'กินไรดี? 🍳';
    headerSubtitle = 'วัตถุดิบในตู้เย็น';
  } else if (currentView === 'discover') {
    headerTitle = 'กินไรดี? 🍳';
    headerSubtitle = 'เมนูแนะนำ';
  } else if (currentView === 'detail') {
    headerTitle = activeRecipe ? activeRecipe.title : 'รายละเอียดสูตร';
    headerSubtitle = 'สูตรอาหารและวิธีทำ';
    onBackHandler = () => setCurrentView('discover');
  } else if (currentView === 'cooking') {
    headerTitle = activeRecipe ? activeRecipe.title : 'โหมดทำอาหาร ⏱️';
    headerSubtitle = 'โหมดทำอาหารตามเวลาจริง';
    onBackHandler = () => setCurrentView('discover');
  } else if (currentView === 'saved') {
    headerTitle = 'กินไรดี? 🍳';
    headerSubtitle = 'สูตรของฉัน';
  }

  // Dynamically compute recipe match score, badges, and sort by highest match
  const dynamicRecipes = useMemo(() => {
    return RECIPES.map((recipe) => {
      const core = recipe.coreIngredientIds || [];
      const matched = core.filter((id) => selectedIngredientIds.includes(id));
      const matchRatio = core.length > 0 ? matched.length / core.length : 0.5;

      let badge = recipe.badge;
      let badgeType = recipe.badgeType;

      if (selectedIngredientIds.length > 0 && core.length > 0) {
        if (matched.length === core.length) {
          badge = 'วัตถุดิบครบ 100% 🎯';
          badgeType = 'full';
        } else if (core.length - matched.length === 1) {
          const missingId = core.find((id) => !selectedIngredientIds.includes(id));
          const missingIng = INITIAL_INGREDIENTS.find((i) => i.id === missingId);
          badge = `ขาดแค่${missingIng ? missingIng.name : '1 อย่าง'} (ปรับใช้ของอื่นได้) 💡`;
          badgeType = 'substitute';
        } else if (matchRatio >= 0.5) {
          badge = `มีวัตถุดิบ ${Math.round(matchRatio * 100)}% ⚡`;
          badgeType = 'partial';
        }
      }

      return {
        ...recipe,
        badge,
        badgeType,
        _matchRatio: matchRatio,
        _matchedCount: matched.length,
      };
    }).sort((a, b) => {
      if (b._matchRatio !== a._matchRatio) {
        return b._matchRatio - a._matchRatio;
      }
      return b._matchedCount - a._matchedCount;
    });
  }, [selectedIngredientIds]);

  const savedRecipesList = dynamicRecipes.filter((r) => savedRecipeIds.includes(r.id));

  return (
    <div className="min-h-screen bg-[#fff8f6] text-[#241915] flex flex-col antialiased selection:bg-[#ffdad2]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-[#241915] text-white text-[13px] font-bold px-4 py-2.5 rounded-full shadow-lg border border-white/20 animate-in fade-in slide-in-from-top-4 duration-200 pointer-events-none">
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <Header
        currentView={currentView}
        title={headerTitle}
        subtitle={headerSubtitle}
        onBack={onBackHandler}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-lg mx-auto pt-20 px-4 flex flex-col">
        {currentView === 'fridge' && (
          <FridgeView
            ingredients={INITIAL_INGREDIENTS}
            selectedIds={selectedIngredientIds}
            recipes={dynamicRecipes}
            onToggleIngredient={handleToggleIngredient}
            onClearAll={handleClearAllIngredients}
            onQuickRandom={handleQuickRandom}
            onFindRecipes={() => {
              setCurrentView('discover');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentView === 'discover' && (
          <DiscoverView
            recipes={dynamicRecipes}
            savedRecipeIds={savedRecipeIds}
            onToggleBookmark={handleToggleBookmark}
            onSelectRecipe={handleSelectRecipe}
            onStartCookingRecipe={(recipe) => {
              setActiveRecipe(recipe);
              setCurrentView('cooking');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onGoToFridge={() => {
              setCurrentView('fridge');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentView === 'detail' && (
          <RecipeDetailView
            recipe={activeRecipe || dynamicRecipes[0] || RECIPES[0]}
            isBookmarked={savedRecipeIds.includes((activeRecipe || dynamicRecipes[0] || RECIPES[0]).id)}
            onToggleBookmark={() => handleToggleBookmark((activeRecipe || dynamicRecipes[0] || RECIPES[0]).id)}
            onStartCooking={handleStartCooking}
            onShare={handleShare}
          />
        )}

        {currentView === 'cooking' && (
          <CookingModeView
            recipe={activeRecipe || dynamicRecipes[0] || RECIPES[0]}
            recipes={dynamicRecipes}
            onSelectRecipe={(r) => setActiveRecipe(r)}
            onFinishCooking={() => {
              setCompletedMealsCount((c) => c + 1);
              showToast('🎉 บันทึกประวัติมื้ออร่อยเรียบร้อยแล้ว!');
              setCurrentView('discover');
            }}
            onExit={() => setCurrentView('discover')}
          />
        )}

        {currentView === 'saved' && (
          <SavedRecipesView
            savedRecipes={savedRecipesList}
            onSelectRecipe={handleSelectRecipe}
            onStartCooking={(recipe) => {
              setActiveRecipe(recipe);
              setCurrentView('cooking');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onRemoveBookmark={handleToggleBookmark}
            onGoToDiscover={() => setCurrentView('discover')}
          />
        )}
      </main>

      {/* Persistent Bottom Navigation Dock */}
      <BottomNav
        currentView={currentView}
        onChangeView={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        savedCount={savedRecipeIds.length}
      />
    </div>
  );
}
