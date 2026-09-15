//2026-09-15 : Colours now sourced from ColourProvider
//2026-06-01 : The most basic of components

//2025-11-21 : Moving common UI elements into their own folder

import {View} from "react-native";
import type { PropsWithChildren } from "react";
import type { ViewStyle } from "react-native";
import { useColourData } from "@/Contexts/Colours/ColourDataProvider";

type ComponentProps = {
    style?: ViewStyle,
    ["aria-label"]?:string
}

/**
 * ComponentView
 * A styled container that arranges its children in a column, so flex direction is column
 * Component has default styles including background color, text color, border radius, padding, and margin.
 * @component
 * @param {ViewStyle} style - Optional additional styles to apply to the component.
 * @param {React.ReactNode} children - Child components to be rendered inside the component.
 * @param {string} aria-label - Accessibility label for the component.
 */

const Component = ({style, children, 'aria-label' : ariaLabel} : PropsWithChildren<ComponentProps>) => {

    const {colours} = useColourData();
    
    const componentStyles = {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colours.primary,
        color: colours.text,
        width:"100%",
        borderRadius: 10,
        padding: 10,
        marginVertical: 5,
    } as ViewStyle;
    
    return (
        <View 
            style={{ 
                ...componentStyles,
                ...style,
            }}
            aria-label={ariaLabel}>
            {children}
        </View>
    );
}

export default Component;