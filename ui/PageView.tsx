//2026-06-01 : UI Tweaking

//2025-11-21 : Moving common UI elements into their own folder

import {View} from "react-native";
import type { PropsWithChildren } from "react";
import type { ViewStyle } from "react-native";
import { Colours } from "@/constants/Colors";

type PageViewProps = PropsWithChildren<{style? : ViewStyle}>

const PageView : React.FC<PageViewProps> = props => {
    return (
        <View style={{ 
            ...pageViewStyles,
            ...props.style,

        }}>
            {props.children}
        </View>
    );
}

const pageViewStyles = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: Colours.background,
    flex:1,
    width: "100%",
    paddingTop: 30,
} as ViewStyle;

export default PageView;