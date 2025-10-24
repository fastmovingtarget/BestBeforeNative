//2025-10-20 : Removed extra imports, changed to use ingredients context

import ComponentView from "@/components/CustomComponents/ComponentView";
import FormTextInput from "@/components/CustomComponents/FormTextInput";
import { useIngredients } from "@/Contexts/Ingredients/IngredientsDataProvider";

export default function IngredientSearch() {

    const {setIngredientsSearchOptions, ingredientsSearchOptions} = useIngredients();

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