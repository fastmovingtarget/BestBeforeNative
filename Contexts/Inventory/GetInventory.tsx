//2025-11-19 : Renamed Ingredients to Inventory

//2025-11-10 : Added improved documentation

//2025-10-24 : Adding catch for fetch errors

//2025-10-20 : Moved server properties into individual files, now return enum states

//2025-05-28 : When null Ingredient Date comes in, retains null value

import React from "react";
import Inventory_Item, {InventorySearchOptions} from "../../Types/Inventory_Item";
import { SyncState } from "@/Types/DataLoadingState";
/**
 * Fetches inventory from the database based on user ID and optional search criteria,
 * then updates the local state with the retrieved inventory.
 * @param {number} userID - The ID of the user whose inventory is to be fetched.
 * @param {React.Dispatch<React.SetStateAction<Inventory_Item[]>>} setInventory - State setter function for updating the inventory list.
 * @param {InventorySearchOptions} [searchOptions={}] - Optional search criteria for filtering inventory items.
 * @returns {Promise<SyncState>} - A promise that resolves to the sync state indicating success or failure.
 */

export const getInventoryData = async (
    userID : number, 
    setInventory : React.Dispatch<React.SetStateAction<Inventory_Item[]>>, 
    searchOptions : InventorySearchOptions = {},
) => {
    
    const serverProps = {
        DatabaseServer: process.env.REACT_APP_DATABASE_SERVER || "192.168.50.183",
        DatabasePort: process.env.REACT_APP_DATABASE_PORT || "5091",
    }

    const optionsString = Object.entries(searchOptions).map(([key, value]) => {//map the key and uri encoded value pairs to a string joined by &
        if (value === undefined) return ""; // Skip undefined values
        return `${key}=${encodeURIComponent(value)}`;
    }).join("&");

    let returnPromise = new Promise<SyncState>((resolve) => {
        fetch(
            `http://${serverProps.DatabaseServer}:${serverProps.DatabasePort}/inventory/${userID}?${optionsString}`, 
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        ).then((rawData) => {
            if(rawData.status !== 200) {
                resolve(SyncState.Failed);
            }
            else {
                rawData.json().then((data : Inventory_Item[]) => {
                    setInventory(
                        data.map((element: Inventory_Item) => {
                            if(element.Inventory_Item_Date) 
                                return {
                                    ...element,
                                    Inventory_Item_Date: element.Inventory_Item_Date ? new Date(element.Inventory_Item_Date) : undefined,//date comes in as a string and doesn't get properly parsed within .json()
                                };
                            
                            return element
                        }),
                    );
                    resolve(SyncState.Successful);
                })
            }
        }).catch((error) => {
            console.error("Error fetching inventory data", error);
            resolve(SyncState.Failed);
        });
    });
    return returnPromise;
}