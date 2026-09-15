//2026-09-15 : Colours now sourced from ColourProvider
//2026-07-16 : Added function descriptions
//2026-06-01 : UI Tweaking

//2025-11-21 : Moving common UI elements into their own folder

import {Pressable} from "react-native";
import type { PropsWithChildren } from "react";
import type { ViewStyle, AccessibilityProps } from "react-native";
import { useColourData } from "@/Contexts/Colours/ColourDataProvider";

type PressableViewProps = PropsWithChildren<{
    style? : ViewStyle, 
    onPress?: () => void, 
    accessibilityRole?: AccessibilityProps["accessibilityRole"],
    ["aria-label"]?: string,
}>

/**
 * PressableComponent
 * A customizable pressable component that changes its background color when pressed.
 * @param style - Optional styles to apply to the pressable component
 * @param children - The content to display inside the pressable component
 * @param onPress - Function to call when the pressable component is pressed
 * @param accessibilityRole - Accessibility role for the pressable component
 * @param aria-label - Accessibility label for the pressable component
 * @returns {JSX.Element} A React component that renders a customizable pressable component.
 */

const PressableComponent : React.FC<PressableViewProps> = ({style, children, onPress, "aria-label" : ariaLabel, accessibilityRole} : PressableViewProps ) => {

    const {colours} = useColourData();

    const pressableViewStyles = {
        display: "flex",
        flexGrow: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        backgroundColor: colours.primary,
        color: colours.text,
        borderRadius: 10,
        padding: 10,
        margin: 5,
    } as ViewStyle;

    return (
        <Pressable 
            style={({pressed}) => {
                if(pressed) 
                    return {
                        ...pressableViewStyles,
                        ...style,
                        backgroundColor: colours.buttonBackgroundPressed,
                    }  
                else 
                    return {    
                        ...pressableViewStyles,
                        ...style,
                    }
            }}
            onPress={onPress}
            accessibilityRole={accessibilityRole}
            aria-label={ariaLabel}
        >
            {children}
        </Pressable>
    );
}

export default PressableComponent;