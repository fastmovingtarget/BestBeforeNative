//2025-10-14 : Initial Implementation of Recipe Plan Page

import type Shopping_List_Item from "@/Types/Shopping_List_Item";
import React from 'react';
import LabelText from "@/components/CustomComponents/LabelText";
import PressableComponent from "@/components/CustomComponents/PressableComponent";

export default function RecipePlanCalendarDay({onPress, date, recipePlans} : {onPress:(date : number) => void, date: Date, recipePlans: string[]}) {
    return (
        <PressableComponent
            onPress={() => onPress(date.getDate())}
            style={{flexDirection: "column"}}
            >
            <LabelText style={{textAlign: "center", fontSize: 16, fontWeight: "bold"}}>
                    {date.getDate()}
            </LabelText>
            {recipePlans.map(recipePlan => {
                return (
                    <LabelText
                        key={"recipe-plan-" + recipePlan}
                        aria-label={"recipe-plan-" + recipePlan}
                        style={{
                            textAlign: "center",
                            fontSize: 14,
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