//2026-08-11 : added handling for refresh
//2026-07-16 : Added function description

//2026-06-01 : Replaced ListView with ScrollableContainer

//2025-11-21 : Moving common UI elements into their own folder

//2025-11-19 : Renamed "Ingredient(s)" to "Inventory(_Items)"

//2025-10-20 : Changed to use Ingredients Context

import Inventory_Item from "@/Types/Inventory_Item";
import { useInventory } from "@/Contexts/Inventory/InventoryDataProvider";
import { useState } from "react";
import InventoryItemComponent from "./InventoryItemComponent/InventoryItemComponent";
import InventoryItemForm from "../InventoryItemForm/InventoryItemForm";
import { ScrollableContainer} from "@/ui/BestBeforeUI";
import { SyncState } from "@/Types/DataLoadingState";
import log from "@/utils/log";

/**
 * InventoryList component
 * @param onEdit - Callback function to call when an inventory item is being edited - lets the inventory page know to hide the add inventory item form so that only one form is present at a time
 * @returns A list of inventory items, with the ability to edit or delete each item
 */
export default function InventoryList({onEdit}: {onEdit: () => void}) {
    const [editId, setEditId] = useState<number | undefined>(undefined);
    const {inventory, setInventoryDataState} = useInventory();

    const onRefresh = () => {
        setInventoryDataState(SyncState.Loading);
    }
    
    return (
        <ScrollableContainer onRefresh={onRefresh}>
            {inventory.map((inventoryItem: Inventory_Item) => (
                editId !== inventoryItem.Inventory_Item_ID ?
                    <InventoryItemComponent key={`inventory-item-${inventoryItem.Inventory_Item_ID}`} inventoryItem={inventoryItem} onEdit={(id) => {
                        setEditId(id);
                        onEdit();
                    }}/> :
                    <InventoryItemForm key={`inventory-item-form-${inventoryItem.Inventory_Item_ID}`} inventoryItem={inventoryItem} onCancel={() => {setEditId(undefined)}} isFormVisible={true}/>
            ))}
        </ScrollableContainer>
    );
}