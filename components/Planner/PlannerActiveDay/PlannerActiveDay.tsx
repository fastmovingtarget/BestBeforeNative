//2026-06-12 : Shifted FadeComponent wrapper

//2026-06-01 : Using FadeComponent and RowContainer

//2025-11-21 : Moving common UI elements into their own folder

//2025-11-19 : Renamed RecipePlan/nner to just Planner, Recipe_Plan to just Plan

//2025-11-17 : Added Docs, corrected styles and naming

//2025-10-31 : Implementation for the switcher between recipes list and recipe breakdown

//2025-10-28 : Simple initial implementation

import React, { useState } from "react";
import Recipe_Plan from "@/Types/Plan";
import PlannerActiveDayRecipes from "./PlannerActiveDayRecipes/PlannerActiveDayRecipes";
import PlannerIngredients from "./PlannerIngredients/PlannerIngredients";
import { FadeComponent, LabelText, RowContainer } from '@/ui/BestBeforeUI';
import { Pressable } from "react-native";

/**
 * React Component for displaying the active day view of the Recipe Planner
 * Switches between displaying the list of recipes for the selected day and the ingredients for the selected recipe
 * 
 * @param selectedDate The date selected in the calendar view
 * @states selectedRecipe/setSelectedRecipe The recipe selected from the list of recipes for the day
 * @returns React Component
 */ 

export default function PlannerActiveDay({selectedDate, setSelectedDate}: {selectedDate: Date | null, setSelectedDate: (date: Date | null) => void}) {
    const [selectedPlan, setSelectedPlan] = useState<Recipe_Plan | null>(null);
    
    return (
        <>
            <FadeComponent style={{padding: 10}}>
                <RowContainer>
                    <Pressable onPress={() => setSelectedDate(null)} style={{position: "absolute", left: 5, padding: 5,}}>
                        <LabelText >{"<"}</LabelText>
                    </Pressable>
                    <LabelText >{selectedDate ? selectedDate.toDateString() : "No Date Selected"}</LabelText>
                </RowContainer>
            </FadeComponent>
            {selectedPlan ? 
            (<PlannerIngredients recipePlan={selectedPlan} />) : 
            (<PlannerActiveDayRecipes date={selectedDate ? selectedDate : new Date()} setSelectedPlan={setSelectedPlan} />)}
        </>
    );
}