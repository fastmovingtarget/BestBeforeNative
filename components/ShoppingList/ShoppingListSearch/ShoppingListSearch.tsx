//2026-07-20 : Adding aria-labels to iconised components
//2026-07-16 : Added function descriptions
//2026-07-01 : Moving Add button onto the Search bar

//2026-06-01 : Using FadeComponent for animations

//2025-11-21 : Moving common UI elements into their own folder

//2025-10-23 : Converted to use Shopping List Context

//2025-05-27 : Initial implementation of shopping list search function

import React from "react";
import { useShoppingList } from "@/Contexts/ShoppingList/ShoppingListDataProvider";
import {  ButtonView, FadeComponent, FormTextInput, RowContainer } from '@/ui/BestBeforeUI';
import { AddShoppingListItemIcon } from "@/ui/ReactIcon";

/**
 * ShoppingListSearch component
 * The search input updates the search options in the Shopping List context, allowing for dynamic filtering of the shopping list
 * @param setIsFormVisible - Callback function to call when the add button is pressed, to show the add shopping list item form
 * @returns A component that provides a search input for filtering shopping list items by name
 */
export default function ShoppingListSearch({ setIsFormVisible }: { setIsFormVisible: (isVisible: boolean) => void }) {

    const {setShoppingListSearchOptions, shoppingListSearchOptions} = useShoppingList()

    return (
        <FadeComponent>
            <RowContainer style={{justifyContent:"space-between", alignItems:"center", width:"100%"}}>
                <FormTextInput 
                    aria-label="shopping-list-search-input"
                    placeholder="Search for a shopping list item..."
                    onChange={event => {setShoppingListSearchOptions({searchText: event.nativeEvent.text})}}
                    defaultValue = {shoppingListSearchOptions?.searchText || ""}
                    style={{flex:1, margin:5, width:"85%", height:57}}
                />
                <ButtonView aria-label="add-shopping-list-item-button" onPress={() => setIsFormVisible(true)} style={{margin:5}}>
                    <AddShoppingListItemIcon />
                </ButtonView> 
            </RowContainer>
        </FadeComponent>
    )
}