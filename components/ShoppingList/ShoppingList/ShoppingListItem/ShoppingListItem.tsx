//2026-06-15 : 0 quantity now displays correctly

//2026-06-01 : Using FadeComponent and RowContainer

//2025-11-21 : Moving common UI elements into their own folder

//2025-11-19 : Item_... fields now have Shopping_ as a prefix

//2025-10-23 : Converted to use Shopping List and Ingredients contexts

//2025-05-27 : Adding purchase button to the list item

//2025-05-21 : Basic Implementation of list item

import type Shopping_List_Item from "@/Types/Shopping_List_Item";
import { useShoppingList } from "@/Contexts/ShoppingList/ShoppingListDataProvider";
import { useInventory } from "@/Contexts/Inventory/InventoryDataProvider";
import {RowContainer, ButtonView, LabelText, FadeComponent} from "@/ui/BestBeforeUI";

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
        <FadeComponent >
            <RowContainer>
                <LabelText>{item.Shopping_Item_Name}</LabelText>
                <LabelText>{item.Shopping_Item_Quantity || item.Shopping_Item_Quantity === 0 ? item.Shopping_Item_Quantity + "g" : "??g"}</LabelText>
            </RowContainer>
            {item.Plan_Date && item.Plan_Recipe_Name ? (
                <LabelText>Buy By: {item.Plan_Date.toLocaleDateString()} for {item.Plan_Recipe_Name}</LabelText>
            ) : null}
            <RowContainer style={{justifyContent: "space-around", width: "100%"}}>
                <ButtonView onPress={onPurchase}>
                    <LabelText>Purchase</LabelText>
                </ButtonView>
                <ButtonView onPress={() => onEdit(item.Shopping_Item_ID || -1)}>
                    <LabelText>Edit</LabelText>
                </ButtonView>
                <ButtonView onPress={() => {deleteShoppingItem(item.Shopping_Item_ID || -1)}}>
                    <LabelText>Delete</LabelText>
                </ButtonView>
            </RowContainer>
        </FadeComponent>
    )
}