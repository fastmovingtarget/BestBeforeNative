import React, {useState} from 'react'
import { StyleSheet, Text, View, Pressable, TextInput } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import Ingredient from "@/Types/Ingredient";
import { useData } from "@/Contexts/DataProvider";

export default function IngredientForm({ingredient, onCancel, isFormVisible = false} : {ingredient?: Ingredient, onCancel?: () => void, isFormVisible?: boolean}) {

    const [formIngredient, setFormIngredient] = useState<Ingredient>( ingredient || {
        Ingredient_Name: "",
        Ingredient_Quantity: 0,
        Ingredient_Date: new Date(),
    });
    const {addIngredient, updateIngredient} = useData();

    const cancelHandler = () => {
        setFormIngredient(ingredient || {
            Ingredient_Name: "",
            Ingredient_Quantity: 0,
            Ingredient_Date: new Date(),
        })
        if (onCancel) {
            onCancel();
        }
    }

    return (
        <View aria-label="formContainer" style={isFormVisible ? styles.formVisible : styles.formInvisible}>
            <Text>Ingredient: 
                <TextInput
                    defaultValue={formIngredient.Ingredient_Name || ""}
                    onSubmitEditing={(event) => setFormIngredient({...formIngredient, Ingredient_Name: event.nativeEvent.text})}
                    aria-label="name-input"
                />
            </Text>
            <Text>Use By: 
                <DateTimePicker
                    value={formIngredient.Ingredient_Date || new Date()}
                    minimumDate={new Date()}
                    mode="date"
                    display="default"
                    onChange={(event, date) => setFormIngredient({...formIngredient, Ingredient_Date: date})}
                    aria-label="date-input"
                />
            </Text>
            <Text>Quantity: 
                <TextInput
                    defaultValue={formIngredient.Ingredient_Quantity?.toString()}
                    inputMode='numeric'
                    onSubmitEditing={(event) => setFormIngredient({...formIngredient, Ingredient_Quantity: parseInt(event.nativeEvent.text)})}
                    aria-label="quantity-input"
                />
            </Text>
            <Pressable onPress={cancelHandler}>
                <Text>Cancel</Text>
            </Pressable>
            <Pressable onPress={() => 
                formIngredient.Ingredient_ID ? 
                updateIngredient(formIngredient) : 
                addIngredient(formIngredient)}>
                <Text>Submit</Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    formVisible: {
        display: "flex",
        flexDirection: "column",
        backgroundColor: "white",
        padding: 10,
        borderRadius: 5,
    },
    formInvisible: {
        display: "none",
    },
});
