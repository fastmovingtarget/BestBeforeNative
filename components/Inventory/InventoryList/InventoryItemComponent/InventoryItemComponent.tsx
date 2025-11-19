//2025-11-19 : Renamed "Ingredient(s)" to "Inventory(_Items)"

//2025-10-20 : Changed to use Ingredients Context

import {  View } from "react-native";
import Inventory_Item from "@/Types/Inventory_Item";
import ComponentView from "@/components/CustomComponents/ComponentView";
import LabelText from "@/components/CustomComponents/LabelText";
import ButtonView from "@/components/CustomComponents/ButtonView";
import { useInventory } from "@/Contexts/Inventory/InventoryDataProvider";

export default function InventoryItemComponent({ inventoryItem, onEdit } : { inventoryItem: Inventory_Item, onEdit: (ingredientID: number) => void }) {
    const { deleteInventoryItem } = useInventory();

    return (
        <ComponentView >
            <LabelText>{inventoryItem.Inventory_Item_Name}</LabelText>
            {inventoryItem.Inventory_Item_Frozen ? 
                <LabelText>{`Frozen on ${inventoryItem.Inventory_Item_Frozen?.toLocaleDateString("en-UK", { year: "numeric", month: "2-digit", day: "2-digit" })}`}</LabelText> :
                <LabelText>{`Eat By ${inventoryItem.Inventory_Item_Date?.toLocaleDateString("en-UK", { year: "numeric", month: "2-digit", day: "2-digit" }) || "??/??/????"}`}</LabelText>
            }
            <LabelText>{inventoryItem.Inventory_Item_Quantity ? inventoryItem.Inventory_Item_Quantity + "g" : "??g"}</LabelText>
            {inventoryItem.Plan_ID && inventoryItem.Plan_Recipe_Name && inventoryItem.Plan_Date && (
                <LabelText>{`Reserved for ${inventoryItem.Plan_Recipe_Name} on ${new Date(inventoryItem.Plan_Date)?.toLocaleDateString("en-UK", { year: "numeric", month: "2-digit", day: "2-digit" })}`}</LabelText>
            )}
            <View style={{flexDirection: "row", justifyContent: "space-around", width: "100%"}}>
                <ButtonView onPress={() => onEdit(inventoryItem.Inventory_Item_ID || -1)}>
                    <LabelText>Edit</LabelText>
                </ButtonView>
                <ButtonView onPress={() => {deleteInventoryItem(inventoryItem.Inventory_Item_ID || -1)}}>
                    <LabelText>Delete</LabelText>
                </ButtonView>
            </View>
        </ComponentView>
    )
}