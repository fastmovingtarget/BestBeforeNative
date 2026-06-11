//2026-06-01 : UI Tweaking

//2025-11-21 : Moving common UI elements into their own folder

import {ScrollView} from "react-native";
import type { PropsWithChildren } from "react";
import type { ViewStyle } from "react-native";

type ListViewProps = PropsWithChildren<{style? : ViewStyle}>

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