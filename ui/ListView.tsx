//2026-07-16 : Added function descriptions
//2026-06-01 : UI Tweaking

//2025-11-21 : Moving common UI elements into their own folder

import {ScrollView} from "react-native";
import type { PropsWithChildren } from "react";
import type { ViewStyle } from "react-native";

type ListViewProps = PropsWithChildren<{style? : ViewStyle}>

/**
 * ListView
 * A styled scrollable container that arranges its children in a column, so flex direction is column
 * ListView has default styles including border radius and width.
 * @component
 * @param {ViewStyle} style - Optional additional styles to apply to the container.
 * @param {React.ReactNode} children - Child components to be rendered inside the container.
 * @param {string} aria-label - Accessibility label for the container.
 * @returns {JSX.Element} A React component that renders a styled scrollable container.
 */
const ListView : React.FC<ListViewProps> = props => {
    return (
        <ScrollView style={{ 
            ...props.style,
            ...listViewStyles

        }}>
            {props.children}
        </ScrollView>
    );
}

const listViewStyles = {
    display: "flex",
    flexGrow: 1,
    flexDirection: "column",
    borderRadius: 10,
    width: "100%",
} as ViewStyle;


export default ListView;