//2026-06-01 : Using FadeComponent for animations

//2025-11-21 : Moving common UI elements into their own folder

//2025-10-23 : Converted to use Shopping List Context

//2025-05-27 : Initial implementation of shopping list search function

import React from "react";
import { useShoppingList } from "@/Contexts/ShoppingList/ShoppingListDataProvider";
import {  FadeComponent, FormTextInput } from '@/ui/BestBeforeUI';

export default function ShoppingListSearch() {

    const {setShoppingListSearchOptions, shoppingListSearchOptions} = useShoppingList()

    return (
        <FadeComponent>
            <FormTextInput 
                aria-label="shopping-list-search-input"
                placeholder="Search for a shopping list item..."
                onChange={event => {setShoppingListSearchOptions({searchText: event.nativeEvent.text})}}
                defaultValue = {shoppingListSearchOptions?.searchText || ""}
            />
        </FadeComponent>
    )
}