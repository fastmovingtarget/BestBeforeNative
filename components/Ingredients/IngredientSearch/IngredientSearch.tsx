import {Text, TextInput, View, StyleSheet} from "react-native";
import React, {useState} from "react";
import ComponentView from "@/components/ComponentView";
import LabelText from "@/components/LabelText";
import FormTextInput from "@/components/FormTextInput";
import FormFieldContainer from "@/components/FormFieldContainer";
import {useData} from "@/Contexts/DataProvider";
import Ingredient from "@/Types/Ingredient";

export default function IngredientSearch() {

    const {setIngredientsSearchOptions, ingredientsSearchOptions} = useData()

    return (
        <ComponentView>
            <FormFieldContainer style={{flexDirection: "row", justifyContent: "space-between"}}>
                <LabelText>Search: </LabelText>
                <FormTextInput 
                    aria-label="search-input"
                    placeholder="Search for an ingredient..."
                    onSubmitEditing={event => {setIngredientsSearchOptions({searchText: event.nativeEvent.text})}}
                    defaultValue = {ingredientsSearchOptions?.searchText || ""}
                />
            </FormFieldContainer>
        </ComponentView>
    )
}
const styles = StyleSheet.create({
    textInputField:{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#111111",
        color: "#e3dccf",
        borderRadius: 5,
        textAlignVertical: "center",
        width: "70%",
        lineHeight: 20,
        fontSize: 16
    }
});