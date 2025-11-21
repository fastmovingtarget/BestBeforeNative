//2025-11-21 : Moving common UI elements into their own folder

//2025-11-19 : Renamed "Ingredient(s)" to "Inventory(_Items)"

//2025-10-20 : Removed extra imports, changed to use ingredients context

import ComponentView from "@/ui/ComponentView";
import FormTextInput from "@/ui/FormTextInput";
import { useInventory } from "@/Contexts/Inventory/InventoryDataProvider";

export default function IngredientSearch() {

    const {setInventorySearchOptions, inventorySearchOptions} = useInventory();
    return (
        <ComponentView>
            <FormTextInput 
                aria-label="search-input"
                placeholder="Search for an ingredient..."
                onChange={event => {setInventorySearchOptions({searchText: event.nativeEvent.text})}}
                defaultValue = {inventorySearchOptions?.searchText || ""}
            />
        </ComponentView>
    )
}