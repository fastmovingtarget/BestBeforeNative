import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import IngredientSearch from "./IngredientSearch/IngredientSearch";
import IngredientsList from "./IngredientsList/IngredientsList";
import IngredientForm from "./IngredientForm/IngredientForm";

export default function IngredientsPage() {
    const [isFormVisible, setIsFormVisible] = useState(false);

    return (
        <View>
            <Text>Ingredients Page</Text>
            <IngredientSearch />
            <View >
                <Pressable accessibilityRole="button" style={isFormVisible ? styles.addIngredientInvisible : styles.addIngredientVisible} onPress={() => setIsFormVisible(true)}>
                    <Text>Add Ingredient</Text>
                </Pressable>
                <IngredientForm onCancel={() => setIsFormVisible(false)} isFormVisible={isFormVisible} />
            </View>
            <IngredientsList onEdit={() => setIsFormVisible(false)} />
        </View>
    );
}

const styles = StyleSheet.create({
    addIngredientVisible: {
        backgroundColor: "blue",
        padding: 10,
        borderRadius: 5,
    },
    addIngredientInvisible: {
        display: "none",
    },
});