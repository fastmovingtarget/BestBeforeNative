//2026-08-11 : Added LoadingBar
//2026-07-16 : Added function description

//2026-07-01 : Moving Add button to Search bar

//2026-06-30 : Icon for Add Inventory Item

//2026-06-10 : Style format no longer used

//2026-06-01 : FadeComponent with removal

//2025-11-21 : Moving common UI elements into their own folder

//2025-11-19 : Renamed "Ingredient(s)" to "Inventory(_Items)"

//2025-10-28 : Removing extraneous import

import React, { useState } from "react";
import InventorySearch from "./InventorySearch/InventorySearch";
import InventoryList from "./InventoryList/InventoryList";
import InventoryItemForm from "./InventoryItemForm/InventoryItemForm";
import { PageView } from "@/ui/BestBeforeUI";
import { MountState } from "@/ui/Types/MountState";
import LoadingBar from "@/ui/LoadingBar";
import { useInventory } from "@/Contexts/Inventory/InventoryDataProvider";
import { UpdateState, SyncState } from "@/Types/DataLoadingState";

/**
 * InventoryPage component
 * @returns The main inventory page, which includes a search bar, a list of inventory items, and a form for adding or editing inventory items
 */
export default function InventoryPage() {
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [mountState, setMountState] = useState(MountState.Mount);

    const {inventoryDataState} = useInventory();

    return (
        <PageView>
            <LoadingBar isLoading={inventoryDataState === UpdateState.Loading || inventoryDataState === SyncState.Loading}/>
            <InventorySearch setIsFormVisible={setIsFormVisible} />
            {
                isFormVisible && /* If the form is visible, render the InventoryItemForm component */
                <InventoryItemForm onCancel={() =>{ setMountState(MountState.Mount); setIsFormVisible(false); }} isFormVisible={isFormVisible} />
            }
            <InventoryList onEdit={() => setIsFormVisible(false)} />
        </PageView>
    );
}