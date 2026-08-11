//2026-08-11 : Created Loading Bar to indicate loads
import {View} from "react-native";
import { useEffect, useState, type PropsWithChildren } from "react";
import type { ViewStyle } from "react-native";
import {Colours} from "@/constants/Colors";

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
    const [animationReverse, setAnimationReverse] = useState<boolean>(false);
    const loadingBarWidth = 20;

    useEffect(() => {
        if(isLoading){
            const interval = setTimeout(() => {
                if(loadingBarLocation + loadingBarWidth >= 100) {
                    setAnimationReverse(true);
                }
                if(loadingBarLocation <= 0) {
                    setAnimationReverse(false);
                }
                setLoadingBarLocation(prevLocation => animationReverse ? prevLocation - 1 : (prevLocation + 1) % 100);
            }, 10); // Update every 10ms
            return () => clearTimeout(interval);
        }
    }, [isLoading, loadingBarLocation, animationReverse]);

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

const LoadingBarStyles = {
    position: "absolute",
    top: 15,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 10,
    backgroundColor: Colours.primary,
} as ViewStyle;


export default LoadingBar;