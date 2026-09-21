//2026-09-21 : Added support for aria label, force 100% height
//2026-09-15 : Colours now sourced from ColourProvider
//2026-07-16 : Added function descriptions
//2026-06-11 : Improved padding

//2026-06-01 : UI Tweaking

//2025-11-21 : Moving common UI elements into their own folder

import { View } from "react-native";
import { useRef } from "react";
import type { PropsWithChildren } from "react";
import type { ViewStyle } from "react-native";
import { useColourData } from "@/Contexts/Colours/ColourDataProvider";

type PageViewProps = PropsWithChildren<{
    style? : ViewStyle
    ariaLabel?: string
}>

/**
 * PageView
 * A styled container that arranges its children in a column, so flex direction is column
 * PageView has default styles including background color, text color, border radius, padding, and width.
 * @component
 * @param {ViewStyle} style - Optional additional styles to apply to the container.
 * @param {React.ReactNode} children - Child components to be rendered inside the container.
 * @param {string} aria-label - Accessibility label for the container.
 * @returns {JSX.Element} A React component that renders a styled page view with the specified styles and children.
 */
const PageView : React.FC<PageViewProps> = props => {

    const {colours} = useColourData();

    const pageViewRef = useRef<View>(null);

    const pageViewStyles = {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        backgroundColor: colours.background,
        flex:1,
        width: "100%",
        height: "100%",
        paddingTop: 30,
        paddingHorizontal: 5,
    } as ViewStyle;

    return (
        <View 
        ref={pageViewRef}
        accessibilityLabel={props.ariaLabel}
        style={{ 
            ...pageViewStyles,
            ...props.style,
        }}>
            {props.children}
        </View>
    );
}

export default PageView;