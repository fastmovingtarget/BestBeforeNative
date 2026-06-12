//2026-06-12 : Resize component created

//2026-06-11 : Removing an extra console log

//2026-06-01 : Animated fade in/out component

//2025-11-21 : Moving common UI elements into their own folder

import {Animated} from "react-native";
import { useEffect, type PropsWithChildren, useRef} from "react";
import type { ViewStyle } from "react-native";

type ComponentProps = {
    style?: ViewStyle,
    ["aria-label"]?:string,
    duration?: number,
    dependency?: any,
    onResizeAnimationEnd?: () => void,
    targetHeight: number,
}

/**
 * ResizeComponent
 * A styled container that arranges its children in a column, so flex direction is column
 * Component has default styles including background color, text color, border radius, padding, and margin.
 * ResizeComponent wraps its children with a fade in (opacity 0 -> 1) on mount and fade out (opacity 1 -> 0) on dismount effect with specifiable timing.
 * @component
 * @param {ViewStyle} style - Optional additional styles to apply to the component.
 * @param {React.ReactNode} children - Child components to be rendered inside the component.
 * @param {string} aria-label - Accessibility label for the component.
 * @param {number} duration - Duration of the fade in/out effect in milliseconds.
 * @param {any} dependency - Dependency to trigger the fade effect when changed.
 */

const ResizeComponent = ({style, children, 'aria-label' : ariaLabel, duration = 300, onResizeAnimationEnd, targetHeight } : PropsWithChildren<ComponentProps>) => {
    const resizeAnim = useRef(new Animated.Value(0)).current; // Initial height value: 0


    useEffect(() => {
        Animated.timing(resizeAnim, {
            toValue: targetHeight, // Default height if targetHeight is not provided
            duration: duration, // Duration of the resize effect
            useNativeDriver: false,
        }).start(() => {
            if (onResizeAnimationEnd) {
                onResizeAnimationEnd();
            }
        });
    }, [resizeAnim, duration, onResizeAnimationEnd, targetHeight]);

    return (
        <Animated.View 
            style={{ 
                ...resizeComponentStyles,
                ...style,
                height: resizeAnim,
            }}
            aria-label={ariaLabel}  
            >
            {children}
        </Animated.View>
    );
}

const resizeComponentStyles = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width:"100%",
    borderRadius: 10,
    padding: 0,
    margin:0,
    overflow: "hidden",
} as ViewStyle;


export default ResizeComponent;