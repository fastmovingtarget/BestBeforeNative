//2026-06-01 : Using FadeComponent for animations

//2025-11-21 : Moving common UI elements into their own folder

//2025-11-19 : Renamed "Ingredient(s)" to "Inventory(_Items)"

//2025-10-20 : Removed extra imports, changed to use ingredients context

import { useInventory } from "@/Contexts/Inventory/InventoryDataProvider";
import { FadeComponent, FormTextInput} from "@/ui/BestBeforeUI";

export default function IngredientSearch() {

    const {setInventorySearchOptions, inventorySearchOptions} = useInventory();
    return (
        <FadeComponent>
            <FormTextInput 
                aria-label="search-input"
                placeholder="Search for an ingredient..."
                onChange={event => {setInventorySearchOptions({searchText: event.nativeEvent.text})}}
                defaultValue = {inventorySearchOptions?.searchText || ""}
            />
        </FadeComponent>
    )
}