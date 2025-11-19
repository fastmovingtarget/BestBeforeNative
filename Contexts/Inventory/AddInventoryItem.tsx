//2025-11-19 : Renamed Ingredients to Inventory

//2025-11-10 : Added improved documentation

//2025-10-24 : Adding catch for fetch errors

//2025-10-20 : Moved server properties into individual files, now return enum states

//2025-05-28 : Allows for a null date to be sent (from the purchase button in Shopping List tab)

import React from "react";
import Inventory_Item from "../../Types/Inventory_Item";
import { UpdateState } from "@/Types/DataLoadingState";

/**
 * Adds a new inventory item to the database and updates the local state.
 * If the addition is successful, the inventory item list state is updated to include the new inventory item.
 * The Inventory_Item_Date field is formatted to 'YYYY-MM-DD' if provided; otherwise, it is set to null.
 * @param {number} userID - The ID of the user adding the inventory item.
 * @param {InventoryItem[]} inventory - The current list of inventory items.
 * @param {React.Dispatch<React.SetStateAction<InventoryItem[]>>} setInventory - State setter function for updating the inventory list.
 * @param {InventoryItem} inventoryItem - The inventory item to be added.
 * @returns {Promise<UpdateState>} - A promise that resolves to the update state indicating success or failure.
 */
export const addInventoryItemData = async (
    userID : number,
    inventory : Inventory_Item[],
    setInventory : React.Dispatch<React.SetStateAction<Inventory_Item[]>>, 
    inventoryItem : Inventory_Item,
) : Promise<UpdateState> => {

    const serverProps = {
        DatabaseServer: process.env.REACT_APP_DATABASE_SERVER || "192.168.50.183",
        DatabasePort: process.env.REACT_APP_DATABASE_PORT || "5091",
    }

    const updateBody = JSON.stringify({ 
        ...inventoryItem,
        Inventory_Item_Date: inventoryItem.Inventory_Item_Date ? new Date(inventoryItem.Inventory_Item_Date).toISOString().slice(0, 10) : undefined, // Format date to YYYY-MM-DD, keep it undefined if not provided
        User_ID: userID,
    } as Inventory_Item);

    let returnPromise = new Promise<UpdateState>((resolve) => {
        fetch(
            `http://${serverProps.DatabaseServer}:${serverProps.DatabasePort}/inventory/`, 
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body : updateBody
            }
        ).then((rawData) => {
            if(!rawData.ok) {
                resolve(UpdateState.FailedAdd);
            }
            else{
                rawData.json().then((data) => {//the data returned should be the inventory item that was added including the id
                    setInventory([//we can't add the inventory item to the list until we get the id back from the server
                        ...inventory,
                        {
                            ...data,
                            Inventory_Item_Date: new Date(data.Inventory_Item_Date),//date comes in as a string and doesn't get properly parsed within .json()
                        }]);
                })
                resolve(UpdateState.Successful);
            }
        }).catch(() => {
            resolve(UpdateState.Failed);
        });
    })
    return returnPromise;
}