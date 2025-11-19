//2025-11-19 : Renamed RecipePlan/nner to just Planner, Recipe_Plan to just Plan

//2025-11-17 : Added docs, recipe plan display to calendar day

//2025-10-28 : More cohesive implementation of the calendar grid

//2025-10-14 : Initial Implementation of Recipe Plan Page

import React, { useState } from 'react';
import { View } from 'react-native';
import PlannerCalendarDay from './PlannerCalendarDay/PlannerCalendarDay';
import LabelText from '@/components/CustomComponents/LabelText';
import ComponentView from '@/components/CustomComponents/ComponentView';
import PressableComponent from '@/components/CustomComponents/PressableComponent';

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

    const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

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
        <>
            <ComponentView style={{flexDirection:"row", justifyContent: "space-between", alignItems: "center", padding: 0, height:"0%"}}>
                <PressableComponent onPress={() => setMonthIndex(monthIndex - 1)}>
                    <LabelText style={{fontSize: 18, fontWeight: "bold"}}>{"<"}</LabelText>
                </PressableComponent>
                <LabelText style={{fontSize: 18, fontWeight: "bold"}}>
                    {monthStartDate.toLocaleString('default', { month: 'long' })}
                </LabelText>
                <PressableComponent onPress={() => setMonthIndex(monthIndex + 1)}>
                    <LabelText style={{fontSize: 18, fontWeight: "bold"}}>{">"}</LabelText>
                </PressableComponent>
            </ComponentView>
            <View style={{flexDirection: "row"}}>
                {daysOfWeek.map((day, index) => (
                    <LabelText key={index} style={{textAlign: "center", fontWeight: "bold", paddingVertical: 5, flex: 1, marginHorizontal:0, marginVertical:3, padding:0}}>
                        {day}
                    </LabelText>
                ))}
            </View>
            <View style={{flexDirection: "column", flex:6}}>
            {
                weeksArray.map((week, weekIndex) => (
                    <View style={{flexDirection: "row", width: "100%", flex:1}} key={weekIndex}>
                        {week.map((date, index) => (
                            <PlannerCalendarDay
                                key={index}
                                date={date}
                                onPress={() => setSelectedDate(date)} // Replace with actual onPress function
                            />  
                        ))}
                    </View>
                ))
            }
            </View>
        </>
    );
}