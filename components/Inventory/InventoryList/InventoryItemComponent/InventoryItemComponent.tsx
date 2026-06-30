//2026-06-30 : Icons for Edit and Delete

//2026-06-01 : use FadeComponent wrapper, improve containers

//2025-11-21 : Moving common UI elements into their own folder

//2025-11-19 : Renamed "Ingredient(s)" to "Inventory(_Items)"

//2025-10-20 : Changed to use Ingredients Context
import { useState } from "react";
import Inventory_Item from "@/Types/Inventory_Item";
import { useInventory } from "@/Contexts/Inventory/InventoryDataProvider";
import {RowContainer, FadeComponent, ButtonView, LabelText} from "@/ui/BestBeforeUI";
import { MountState } from "@/ui/Types/MountState"; 
import { DeleteIcon, EditInventoryItemIcon } from "@/ui/ReactIcon";

export default function InventoryItemComponent({ inventoryItem, onEdit } : { inventoryItem: Inventory_Item, onEdit: (ingredientID: number) => void }) {
    const { deleteInventoryItem } = useInventory();
    const [mountState, setMountState] = useState<MountState>(MountState.Mount);
    const [unmountAction, setUnmountAction] = useState<"edit" | "delete" | null>(null);

    let onUnmountAnimationEnd: () => void = () => {
        if(unmountAction === "edit") {
            onEdit(inventoryItem.Inventory_Item_ID || -1);
        }
        else if(unmountAction === "delete") {
            deleteInventoryItem(inventoryItem.Inventory_Item_ID || -1);
        }
    };

    return (
        <FadeComponent style={{marginHorizontal : 0, padding : 10, width: "100%"}} mountState={mountState} onUnmountAnimationEnd={() => onUnmountAnimationEnd()}>
            <LabelText>{inventoryItem.Inventory_Item_Name}</LabelText>
            
            <RowContainer style={{justifyContent: "space-between", width: "100%"}}>
                {inventoryItem.Inventory_Item_Frozen ? 
                    <LabelText>{`Frozen on ${inventoryItem.Inventory_Item_Frozen?.toLocaleDateString("en-UK", { year: "numeric", month: "2-digit", day: "2-digit" })}`}</LabelText> :
                    <LabelText>{`Eat By ${inventoryItem.Inventory_Item_Date?.toLocaleDateString("en-UK", { year: "numeric", month: "2-digit", day: "2-digit" }) || "??/??/????"}`}</LabelText>
                }
                <LabelText>{inventoryItem.Inventory_Item_Quantity ? inventoryItem.Inventory_Item_Quantity + "g" : "??g"}</LabelText>
            </RowContainer>

            {inventoryItem.Plan_ID && inventoryItem.Plan_Recipe_Name && inventoryItem.Plan_Date && (
                <LabelText>{`Reserved for ${inventoryItem.Plan_Recipe_Name} on ${new Date(inventoryItem.Plan_Date)?.toLocaleDateString("en-UK", { year: "numeric", month: "2-digit", day: "2-digit" })}`}</LabelText>
            )}
            
            <RowContainer style={{justifyContent: "space-around", width: "100%"}}>
                <ButtonView onPress={() => {
                    setUnmountAction("edit");
                    setMountState(MountState.Unmount);
                }}>
                    <EditInventoryItemIcon />
                </ButtonView>
                <ButtonView onPress={() => {
                    setUnmountAction("delete");
                    setMountState(MountState.Unmount);
                }}>
                    <DeleteIcon />
                </ButtonView>
            </RowContainer>
        </FadeComponent>
    )
}