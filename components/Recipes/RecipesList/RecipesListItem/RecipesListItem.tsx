import React from "react";
import PressableComponent from "@/components/PressableComponent";
import LabelText from "@/components/LabelText";
import Recipe from "@/Types/Recipe";

export default function RecipesListItem({ recipe, setSelectedRecipe }: { recipe: Recipe, setSelectedRecipe: (recipe: Recipe) => void }) {
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