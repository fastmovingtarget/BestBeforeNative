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

export default function InventoryPage() {
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [mountState, setMountState] = useState(MountState.Mount);

    return (
        <PageView>
            <InventorySearch setIsFormVisible={setIsFormVisible} />
            {
                isFormVisible &&
                <InventoryItemForm onCancel={() =>{ setMountState(MountState.Mount); setIsFormVisible(false); }} isFormVisible={isFormVisible} />
            }
            <InventoryList onEdit={() => setIsFormVisible(false)} />
        </PageView>
    );
}