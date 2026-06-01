//2026-06-01 : Custom container for row/column

import {View} from "react-native";
import type { PropsWithChildren } from "react";
import type { ViewStyle } from "react-native";

type ColumnContainerProps = {
    style?: ViewStyle,
    ["aria-label"]?:string
}

/**
 * ColumnContainer
 * A container that arranges its children in a column, so flex direction is column
 * Container JUST contains by default. No margin, no padding, no border, inherits colours from parent.
 * @component
 * @param {ViewStyle} style - Optional additional styles to apply to the container.
 * @param {React.ReactNode} children - Child components to be rendered inside the container.
 * @param {string} aria-label - Accessibility label for the container.
 */

const ColumnContainer = ({style, children, 'aria-label' : ariaLabel} : PropsWithChildren<ColumnContainerProps>) => {
    return (
        <View 
            style={{ 
                ...ColumnContainerStyles,
                ...style,
            }}
            aria-label={ariaLabel}>
            {children}
        </View>
    );
}

const ColumnContainerStyles = {
    display: "flex",
    flexGrow: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
} as ViewStyle;


export default ColumnContainer;