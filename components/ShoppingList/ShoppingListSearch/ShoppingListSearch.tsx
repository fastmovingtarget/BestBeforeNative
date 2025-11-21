//2025-11-21 : Moving common UI elements into their own folder

//2025-10-23 : Converted to use Shopping List Context

//2025-05-27 : Initial implementation of shopping list search function

import React from "react";
import ComponentView from "@/ui/ComponentView";
import FormTextInput from "@/ui/FormTextInput";
import { useShoppingList } from "@/Contexts/ShoppingList/ShoppingListDataProvider";

export default function ShoppingListSearch() {

    const {setShoppingListSearchOptions, shoppingListSearchOptions} = useShoppingList()

    return (
        <ComponentView>
            <FormTextInput 
                aria-label="shopping-list-search-input"
                placeholder="Search for a shopping list item..."
                onChange={event => {setShoppingListSearchOptions({searchString: event.nativeEvent.text})}}
                defaultValue = {shoppingListSearchOptions?.searchString || ""}
            />
        </ComponentView>
    )
}