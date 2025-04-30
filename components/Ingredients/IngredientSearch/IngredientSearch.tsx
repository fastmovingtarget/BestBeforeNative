import {Text, TextInput, View} from "react-native";
import React, {useState} from "react";
import {useData} from "@/Contexts/DataProvider";
import Ingredient from "@/Types/Ingredient";

export default function IngredientSearch() {
    return (
        <View>
            <Text>Search: 
                <TextInput 
                    aria-label="search-input"
                    placeholder="Search for an ingredient"
                    onSubmitEditing={() => {}}
                    defaultValue=""
                />
            </Text>
        </View>
    )
}