//2026-06-01 : Using FadeComponent and RowContainer

//2025-11-21 : Moving common UI elements into their own folder

//2025-11-19 : Item_... fields now have Shopping_ as a prefix

//2025-10-23 : Converted to use Shopping List Context

//2025-05-22 : Initial implementation and basic tests

import Shopping_List_Item from "@/Types/Shopping_List_Item";
import { useState } from "react";
import ShoppingListForm from "../ShoppingListForm/ShoppingListForm";
import ShoppingListItem from "./ShoppingListItem/ShoppingListItem";
import { ScrollableContainer} from "@/ui/BestBeforeUI";
import { useShoppingList } from "@/Contexts/ShoppingList/ShoppingListDataProvider";

export default function ShoppingList({onEdit}: {onEdit: () => void}) {
    const [editId, setEditId] = useState<number | undefined>(undefined);

    return (
        <ScrollableContainer >
            {useShoppingList().shoppingList.map((item: Shopping_List_Item) => (
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