//2026-07-01 : Moving Add button onto the Search bar

//2026-06-01 : Using FadeComponent for animations

//2025-11-21 : Moving common UI elements into their own folder

//2025-10-23 : Converted to use Shopping List Context

//2025-05-27 : Initial implementation of shopping list search function

import React from "react";
import { useShoppingList } from "@/Contexts/ShoppingList/ShoppingListDataProvider";
import {  ButtonView, FadeComponent, FormTextInput, RowContainer } from '@/ui/BestBeforeUI';
import { AddShoppingListItemIcon } from "@/ui/ReactIcon";

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
                <ButtonView accessibilityRole="button" onPress={() => setIsFormVisible(true)} style={{margin:5}}>
                    <AddShoppingListItemIcon />
                </ButtonView> 
            </RowContainer>
        </FadeComponent>
    )
}