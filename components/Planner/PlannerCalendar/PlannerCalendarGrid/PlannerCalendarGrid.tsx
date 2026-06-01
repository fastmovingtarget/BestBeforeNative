//2026-06-01 : Calendar Grid code moved to separate file

//2026-06-01 : File location changed

//2025-11-21 : Moving common UI elements into their own folder

//2025-11-19 : Renamed RecipePlan/nner to just Planner, Recipe_Plan to just Plan

//2025-11-17 : Added docs, recipe plan display to calendar day

//2025-10-28 : More cohesive implementation of the calendar grid

//2025-10-14 : Initial Implementation of Recipe Plan Page

import React, { useState } from 'react';
import PlannerCalendarDay from './PlannerCalendarDay/PlannerCalendarDay';
import {ColumnContainer, FadeComponent, LabelText, RowContainer} from '@/ui/BestBeforeUI';

/**
 * React Component for displaying the Planner Calendar
 * Shows an array of PlannerCalendarDay components in a month view, 6x7 grid
 * Has buttons to navigate between months
 * 
 * @param setSelectedDate Function to set the selected date in the parent component
 * @returns React Component
 */

export default function PlannerCalendar({setSelectedDate, monthIndex} : {setSelectedDate: (date: Date) => void, monthIndex: number}) {

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
        <FadeComponent style={{flex:1, padding: 0, margin:0}} dependency={monthIndex}>
            <ColumnContainer style={{flex:1, marginVertical: 5, padding:0, width: "100%"}}>
                <RowContainer style={{ flex:1}}>
                    {daysOfWeek.map((day, index) => (
                        <FadeComponent style={{flex:1, margin: 1}} key={index}>
                            <LabelText key={index} style={{textAlign: "center", fontWeight: "bold", paddingVertical: 5, flex: 1, marginHorizontal:0, marginVertical:3, padding:0}}>
                                {day}
                            </LabelText>
                        </FadeComponent>
                    ))}
                </RowContainer>
                {
                    weeksArray.map((week, weekIndex) => (
                        <RowContainer style={{width: "100%", flex:1, margin:1}} key={weekIndex}>
                            {week.map((date, index) => (
                                <PlannerCalendarDay
                                    key={`calendar-day-${weekIndex}-${index}`}
                                    date={date}
                                    onPress={() => setSelectedDate(date)} // Replace with actual onPress function
                                    greyOut={date.getMonth() !== (today.getMonth() + monthIndex) % 12}
                                />  
                            ))}
                        </RowContainer>
                    ))
                }
            </ColumnContainer>
        </FadeComponent>
    );
}