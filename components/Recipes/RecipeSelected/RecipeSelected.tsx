import React from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import ScrollableComponent from "@/components/ScrollableComponent";
import LabelText from "@/components/LabelText";
import Recipe from "@/Types/Recipe";
import FormFieldContainer from "@/components/FormFieldContainer";
import ButtonView from "@/components/ButtonView";

export default function RecipeSelected({recipe}: { recipe: Recipe}) {
    return (
        <ScrollableComponent>
            <LabelText >{recipe.Recipe_Name}</LabelText>
            <LabelText >Time: {recipe.Recipe_Time} min</LabelText>
            <LabelText >Difficulty: {recipe.Recipe_Difficulty}</LabelText>
            <LabelText >Ingredients:</LabelText>
            {recipe.Recipe_Ingredients.map((ingredient) => (
                <LabelText key={ingredient.Recipe_Ingredient_ID}>
                    {ingredient.Ingredient_Name}: {ingredient.Ingredient_Quantity}
                </LabelText>
            ))}
            <LabelText >Instructions:</LabelText>
            <LabelText >{recipe.Recipe_Instructions}</LabelText>
        </ScrollableComponent>
    )
}