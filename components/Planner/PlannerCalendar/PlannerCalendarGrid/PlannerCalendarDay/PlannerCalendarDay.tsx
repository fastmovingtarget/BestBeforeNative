//2026-06-29 : Improvements to pressable visuals

//2026-06-01 : File location changed

//2025-11-21 : Moving common UI elements into their own folder

//2025-11-19 : Renamed RecipePlan/nner to just Planner, Recipe_Plan to just Plan

//2025-11-17 : Correctly shows Recipe Plans for date

//2025-10-28 : Improved styling

//2025-10-14 : Initial Implementation of Recipe Plan Page

import React from 'react';
import { usePlans } from '@/Contexts/Plans/PlansDataProvider';

import {Component, FadeComponent, LabelText, PressableComponent} from '@/ui/BestBeforeUI';
import { Colours } from '@/constants/Colors';

/**
 * React Component for displaying a single day in the Recipe Plan Calendar
 * When pressed, it calls the onPress function with the date number
 * Displays the date number and any recipe plans for that date (by name in a small list)
 * 
 * @param onPress Function to call when the day is pressed
 * @param date Date object representing the day to display
 * @returns React Component
 */

export default function PlannerCalendarDay({onPress, date, greyOut} : {onPress:(date : number) => void, date: Date, greyOut?: boolean}) {

    const {plans} = usePlans();
    const recipePlansForDate = plans.filter(plan => {
        const planDate = new Date(plan.Plan_Date);
        return planDate.getFullYear() === date.getFullYear() &&
               planDate.getMonth() === date.getMonth() &&
               planDate.getDate() === date.getDate();
    })

    return (
        <PressableComponent
            onPress={() => onPress(date.getDate())}
            style={{flexDirection: "column", flex:1, margin: 1, padding: 0, justifyContent: "flex-start", alignItems: "center", height:"100%", overflow: "hidden", backgroundColor: Colours.buttonBackground }}
            >
            <LabelText style={{textAlign: "center", fontSize: 14, fontWeight: "bold", verticalAlign: "top", marginVertical: 0, padding: 0}}>
                    {date.getDate()}
            </LabelText>
            <Component style={{flex:1, width: "100%", justifyContent: "flex-start", alignItems: "center", margin:0, padding:0, overflow: "hidden", flexShrink:1, backgroundColor: "inherit"}}>
            {recipePlansForDate.map(recipePlan => {
                return (
                    <LabelText
                        key={"recipe-plan-" + recipePlan.Plan_ID}
                        aria-label={"recipe-plan-" + recipePlan.Plan_ID}
                        style={{
                            textAlign: "center",
                            fontSize: 12,
                            marginVertical: 1,
                            padding:0,
                            flexShrink:1,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            opacity: greyOut ? 0.5 : 1,
                        }}
                    >
                        {recipePlan.Recipe_Name}
                    </LabelText>
                );
            })}
            </Component>
        </PressableComponent>
    );
}