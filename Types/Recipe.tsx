import Recipe_Ingredient from './Recipe_Ingredient';

interface Recipe {
    Recipe_ID?: number;
    Recipe_Name: string;
    Recipe_Difficulty: number;
    Recipe_Time: number;
    Recipe_Instructions?: string;
    Recipe_Ingredients?: Recipe_Ingredient[];
}

export interface RecipesSearchOptions {
    searchText?: string;
    sortBy?: "Recipe_Name" | "Recipe_Difficulty" | "Recipe_Time";
    sortOrder?: "asc" | "desc";
    amount?: number;
}

export default Recipe;