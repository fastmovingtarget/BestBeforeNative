//2026-06-01 : UI Tweaking

//2025-11-21 : Moving common UI elements into their own folder

import {ScrollView} from "react-native";
import type { PropsWithChildren } from "react";
import type { ViewStyle } from "react-native";
import { Colours } from "@/constants/Colors";

type ComponentViewProps = {
    style?: ViewStyle,
    ["aria-label"]?:string
}

const ComponentView = ({style, children, 'aria-label' : ariaLabel} : PropsWithChildren<ComponentViewProps>) => {
    return (
        <ScrollView 
            contentContainerStyle={{ 
                ...componentViewStyles,
                ...style,
            }}
            aria-label={ariaLabel}>
            {children}
        </ScrollView>
    );
}

const componentViewStyles = {
    display: "flex",
    flexGrow: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colours.primary,
    color: Colours.text,
    borderRadius: 10,
    padding: 10,
    margin: 5,
} as ViewStyle;

export default ComponentView;