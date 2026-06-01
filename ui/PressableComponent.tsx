//2026-06-01 : UI Tweaking

//2025-11-21 : Moving common UI elements into their own folder

import {Pressable} from "react-native";
import type { PropsWithChildren } from "react";
import type { ViewStyle, AccessibilityProps } from "react-native";
import { Colours } from "@/constants/Colors";

type PressableViewProps = PropsWithChildren<{
    style? : ViewStyle, 
    onPress?: () => void, 
    accessibilityRole?: AccessibilityProps["accessibilityRole"],
    ["aria-label"]?: string,
}>

const PressableComponent : React.FC<PressableViewProps> = ({style, children, onPress, "aria-label" : ariaLabel, accessibilityRole} : PressableViewProps ) => {
    return (
        <Pressable 
            style={({pressed}) => {
                if(pressed) 
                    return {
                        ...pressableViewStyles,
                        ...style,
                        backgroundColor: Colours.buttonBackgroundPressed,
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

const pressableViewStyles = {
    display: "flex",
    flexGrow: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    backgroundColor: Colours.primary,
    color: Colours.text,
    borderRadius: 10,
    padding: 10,
    margin: 5,
} as ViewStyle;


export default PressableComponent;