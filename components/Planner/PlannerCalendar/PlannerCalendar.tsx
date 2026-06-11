//2026-06-11 : Removed padding doubling

//2026-06-01 : Calendar Grid code moved to separate file

//2025-11-21 : Moving common UI elements into their own folder

//2025-11-19 : Renamed RecipePlan/nner to just Planner, Recipe_Plan to just Plan

//2025-11-17 : Added docs, recipe plan display to calendar day

//2025-10-28 : More cohesive implementation of the calendar grid

//2025-10-14 : Initial Implementation of Recipe Plan Page

import React, { useState } from 'react';
import PlannerCalendarDay from './PlannerCalendarGrid/PlannerCalendarDay/PlannerCalendarDay';
import {ColumnContainer, FadeComponent, LabelText, PressableComponent, RowContainer} from '@/ui/BestBeforeUI';
import PlannerCalendarGrid from './PlannerCalendarGrid/PlannerCalendarGrid';

/**
 * React Component for displaying the Planner Calendar
 * Shows an array of PlannerCalendarDay components in a month view, 6x7 grid
 * Has buttons to navigate between months
 * 
 * @param setSelectedDate Function to set the selected date in the parent component
 * @returns React Component
 */

export default function PlannerCalendar({setSelectedDate} : {setSelectedDate: (date: Date) => void}) {

    const [monthIndex, setMonthIndex] = useState(0); // 0 for current month, -1 for last month, 1 for next month

    const daysOfWeek = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

    const today = new Date();

    const monthStartDate = new Date(today.getFullYear(), today.getMonth() + monthIndex, 1);

    const daysArray : Date[] = new Array(42).fill(null).map ((_, index) => {
        return new Date(today.getFullYear(), today.getMonth() + monthIndex, (2 + index) - (monthStartDate.getDay() || 7));
    })

    const weeksArray : Date[][] = [[], [], [], [], [], []];
    daysArray.forEach((date, index) => {
        weeksArray[Math.floor(index / 7)].push(date);
    });

    return (
        <ColumnContainer style={{flex:1, marginHorizontal:0}}>
            <FadeComponent style={{flexDirection:"row", justifyContent: "space-between", alignItems: "center", padding: 0}}>
                <PressableComponent onPress={() => setMonthIndex(monthIndex - 1)} style={{flex:1}}>
                    <LabelText style={{fontSize: 18, fontWeight: "bold"}}>{"<"}</LabelText>
                </PressableComponent>
                <LabelText style={{fontSize: 18, fontWeight: "bold"}}>
                    {monthStartDate.toLocaleString('default', { month: 'long' })}
                </LabelText>
                <PressableComponent onPress={() => setMonthIndex(monthIndex + 1)} style={{flex:1}}>
                    <LabelText style={{fontSize: 18, fontWeight: "bold"}}>{">"}</LabelText>
                </PressableComponent>
            </FadeComponent>
            <PlannerCalendarGrid monthIndex={monthIndex} setSelectedDate={setSelectedDate} />
        </ColumnContainer>
    );
}