import React from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import Recipe from "@/Types/Recipe";
import RecipesListItem from "./RecipesListItem/RecipesListItem";
import ListView from "@/components/ListView";
import { useData } from "@/Contexts/DataProvider";

export default function RecipesList({ setSelectedRecipe }: { setSelectedRecipe: (recipeID: number) => void }) {
    const { recipes } = useData();

    return (
        <ListView>
            {recipes.map((recipe: Recipe) => (
                <RecipesListItem
                    key={recipe.Recipe_ID}
                    recipe={recipe}
                    setSelectedRecipe={setSelectedRecipe}
                />
            ))}
        </ListView>
    );
}