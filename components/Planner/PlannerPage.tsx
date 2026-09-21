//2026-09-21 : condensed whitespace
//2026-08-11 : Added LoadingBar
//2026-07-16 : Added function description
//2026-07-16 : Using updated import names
//2026-06-12 : Removed extra imports
//2026-06-01 : help/back buttons moved into components
//2025-11-21 : Moving common UI elements into their own folder
//2025-11-19 : Renamed RecipePlan/nner to just Planner, Recipe_Plan to just Plan
//2025-11-17 : Addeed a help/navigation button for the calendar
//2025-10-28 : Filling out some initial implementation and tests

import React, { useState } from "react";
import PlannerCalendar from "./PlannerCalendar/PlannerCalendar";
import PlannerActiveDay from "./PlannerActiveDay/PlannerActiveDay";
import { PageView} from '@/ui/BestBeforeUI';
import LoadingBar from "@/ui/LoadingBar";
import { SyncState, UpdateState } from "@/Types/DataLoadingState";
import { usePlans } from "@/Contexts/Plans/PlansDataProvider";

/**
 * PlannerPage component
 * @returns The main planner page, which includes a calendar view and an active day view
 * The calendar view is shown when no date is selected, and the active day view is shown when a date is selected
 * The selected date is managed in the state of this component
 */
export default function PlannerPage() {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const {plansDataState} = usePlans();

    //Planner page flips between 2 states depending on if a date is selected or not
    //Calendar view when no date is selected
    //Active day view when a date is selected
    return (
        <PageView>
            <LoadingBar isLoading={plansDataState === UpdateState.Loading || plansDataState === SyncState.Loading}/>
            {
                selectedDate === null ?
                <PlannerCalendar setSelectedDate={setSelectedDate} /> :
                <PlannerActiveDay selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
            }
        </PageView>
    );
}