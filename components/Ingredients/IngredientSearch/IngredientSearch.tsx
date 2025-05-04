import {Text, TextInput, View} from "react-native";
import React, {useState} from "react";
import {useData} from "@/Contexts/DataProvider";
import Ingredient from "@/Types/Ingredient";

export default function IngredientSearch() {

    const {setIngredientsSearchOptions, ingredientsSearchOptions} = useData()
    return (
        <View>
            <Text>Search: 
                <TextInput 
                    aria-label="search-input"
                    placeholder="Search for an ingredient..."
                    onSubmitEditing={event => setIngredientsSearchOptions({searchText: event.nativeEvent.text})}
                    defaultValue = {ingredientsSearchOptions?.searchText || ""}
                />
            </Text>
        </View>
    )
}