//2025-10-31 : Implementation for the switcher between recipes list and recipe breakdown

//2025-10-28 : Simple initial implementation

import React, { useState } from "react";
import { Text } from "react-native";
import PageView from "@/components/CustomComponents/PageView";
import Recipe_Plan from "@/Types/Recipe_Plan";
import RecipePlanActiveDayRecipes from "./RecipePlanActiveDayRecipes/RecipePlanActiveDayRecipes";
import RecipePlanActiveDayRecipeIngredients from "./RecipePlanActiveDayRecipeIngredients/RecipePlanActiveDayRecipeIngredients";

export default function RecipePlanner({selectedDate}: {selectedDate: Date | null}) {
    //Active day page moves between selecting a recipe for the day and populating the selected recipe's ingredients
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe_Plan | null>(null);
    
    return (
        <PageView>
            <Text>{selectedDate ? selectedDate.toDateString() : "No Date Selected"}</Text>
            {selectedRecipe ? 
            (<RecipePlanActiveDayRecipeIngredients recipePlan={selectedRecipe} />) : 
            (<RecipePlanActiveDayRecipes date={selectedDate ? selectedDate : new Date()} setSelectedRecipePlan={setSelectedRecipe} />)}
            
        </PageView>
    );
}