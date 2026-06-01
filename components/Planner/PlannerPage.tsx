//2026-06-01 : help/back buttons moved into components

//2025-11-21 : Moving common UI elements into their own folder

//2025-11-19 : Renamed RecipePlan/nner to just Planner, Recipe_Plan to just Plan

//2025-11-17 : Addeed a help/navigation button for the calendar

//2025-10-28 : Filling out some initial implementation and tests

import React, { useState } from "react";
import RecipePlanCalendar from "./PlannerCalendar/PlannerCalendar";
import RecipePlanActiveDay from "./PlannerActiveDay/PlannerActiveDay";
import { ButtonView, LabelText, PageView, FadeComponent} from '@/ui/BestBeforeUI';

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
                <RecipePlanActiveDay selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
            }
        </PageView>
    );
}