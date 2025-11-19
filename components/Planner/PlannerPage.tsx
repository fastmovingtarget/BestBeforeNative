//2025-11-19 : Renamed RecipePlan/nner to just Planner, Recipe_Plan to just Plan

//2025-11-17 : Addeed a help/navigation button for the calendar

//2025-10-28 : Filling out some initial implementation and tests

import React, { useState } from "react";
import ButtonView from "../CustomComponents/ButtonView";
import LabelText from "../CustomComponents/LabelText";
import PageView from "../CustomComponents/PageView";
import RecipePlanCalendar from "./PlannerCalendar/PlannerCalendar";
import RecipePlanActiveDay from "./PlannerActiveDay/PlannerActiveDay";
import ComponentView from "../CustomComponents/ComponentView";

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
            <ComponentView style={{flexDirection: "row", justifyContent: "center", alignItems: "center", padding: 0, marginHorizontal:0, height:"10%", flexGrow:0}}>
                {
                    selectedDate !== null 
                    ?
                    <ButtonView onPress={() => setSelectedDate(null)} style={{paddingHorizontal: 10, paddingVertical: 5, margin: 0, flex:1, height: "100%"}}>
                        <LabelText>
                            Back to Calendar
                        </LabelText>
                    </ButtonView>
                    :
                    <LabelText>
                        Select a date to view or add to your recipe plans.
                    </LabelText>
                }
            </ComponentView>
        </PageView>
    );
}