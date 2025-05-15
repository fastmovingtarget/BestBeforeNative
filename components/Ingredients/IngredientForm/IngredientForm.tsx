import React, {useState} from 'react'
import { StyleSheet, Text, View, Pressable, TextInput } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import Ingredient from "@/Types/Ingredient";
import ComponentView from '@/components/ComponentView';
import ButtonView from '@/components/ButtonView';
import FormFieldContainer from '@/components/FormFieldContainer';
import LabelText from '@/components/LabelText';
import FormTextInput from '@/components/FormTextInput';
import { useData } from "@/Contexts/DataProvider";

export default function IngredientForm({ingredient, onCancel, isFormVisible = false} : {ingredient?: Ingredient, onCancel?: () => void, isFormVisible?: boolean}) {

    const blankIngredient = {
        Ingredient_Name: "",
        Ingredient_Quantity: 0,
        Ingredient_Date: new Date(),
    }
    const [formIngredient, setFormIngredient] = useState<Ingredient>( ingredient || blankIngredient);
    const [pickerVisible, setPickerVisible] = useState(false);
    const {addIngredient, updateIngredient} = useData();

    const cancelHandler = () => {
        formIngredient.Ingredient_ID ? 
        setFormIngredient(ingredient || blankIngredient) 
        : setFormIngredient(blankIngredient);
        if (onCancel) {
            onCancel();
        }
    }

    const submitHandler = () => {
        if(formIngredient?.Ingredient_ID)  
            updateIngredient(formIngredient) 
        else{ 
            addIngredient(formIngredient);
            setFormIngredient(blankIngredient);
        }
        if (onCancel) {
            onCancel();
        }
    }

    return (
        <ComponentView aria-label="formContainer" style={isFormVisible ? styles.formVisible : styles.formInvisible} >
            <FormFieldContainer  >
                <LabelText >Ingredient: </LabelText> 
                <FormTextInput
                    defaultValue={formIngredient.Ingredient_Name || ""}
                    inputMode='text'
                    onChange={(event) => setFormIngredient({...formIngredient, Ingredient_Name: event.nativeEvent.text})}
                    aria-label="name-input"
                />
            </FormFieldContainer>
                
            <FormFieldContainer  >
                <LabelText aria-label="date-input-label" >Use By: </LabelText>
                <ButtonView
                    onPress={() => setPickerVisible(!pickerVisible)}
                    style={{width: "70%", padding:0}}
                >
                    <LabelText aria-label="date-input-button">
                        {formIngredient.Ingredient_Date?.toLocaleDateString("en-UK", { year: "numeric", month: "2-digit", day: "2-digit" })}
                    </LabelText>
                </ButtonView>
                {pickerVisible ? <DateTimePicker
                    value={formIngredient.Ingredient_Date || new Date()}
                    minimumDate={new Date()}
                    mode="date"
                    display="default"
                    onChange={(event, date) => {setFormIngredient({...formIngredient, Ingredient_Date: date}); setPickerVisible(false)}}
                    aria-label="date-input"
                /> : null}
            </FormFieldContainer>
            <FormFieldContainer  >
                <LabelText >Quantity: </LabelText>
                <FormTextInput
                    defaultValue={formIngredient.Ingredient_Quantity?.toString() || ""}
                    inputMode='numeric'
                    onChange={(event) => setFormIngredient({...formIngredient, Ingredient_Quantity: parseInt(event.nativeEvent.text)})}
                    aria-label="quantity-input"
                />
            </FormFieldContainer>
            <FormFieldContainer style={{justifyContent:"space-around"}} >
                <ButtonView onPress={cancelHandler}>
                    <LabelText >Cancel</LabelText>
                </ButtonView>
                <ButtonView onPress={submitHandler}>
                    <LabelText >Submit</LabelText>
                </ButtonView>
            </FormFieldContainer>

        </ComponentView>
    )
}

const styles = StyleSheet.create({
    formVisible: {
        display: "flex",
        flexDirection: "column",
        padding: 10,
        borderRadius: 5,
    },
    formInvisible: {
        display: "none",
    },
});
