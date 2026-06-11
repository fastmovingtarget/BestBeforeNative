//2026-06-01 : UI Tweaking

//2025-11-21 : Moving common UI elements into their own folder

import {Pressable} from "react-native";
import { type PropsWithChildren } from "react";
import type { ViewStyle, AccessibilityProps, } from "react-native";
import { Colours } from "@/constants/Colors";

type PressableViewProps = PropsWithChildren<{
    style? : ViewStyle, 
    onPress?: () => void, 
    accessibilityRole?: AccessibilityProps["accessibilityRole"],
    ["aria-label"]?: string,
    duration?: number,
}>

const ButtonView : React.FC<PressableViewProps> = ({style, children, onPress, "aria-label" : ariaLabel, accessibilityRole, duration} : PressableViewProps ) => {

    return (
        <Pressable 
            onPress={onPress}
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
                        backgroundColor: Colours.buttonBackground,
                    }
            }}
            accessibilityRole={accessibilityRole}
            aria-label={ariaLabel}
            android_ripple={{
                color: '#000000',
                radius: 200,
            }}
        >
            {children}
        </Pressable>
    ); 
}

const pressableViewStyles = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#111111",
    borderStyle: "solid",
    backgroundColor: "#DDDDDD",
    borderRadius: 5,
} as ViewStyle;


export default ButtonView;

/*
            
            */