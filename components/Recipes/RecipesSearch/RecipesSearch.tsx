import {Text, TextInput, View, StyleSheet} from "react-native";
import React, {useState} from "react";
import ComponentView from "@/components/ComponentView";
import LabelText from "@/components/LabelText";
import FormTextInput from "@/components/FormTextInput";
import FormFieldContainer from "@/components/FormFieldContainer";
import {useData} from "@/Contexts/DataProvider";
import Ingredient from "@/Types/Ingredient";

export default function RecipesSearch() {

    const {setRecipesSearchOptions, recipesSearchOptions} = useData()

    return (
        <ComponentView>
            <FormFieldContainer style={{flexDirection: "row", justifyContent: "space-between"}}>
                <LabelText>Search: </LabelText>
                <FormTextInput 
                    aria-label="search-input"
                    placeholder="Search for a recipe name or recipe ingredient..."
                    onChange={event => {setRecipesSearchOptions({searchText: event.nativeEvent.text})}}
                    defaultValue = {recipesSearchOptions?.searchText || ""}
                />
            </FormFieldContainer>
        </ComponentView>
    )
}