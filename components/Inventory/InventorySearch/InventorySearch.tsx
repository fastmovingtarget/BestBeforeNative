//2026-07-16 : Added function description

//2026-07-01 : Unifying Add and Search

//2026-06-01 : Using FadeComponent for animations

//2025-11-21 : Moving common UI elements into their own folder

//2025-11-19 : Renamed "Ingredient(s)" to "Inventory(_Items)"

//2025-10-20 : Removed extra imports, changed to use ingredients context

import { useInventory } from "@/Contexts/Inventory/InventoryDataProvider";
import { ButtonView, FadeComponent, FormTextInput, RowContainer} from "@/ui/BestBeforeUI";
import { AddInventoryIcon } from "@/ui/ReactIcon";

/**
 * InventorySearch component
 * @param setIsFormVisible - Callback function to call when the add button is pressed, to show the add inventory item form
 * @returns A search bar for searching inventory items, with an add button to show the add inventory item form
 */

export default function InventorySearch({ setIsFormVisible }: { setIsFormVisible: (isFormVisible: boolean) => void }) {

    const {setInventorySearchOptions, inventorySearchOptions} = useInventory();
    return (
        <FadeComponent>
            <RowContainer style={{justifyContent:"space-between", alignItems:"center", width:"100%"}}>
                <FormTextInput 
                    aria-label="search-input"
                    placeholder="Search for an inventory item..."
                    onChange={event => {setInventorySearchOptions({searchText: event.nativeEvent.text})}}
                    defaultValue = {inventorySearchOptions?.searchText || ""}
                    style={{flex:1, margin:5, width:"85%", height:57}}
                />
                <ButtonView accessibilityRole="button" style={{margin : 5}} onPress={() => setIsFormVisible(true)} >
                    <AddInventoryIcon />
                </ButtonView>
            </RowContainer>
        </FadeComponent>
    )
}