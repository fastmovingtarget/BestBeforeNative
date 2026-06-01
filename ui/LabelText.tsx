//2026-06-01 : UI Tweaking

//2025-11-21 : Moving common UI elements into their own folder

import {Text} from "react-native";
import type { PropsWithChildren } from "react";
import type { TextStyle } from "react-native";
import { Colours } from "@/constants/Colors";

type LabelTextProps = {
    style?: TextStyle,
    ["aria-label"]?:string
}

const LabelText = ({style, children, 'aria-label' : ariaLabel} : PropsWithChildren<LabelTextProps>) => {
    return (
        <Text style={{ 
            ...labelTextStyles,
            ...style,

        }}
        aria-label={ariaLabel}>
            {children}
        </Text>
    );
}

const labelTextStyles = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    color: Colours.text,
    padding: 10,
    margin:0,
    textAlignVertical: "center",
    verticalAlign: "middle",
    fontSize: 16
} as TextStyle;


export default LabelText;