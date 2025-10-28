//2025-10-28 : Simple initial implementation

import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import PageView from "@/components/CustomComponents/PageView";
import { useRecipePlans } from "@/Contexts/RecipePlans/RecipePlanDataProvider";
import { useRecipes } from "@/Contexts/Recipes/RecipesDataProvider";

export default function RecipePlanner({selectedDate}: {selectedDate: Date | null}) {

    const {recipePlans} = useRecipePlans();
    const {recipes} = useRecipes();

    const daysRecipePlans = recipePlans.filter(plan => {
        if(selectedDate === null) return false;
        const planDate = new Date(plan.Plan_Date);
        return planDate.toDateString() === selectedDate.toDateString();
    });

    //Active day page moves between selecting a recipe for the day and populating the selected recipe's ingredients
    
    return (
        <PageView>
            <Text>{selectedDate ? selectedDate.toDateString() : "No Date Selected"}</Text>
            <Text>Recipes for the day:</Text>
            {
                daysRecipePlans.map(plan => (
                    <Text key={plan.Plan_ID}>{plan.Recipe_Name}</Text>
                ))
            }
        </PageView>
    );
}

const styles = StyleSheet.create({
    addIngredientInvisible: {
        display: "none",
    },
});