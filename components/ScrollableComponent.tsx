import {ScrollView} from "react-native";
import type { PropsWithChildren } from "react";
import type { ViewStyle } from "react-native";

type ComponentViewProps = {
    style?: ViewStyle,
    ["aria-label"]?:string
}

const ComponentView = ({style, children, 'aria-label' : ariaLabel} : PropsWithChildren<ComponentViewProps>) => {
    return (
        <ScrollView 
            style={{ 
                ...componentViewStyles,
                ...style,
            }}
            aria-label={ariaLabel}>
            {children}
        </ScrollView>
    );
}

const componentViewStyles = {
    display: "flex",
    flexGrow: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#191f2b",
    color: "#e6e0d4",
    borderRadius: 10,
    padding: 10,
    margin: 5,
} as ViewStyle;

export default ComponentView;