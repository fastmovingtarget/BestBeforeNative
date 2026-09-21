//2026-09-21 : changed to looping scroll rather than bouncing
//2026-09-15 : Colours now sourced from ColourProvider
//2026-08-11 : Created Loading Bar to indicate loads
import {View} from "react-native";
import { useEffect, useState, type PropsWithChildren } from "react";
import type { ViewStyle } from "react-native";
import { useColourData } from "@/Contexts/Colours/ColourDataProvider";

type LoadingBarProps = {
    style?: ViewStyle,
    ["aria-label"]?:string,
    isLoading?: boolean
}

/**
 * LoadingBar
 * A container that arranges its children in a row, so flex direction is row
 * Container JUST contains by default. No margin, no padding, no border, inherits colours from parent.
 * @component
 * @param {ViewStyle} style - Optional additional styles to apply to the container.
 * @param {React.ReactNode} children - Child components to be rendered inside the container.
 * @param {string} aria-label - Accessibility label for the container.
 * @returns {JSX.Element} A React component that renders a row container with the specified styles and children.
 */

const LoadingBar = ({style, children, 'aria-label' : ariaLabel, isLoading} : PropsWithChildren<LoadingBarProps>) => {

    const [loadingBarLocation, setLoadingBarLocation] = useState<number>(0);
    const loadingBarWidth = 20;

    const {colours} = useColourData();

    const LoadingBarStyles = {
        position: "absolute",
        top: 12.5,
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        height: 5,
        backgroundColor: colours.primary,
    } as ViewStyle;

    useEffect(() => {
        if(isLoading){
            const interval = setTimeout(() => {
                setLoadingBarLocation(prevLocation => (prevLocation + 1) % 100);
            }, 10); // Update every 10ms
            return () => clearTimeout(interval);
        }
    }, [isLoading, loadingBarLocation]);

    if(!isLoading) {
        return null;
    }

    return (
        <View 
            style={{ 
                ...LoadingBarStyles,
                ...style,
                left: `${loadingBarLocation}%`,
                width: `${loadingBarWidth}%`,
            }}
            accessibilityLabel={ariaLabel}>
            {children}
        </View>
    );
}

export default LoadingBar;