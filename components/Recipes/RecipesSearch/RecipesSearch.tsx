//2026-07-16 : Added function descriptions
//2026-07-01 : Allowing space for Add button in same row

//2026-06-01 : Import and text tweaks

//2025-11-21 : Moving common UI elements into their own folder

//2025-10-20 : Using Recipes context rather than Data context

import React from "react";
import { FormTextInput} from "@/ui/BestBeforeUI";
import {useRecipes} from "@/Contexts/Recipes/RecipesDataProvider";

/**
 * RecipesSearch component
 * The search input updates the search options in the Recipes context, allowing for dynamic filtering of the recipe list
 * @returns A component that provides a search input for filtering recipes by name or ingredient
 */
export default function RecipesSearch() {

    const {setRecipesSearchOptions, recipesSearchOptions} = useRecipes()

    return (
        <FormTextInput 
            aria-label="search-input"
            placeholder="Search for a recipe name or ingredient..."
            onChange={event => {setRecipesSearchOptions({searchText: event.nativeEvent.text})}}
            defaultValue = {recipesSearchOptions?.searchText || ""}
            style={{flex:1, margin:5, width:"85%", height:57}}
        />
    )
}