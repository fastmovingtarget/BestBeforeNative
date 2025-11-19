//2025-11-19 : Renamed "Ingredient(s)" to "Inventory(_Items)"

//2025-10-20 : Changed to use Ingredients Context

import Inventory_Item from "@/Types/Inventory_Item";
import { useInventory } from "@/Contexts/Inventory/InventoryDataProvider";
import { useState } from "react";
import InventoryItemComponent from "./InventoryItemComponent/InventoryItemComponent";
import InventoryItemForm from "../InventoryItemForm/InventoryItemForm";
import ListView from "@/components/CustomComponents/ListView";

export default function IngredientsList({onEdit}: {onEdit: () => void}) {
    const [editId, setEditId] = useState<number | undefined>(undefined);
    const {inventory} = useInventory();
    
    return (
        <ListView >
            {inventory.map((inventoryItem: Inventory_Item) => (
                editId !== inventoryItem.Inventory_Item_ID ?
                    <InventoryItemComponent key={`inventory-item-${inventoryItem.Inventory_Item_ID}`} inventoryItem={inventoryItem} onEdit={(id) => {
                        setEditId(id);
                        onEdit();
                    }}/> :
                    <InventoryItemForm key={`inventory-item-form-${inventoryItem.Inventory_Item_ID}`} inventoryItem={inventoryItem} onCancel={() => {setEditId(undefined)}} isFormVisible={true}/>
            ))}
        </ListView>
    );
}