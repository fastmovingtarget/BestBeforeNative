//2025-05-27 : Initial implementation of shopping list search function

import {Text, TextInput, View, StyleSheet} from "react-native";
import React, {useState} from "react";
import ComponentView from "@/components/CustomComponents/ComponentView";
import LabelText from "@/components/CustomComponents/LabelText";
import FormTextInput from "@/components/CustomComponents/FormTextInput";
import FormFieldContainer from "@/components/CustomComponents/FormFieldContainer";
import {useData} from "@/Contexts/DataProvider";

export default function ShoppingListSearch() {

    const {setShoppingListSearchOptions, shoppingListSearchOptions} = useData()

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