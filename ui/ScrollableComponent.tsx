//2026-09-15 : Colours now sourced from ColourProvider
//2026-07-16 : Added function descriptions
//2026-06-01 : UI Tweaking

//2025-11-21 : Moving common UI elements into their own folder

import {ScrollView} from "react-native";
import type { PropsWithChildren } from "react";
import type { ViewStyle } from "react-native";
import { useColourData } from "@/Contexts/Colours/ColourDataProvider";

type ScrollableComponentProps = {
    style?: ViewStyle,
    ["aria-label"]?:string
}

/**
 * ScrollableComponent
 * A styled scrollable container that arranges its children in a column, so flex direction is column
 * ScrollableComponent has default styles including background color, text color, border radius, padding, and margin.
 * @component
 * @param {ViewStyle} style - Optional additional styles to apply to the component.
 * @param {React.ReactNode} children - Child components to be rendered inside the component.
 * @param {string} aria-label - Accessibility label for the component.
 * @returns {JSX.Element} A React component that renders a styled scrollable container with the specified styles and children.
 */
const ScrollableComponent = ({style, children, 'aria-label' : ariaLabel} : PropsWithChildren<ScrollableComponentProps>) => {

    const {colours} = useColourData();

    const scrollableComponentStyles = {
        display: "flex",
        flexGrow: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colours.primary,
        color: colours.text,
        borderRadius: 10,
        padding: 10,
        margin: 5,
    } as ViewStyle;

    return (
        <ScrollView 
            contentContainerStyle={{ 
                ...scrollableComponentStyles,
                ...style,
            }}
            aria-label={ariaLabel}>
            {children}
        </ScrollView>
    );
}

export default ScrollableComponent;