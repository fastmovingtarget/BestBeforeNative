//2026-09-15 : Colours now sourced from ColourProvider
//2026-07-16 : Added function descriptions
//2026-06-01 : UI Tweaking

//2025-11-21 : Moving common UI elements into their own folder

import {View} from "react-native";
import type { PropsWithChildren } from "react";
import type { ViewStyle } from "react-native";
import { useColourData } from "@/Contexts/Colours/ColourDataProvider";

type FormFieldProps = {
    style?: ViewStyle,
    ["aria-label"]?:string
}

/**
 * FormFieldContainer
 * A styled container that arranges its children in a row, so flex direction is row
 * FormFieldContainer has default styles including text color, border radius, padding, and width.   
 * @component
 * @param {ViewStyle} style - Optional additional styles to apply to the container.
 * @param {React.ReactNode} children - Child components to be rendered inside the container.
 * @param {string} aria-label - Accessibility label for the container.
 * @returns {JSX.Element} A React component that renders a form field container with the specified styles and children.
 */

const FormFieldContainer = ({style, children, 'aria-label' : ariaLabel} : PropsWithChildren<FormFieldProps>) => {

    const {colours} = useColourData();

    const formFieldContainerStyles = {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        textAlignVertical: "center",
        textAlign: "center",
        color: colours.text,
        borderRadius: 5,
        width: "100%",
        padding: 5,
    } as ViewStyle;

    return (
        <View 
            style={{ 
                ...formFieldContainerStyles,
                ...style,
            }}
            aria-label={ariaLabel}>
            {children}
        </View>
    );
}


export default FormFieldContainer;