//2026-08-11 : added handling for refresh
//2026-07-16 : Added function descriptions
//2026-06-01 : Using FadeComponent and RowContainer

//2025-11-21 : Moving common UI elements into their own folder

//2025-11-19 : Item_... fields now have Shopping_ as a prefix

//2025-10-23 : Converted to use Shopping List Context

//2025-05-22 : Initial implementation and basic tests

import Shopping_List_Item from "@/Types/Shopping_List_Item";
import { useState } from "react";
import {SyncState} from "@/Types/DataLoadingState";
import ShoppingListForm from "../ShoppingListForm/ShoppingListForm";
import ShoppingListItem from "./ShoppingListItem/ShoppingListItem";
import { ScrollableContainer} from "@/ui/BestBeforeUI";
import { useShoppingList } from "@/Contexts/ShoppingList/ShoppingListDataProvider";

/**
 * ShoppingList component
 * @param onEdit - Callback function to call when an item is being edited - lets the shopping list page know to hide the add shopping list item form so that only one form is present at a time
 * @returns A list of shopping list items, with the ability to edit or delete each item
 */
export default function ShoppingList({onEdit}: {onEdit: () => void}) {
    const [editId, setEditId] = useState<number | undefined>(undefined);

    const {shoppingList, setShoppingListDataState} = useShoppingList();

    return (
        <ScrollableContainer onRefresh={()=> {setShoppingListDataState(SyncState.Loading)}} >
            {shoppingList.map((item: Shopping_List_Item) => (
                editId !== item.Shopping_Item_ID ?
                    <ShoppingListItem key={`item-${item.Shopping_Item_ID}`} item={item} onEdit={(id) => {
                        setEditId(id);
                        onEdit();
                    }}/> :
                    <ShoppingListForm key={`item-form-${item.Shopping_Item_ID}`} item={item} onCancel={() => {setEditId(undefined)}} isFormVisible={true}/>
            ))}
        </ScrollableContainer>
    );
}