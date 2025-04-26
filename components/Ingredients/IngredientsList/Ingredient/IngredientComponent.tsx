import { StyleSheet, Text, View, Pressable } from "react-native";
import Ingredient from "@/Types/Ingredient";
import { useData } from "@/Contexts/DataProvider";

export default function IngredientItem({ ingredient, onEdit } : { ingredient: Ingredient, onEdit: (ingredientID?: number) => void }) {
    const { deleteIngredient } = useData();

    return (
        <View>
            <Text>{ingredient.Ingredient_Name}</Text>
            <Text>{ingredient.Ingredient_Quantity ? ingredient.Ingredient_Quantity + "g" : "??g"}</Text>
            {ingredient.Ingredient_Frozen ? 
            <Text>{`Frozen on ${ingredient.Ingredient_Frozen?.toLocaleDateString("en-UK", { year: "numeric", month: "2-digit", day: "2-digit" })}`}</Text> :
            <Text>{`Eat By ${ingredient.Ingredient_Date?.toLocaleDateString("en-UK", { year: "numeric", month: "2-digit", day: "2-digit" }) || "??/??/????"}`}</Text>
            }
            {ingredient.Plan_ID && ingredient.Recipe_Name && ingredient.Plan_Date && (
                <Text>{`Reserved for ${ingredient.Recipe_Name} on ${ingredient.Plan_Date?.toLocaleDateString("en-UK", { year: "numeric", month: "2-digit", day: "2-digit" })}`}</Text>
            )}
            <Pressable onPress={() => onEdit(ingredient.Ingredient_ID)}>
                <Text>Edit</Text>
            </Pressable>
            <Pressable onPress={() => deleteIngredient(ingredient.Ingredient_ID || -1)}>
                <Text>Delete</Text>
            </Pressable>
        </View>
    )
}