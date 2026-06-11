//2026-06-01 : UI Tweaking

//2025-11-21 : Moving common UI elements into their own folder

import { TextInput, NativeSyntheticEvent, } from "react-native";
import type { PropsWithChildren } from "react";
import type { TextInputChangeEventData, TextStyle} from "react-native";
import { Colours } from "@/constants/Colors";

type InputTextProps = {
    style?: TextStyle,
    defaultValue : string,
    placeholder?: string,
    inputMode?:'numeric' | 'text',
    onChange?:(event : NativeSyntheticEvent<TextInputChangeEventData>) => void,
    onChangeText?:(text : string) => void,
    ["aria-label"]:string
    multiline?: boolean,
    numberOfLines?: number,
}

const FormTextInput = ({style, children, defaultValue, inputMode = "text", onChange, onChangeText, 'aria-label' : ariaLabel, placeholder = "", multiline = false, numberOfLines = 1} : PropsWithChildren<InputTextProps>) => {
    return (
        <TextInput 
            style={{ 
                ...inputTextStyles,
                ...style,
            }}
            defaultValue={defaultValue}
            inputMode={inputMode}
            onChange={onChange}
            onChangeText={onChangeText}
            aria-label={ariaLabel}
            placeholder={placeholder}
            placeholderTextColor={Colours.placeholderText}
            multiline={multiline}
            numberOfLines={numberOfLines}
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
        backgroundColor: Colours.inputBackground,
        color: Colours.text,
        borderRadius: 5,
        textAlignVertical: "center",
        width: "70%",
        lineHeight: 20,
        fontSize: 16,
        margin: 5,
} as TextStyle;


export default FormTextInput;