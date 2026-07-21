//2026-07-21 : Recipe_Difficulty changed to Recipe_Rating
//2026-07-16 : Added function descriptions
//2026-06-01 : Using FadeComponent for animations

//2025-11-21 : Moving common UI elements into their own folder

//2025-10-20 : Key for the key gods

import React from "react";
import Recipe from "@/Types/Recipe";
import { PressableComponent, LabelText, FadeComponent } from "@/ui/BestBeforeUI";

/**
 * RecipesListItem component
 * @param recipe - The recipe to display in the list item
 * @param setSelectedRecipe - Callback function to set the selected recipe in the parent component
 * @returns A component that displays a summary of the recipe and allows selection
 */
export default function RecipesListItem({ recipe, setSelectedRecipe }: { key: string, recipe: Recipe, setSelectedRecipe: (recipe: Recipe) => void }) {
    return (
        <FadeComponent style={{padding: 0}}>
            <PressableComponent
                aria-label="recipe item summary"
                onPress={() => setSelectedRecipe(recipe)}
                style={{margin : 0}}
            > 
                <LabelText >{recipe.Recipe_Name}</LabelText>
                <LabelText >Time: {recipe.Recipe_Time} min</LabelText>
                <LabelText >Rating: {recipe.Recipe_Rating}</LabelText>
            </PressableComponent>
        </FadeComponent>
    );
}