//2026-08-04 : New component adding a wrapper label and border
//2026-06-01 : The most basic of components

//2025-11-21 : Moving common UI elements into their own folder

import {View, Text} from "react-native";
import type { PropsWithChildren } from "react";
import type { ViewStyle, TextStyle } from "react-native";
import { Colours } from "@/constants/Colors";

type ComponentProps = {
    style?: ViewStyle,
    ["aria-label"]?:string,
    labelText?: string,
    labelColour?: string,
    borderColour?: string,
}

/**
 * LabelledComponent
 * 
 * @component
 * @param {ViewStyle} style - Optional additional styles to apply to the component.
 * @param {React.ReactNode} children - Child components to be rendered inside the component.
 * @param {string} aria-label - Accessibility label for the component.
 * @param {string} labelColour - Optional color for the label text.
 * @param {string} borderColour - Optional color for the border of the component.
 */

const LabelledComponent = ({style, children, 'aria-label' : ariaLabel, labelText, labelColour, borderColour} : PropsWithChildren<ComponentProps>) => {
    return (
        <View 
            style={{ 
                ...labelledComponentStyles,
                borderColor: borderColour || Colours.text,
                ...style,
            }}
            aria-label={ariaLabel}>
            {labelText && (
                <Text style={{
                    color: labelColour || Colours.text, 
                    backgroundColor: Colours.primary, 
                    ...labelStyles, 
                    borderColor: borderColour || Colours.text
                }}>
                    {labelText}
                </Text>
            )}
            {children}
        </View>
    );
}

const labelledComponentStyles = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colours.primary,
    color: Colours.text,
    borderRadius: 10,
    padding: 0,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: Colours.text,
} as ViewStyle;

const labelStyles = {
    position: "absolute",
    top: -10,
    left: 10,
    paddingHorizontal: 5,
    fontSize: 12,
    borderRadius: 5,
    borderWidth: 1,
} as TextStyle;


export default LabelledComponent;