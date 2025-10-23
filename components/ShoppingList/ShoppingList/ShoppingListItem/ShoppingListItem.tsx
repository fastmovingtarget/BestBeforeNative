//2025-10-23 : Converted to use Shopping List and Ingredients contexts

//2025-05-27 : Adding purchase button to the list item

//2025-05-21 : Basic Implementation of list item


import { View } from "react-native";
import type Shopping_List_Item from "@/Types/Shopping_List_Item";
import ComponentView from "@/components/CustomComponents/ComponentView";
import LabelText from "@/components/CustomComponents/LabelText";
import ButtonView from "@/components/CustomComponents/ButtonView";
import { useShoppingList } from "@/Contexts/ShoppingList/ShoppingListDataProvider";
import { useIngredients } from "@/Contexts/Ingredients/IngredientsDataProvider";

export default function IngredientComponent({ item, onEdit } : { item: Shopping_List_Item, onEdit: (itemID: number) => void }) {
    const { deleteShoppingItem } = useShoppingList();
    const { addIngredient } = useIngredients();

    const onPurchase = () => {
        if (item.Item_ID) {
            addIngredient({
                Ingredient_Name: item.Item_Name,
                Ingredient_Quantity: item.Item_Quantity || 0,
            });
            deleteShoppingItem(item.Item_ID);
        }
    }

    return (
        <ComponentView >
            <LabelText>{item.Item_Name}</LabelText>
            <LabelText>{item.Item_Quantity ? item.Item_Quantity + "g" : "??g"}</LabelText>
            {item.Plan_Date && item.Recipe_Name ? (
                <LabelText>Buy By: {item.Plan_Date.toLocaleDateString()} for {item.Recipe_Name}</LabelText>
            ) : null}
            <View style={{flexDirection: "row", justifyContent: "space-around", width: "100%"}}>
                <ButtonView onPress={onPurchase}>
                    <LabelText>Purchase</LabelText>
                </ButtonView>
                <ButtonView onPress={() => onEdit(item.Item_ID || -1)}>
                    <LabelText>Edit</LabelText>
                </ButtonView>
                <ButtonView onPress={() => {deleteShoppingItem(item.Item_ID || -1)}}>
                    <LabelText>Delete</LabelText>
                </ButtonView>
            </View>
        </ComponentView>
    )
}