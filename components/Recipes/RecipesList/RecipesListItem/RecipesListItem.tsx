import React from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import LabelText from "@/components/LabelText";
import Recipe from "@/Types/Recipe";

export default function RecipesListItem({ recipe, setSelectedRecipe }: { recipe: Recipe, setSelectedRecipe: (recipeID: number) => void }) {
    return (
        <Pressable
            aria-label="recipe item summary"
            onPress={() => setSelectedRecipe(recipe.Recipe_ID)}
        >
            <LabelText >{recipe.Recipe_Name}</LabelText>
            <LabelText >Time: {recipe.Recipe_Time} min</LabelText>
            <LabelText >Difficulty: {recipe.Recipe_Difficulty}</LabelText>
        </Pressable>
    );
}