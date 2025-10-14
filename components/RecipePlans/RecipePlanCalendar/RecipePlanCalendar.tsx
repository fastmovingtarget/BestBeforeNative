//2025-10-14 : Initial Implementation of Recipe Plan Page

import React, { useState } from 'react';
import { View } from 'react-native';
import PageView from '@/components/CustomComponents/PageView';
import RecipePlanCalendarDay from './RecipePlanCalendarDay/RecipePlanCalendarDay';
import LabelText from '@/components/CustomComponents/LabelText';
import ComponentView from '@/components/CustomComponents/ComponentView';
import PressableComponent from '@/components/CustomComponents/PressableComponent';

export default function RecipePlanCalendar() {

    const [monthIndex, setMonthIndex] = useState(0); // 0 for current month, -1 for last month, 1 for next month

    const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    const today = new Date();

    const monthStartDate = new Date(today.getFullYear(), today.getMonth() + monthIndex, 1);

    const daysArray = new Array(42).fill(null).map ((_, index) => {
        return new Date(today.getFullYear(), today.getMonth() + monthIndex, (2 + index) - (monthStartDate.getDay() || 7));
    })

    return (
        <>
            <ComponentView style={{flexDirection:"row", justifyContent: "space-between", alignItems: "center", padding: 10}}>
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
            <View>
                {daysOfWeek.map((day, index) => (
                    <LabelText key={index} style={{textAlign: "center", fontWeight: "bold", paddingVertical: 5}}>
                        {day}
                    </LabelText>
                ))}
            </View>
            <View style={{flexDirection: "row", flexWrap: "wrap"}}>
                {daysArray.map((date, index) => (
                    <RecipePlanCalendarDay
                        key={index}
                        date={date}
                        recipePlans={[]} // Replace with actual recipe plans for the date
                        onPress={(day) => console.log(`Selected day: ${day}`)} // Replace with actual onPress function
                    />
                ))}
            </View>
        </>
    );
}