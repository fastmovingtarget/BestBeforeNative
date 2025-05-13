import { StyleSheet, Text, View, Pressable, ScrollView } from "react-native";
import Ingredient from "@/Types/Ingredient";
import { useData } from "@/Contexts/DataProvider";
import { useState } from "react";
import IngredientComponent from "./IngredientComponent/IngredientComponent";
import IngredientForm from "../IngredientForm/IngredientForm";
import ListView from "@/components/ListView";

export default function IngredientsList({onEdit}: {onEdit: () => void}) {
    const [editId, setEditId] = useState<number | undefined>(undefined);

    return (
        <ListView >
            {useData().ingredients.map((ingredient: Ingredient) => (
                editId !== ingredient.Ingredient_ID ?
                    <IngredientComponent key={`ingredient-${ingredient.Ingredient_ID}`} ingredient={ingredient} onEdit={(id) => {
                        setEditId(id);
                        onEdit();
                    }}/> :
                    <IngredientForm key={`ingredient-form-${ingredient.Ingredient_ID}`} ingredient={ingredient} onCancel={() => {setEditId(undefined)}} isFormVisible={true}/>
            ))}
        </ListView>
    );
}