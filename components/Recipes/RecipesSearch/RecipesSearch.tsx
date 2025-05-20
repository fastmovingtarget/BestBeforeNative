import React from "react";
import ComponentView from "@/components/CustomComponents/ComponentView";
import FormTextInput from "@/components/CustomComponents/FormTextInput";
import {useData} from "@/Contexts/DataProvider";

export default function RecipesSearch() {

    const {setRecipesSearchOptions, recipesSearchOptions} = useData()

    return (
        <ComponentView style={{flexDirection:"row"}}>
            <FormTextInput 
                aria-label="search-input"
                placeholder="Search for a recipe name or recipe ingredient..."
                onChange={event => {setRecipesSearchOptions({searchText: event.nativeEvent.text})}}
                defaultValue = {recipesSearchOptions?.searchText || ""}
                style={{flexGrow:1}}
            />
        </ComponentView>
    )
}