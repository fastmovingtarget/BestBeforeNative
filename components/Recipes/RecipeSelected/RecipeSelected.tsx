//2025-11-19 : Ingredient_Name and Ingredient_Quantity now have Recipe_ prefix

//2025-10-20 : Removed unnecessary imports

import React from "react";
import ScrollableComponent from "@/components/CustomComponents/ScrollableComponent";
import LabelText from "@/components/CustomComponents/LabelText";
import Recipe from "@/Types/Recipe";

export default function RecipeSelected({recipe}: { recipe: Recipe}) {
    return (
        <ScrollableComponent>
            <LabelText >{recipe.Recipe_Name}</LabelText>
            <LabelText >Time: {recipe.Recipe_Time} min</LabelText>
            <LabelText >Difficulty: {recipe.Recipe_Difficulty}</LabelText>
            <LabelText >Ingredients:</LabelText>
            {recipe.Recipe_Ingredients?.map((ingredient) => (
                <LabelText key={ingredient.Recipe_Ingredient_ID}>
                    {ingredient.Recipe_Ingredient_Name}: {ingredient.Recipe_Ingredient_Quantity}
                </LabelText>
            ))}
            <LabelText >Instructions:</LabelText>
            <LabelText >{recipe.Recipe_Instructions}</LabelText>
        </ScrollableComponent>
    )
}