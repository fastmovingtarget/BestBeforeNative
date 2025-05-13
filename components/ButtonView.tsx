import {Pressable} from "react-native";
import type { PropsWithChildren } from "react";
import type { ViewStyle, AccessibilityProps } from "react-native";

type PressableViewProps = PropsWithChildren<{style? : ViewStyle, onPress?: () => void, accessibilityRole?: AccessibilityProps["accessibilityRole"]}>

const ButtonView : React.FC<PressableViewProps> = props => {
    return (
        <Pressable style={{ 
            ...pressableViewStyles,
            ...props.style,

        }}
        onPress={props.onPress}
        accessibilityRole={props.accessibilityRole}>
            {props.children}
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