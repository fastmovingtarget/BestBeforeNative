import {Text, TextInput, NativeSyntheticEvent, TextInputSubmitEditingEventData} from "react-native";
import type { PropsWithChildren } from "react";
import type { TextInputChangeEventData, TextStyle} from "react-native";

type InputTextProps = {
    style?: TextStyle,
    defaultValue : string,
    placeholder?: string,
    inputMode?:'numeric' | 'text',
    onChange:(event : NativeSyntheticEvent<TextInputChangeEventData>) => void,
    ["aria-label"]:string
}

const FormTextInput = ({style, children, defaultValue, inputMode = "text", onChange, 'aria-label' : ariaLabel, placeholder = ""} : PropsWithChildren<InputTextProps>) => {
    return (
        <TextInput 
            style={{ 
                ...inputTextStyles,
                ...style,
            }}
            defaultValue={defaultValue}
            inputMode={inputMode}
            onChange={onChange}
            aria-label={ariaLabel}
            placeholder={placeholder}
            placeholderTextColor={"#e3dccf"}
        >
            {children}
        </TextInput>
    );
}

const inputTextStyles = {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#111111",
        color: "#e3dccf",
        borderRadius: 5,
        textAlignVertical: "center",
        width: "70%",
        lineHeight: 20,
        fontSize: 16
} as TextStyle;


export default FormTextInput;