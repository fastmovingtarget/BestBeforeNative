//2025-11-19 : Renamed Ingredients to Inventory

//2025-11-10 : Added improved documentation

//2025-10-24 : Adding catch for fetch errors

//2025-10-23 : Standardised to update state on response to fetch

//2025-10-22 : Corrected fail state resolution

//2025-10-20 : Moved server properties into individual files, now return enum states

import React from "react";
import Inventory_Item from "../../Types/Inventory_Item";
import { UpdateState } from "@/Types/DataLoadingState";

/**
 * Deletes an inventory item from the database and updates the local state.
 * If the deletion is successful, the inventory item list state is updated to remove the deleted item.
 * @param {Inventory_Item[]} inventoryItems - The current list of inventory items.
 * @param {React.Dispatch<React.SetStateAction<Inventory_Item[]>>} setInventoryItems - State setter function for updating the inventory item list.
 * @param {number} inventoryItemID - The ID of the inventory item to be deleted.
 * @returns {Promise<UpdateState>} - A promise that resolves to the update state indicating success or failure.
 */
export const deleteInventoryItemData = async (
    inventoryItems : Inventory_Item[],
    setInventoryItems : React.Dispatch<React.SetStateAction<Inventory_Item[]>>, 
    inventoryItemID : number,
) => {
    const serverProps = {
        DatabaseServer: process.env.REACT_APP_DATABASE_SERVER || "192.168.50.183",
        DatabasePort: process.env.REACT_APP_DATABASE_PORT || "5091",
    }


    let returnPromise = new Promise<UpdateState>((resolve) => {
        fetch(
            `http://${serverProps.DatabaseServer}:${serverProps.DatabasePort}/inventory/${inventoryItemID}`, 
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                }
            }
        ).then((rawData) => {
            if(rawData.ok) {
                setInventoryItems(inventoryItems.filter((item) => item.Inventory_Item_ID !== inventoryItemID));//remove the deleted item from the list
                resolve(UpdateState.Successful);
            }
            else
                resolve(UpdateState.Failed);
        }).catch(() => {
                    resolve(UpdateState.Failed);
        });
    })
    return returnPromise;
}