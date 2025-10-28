//2025-10-28 : Improved styling

//2025-10-14 : Initial Implementation of Recipe Plan Page

import React from 'react';
import LabelText from "@/components/CustomComponents/LabelText";
import PressableComponent from "@/components/CustomComponents/PressableComponent";

export default function RecipePlanCalendarDay({onPress, date, recipePlans} : {onPress:(date : number) => void, date: Date, recipePlans: string[]}) {
    return (
        <PressableComponent
            onPress={() => onPress(date.getDate())}
            style={{flexDirection: "column", flex:1, margin: 1, padding: 0, justifyContent: "flex-start", alignItems: "center"}}
            >
            <LabelText style={{textAlign: "center", fontSize: 14, fontWeight: "bold", verticalAlign: "top"}}>
                    {date.getDate()}
            </LabelText>
            {recipePlans.map(recipePlan => {
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