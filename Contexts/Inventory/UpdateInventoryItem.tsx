//2025-11-19 : Renamed Ingredients to Inventory

//2025-11-10 : Added improved documentation

//2025-11-10 : Update now handles null date correctly

//2025-10-24 : Adding catch for fetch errors

//2025-10-23 : Standardised to update state on response to fetch

//2025-10-22 : Corrected fail state resolution

//2025-10-20 : Moved server properties into individual files, now return enum states

import React from "react";
import { UpdateState } from "@/Types/DataLoadingState";
import Inventory_Item from "../../Types/Inventory_Item";

/**
 * Updates an existing inventory item in the database and updates the local state.
 * If the update is successful, the inventory list state is updated to reflect the changes.
 * The Inventory_Item_Date field is formatted to 'YYYY-MM-DD' if provided; otherwise, it is set to null.
 * @param {Inventory_Item[]} inventory - The current list of inventory items.
 * @param {React.Dispatch<React.SetStateAction<Inventory_Item[]>>} setInventory - State setter function for updating the inventory list.
 * @param {Inventory_Item} inventoryItem - The inventory item to be updated.
 * @returns {Promise<UpdateState>} - A promise that resolves to the update state indicating success or failure.
 */

export const updateInventoryItemData = async (
    inventory : Inventory_Item[],
    setInventory : React.Dispatch<React.SetStateAction<Inventory_Item[]>>, 
    inventoryItem : Inventory_Item,
) => {

    const serverProps = {
        DatabaseServer: process.env.REACT_APP_DATABASE_SERVER || "192.168.50.183",
        DatabasePort: process.env.REACT_APP_DATABASE_PORT || "5091",
    }

    const updateBody = JSON.stringify({ 
        ...inventoryItem,
        Inventory_Item_Date: inventoryItem.Inventory_Item_Date ? new Date(inventoryItem.Inventory_Item_Date).toISOString().slice(0, 10) : null, // Format date to YYYY-MM-DD
    } as Inventory_Item);

    let returnPromise = new Promise<UpdateState>((resolve) => {

        fetch(
            `http://${serverProps.DatabaseServer}:${serverProps.DatabasePort}/inventory/${inventoryItem.Inventory_Item_ID}`, 
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body : updateBody
            }
        ).then((rawData) => {
            if(!rawData.ok) {//this should encompass all errors
                resolve(UpdateState.Failed);
            }
            else {
                resolve(UpdateState.Successful);//nothing useful passed back from the server, so we can just return successful
                setInventory(inventory.map(element => {
                    if (element.Inventory_Item_ID !== inventoryItem.Inventory_Item_ID)//if the element's ID isn't the input inventory item's then no change
                        return element;
                    else //otherwise return the inventory item that was input
                        return inventoryItem;
                }));
            }
        }).catch(() => {
            resolve(UpdateState.Failed);
        });
    })
    return returnPromise;
}