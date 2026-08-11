//2026-08-11 : causes plans to refresh when a relevant item is deleted
//2026-07-20 : Adding aria-labels to iconised components
//2026-07-16 : Added function descriptions
//2026-06-30 : Added Buy, Edit and Delete icons

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
import { usePlans } from "@/Contexts/Plans/PlansDataProvider"; 
import {RowContainer, ButtonView, LabelText, FadeComponent} from "@/ui/BestBeforeUI";
import { AddInventoryIcon, DeleteIcon, EditShoppingListIcon } from "@/ui/ReactIcon";
import { SyncState } from "@/Types/DataLoadingState";

/**
 * ShoppingListItem component
 * @param item - The shopping list item to display
 * @param onEdit - Callback function to call when the edit button is pressed
 * @returns A component that displays a shopping list item with purchase, edit and delete buttons
 */
export default function ShoppingListItem({ item, onEdit } : { item: Shopping_List_Item, onEdit: (itemID: number) => void }) {
    const { deleteShoppingItem } = useShoppingList();
    const { addInventoryItem } = useInventory();   
    const { setPlansDataState } = usePlans();
    
    /**
     * Handles the purchase of a shopping list item. When the purchase button is pressed, the item is added to the inventory and removed from the shopping list.
     * If the item has a Shopping_Item_ID, it is added to the inventory with its name and quantity, and any associated plan information. The item is then deleted from the shopping list.
     */
    const onPurchase = () => {
        if (item.Shopping_Item_ID) {
            addInventoryItem({
                Inventory_Item_Name: item.Shopping_Item_Name,
                Inventory_Item_Quantity: item.Shopping_Item_Quantity || 0,
                Plan_ID: item.Plan_ID || undefined,
                Plan_Ingredient_ID: item.Plan_Ingredient_ID || undefined,
            });
            deleteShoppingItem(item.Shopping_Item_ID);
            if(item.Plan_ID && item.Plan_Ingredient_ID) {
                setPlansDataState(SyncState.Loading);
            }
        }
    }

    const onDelete = () => {
        if (item.Shopping_Item_ID) {
            deleteShoppingItem(item.Shopping_Item_ID);
            if(item.Plan_ID && item.Plan_Ingredient_ID) {
                setPlansDataState(SyncState.Loading);
            }
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
                <ButtonView onPress={onPurchase} aria-label="purchase-shopping-list-item-button">
                    <AddInventoryIcon />
                </ButtonView>
                <ButtonView onPress={() => onEdit(item.Shopping_Item_ID || -1)} aria-label="edit-shopping-list-item-button">
                    <EditShoppingListIcon />
                </ButtonView>
                <ButtonView onPress={onDelete} aria-label="delete-shopping-list-item-button">
                    <DeleteIcon />
                </ButtonView>
            </RowContainer>
        </FadeComponent>
    )
}