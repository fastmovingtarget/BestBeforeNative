import {View} from "react-native";
import type { PropsWithChildren } from "react";
import type { ViewStyle } from "react-native";

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
    backgroundColor: "#000000",
} as ViewStyle;

export default PageView;