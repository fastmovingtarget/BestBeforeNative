//2026-10-09 : New Date Picker Component, dismissed properly on cancel
//2026-10-09 : Date Picker moved to separate file with validation

import DateTimePicker from '@react-native-community/datetimepicker';
import {RowContainer, ButtonView, LabelText} from '@/ui/BestBeforeUI'; // Replace 'your-component-library' with the actual path


import {useState} from 'react';
import { useColourData } from '@/Contexts/Colours/ColourDataProvider';
import { TextStyle } from 'react-native';

export default function InventoryItemFormDatePicker({date, onDateChange, ariaLabel, validationFunction }: {date: Date | undefined | null, onDateChange: (date: Date) => void, ariaLabel?: string, validationFunction?: (date: Date | undefined | null) => true | string}) {
    const {colours} = useColourData();
    
    const initialMessage = validationFunction ? (validationFunction(date) === true ? null : validationFunction(date).toString()) : null;

    const [pickerVisible, setPickerVisible] = useState(false);

    const [invalidMessage, setInvalidMessage] = useState<string | null>(initialMessage);

    const dateChangeHandler = (event: any, selectedDate: Date | undefined) => {
        const currentDate = selectedDate || date;
        onDateChange(currentDate || new Date());
        setInvalidMessage(validationFunction ? (validationFunction(currentDate) === true ? null : validationFunction(currentDate).toString()) : null);
        setPickerVisible(false);
    }
    
    const errorTextStyles = {
        color: colours.errorText, 
        position: "absolute", 
        bottom: -8, 
        left: 15, 
        fontSize: 10, 
        backgroundColor: colours.primary, 
        paddingVertical: 0, 
        paddingHorizontal: 5, 
        borderWidth: 1, 
        borderColor: colours.errorText
    } as TextStyle;

    return (
        <RowContainer  >
            <ButtonView
                onPress={() => setPickerVisible(!pickerVisible)}
                style={{width: "100%", padding:0, borderWidth: 1,
                    borderColor: invalidMessage ? colours.errorText : "transparent",}}
                aria-label="date-input-button"
            >
                <LabelText aria-label="date-button-label">
                    {`Use By: ${date?.toLocaleDateString("en-UK", { year: "numeric", month: "2-digit", day: "2-digit" })}`}
                </LabelText>
                {invalidMessage && <LabelText style={errorTextStyles} aria-label={`validation-text`}>{invalidMessage}</LabelText>}
            </ButtonView>


            {pickerVisible ? <DateTimePicker
                value={date || new Date()}
                minimumDate={new Date()}
                mode="date"
                display="default"
                onValueChange={dateChangeHandler}
                onDismiss={() => setPickerVisible(false)}
                aria-label="date-input"
            /> : null}
        </RowContainer>
    );
}