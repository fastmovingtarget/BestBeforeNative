//2025-11-19 : Item_... fields now have Shopping_ as a prefix

//2025-10-23 : Converted to use Shopping List and Ingredients contexts

//2025-05-27 : Adding purchase button to the list item

//2025-05-21 : Basic Implementation of list item


import { View } from "react-native";
import type Shopping_List_Item from "@/Types/Shopping_List_Item";
import ComponentView from "@/components/CustomComponents/ComponentView";
import LabelText from "@/components/CustomComponents/LabelText";
import ButtonView from "@/components/CustomComponents/ButtonView";
import { useShoppingList } from "@/Contexts/ShoppingList/ShoppingListDataProvider";
import { useInventory } from "@/Contexts/Inventory/InventoryDataProvider";

export default function ShoppingListItem({ item, onEdit } : { item: Shopping_List_Item, onEdit: (itemID: number) => void }) {
    const { deleteShoppingItem } = useShoppingList();
    const { addInventoryItem } = useInventory();       
    const onPurchase = () => {
        if (item.Shopping_Item_ID) {
            addInventoryItem({
                Inventory_Item_Name: item.Shopping_Item_Name,
                Inventory_Item_Quantity: item.Shopping_Item_Quantity || 0,
                Plan_ID: item.Plan_ID || undefined,
                Plan_Ingredient_ID: item.Plan_Ingredient_ID || undefined,
            });
            deleteShoppingItem(item.Shopping_Item_ID);
        }
    }

    return (
        <ComponentView >
            <LabelText>{item.Shopping_Item_Name}</LabelText>
            <LabelText>{item.Shopping_Item_Quantity ? item.Shopping_Item_Quantity + "g" : "??g"}</LabelText>
            {item.Plan_Date && item.Plan_Recipe_Name ? (
                <LabelText>Buy By: {item.Plan_Date.toLocaleDateString()} for {item.Plan_Recipe_Name}</LabelText>
            ) : null}
            <View style={{flexDirection: "row", justifyContent: "space-around", width: "100%"}}>
                <ButtonView onPress={onPurchase}>
                    <LabelText>Purchase</LabelText>
                </ButtonView>
                <ButtonView onPress={() => onEdit(item.Shopping_Item_ID || -1)}>
                    <LabelText>Edit</LabelText>
                </ButtonView>
                <ButtonView onPress={() => {deleteShoppingItem(item.Shopping_Item_ID || -1)}}>
                    <LabelText>Delete</LabelText>
                </ButtonView>
            </View>
        </ComponentView>
    )
}