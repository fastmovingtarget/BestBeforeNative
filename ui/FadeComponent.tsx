//2026-06-11 : Removing an extra console log

//2026-06-01 : Animated fade in/out component

//2025-11-21 : Moving common UI elements into their own folder

import {Animated} from "react-native";
import { useEffect, type PropsWithChildren, useRef } from "react";
import type { ViewStyle } from "react-native";
import { MountState } from "@/ui/Types/MountState";
import { Colours } from "@/constants/Colors";

type ComponentProps = {
    style?: ViewStyle,
    ["aria-label"]?:string,
    duration?: number,
    dependency?: any,
    mountState?: MountState,
    onMountAnimationEnd?: () => void,
    onUnmountAnimationEnd?: () => void,
    onUpdateMountAnimationEnd?: () => void,
    onUpdateUnmountAnimationEnd?: () => void,
}

/**
 * FadeComponent
 * A styled container that arranges its children in a column, so flex direction is column
 * Component has default styles including background color, text color, border radius, padding, and margin.
 * FadeComponent wraps its children with a fade in (opacity 0 -> 1) on mount and fade out (opacity 1 -> 0) on dismount effect with specifiable timing.
 * @component
 * @param {ViewStyle} style - Optional additional styles to apply to the component.
 * @param {React.ReactNode} children - Child components to be rendered inside the component.
 * @param {string} aria-label - Accessibility label for the component.
 * @param {number} duration - Duration of the fade in/out effect in milliseconds.
 * @param {any} dependency - Dependency to trigger the fade effect when changed.
 */

const FadeComponent = ({style, children, 'aria-label' : ariaLabel, duration = 300, mountState = MountState.Mount, onUnmountAnimationEnd, onMountAnimationEnd, onUpdateUnmountAnimationEnd, onUpdateMountAnimationEnd} : PropsWithChildren<ComponentProps>) => {
    const fadeAnim = useRef(new Animated.Value(0)).current; // Initial opacity value: 0

    useEffect(() => {
        if(mountState === MountState.Unmount) {
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: duration, // Duration of the fade out effect
                useNativeDriver: true,
            }).start(() => {
                if (onUnmountAnimationEnd) {
                    onUnmountAnimationEnd();
                }
            });
        } else if(mountState === MountState.Mount) {
            // Implement fade in effect on mount
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: duration, // Duration of the fade in effect
                useNativeDriver: true,
            }).start(() => {
                if (onMountAnimationEnd) {
                    onMountAnimationEnd();
                }
            });
        }
    }, [fadeAnim, duration, onMountAnimationEnd, mountState, onUnmountAnimationEnd, ariaLabel]);

    return (
        <Animated.View 
            style={{ 
                ...fadeComponentStyles,
                ...style,
                opacity: fadeAnim,
            }}
            aria-label={ariaLabel}  
            >
            {children}
        </Animated.View>
    );
}

const fadeComponentStyles = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colours.primary,
    color: Colours.text,
    width:"100%",
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
} as ViewStyle;


export default FadeComponent;