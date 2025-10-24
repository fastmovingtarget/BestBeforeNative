//2025-10-20 : Switched to using recipes context, added key to stop list complaining

import React from "react";
import Recipe from "@/Types/Recipe";
import RecipesListItem from "./RecipesListItem/RecipesListItem";
import ListView from "@/components/CustomComponents/ListView";
import { useRecipes } from "@/Contexts/Recipes/RecipesDataProvider";

export default function RecipesList({ setSelectedRecipe }: { setSelectedRecipe: (recipe: Recipe) => void }) {
    const { recipes } = useRecipes();

    return (
        <ListView>
            {recipes.map((recipe: Recipe) => (
                <RecipesListItem
                    key={`recipe-list-item-${recipe.Recipe_ID}`}
                    recipe={recipe}
                    setSelectedRecipe={setSelectedRecipe}
                />
            ))}
        </ListView>
    );
}