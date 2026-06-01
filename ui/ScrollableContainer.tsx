//2026-06-01 : Container for item lists

//2025-11-21 : Moving common UI elements into their own folder

import {ScrollView} from "react-native";
import type { PropsWithChildren } from "react";
import type { ViewStyle } from "react-native";

type ScrollableContainerProps = {
    style?: ViewStyle,
    ["aria-label"]?:string
}

/**
 * ScrollableContainer
 * A scrollable container that arranges its children in a column, so flex direction is column
 * Container JUST contains by default. No margin, no padding, no border, inherits colours from parent.
 * @component
 * @param {ViewStyle} style - Optional additional styles to apply to the container.
 * @param {React.ReactNode} children - Child components to be rendered inside the container.
 * @param {string} aria-label - Accessibility label for the container.
 */

const ScrollableContainer = ({style, children, 'aria-label' : ariaLabel} : PropsWithChildren<ScrollableContainerProps>) => {
    return (
        <ScrollView 
            contentContainerStyle={{ 
                ...scrollableContainerStyles,
                ...style,
            }}
            accessibilityLabel={ariaLabel}
            scrollEnabled={true}
            >
            {children}
        </ScrollView>
    );
}

const scrollableContainerStyles = {
    display: "flex",
    flexGrow: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
} as ViewStyle;

export default ScrollableContainer;