//2026-08-04 : Updating api calls to use correct env variable
//2026-07-10 : Changes to pick up env server props

//2026-06-19 : Logs for API calls

//2026-06-01 : updating local IP Address

//2025-11-19 : Renamed Ingredients to Inventory

//2025-11-10 : Added improved documentation

//2025-10-24 : Adding catch for fetch errors

//2025-10-23 : Standardised to update state on response to fetch

//2025-10-22 : Corrected fail state resolution

//2025-10-20 : Moved server properties into individual files, now return enum states

import React from "react";
import Inventory_Item from "../../Types/Inventory_Item";
import { UpdateState } from "@/Types/DataLoadingState";
import log from "@/utils/log";

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

    log(`Deleting inventory item with ID: ${inventoryItemID}`, "debug");

    let returnPromise = new Promise<UpdateState>((resolve) => {
        fetch(
            `${process.env.EXPO_PUBLIC_API_URL}/inventory/${inventoryItemID}`, 
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                }
            }
        ).then((rawData) => {
            if(rawData.ok) {
                setInventoryItems(inventoryItems.filter((item) => item.Inventory_Item_ID !== inventoryItemID));//remove the deleted item from the list
                log(`Successfully deleted inventory item with ID: ${inventoryItemID}`, "debug");
                resolve(UpdateState.Successful);
            }
            else {
                log(`Error deleting inventory item with ID: ${inventoryItemID}`, "error");
                resolve(UpdateState.Failed);
            }
        }).catch((error) => {
            log(`Error deleting inventory item with ID: ${inventoryItemID}: ${error}`, "error");
            resolve(UpdateState.Failed);
        });
    })
    return returnPromise;
}