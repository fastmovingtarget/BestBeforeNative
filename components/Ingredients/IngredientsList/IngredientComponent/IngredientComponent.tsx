//2025-10-20 : Changed to use Ingredients Context

import {  View } from "react-native";
import Ingredient from "@/Types/Ingredient";
import ComponentView from "@/components/CustomComponents/ComponentView";
import LabelText from "@/components/CustomComponents/LabelText";
import ButtonView from "@/components/CustomComponents/ButtonView";
import { useIngredients } from "@/Contexts/Ingredients/IngredientsDataProvider";

export default function IngredientComponent({ ingredient, onEdit } : { ingredient: Ingredient, onEdit: (ingredientID: number) => void }) {
    const { deleteIngredient } = useIngredients();

    return (
        <ComponentView >
            <LabelText>{ingredient.Ingredient_Name}</LabelText>
            {ingredient.Ingredient_Frozen ? 
                <LabelText>{`Frozen on ${ingredient.Ingredient_Frozen?.toLocaleDateString("en-UK", { year: "numeric", month: "2-digit", day: "2-digit" })}`}</LabelText> :
                <LabelText>{`Eat By ${ingredient.Ingredient_Date?.toLocaleDateString("en-UK", { year: "numeric", month: "2-digit", day: "2-digit" }) || "??/??/????"}`}</LabelText>
            }
            <LabelText>{ingredient.Ingredient_Quantity ? ingredient.Ingredient_Quantity + "g" : "??g"}</LabelText>
            {ingredient.Plan_ID && ingredient.Recipe_Name && ingredient.Plan_Date && (
                <LabelText>{`Reserved for ${ingredient.Recipe_Name} on ${new Date(ingredient.Plan_Date)?.toLocaleDateString("en-UK", { year: "numeric", month: "2-digit", day: "2-digit" })}`}</LabelText>
            )}
            <View style={{flexDirection: "row", justifyContent: "space-around", width: "100%"}}>
                <ButtonView onPress={() => onEdit(ingredient.Ingredient_ID || -1)}>
                    <LabelText>Edit</LabelText>
                </ButtonView>
                <ButtonView onPress={() => {deleteIngredient(ingredient.Ingredient_ID || -1)}}>
                    <LabelText>Delete</LabelText>
                </ButtonView>
            </View>
        </ComponentView>
    )
}