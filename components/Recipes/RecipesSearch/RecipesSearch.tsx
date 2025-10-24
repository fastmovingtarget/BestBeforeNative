//2025-10-20 : Using Recipes context rather than Data context

import React from "react";
import ComponentView from "@/components/CustomComponents/ComponentView";
import FormTextInput from "@/components/CustomComponents/FormTextInput";
import {useRecipes} from "@/Contexts/Recipes/RecipesDataProvider";

export default function RecipesSearch() {

    const {setRecipesSearchOptions, recipesSearchOptions} = useRecipes()

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