//2026-07-21 : Recipe_Difficulty changed to Recipe_Rating
//2026-06-18 : Allow undefined numeric fields

import Recipe_Ingredient from './Recipe_Ingredient';

interface Recipe {
    Recipe_ID?: number;
    Recipe_Name: string;
    Recipe_Rating?: number;
    Recipe_Time?: number;
    Recipe_Instructions?: string;
    Recipe_Ingredients?: Recipe_Ingredient[];
}

export interface RecipesSearchOptions {
    searchText?: string;
    sortBy?: "Recipe_Name" | "Recipe_Rating" | "Recipe_Time";
    sortOrder?: "asc" | "desc";
    amount?: number;
}

export default Recipe;