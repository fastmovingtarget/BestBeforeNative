//2025-11-17 : Correctly shows Recipe Plans for date

//2025-10-28 : Improved styling

//2025-10-14 : Initial Implementation of Recipe Plan Page

import React from 'react';
import LabelText from "@/components/CustomComponents/LabelText";
import PressableComponent from "@/components/CustomComponents/PressableComponent";
import { useRecipePlans } from '@/Contexts/RecipePlans/RecipePlansDataProvider';

/**
 * React Component for displaying a single day in the Recipe Plan Calendar
 * When pressed, it calls the onPress function with the date number
 * Displays the date number and any recipe plans for that date (by name in a small list)
 * 
 * @param onPress Function to call when the day is pressed
 * @param date Date object representing the day to display
 * @returns React Component
 */

export default function RecipePlanCalendarDay({onPress, date} : {onPress:(date : number) => void, date: Date}) {

    const {recipePlans} = useRecipePlans();
    const recipePlansForDate = recipePlans.filter(plan => {
        const planDate = new Date(plan.Plan_Date);
        return planDate.getFullYear() === date.getFullYear() &&
               planDate.getMonth() === date.getMonth() &&
               planDate.getDate() === date.getDate();
    }).map(plan => plan.Recipe_Name);

    return (
        <PressableComponent
            onPress={() => onPress(date.getDate())}
            style={{flexDirection: "column", flex:1, margin: 1, padding: 0, justifyContent: "flex-start", alignItems: "center"}}
            >
            <LabelText style={{textAlign: "center", fontSize: 14, fontWeight: "bold", verticalAlign: "top"}}>
                    {date.getDate()}
            </LabelText>
            {recipePlansForDate.map(recipePlan => {
                return (
                    <LabelText
                        key={"recipe-plan-" + recipePlan}
                        aria-label={"recipe-plan-" + recipePlan}
                        style={{
                            textAlign: "center",
                            fontSize: 12,
                            marginVertical: 2,
                        }}
                    >
                        {recipePlan}
                    </LabelText>
                );
            })}
        </PressableComponent>
    );
}