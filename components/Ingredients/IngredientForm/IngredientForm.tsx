import React, {useState} from 'react'
import { StyleSheet, Text, View, Pressable, TextInput } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import Ingredient from "@/Types/Ingredient";
import { useData } from "@/Contexts/DataProvider";

export default function IngredientForm({ingredient, onCancel} : {ingredient?: Ingredient, onCancel?: () => void}) {

    const [formIngredient, setFormIngredient] = useState<Ingredient>( ingredient || {
        Ingredient_Name: "",
        Ingredient_Quantity: 0,
        Ingredient_Date: new Date(),
    });
    const {addIngredient, updateIngredient} = useData();

    return (
        <View>
            <Text>Ingredient: 
                <TextInput
                    value={formIngredient.Ingredient_Name || ""}
                    onChangeText={(text) => setFormIngredient({...formIngredient, Ingredient_Name: text})}
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
                    value={formIngredient.Ingredient_Quantity?.toString()}
                    inputMode='numeric'
                    onChangeText={(text) => setFormIngredient({...formIngredient, Ingredient_Quantity: parseInt(text)})}
                    aria-label="quantity-input"
                />
            </Text>
            <Pressable onPress={() => onCancel ? onCancel() : null}>
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