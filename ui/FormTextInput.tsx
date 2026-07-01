//2026-07-01 : Adding ability to specify height

//2026-06-18 : Removed require cycle

//2026-06-17 : Incoming width applies to container

//2026-06-15 : Failed validation requires handling in parent

//2026-06-15 : Improved error message display

//2026-06-15 : Added field validation and error message

//2026-06-01 : UI Tweaking

//2025-11-21 : Moving common UI elements into their own folder

import { TextInput, NativeSyntheticEvent, } from "react-native";
import { useState, type PropsWithChildren } from "react";
import type { TextInputChangeEventData, TextStyle} from "react-native";
import { Colours } from "@/constants/Colors";
import ColumnContainer from "./ColumnContainer";
import LabelText from "./LabelText";

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
    validationFunction?:(text : string) => true | string,
}

const FormTextInput = ({style, children, defaultValue, inputMode = "text", onChange, onChangeText, 'aria-label' : ariaLabel, placeholder = "", multiline = false, numberOfLines = 1, validationFunction} : PropsWithChildren<InputTextProps>) => {

    const initialMessage = validationFunction ? (validationFunction(defaultValue) === true ? null : validationFunction(defaultValue).toString()) : null;    

    const [invalidMessage, setInvalidMessage] = useState<string | null>(initialMessage);

    const onChangeValidation = (event : NativeSyntheticEvent<TextInputChangeEventData>) => {
        if(validationFunction){
            const validationResult = validationFunction(event.nativeEvent.text);
            if(validationResult === true){
                if(onChange) onChange(event);
                setInvalidMessage(null);
            }
            else{
                if(onChange) onChange(event);
                setInvalidMessage(validationResult);
            }
        } else {
            if(onChange) onChange(event);
        }
    }

    return (
        <ColumnContainer style={{alignItems: "flex-start", position: "relative", width: style?.width || "100%", height: style?.height || "auto", flexGrow: style?.flexGrow || 0,}}>
            <TextInput 
                style={{ 
                    ...inputTextStyles,
                    ...style,
                    width: "100%",
                    height: multiline ? 100 : 40,
                    borderColor: invalidMessage ? Colours.errorText : "transparent",
                    textAlignVertical: multiline ? "top" : "center",
                }}
                defaultValue={defaultValue}
                inputMode={inputMode}
                onChange={onChangeValidation}
                onChangeText={onChangeText}
                aria-label={ariaLabel}
                placeholder={placeholder}
                placeholderTextColor={Colours.placeholderText}
                multiline={multiline}
                numberOfLines={numberOfLines}
            >
                {children}
            </TextInput>
            {invalidMessage && <LabelText style={errorTextStyles}>{invalidMessage}</LabelText>}
        </ColumnContainer>
    );
}

const errorTextStyles = {
    color: Colours.errorText, 
    position: "absolute", 
    bottom: 1, 
    left: 15, 
    fontSize: 10, 
    backgroundColor: Colours.primary, 
    paddingVertical: 0, 
    paddingHorizontal: 5, 
    borderWidth: 1, 
    borderColor: Colours.errorText
} as TextStyle;

const inputTextStyles = {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: Colours.inputBackground,
        color: Colours.text,
        borderRadius: 5,
        textAlignVertical: "center",
        lineHeight: 20,
        fontSize: 16,
        width:"100%",
        marginVertical: 8,
        padding:3,
        paddingVertical: 8,
        borderWidth: 1,
} as TextStyle;


export default FormTextInput;