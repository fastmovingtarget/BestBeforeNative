import {Pressable} from "react-native";
import type { PropsWithChildren } from "react";
import type { ViewStyle, AccessibilityProps } from "react-native";

type PressableViewProps = PropsWithChildren<{
    style? : ViewStyle, 
    onPress?: () => void, 
    accessibilityRole?: AccessibilityProps["accessibilityRole"],
    ["aria-label"]?: string,
}>

const PressableComponent : React.FC<PressableViewProps> = ({style, children, onPress, "aria-label" : ariaLabel, accessibilityRole} : PressableViewProps ) => {
    return (
        <Pressable 
            style={{ 
                ...pressableViewStyles,
                ...style,
            }}
            onPress={onPress}
            accessibilityRole={accessibilityRole}
            aria-label={ariaLabel}
        >
            {children}
        </Pressable>
    );
}

const pressableViewStyles = {
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


export default PressableComponent;