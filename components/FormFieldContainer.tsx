import {View} from "react-native";
import type { PropsWithChildren } from "react";
import type { ViewStyle } from "react-native";

type FormFieldProps = {
    style?: ViewStyle,
    ["aria-label"]?:string
}

const FormFieldContainer = ({style, children, 'aria-label' : ariaLabel} : PropsWithChildren<FormFieldProps>) => {
    return (
        <View 
            style={{ 
                ...formFieldContainerStyles,
                ...style,
            }}
            aria-label={ariaLabel}>
            {children}
        </View>
    );
}

const formFieldContainerStyles = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    textAlignVertical: "center",
    textAlign: "center",
    color: "#e3dccf",
    borderRadius: 5,
    width: "100%",
    padding: 5,
} as ViewStyle;

export default FormFieldContainer;