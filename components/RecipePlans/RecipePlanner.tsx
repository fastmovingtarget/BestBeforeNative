//2025-10-28 : Filling out some initial implementation and tests

import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import ButtonView from "../CustomComponents/ButtonView";
import LabelText from "../CustomComponents/LabelText";
import PageView from "../CustomComponents/PageView";
import RecipePlanCalendar from "./RecipePlanCalendar/RecipePlanCalendar";
import RecipePlanActiveDay from "./RecipePlanActiveDay/RecipePlanActiveDay";

export default function RecipePlanner() {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    //Planner page flips between 2 states depending on if a date is selected or not
    //Calendar view when no date is selected
    //Active day view when a date is selected
    return (
        <PageView>
            {
                selectedDate === null ?
                <RecipePlanCalendar setSelectedDate={setSelectedDate} /> :
                <RecipePlanActiveDay selectedDate={selectedDate} />
            }
        </PageView>
    );
}

const styles = StyleSheet.create({
    addIngredientInvisible: {
        display: "none",
    },
});