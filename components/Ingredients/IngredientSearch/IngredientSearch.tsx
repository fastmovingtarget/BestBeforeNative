import {Text, TextInput, View, StyleSheet} from "react-native";
import React, {useState} from "react";
import ComponentView from "@/components/CustomComponents/ComponentView";
import LabelText from "@/components/CustomComponents/LabelText";
import FormTextInput from "@/components/CustomComponents/FormTextInput";
import FormFieldContainer from "@/components/CustomComponents/FormFieldContainer";
import {useData} from "@/Contexts/DataProvider";
import Ingredient from "@/Types/Ingredient";

export default function IngredientSearch() {

    const {setIngredientsSearchOptions, ingredientsSearchOptions} = useData()

    return (
        <ComponentView>
            <FormTextInput 
                aria-label="search-input"
                placeholder="Search for an ingredient..."
                onChange={event => {setIngredientsSearchOptions({searchText: event.nativeEvent.text})}}
                defaultValue = {ingredientsSearchOptions?.searchText || ""}
            />
        </ComponentView>
    )
}