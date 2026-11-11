"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ChefHat,
  Clock3,
  Copy,
  DollarSign,
  Heart,
  Printer,
  Search,
  Sparkles,
  Wallet,
} from "lucide-react";

type IngredientCategory =
  | "Meat"
  | "Seafood"
  | "Vegetables"
  | "Other Ingredients";

type MealType = "Breakfast" | "Lunch" | "Dinner" | "Merienda";
type Difficulty = "Easy" | "Moderate" | "Advanced";
type SortMode = "lowest-price" | "highest-match" | "fastest-cook";

type Ingredient = {
  id: string;
  name: string;
  category: IngredientCategory;
  unit: string;
  estimatedPrice: number;
  lastUpdated: string;
  market: string;
};

type RecipeIngredient = {
  ingredientId: string;
  quantity: number;
  unit: string;
};

type Recipe = {
  id: string;
  name: string;
  description: string;
  image: string;
  meal: MealType;
  servings: number;
  prepMinutes: number;
  cookMinutes: number;
  difficulty: Difficulty;
  estimatedTotalCost: number;
  ingredients: RecipeIngredient[];
  steps: string[];
  tips: string[];
};

const budgetOptions = [50, 100, 150, 200, 300, 500];
const mealOptions: MealType[] = ["Breakfast", "Lunch", "Dinner", "Merienda"];
const difficultyOptions: Difficulty[] = ["Easy", "Moderate", "Advanced"];
const sortOptions: { value: SortMode; label: string }[] = [
  { value: "lowest-price", label: "Lowest price" },
  { value: "highest-match", label: "Highest ingredient match" },
  { value: "fastest-cook", label: "Fastest cooking time" },
];

const baseIngredients: Ingredient[] = [
  { id: "pork", name: "Pork", category: "Meat", unit: "kg", estimatedPrice: 220, lastUpdated: "2026-11-01", market: "Divisoria" },
  { id: "chicken", name: "Chicken", category: "Meat", unit: "kg", estimatedPrice: 180, lastUpdated: "2026-11-01", market: "Baclaran" },
  { id: "beef", name: "Beef", category: "Meat", unit: "kg", estimatedPrice: 280, lastUpdated: "2026-11-01", market: "Quiapo" },
  { id: "ground-pork", name: "Ground pork", category: "Meat", unit: "kg", estimatedPrice: 220, lastUpdated: "2026-11-01", market: "Talipapa" },
  { id: "ground-beef", name: "Ground beef", category: "Meat", unit: "kg", estimatedPrice: 310, lastUpdated: "2026-11-01", market: "Libis" },
  { id: "hotdog", name: "Hotdog", category: "Meat", unit: "pack", estimatedPrice: 65, lastUpdated: "2026-11-01", market: "Metro Supermarket" },
  { id: "ham", name: "Ham", category: "Meat", unit: "pack", estimatedPrice: 95, lastUpdated: "2026-11-01", market: "SM Hypermarket" },
  { id: "bacon", name: "Bacon", category: "Meat", unit: "pack", estimatedPrice: 120, lastUpdated: "2026-11-01", market: "Talipapa" },
  { id: "tilapia", name: "Tilapia", category: "Seafood", unit: "kg", estimatedPrice: 150, lastUpdated: "2026-11-01", market: "Navotas" },
  { id: "bangus", name: "Bangus", category: "Seafood", unit: "kg", estimatedPrice: 170, lastUpdated: "2026-11-01", market: "Navotas" },
  { id: "galunggong", name: "Galunggong", category: "Seafood", unit: "kg", estimatedPrice: 120, lastUpdated: "2026-11-01", market: "Navotas" },
  { id: "shrimp", name: "Shrimp", category: "Seafood", unit: "kg", estimatedPrice: 260, lastUpdated: "2026-11-01", market: "Navotas" },
  { id: "squid", name: "Squid", category: "Seafood", unit: "kg", estimatedPrice: 220, lastUpdated: "2026-11-01", market: "Navotas" },
  { id: "tuna", name: "Tuna", category: "Seafood", unit: "can", estimatedPrice: 60, lastUpdated: "2026-11-01", market: "Meralco Market" },
  { id: "sardines", name: "Sardines", category: "Seafood", unit: "can", estimatedPrice: 24, lastUpdated: "2026-11-01", market: "Meralco Market" },
  { id: "potato", name: "Potato", category: "Vegetables", unit: "pc", estimatedPrice: 12, lastUpdated: "2026-11-01", market: "Public Market" },
  { id: "carrots", name: "Carrots", category: "Vegetables", unit: "bundle", estimatedPrice: 20, lastUpdated: "2026-11-01", market: "Public Market" },
  { id: "cabbage", name: "Cabbage", category: "Vegetables", unit: "head", estimatedPrice: 35, lastUpdated: "2026-11-01", market: "Public Market" },
  { id: "sayote", name: "Sayote", category: "Vegetables", unit: "pc", estimatedPrice: 25, lastUpdated: "2026-11-01", market: "Public Market" },
  { id: "eggplant", name: "Eggplant", category: "Vegetables", unit: "pc", estimatedPrice: 18, lastUpdated: "2026-11-01", market: "Public Market" },
  { id: "kangkong", name: "Kangkong", category: "Vegetables", unit: "bundle", estimatedPrice: 25, lastUpdated: "2026-11-01", market: "Bayani Market" },
  { id: "pechay", name: "Pechay", category: "Vegetables", unit: "bundle", estimatedPrice: 30, lastUpdated: "2026-11-01", market: "Public Market" },
  { id: "malunggay", name: "Malunggay", category: "Vegetables", unit: "bundle", estimatedPrice: 22, lastUpdated: "2026-11-01", market: "Public Market" },
  { id: "tomato", name: "Tomato", category: "Vegetables", unit: "pc", estimatedPrice: 10, lastUpdated: "2026-11-01", market: "Public Market" },
  { id: "onion", name: "Onion", category: "Vegetables", unit: "pc", estimatedPrice: 8, lastUpdated: "2026-11-01", market: "Public Market" },
  { id: "garlic", name: "Garlic", category: "Vegetables", unit: "head", estimatedPrice: 12, lastUpdated: "2026-11-01", market: "Public Market" },
  { id: "bell-pepper", name: "Bell pepper", category: "Vegetables", unit: "pc", estimatedPrice: 25, lastUpdated: "2026-11-01", market: "SM Hypermarket" },
  { id: "squash", name: "Squash", category: "Vegetables", unit: "pc", estimatedPrice: 28, lastUpdated: "2026-11-01", market: "Public Market" },
  { id: "string-beans", name: "String beans", category: "Vegetables", unit: "bundle", estimatedPrice: 35, lastUpdated: "2026-11-01", market: "Public Market" },
  { id: "egg", name: "Eggs", category: "Other Ingredients", unit: "pc", estimatedPrice: 6, lastUpdated: "2026-11-01", market: "Sari-sari" },
  { id: "tofu", name: "Tofu", category: "Other Ingredients", unit: "block", estimatedPrice: 28, lastUpdated: "2026-11-01", market: "SM Hypermarket" },
  { id: "cheese", name: "Cheese", category: "Other Ingredients", unit: "pack", estimatedPrice: 55, lastUpdated: "2026-11-01", market: "SM Hypermarket" },
  { id: "coconut-milk", name: "Coconut milk", category: "Other Ingredients", unit: "can", estimatedPrice: 35, lastUpdated: "2026-11-01", market: "SM Hypermarket" },
  { id: "soy-sauce", name: "Soy sauce", category: "Other Ingredients", unit: "bottle", estimatedPrice: 30, lastUpdated: "2026-11-01", market: "SM Hypermarket" },
  { id: "vinegar", name: "Vinegar", category: "Other Ingredients", unit: "bottle", estimatedPrice: 22, lastUpdated: "2026-11-01", market: "SM Hypermarket" },
  { id: "fish-sauce", name: "Fish sauce", category: "Other Ingredients", unit: "bottle", estimatedPrice: 34, lastUpdated: "2026-11-01", market: "SM Hypermarket" },
  { id: "oyster-sauce", name: "Oyster sauce", category: "Other Ingredients", unit: "bottle", estimatedPrice: 38, lastUpdated: "2026-11-01", market: "SM Hypermarket" },
  { id: "tomato-sauce", name: "Tomato sauce", category: "Other Ingredients", unit: "bottle", estimatedPrice: 27, lastUpdated: "2026-11-01", market: "SM Hypermarket" },
  { id: "flour", name: "Flour", category: "Other Ingredients", unit: "pack", estimatedPrice: 40, lastUpdated: "2026-11-01", market: "SM Hypermarket" },
  { id: "cornstarch", name: "Cornstarch", category: "Other Ingredients", unit: "pack", estimatedPrice: 28, lastUpdated: "2026-11-01", market: "SM Hypermarket" },
];

const recipes: Recipe[] = [
  {
    id: "chicken-adobo",
    name: "Chicken Adobo",
    description: "Tender chicken simmered in soy sauce, vinegar, garlic, and bay leaves.",
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=900&q=80",
    meal: "Lunch",
    servings: 4,
    prepMinutes: 15,
    cookMinutes: 30,
    difficulty: "Easy",
    estimatedTotalCost: 240,
    ingredients: [
      { ingredientId: "chicken", quantity: 1, unit: "kg" },
      { ingredientId: "soy-sauce", quantity: 3, unit: "tbsp" },
      { ingredientId: "vinegar", quantity: 3, unit: "tbsp" },
      { ingredientId: "garlic", quantity: 5, unit: "cloves" },
      { ingredientId: "onion", quantity: 1, unit: "pc" },
      { ingredientId: "water", quantity: 1, unit: "cup" },
    ],
    steps: [
      "Marinate chicken with soy sauce, vinegar, and crushed garlic.",
      "Heat oil and brown the chicken lightly on both sides.",
      "Add onion and remaining marinade to the pan.",
      "Simmer until the sauce reduces and chicken is tender.",
      "Serve hot with steamed rice.",
    ],
    tips: [
      "Add bay leaves for a richer adobo aroma.",
      "Balance the vinegar with a pinch of sugar if needed.",
    ],
  },
  {
    id: "ginisang-sardinas",
    name: "Ginisang Sardinas",
    description: "A quick, protein-packed, affordable dish made with sardines and vegetables.",
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80",
    meal: "Dinner",
    servings: 3,
    prepMinutes: 10,
    cookMinutes: 15,
    difficulty: "Easy",
    estimatedTotalCost: 110,
    ingredients: [
      { ingredientId: "sardines", quantity: 2, unit: "cans" },
      { ingredientId: "tomato", quantity: 2, unit: "pcs" },
      { ingredientId: "onion", quantity: 1, unit: "pc" },
      { ingredientId: "garlic", quantity: 3, unit: "cloves" },
      { ingredientId: "bell-pepper", quantity: 1, unit: "pc" },
    ],
    steps: [
      "Sauté garlic and onion until fragrant.",
      "Add tomatoes and bell pepper until soft.",
      "Add sardines and simmer gently.",
      "Season with salt, pepper, and a splash of soy sauce.",
      "Serve with rice.",
    ],
    tips: [
      "Use a little vinegar for extra tang.",
      "Great with fried egg if you need a fuller meal.",
    ],
  },
  {
    id: "tortang-talong",
    name: "Tortang Talong",
    description: "Grilled eggplant topped with egg and pan-fried until golden and savory.",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80",
    meal: "Breakfast",
    servings: 2,
    prepMinutes: 15,
    cookMinutes: 20,
    difficulty: "Easy",
    estimatedTotalCost: 95,
    ingredients: [
      { ingredientId: "eggplant", quantity: 2, unit: "pcs" },
      { ingredientId: "egg", quantity: 3, unit: "pcs" },
      { ingredientId: "onion", quantity: 1, unit: "pc" },
      { ingredientId: "garlic", quantity: 2, unit: "cloves" },
      { ingredientId: "flour", quantity: 1, unit: "tbsp" },
    ],
    steps: [
      "Roast eggplant until soft and charred.",
      "Peel and mash the roasted eggplant.",
      "Mix with beaten egg, onion, garlic, and flour.",
      "Pan-fry until golden on both sides.",
      "Serve with vinegar or tomato sauce.",
    ],
    tips: [
      "Add minced pork if you have extra budget.",
      "Use a non-stick pan to keep the omelet tender.",
    ],
  },
  {
    id: "tokwa-sisig",
    name: "Tokwa with Soy Garlic Sauce",
    description: "Crispy tofu with a garlicky soy glaze that is easy on the budget and palate.",
    image: "https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=900&q=80",
    meal: "Dinner",
    servings: 3,
    prepMinutes: 15,
    cookMinutes: 25,
    difficulty: "Moderate",
    estimatedTotalCost: 150,
    ingredients: [
      { ingredientId: "tofu", quantity: 2, unit: "blocks" },
      { ingredientId: "soy-sauce", quantity: 2, unit: "tbsp" },
      { ingredientId: "garlic", quantity: 4, unit: "cloves" },
      { ingredientId: "onion", quantity: 1, unit: "pc" },
      { ingredientId: "vinegar", quantity: 1, unit: "tbsp" },
    ],
    steps: [
      "Press tofu and cube it before frying.",
      "Brown tofu in a shallow pan until crisp.",
      "Sauté garlic and onion until fragrant.",
      "Add soy sauce and vinegar, then toss in the tofu.",
      "Serve with chili or steamed rice.",
    ],
    tips: [
      "A sprinkle of pepper adds a nice warm finish.",
      "Add sliced mushrooms if you have them on hand.",
    ],
  },
  {
    id: "ginataang-kalabasa",
    name: "Ginataang Kalabasa with Shrimp",
    description: "A creamy coconut dish with squash, shrimp, and leafy greens.",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80",
    meal: "Lunch",
    servings: 4,
    prepMinutes: 20,
    cookMinutes: 25,
    difficulty: "Moderate",
    estimatedTotalCost: 260,
    ingredients: [
      { ingredientId: "squash", quantity: 1, unit: "pc" },
      { ingredientId: "shrimp", quantity: 0.5, unit: "kg" },
      { ingredientId: "coconut-milk", quantity: 1, unit: "can" },
      { ingredientId: "garlic", quantity: 4, unit: "cloves" },
      { ingredientId: "onion", quantity: 1, unit: "pc" },
    ],
    steps: [
      "Sauté garlic and onion until aromatic.",
      "Add squash and cook until lightly softened.",
      "Pour in coconut milk and simmer gently.",
      "Add shrimp and continue cooking until pink.",
      "Season and serve with rice.",
    ],
    tips: [
      "Try adding malunggay for extra nutrition.",
      "Use a bit of fish sauce to deepen the savory notes.",
    ],
  },
];

const safeCopy = (value: string) =>
  typeof navigator !== "undefined" && navigator.clipboard
    ? navigator.clipboard.writeText(value)
    : Promise.resolve();

export default function Home() {
  const [ingredients, setIngredients] = useState<Ingredient[]>(baseIngredients);
  const [selectedIngredientIds, setSelectedIngredientIds] = useState<string[]>(() => {
    if (typeof window === "undefined") {
      return ["onion", "garlic", "tomato", "egg", "sardines"];
    }

    try {
      const saved = window.localStorage.getItem("ulam-selected-ingredients");
      if (!saved) {
        return ["onion", "garlic", "tomato", "egg", "sardines"];
      }
      const parsed = JSON.parse(saved) as string[];
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : ["onion", "garlic", "tomato", "egg", "sardines"];
    } catch {
      return ["onion", "garlic", "tomato", "egg", "sardines"];
    }
  });
  const [inventory, setInventory] = useState<Record<string, number>>({
    onion: 2,
    garlic: 3,
    tomato: 2,
    egg: 6,
    sardines: 2,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [customIngredientName, setCustomIngredientName] = useState("");
  const [customIngredientCategory, setCustomIngredientCategory] =
    useState<IngredientCategory>("Other Ingredients");
  const [budget, setBudget] = useState<number>(() => {
    if (typeof window === "undefined") return 150;
    const saved = window.localStorage.getItem("ulam-budget");
    if (!saved) return 150;
    const parsed = Number.parseInt(saved, 10);
    return Number.isNaN(parsed) ? 150 : parsed;
  });
  const [customBudget, setCustomBudget] = useState("");
  const [servings, setServings] = useState(3);
  const [meal, setMeal] = useState<MealType>("Lunch");
  const [prepTimeLimit, setPrepTimeLimit] = useState(45);
  const [difficulty, setDifficulty] = useState<Difficulty>("Moderate");
  const [sortMode, setSortMode] = useState<SortMode>("highest-match");
  const [selectedRecipeId, setSelectedRecipeId] = useState("chicken-adobo");
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = window.localStorage.getItem("ulam-favorites");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [cookingHistory, setCookingHistory] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = window.localStorage.getItem("ulam-history");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    window.localStorage.setItem("ulam-favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    window.localStorage.setItem("ulam-history", JSON.stringify(cookingHistory));
  }, [cookingHistory]);

  useEffect(() => {
    window.localStorage.setItem("ulam-budget", String(budget));
  }, [budget]);

  useEffect(() => {
    window.localStorage.setItem(
      "ulam-selected-ingredients",
      JSON.stringify(selectedIngredientIds),
    );
  }, [selectedIngredientIds]);

  const ingredientMap = useMemo(
    () => Object.fromEntries(ingredients.map((ingredient) => [ingredient.id, ingredient])),
    [ingredients],
  );

  const filteredIngredients = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return ingredients.filter((ingredient) => {
      const matchesQuery =
        query.length === 0 ||
        ingredient.name.toLowerCase().includes(query) ||
        ingredient.category.toLowerCase().includes(query);
      return matchesQuery;
    });
  }, [ingredients, searchTerm]);

  const toggleIngredient = (ingredientId: string) => {
    setSelectedIngredientIds((current) =>
      current.includes(ingredientId)
        ? current.filter((id) => id !== ingredientId)
        : [...current, ingredientId],
    );
  };

  const handleSelectCategory = (category: IngredientCategory, mode: "all" | "clear") => {
    const categoryIds = ingredients
      .filter((ingredient) => ingredient.category === category)
      .map((ingredient) => ingredient.id);

    setSelectedIngredientIds((current) => {
      const next = new Set(current);
      if (mode === "all") {
        categoryIds.forEach((id) => next.add(id));
      } else {
        categoryIds.forEach((id) => next.delete(id));
      }
      return Array.from(next);
    });
  };

  const addCustomIngredient = () => {
    const value = customIngredientName.trim();
    if (!value) return;

    const nextId = value.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const alreadyExists = ingredients.some((ingredient) => ingredient.id === nextId);
    if (alreadyExists) {
      setSelectedIngredientIds((current) =>
        current.includes(nextId) ? current : [...current, nextId],
      );
      setCustomIngredientName("");
      return;
    }

    const customIngredient: Ingredient = {
      id: nextId,
      name: value,
      category: customIngredientCategory,
      unit: "pc",
      estimatedPrice: 30,
      lastUpdated: "2026-11-11",
      market: "User-added",
    };

    setIngredients((current) => [...current, customIngredient]);
    setSelectedIngredientIds((current) => [...current, customIngredient.id]);
    setCustomIngredientName("");
  };

  const recommendationResults = useMemo(() => {
    const selectedSet = new Set(selectedIngredientIds);

    return [...recipes]
      .map((recipe) => {
        const ownedIngredients = recipe.ingredients.filter((item) => selectedSet.has(item.ingredientId));
        const missingIngredients = recipe.ingredients.filter((item) => !selectedSet.has(item.ingredientId));
        const matchPercentage = Math.round(
          (ownedIngredients.length / recipe.ingredients.length) * 100,
        );
        const additionalCost = missingIngredients.reduce((total, item) => {
          const ingredient = ingredientMap[item.ingredientId];
          const price = ingredient?.estimatedPrice ?? 0;
          return total + Math.max(price * item.quantity, 0);
        }, 0);
        const totalCost = recipe.estimatedTotalCost;
        const fitsBudget = totalCost <= budget;
        const worksForTime = recipe.prepMinutes + recipe.cookMinutes <= prepTimeLimit;
        const difficultyEnough =
          (difficulty === "Easy" && recipe.difficulty === "Easy") ||
          (difficulty === "Moderate" && recipe.difficulty !== "Advanced") ||
          (difficulty === "Advanced" && recipe.difficulty !== "Easy");

        const score =
          matchPercentage * 2 +
          (fitsBudget ? 18 : 0) +
          (worksForTime ? 10 : 0) +
          (difficultyEnough ? 8 : 0) -
          Math.min(totalCost / 10, 40);

        return {
          ...recipe,
          ownedIngredients,
          missingIngredients,
          matchPercentage,
          additionalCost,
          fitsBudget,
          worksForTime,
          difficultyEnough,
          score,
        };
      })
      .sort((a, b) => {
        if (sortMode === "lowest-price") {
          return a.estimatedTotalCost - b.estimatedTotalCost;
        }
        if (sortMode === "fastest-cook") {
          return a.cookMinutes + a.prepMinutes - (b.cookMinutes + b.prepMinutes);
        }
        return b.matchPercentage - a.matchPercentage || a.estimatedTotalCost - b.estimatedTotalCost;
      });
  }, [budget, difficulty, ingredientMap, prepTimeLimit, selectedIngredientIds, sortMode]);

  const isCustomBudgetMode = customBudget.trim() !== "";
  const activeBudget = isCustomBudgetMode ? Number.parseInt(customBudget, 10) || 0 : budget;

  const selectedRecipe =
    recipes.find((recipe) => recipe.id === selectedRecipeId) ?? recommendationResults[0] ?? recipes[0];

  const shoppingList = selectedRecipe.ingredients.filter((item) => {
    const neededCount = inventory[item.ingredientId] ?? 0;
    return neededCount < item.quantity;
  });

  const remainingShoppingCost = shoppingList.reduce((total, item) => {
    const ingredient = ingredientMap[item.ingredientId];
    const estimatedPrice = ingredient?.estimatedPrice ?? 0;
    const neededQuantity = Math.max(item.quantity - (inventory[item.ingredientId] ?? 0), 0);
    return total + estimatedPrice * neededQuantity;
  }, 0);

  const toggleFavorite = (recipeId: string) => {
    setFavorites((current) =>
      current.includes(recipeId)
        ? current.filter((id) => id !== recipeId)
        : [...current, recipeId],
    );
  };

  const handleRecipeSelect = (recipeId: string) => {
    setSelectedRecipeId(recipeId);
    setCookingHistory((current) => [recipeId, ...current.filter((id) => id !== recipeId)].slice(0, 5));
  };

  const copyShoppingList = async () => {
    const lines = shoppingList.map((item) => {
      const ingredient = ingredientMap[item.ingredientId];
      return `${ingredient?.name ?? item.ingredientId}: ${item.quantity} ${item.unit}`;
    });
    await safeCopy(["Anong Ulam? shopping list", ...lines].join("\n"));
  };

  const totalSelected = selectedIngredientIds.length;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#fff7ed,_#fff_40%,_#f8fafc_100%)] text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        <header className="mb-8 flex flex-col gap-4 rounded-[28px] border border-amber-200 bg-white/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-700">
              <ChefHat className="h-7 w-7" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.24em] text-amber-700">Filipino meal planner</p>
              <h1 className="text-3xl font-semibold text-slate-900">Anong Ulam?</h1>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 text-sm text-slate-700">
            <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-emerald-700">{totalSelected} ingredients selected</span>
            <span className="rounded-full bg-sky-50 px-3 py-1.5 text-sky-700">₱{budget} budget</span>
            <span className="rounded-full bg-violet-50 px-3 py-1.5 text-violet-700">{servings} servings</span>
          </div>
        </header>

        <section className="grid gap-6 xl:grid-cols-[1.2fr_0.9fr]">
          <div className="space-y-6">
            <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Ingredient selection</p>
                  <h2 className="mt-1 text-xl font-semibold">What&apos;s in your kitchen?</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedIngredientIds([])}
                  className="rounded-full border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:border-slate-500 hover:text-slate-900"
                >
                  Clear all
                </button>
              </div>

              <label className="relative mb-4 block">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search ingredients"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-amber-400 focus:bg-white"
                />
              </label>

              <div className="space-y-5">
                {(["Meat", "Seafood", "Vegetables", "Other Ingredients"] as IngredientCategory[]).map((category) => {
                  const categoryItems = filteredIngredients.filter((ingredient) => ingredient.category === category);
                  if (categoryItems.length === 0) return null;

                  return (
                    <div key={category} className="space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">{category}</h3>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleSelectCategory(category, "all")}
                            className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-200"
                          >
                            Select all
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSelectCategory(category, "clear")}
                            className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-200"
                          >
                            Clear
                          </button>
                        </div>
                      </div>

                      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                        {categoryItems.map((ingredient) => {
                          const isSelected = selectedIngredientIds.includes(ingredient.id);
                          const stock = inventory[ingredient.id] ?? 0;

                          return (
                            <div
                              key={ingredient.id}
                              className={`rounded-2xl border p-3 transition ${
                                isSelected
                                  ? "border-amber-400 bg-amber-50 shadow-sm"
                                  : "border-slate-200 bg-slate-50 hover:border-slate-300"
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <button
                                  type="button"
                                  onClick={() => toggleIngredient(ingredient.id)}
                                  className="flex-1 text-left"
                                >
                                  <div className="flex items-center justify-between gap-2">
                                    <span className="text-sm font-medium text-slate-800">{ingredient.name}</span>
                                    {isSelected && (
                                      <span className="rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                                        Selected
                                      </span>
                                    )}
                                  </div>
                                  <p className="mt-1 text-[11px] text-slate-500">≈ ₱{ingredient.estimatedPrice}/{ingredient.unit}</p>
                                </button>
                              </div>
                              <div className="mt-3 flex items-center gap-2">
                                <label className="text-[11px] font-medium uppercase tracking-[0.15em] text-slate-500">Have</label>
                                <input
                                  type="number"
                                  min={0}
                                  value={stock}
                                  onChange={(event) =>
                                    setInventory((current) => ({
                                      ...current,
                                      [ingredient.id]: Number.parseInt(event.target.value, 10) || 0,
                                    }))
                                  }
                                  className="w-16 rounded-lg border border-slate-200 bg-white px-2 py-1 text-sm outline-none focus:border-amber-400"
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-end">
                  <div className="flex-1">
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                      Custom ingredient
                    </label>
                    <input
                      value={customIngredientName}
                      onChange={(event) => setCustomIngredientName(event.target.value)}
                      placeholder="Add your own ingredient"
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-amber-400"
                    />
                  </div>
                  <div className="min-w-[180px]">
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                      Category
                    </label>
                    <select
                      value={customIngredientCategory}
                      onChange={(event) =>
                        setCustomIngredientCategory(event.target.value as IngredientCategory)
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-amber-400"
                    >
                      {(["Meat", "Seafood", "Vegetables", "Other Ingredients"] as IngredientCategory[]).map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="button"
                    onClick={addCustomIngredient}
                    className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700"
                  >
                    Add item
                  </button>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Budget configuration</p>
                  <h2 className="mt-1 text-xl font-semibold">Plan your meal</h2>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-700">
                  <Wallet className="h-4 w-4" />
                  ₱{activeBudget || 0}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Available budget</label>
                  <div className="flex flex-wrap gap-2">
                    {budgetOptions.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => {
                          setBudget(option);
                          setCustomBudget("");
                        }}
                        className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                          budget === option && customBudget === ""
                            ? "bg-amber-500 text-white shadow-sm"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        ₱{option}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={0}
                      value={customBudget}
                      onChange={(event) => {
                        setCustomBudget(event.target.value);
                        const value = Number.parseInt(event.target.value, 10);
                        if (!Number.isNaN(value)) setBudget(value);
                      }}
                      placeholder="Custom budget"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Servings</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={servings}
                    onChange={(event) => setServings(Number.parseInt(event.target.value, 10) || 1)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-3">
                  <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Meal</label>
                  <select
                    value={meal}
                    onChange={(event) => setMeal(event.target.value as MealType)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-amber-400"
                  >
                    {mealOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Max cooking time</label>
                  <input
                    type="number"
                    min={15}
                    max={120}
                    value={prepTimeLimit}
                    onChange={(event) => setPrepTimeLimit(Number.parseInt(event.target.value, 10) || 30)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-amber-400"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Cooking difficulty
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {difficultyOptions.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setDifficulty(option)}
                        className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                          difficulty === option
                            ? "bg-violet-600 text-white shadow-sm"
                            : "bg-violet-50 text-violet-700 hover:bg-violet-100"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-[28px] border border-slate-200 bg-slate-900 p-5 text-slate-50 shadow-[0_20px_50px_rgba(15,23,42,0.18)]">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">Recommendation engine</p>
                  <h2 className="mt-1 text-xl font-semibold">Best picks for you</h2>
                </div>
                <Sparkles className="h-5 w-5 text-amber-300" />
              </div>

              <div className="mb-4 flex items-center justify-between gap-3 rounded-2xl border border-slate-700 bg-slate-800/60 p-3">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.15em] text-slate-400">Current match</p>
                  <p className="text-lg font-semibold text-white">{recommendationResults[0]?.matchPercentage ?? 0}%</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.15em] text-slate-400">Budget fit</p>
                  <p className="text-lg font-semibold text-emerald-300">
                    {recommendationResults.some((item) => item.fitsBudget) ? "Within budget" : "Tight on budget"}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {recommendationResults.slice(0, 4).map((recipe, index) => (
                  <button
                    key={recipe.id}
                    type="button"
                    onClick={() => handleRecipeSelect(recipe.id)}
                    className={`w-full rounded-2xl border p-3 text-left transition ${
                      selectedRecipe.id === recipe.id
                        ? "border-amber-400 bg-slate-800"
                        : "border-slate-700 bg-slate-800/40 hover:border-slate-500"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-white">{index === 0 ? "Best Budget Choice" : recipe.name}</p>
                        <p className="mt-1 text-xs text-slate-300">
                          {recipe.matchPercentage}% ingredient match · ₱{recipe.estimatedTotalCost}
                        </p>
                      </div>
                      <span className="rounded-full bg-amber-500/15 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-amber-200">
                        {index === 0 ? "Top pick" : recipe.meal}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Saved preferences</p>
                  <h2 className="mt-1 text-xl font-semibold">Favorites & history</h2>
                </div>
                <Heart className="h-5 w-5 text-rose-500" />
              </div>

              <div className="mt-4 space-y-3 text-sm text-slate-700">
                <div className="rounded-2xl bg-rose-50 p-3">
                  <p className="text-[11px] uppercase tracking-[0.15em] text-rose-500">Favorites</p>
                  <p className="mt-2 font-medium text-slate-800">
                    {favorites.length > 0 ? favorites.map((id) => recipes.find((recipe) => recipe.id === id)?.name || "").filter(Boolean).join(", ") : "No favorites saved yet"}
                  </p>
                </div>
                <div className="rounded-2xl bg-sky-50 p-3">
                  <p className="text-[11px] uppercase tracking-[0.15em] text-sky-500">Cooking history</p>
                  <p className="mt-2 font-medium text-slate-800">
                    {cookingHistory.length > 0 ? cookingHistory.map((id) => recipes.find((recipe) => recipe.id === id)?.name || "").filter(Boolean).join(", ") : "No recent dishes yet"}
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </section>

        <section className="mt-8 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Recommendation board</p>
              <h2 className="mt-1 text-2xl font-semibold">Top ulam suggestions</h2>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Sort by</label>
              <select
                value={sortMode}
                onChange={(event) => setSortMode(event.target.value as SortMode)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-amber-400"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {recommendationResults.map((recipe, index) => {
              const isFavorite = favorites.includes(recipe.id);
              const totalTime = recipe.prepMinutes + recipe.cookMinutes;
              const badges = [
                index === 0 ? "Best Budget Choice" : null,
                recipe.matchPercentage >= 70 ? "Best Ingredient Match" : null,
                totalTime <= 35 ? "Quickest to Cook" : null,
                recipe.servings >= 4 ? "Best for Family" : null,
              ].filter(Boolean) as string[];

              return (
                <article
                  key={recipe.id}
                  className={`overflow-hidden rounded-[26px] border bg-slate-50 ${
                    selectedRecipe.id === recipe.id ? "border-amber-400 shadow-md" : "border-slate-200"
                  }`}
                >
                  <div className="relative h-44 overflow-hidden">
                    <img src={recipe.image} alt={recipe.name} className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => toggleFavorite(recipe.id)}
                      className="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-rose-500 shadow-sm transition hover:scale-105"
                    >
                      <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
                    </button>
                  </div>
                  <div className="p-4">
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-xl font-semibold text-slate-900">{recipe.name}</h3>
                        <p className="mt-1 text-sm text-slate-600">{recipe.description}</p>
                      </div>
                      <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
                        {recipe.matchPercentage}% match
                      </span>
                    </div>

                    <div className="mb-4 flex flex-wrap gap-2">
                      {badges.map((badge) => (
                        <span key={badge} className="rounded-full bg-slate-200 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-700">
                          {badge}
                        </span>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm text-slate-700">
                      <div className="rounded-xl bg-white p-2.5">
                        <p className="text-[11px] uppercase tracking-[0.15em] text-slate-500">Cost</p>
                        <p className="mt-1 font-semibold text-slate-900">₱{recipe.estimatedTotalCost}</p>
                      </div>
                      <div className="rounded-xl bg-white p-2.5">
                        <p className="text-[11px] uppercase tracking-[0.15em] text-slate-500">Per serving</p>
                        <p className="mt-1 font-semibold text-slate-900">₱{Math.round(recipe.estimatedTotalCost / recipe.servings)}</p>
                      </div>
                      <div className="rounded-xl bg-white p-2.5">
                        <p className="text-[11px] uppercase tracking-[0.15em] text-slate-500">Prep</p>
                        <p className="mt-1 font-semibold text-slate-900">{recipe.prepMinutes}m</p>
                      </div>
                      <div className="rounded-xl bg-white p-2.5">
                        <p className="text-[11px] uppercase tracking-[0.15em] text-slate-500">Cook</p>
                        <p className="mt-1 font-semibold text-slate-900">{recipe.cookMinutes}m</p>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-3">
                      <p className="text-sm text-slate-600">
                        Need {recipe.missingIngredients.length} extra ingredients
                      </p>
                      <button
                        type="button"
                        onClick={() => handleRecipeSelect(recipe.id)}
                        className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
                      >
                        View recipe
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mt-8 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Recipe details</p>
                <h2 className="mt-1 text-2xl font-semibold">{selectedRecipe.name}</h2>
              </div>
              <button
                type="button"
                onClick={() => handleRecipeSelect(selectedRecipe.id)}
                className="rounded-full bg-amber-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-amber-600"
              >
                Save to history
              </button>
            </div>

            <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-slate-50">
              <img src={selectedRecipe.image} alt={selectedRecipe.name} className="h-64 w-full object-cover" />
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-slate-50 p-3">
                <p className="text-[11px] uppercase tracking-[0.15em] text-slate-500">Servings</p>
                <p className="mt-1 font-semibold text-slate-900">{selectedRecipe.servings}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-3">
                <p className="text-[11px] uppercase tracking-[0.15em] text-slate-500">Prep</p>
                <p className="mt-1 font-semibold text-slate-900">{selectedRecipe.prepMinutes} mins</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-3">
                <p className="text-[11px] uppercase tracking-[0.15em] text-slate-500">Cook</p>
                <p className="mt-1 font-semibold text-slate-900">{selectedRecipe.cookMinutes} mins</p>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-700">Ingredient breakdown</p>
              <div className="mt-3 overflow-x-auto">
                <table className="min-w-full text-left text-sm text-slate-700">
                  <thead>
                    <tr className="border-b border-slate-200 text-[11px] uppercase tracking-[0.14em] text-slate-500">
                      <th className="py-2 pr-4">Ingredient</th>
                      <th className="py-2 pr-4">Qty</th>
                      <th className="py-2 pr-4">Unit</th>
                      <th className="py-2 pr-4">Status</th>
                      <th className="py-2 pr-4">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedRecipe.ingredients.map((item) => {
                      const ingredient = ingredientMap[item.ingredientId];
                      const alreadyOwned = (inventory[item.ingredientId] ?? 0) >= item.quantity;
                      return (
                        <tr key={`${selectedRecipe.id}-${item.ingredientId}`} className="border-b border-slate-100 last:border-none">
                          <td className="py-2 pr-4 font-medium text-slate-800">{ingredient?.name ?? item.ingredientId}</td>
                          <td className="py-2 pr-4">{item.quantity}</td>
                          <td className="py-2 pr-4">{item.unit}</td>
                          <td className="py-2 pr-4">
                            <span className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-wide ${alreadyOwned ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                              {alreadyOwned ? "Owned" : "Buy"}
                            </span>
                          </td>
                          <td className="py-2 pr-4">₱{ingredient?.estimatedPrice ?? 0}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-5">
              <h3 className="text-lg font-semibold text-slate-900">Cooking instructions</h3>
              <ol className="mt-4 space-y-3">
                {selectedRecipe.steps.map((step, index) => (
                  <li key={`${selectedRecipe.id}-step-${index}`} className="flex gap-3 rounded-2xl bg-slate-50 p-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                      {index + 1}
                    </span>
                    <span className="pt-1 text-sm text-slate-700">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              {selectedRecipe.tips.map((tip) => (
                <span key={tip} className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700">
                  {tip}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Shopping list</p>
                  <h2 className="mt-1 text-xl font-semibold">Next purchases</h2>
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={copyShoppingList} className="rounded-full border border-slate-200 p-2 text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
                    <Copy className="h-4 w-4" />
                  </button>
                  <button type="button" onClick={() => window.print()} className="rounded-full border border-slate-200 p-2 text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
                    <Printer className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <ul className="mt-4 space-y-2">
                {shoppingList.length > 0 ? (
                  shoppingList.map((item) => {
                    const ingredient = ingredientMap[item.ingredientId];
                    const key = `${selectedRecipe.id}-${item.ingredientId}`;
                    const isChecked = checkedItems[key] ?? false;
                    const neededQuantity = Math.max(item.quantity - (inventory[item.ingredientId] ?? 0), 0);

                    return (
                      <li key={key} className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                        <label className="flex items-center gap-3 text-sm text-slate-700">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() =>
                              setCheckedItems((current) => ({
                                ...current,
                                [key]: !isChecked,
                              }))
                            }
                            className="h-4 w-4 rounded border-slate-300 text-amber-500 focus:ring-amber-400"
                          />
                          <span className={isChecked ? "line-through text-slate-400" : ""}>
                            {ingredient?.name ?? item.ingredientId} · {neededQuantity} {item.unit}
                          </span>
                        </label>
                        <span className="text-xs font-medium text-slate-500">₱{ingredient?.estimatedPrice ?? 0}</span>
                      </li>
                    );
                  })
                ) : (
                  <li className="rounded-2xl border border-dashed border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
                    You already have everything needed for this recipe.
                  </li>
                )}
              </ul>

              <div className="mt-5 rounded-2xl bg-slate-900 p-4 text-slate-50">
                <p className="text-[11px] uppercase tracking-[0.15em] text-slate-300">Remaining shopping cost</p>
                <p className="mt-2 flex items-center gap-2 text-2xl font-semibold text-white">
                  <DollarSign className="h-5 w-5 text-emerald-300" />
                  ₱{remainingShoppingCost}
                </p>
              </div>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Price database</p>
                  <h2 className="mt-1 text-xl font-semibold">Philippine market estimates</h2>
                </div>
                <Clock3 className="h-5 w-5 text-sky-600" />
              </div>
              <p className="mt-3 text-sm text-slate-600">
                Pricing reflects estimated local market ranges for planning, not live API data.
              </p>
              <div className="mt-4 space-y-2">
                {ingredients.slice(0, 6).map((ingredient) => (
                  <div key={ingredient.id} className="flex items-center justify-between rounded-2xl bg-slate-50 p-3 text-sm text-slate-700">
                    <span className="font-medium text-slate-800">{ingredient.name}</span>
                    <span>₱{ingredient.estimatedPrice}/{ingredient.unit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {activeBudget > 0 && activeBudget < 100 && (
          <section className="mt-8 rounded-[28px] border border-amber-200 bg-amber-50 p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <Wallet className="h-5 w-5 text-amber-700" />
              <div>
                <p className="text-lg font-semibold text-amber-900">Budget warning</p>
                <p className="text-sm text-amber-800">
                  Your budget is tight. Try affordable dishes like Ginisang Sardinas, Tortang Talong, or Tokwa with Soy Garlic Sauce first.
                </p>
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
