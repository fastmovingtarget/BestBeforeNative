//2026-06-01 : Custom container for row/column

import {View} from "react-native";
import type { PropsWithChildren } from "react";
import type { ViewStyle } from "react-native";

type RowContainerProps = {
    style?: ViewStyle,
    ["aria-label"]?:string
}

/**
 * RowContainer
 * A container that arranges its children in a row, so flex direction is row
 * Container JUST contains by default. No margin, no padding, no border, inherits colours from parent.
 * @component
 * @param {ViewStyle} style - Optional additional styles to apply to the container.
 * @param {React.ReactNode} children - Child components to be rendered inside the container.
 * @param {string} aria-label - Accessibility label for the container.
 */

const RowContainer = ({style, children, 'aria-label' : ariaLabel} : PropsWithChildren<RowContainerProps>) => {
    return (
        <View 
            style={{ 
                ...RowContainerStyles,
                ...style,
            }}
            accessibilityLabel={ariaLabel}>
            {children}
        </View>
    );
}

const RowContainerStyles = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
} as ViewStyle;


export default RowContainer;