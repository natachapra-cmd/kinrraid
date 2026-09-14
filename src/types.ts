export interface Ingredient {
  id: string;
  name: string;
  emoji: string;
  category: 'meat' | 'veg' | 'carb' | 'sauce';
  subtext: string;
}

export interface CookingStep {
  stepNumber: number;
  title: string;
  duration: string;
  durationSeconds: number;
  instruction: string;
  proTip?: string;
  heatLevel?: string;
  image: string;
  speechText: string;
}

export interface RecipeIngredient {
  name: string;
  amount: string;
  status: 'in_fridge' | 'pantry' | 'missing';
  statusText: string;
  inFridge: boolean;
}

export interface Recipe {
  id: string;
  title: string;
  subtitle: string;
  category: 'all' | 'thai' | 'quick' | 'lowcal' | 'fusion';
  filterCategories: string[];
  tags: string[];
  image: string;
  time: string;
  calories: number;
  difficulty: 'ง่ายมาก (ระดับเริ่มต้น)' | 'ง่ายมาก' | 'ปานกลาง' | 'ยาก';
  rating: number;
  reviewCount: string;
  badge: string;
  badgeType: 'full' | 'substitute' | 'partial' | 'clean';
  servings: number;
  nutrition: {
    carbs: number;
    protein: number;
    fat: number;
    sodium: number;
    grade: string;
    burnRunningMinutes: number;
    burnCyclingMinutes: number;
  };
  ingredients: RecipeIngredient[];
  steps: CookingStep[];
  chefTip: string;
  coreIngredientIds?: string[];
}

export type ViewType = 'fridge' | 'discover' | 'detail' | 'cooking' | 'saved';
