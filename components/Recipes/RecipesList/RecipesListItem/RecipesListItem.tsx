//2026-06-01 : Using FadeComponent for animations

//2025-11-21 : Moving common UI elements into their own folder

//2025-10-20 : Key for the key gods

import React from "react";
import Recipe from "@/Types/Recipe";
import { PressableComponent, LabelText, FadeComponent } from "@/ui/BestBeforeUI";

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
                <LabelText >Difficulty: {recipe.Recipe_Difficulty}</LabelText>
            </PressableComponent>
        </FadeComponent>
    );
}