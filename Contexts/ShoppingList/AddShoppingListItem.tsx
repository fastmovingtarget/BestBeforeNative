//2025-11-19 : Item_(...) now have Shopping_ Prefix

//2025-11-10 : Added improved documentation

//2025-10-24 : adding catch, fixing names

//2025-10-23 : Standardised state to change after response to fetch, server info now accessed internally

//2025-05-28 : Asynchronous fetch implementation

//2025-05-22 : Adding asynchronous update implementation

import React from "react";
import Shopping_List_Item from "../../Types/Shopping_List_Item";
import { UpdateState } from "@/Types/DataLoadingState";

/**
 * Adds a new item to the shopping list in the database and updates the local state.
 * If the addition is successful, the shopping list state is updated to include the new item.
 * @param {number} userID - The ID of the user adding the shopping list item.
 * @param {Shopping_List_Item[]} shoppingList - The current list of shopping list items.
 * @param {React.Dispatch<React.SetStateAction<Shopping_List_Item[]>>} setShoppingList - State setter function for updating the shopping list.
 * @param {Shopping_List_Item} shoppingListItem - The shopping list item to be added.
 * @returns {Promise<UpdateState>} - A promise that resolves to the update state indicating success or failure.
 */

export const addShoppingListItemData = (
    userID : number,
    shoppingList : Shopping_List_Item[],
    setShoppingList : React.Dispatch<React.SetStateAction<Shopping_List_Item[]>>, 
    shoppingListItem : Shopping_List_Item,
) => {
    
    const serverProps = {
        DatabaseServer: process.env.REACT_APP_DATABASE_SERVER || "192.168.50.183",
        DatabasePort: process.env.REACT_APP_DATABASE_PORT || "5091",
    }

    let returnPromise = new Promise<UpdateState>((resolve) => {
        fetch(
            `http://${serverProps.DatabaseServer}:${serverProps.DatabasePort}/shoppinglist/`, 
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body : JSON.stringify({
                    ...shoppingListItem,
                    User_ID: userID,
                })
            }
        ).then((rawData) => {
            if(!rawData.ok) {
                resolve(UpdateState.Failed);
            }
            else{
                rawData.json().then((data) => {//the data returned should be the shopping item that was added including the id
                    setShoppingList([
                        ...shoppingList,
                        {
                            ...shoppingListItem,
                            Shopping_Item_ID: data.Shopping_Item_ID, // Set the ID from the response
                        }
                    ]);
                    resolve(UpdateState.Successful);
                })
            }
        }).catch(() => {
            resolve(UpdateState.Failed);
        });
    })
    return returnPromise;
}