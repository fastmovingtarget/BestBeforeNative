import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import ButtonView from "../CustomComponents/ButtonView";
import LabelText from "../CustomComponents/LabelText";
import PageView from "../CustomComponents/PageView";
import IngredientSearch from "./IngredientSearch/IngredientSearch";
import IngredientsList from "./IngredientsList/IngredientsList";
import IngredientForm from "./IngredientForm/IngredientForm";

export default function IngredientsPage() {
    const [isFormVisible, setIsFormVisible] = useState(false);

    return (
        <PageView>
            <Text>Ingredients Page</Text>
            <IngredientSearch />
            <View >
                <ButtonView accessibilityRole="button" style={isFormVisible ? styles.addIngredientInvisible : {margin : 5}} onPress={() => setIsFormVisible(true)}>
                    <LabelText >Add Ingredient</LabelText>
                </ButtonView>
                <IngredientForm onCancel={() => setIsFormVisible(false)} isFormVisible={isFormVisible} />
            </View>
            <IngredientsList onEdit={() => setIsFormVisible(false)} />
        </PageView>
    );
}

const styles = StyleSheet.create({
    addIngredientInvisible: {
        display: "none",
    },
});