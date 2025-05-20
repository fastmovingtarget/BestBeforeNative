import {Pressable} from "react-native";
import type { PropsWithChildren } from "react";
import type { ViewStyle, AccessibilityProps } from "react-native";

type PressableViewProps = PropsWithChildren<{
    style? : ViewStyle, 
    onPress?: () => void, 
    accessibilityRole?: AccessibilityProps["accessibilityRole"],
    ["aria-label"]?: string,
}>

const ButtonView : React.FC<PressableViewProps> = ({style, children, onPress, "aria-label" : ariaLabel, accessibilityRole} : PressableViewProps ) => {
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#272727",
    borderColor: "#111111",
    borderStyle: "solid",
    borderRadius: 5,
} as ViewStyle;


export default ButtonView;