//2025-11-17 : Added Docs, corrected styles and naming

//2025-10-31 : Implementation for the switcher between recipes list and recipe breakdown

//2025-10-28 : Simple initial implementation

import React, { useState } from "react";
import Recipe_Plan from "@/Types/Recipe_Plan";
import RecipePlanActiveDayRecipes from "./RecipePlanActiveDayRecipes/RecipePlanActiveDayRecipes";
import RecipePlanIngredients from "./RecipePlanIngredients/RecipePlanIngredients";
import ComponentView from "@/components/CustomComponents/ScrollableComponent";
import LabelText from "@/components/CustomComponents/LabelText";

/**
 * React Component for displaying the active day view of the Recipe Planner
 * Switches between displaying the list of recipes for the selected day and the ingredients for the selected recipe
 * 
 * @param selectedDate The date selected in the calendar view
 * @states selectedRecipe/setSelectedRecipe The recipe selected from the list of recipes for the day
 * @returns React Component
 */

export default function RecipePlanner({selectedDate}: {selectedDate: Date | null}) {
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe_Plan | null>(null);
    
    return (
        <ComponentView style={{flex: 1, padding: 10}}>
            <LabelText>{selectedDate ? selectedDate.toDateString() : "No Date Selected"}</LabelText>
            {selectedRecipe ? 
            (<RecipePlanIngredients recipePlan={selectedRecipe} />) : 
            (<RecipePlanActiveDayRecipes date={selectedDate ? selectedDate : new Date()} setSelectedRecipePlan={setSelectedRecipe} />)}
        </ComponentView>
    );
}