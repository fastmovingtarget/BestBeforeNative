//2025-10-20 : Key for the key gods

import React from "react";
import PressableComponent from "@/components/CustomComponents/PressableComponent";
import LabelText from "@/components/CustomComponents/LabelText";
import Recipe from "@/Types/Recipe";

export default function RecipesListItem({ recipe, setSelectedRecipe }: { key: string, recipe: Recipe, setSelectedRecipe: (recipe: Recipe) => void }) {
    return (
        <PressableComponent
            aria-label="recipe item summary"
            onPress={() => setSelectedRecipe(recipe)}
        >
            <LabelText >{recipe.Recipe_Name}</LabelText>
            <LabelText >Time: {recipe.Recipe_Time} min</LabelText>
            <LabelText >Difficulty: {recipe.Recipe_Difficulty}</LabelText>
        </PressableComponent>
    );
}