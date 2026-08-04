//2026-08-04 : Updating api calls to use correct env variable
//2026-07-10 : Changes to pick up env server props

//2026-06-19 : Logs for API calls

//2026-06-01 : updating local IP Address

//2025-11-19 : Item_(...) now have Shopping_ Prefix

//2025-11-10 : Added improved documentation

//2025-10-24 : adding catch, fixing names

//2025-10-23 : Standardised state to change after response to fetch, server info now accessed internally

//2025-05-28 : Asynchronous fetch implementation

//2025-05-22 : Adding asynchronous update implementation

import React from "react";
import Shopping_List_Item from "../../Types/Shopping_List_Item";
import { UpdateState } from "@/Types/DataLoadingState";
import log from "@/utils/log";

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

    log(`Adding shopping list item: ${shoppingListItem.Shopping_Item_Name} for user ID: ${userID}`, "debug");

    const updateBody = JSON.stringify({ 
        ...shoppingListItem,
        Plan_Date: shoppingListItem.Plan_Date ? new Date(shoppingListItem.Plan_Date).toISOString().slice(0, 10) : undefined, // Format date to YYYY-MM-DD, keep it undefined if not provided
        User_ID: userID,
    } as Shopping_List_Item);

    let returnPromise = new Promise<UpdateState>((resolve) => {
        fetch(
            `${process.env.EXPO_PUBLIC_API_URL}/shoppinglist/`, 
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body : updateBody
            }
        ).then((rawData) => {
            if(!rawData.ok) {
                log(`Error ${rawData.status} adding shopping list item: ${rawData.statusText}`, "error");
                log(`Failed to add shopping list item: ${JSON.stringify(shoppingListItem)} for user ID: ${userID}`, "debug");
                resolve(UpdateState.Failed);
            }
            else{
                log(`Successfully added shopping list item: ${JSON.stringify(shoppingListItem)} for user ID: ${userID}`, "debug");
                rawData.json().then((data) => {//the data returned should be the shopping item that was added including the id
                    setShoppingList([
                        ...shoppingList,
                        {
                            ...shoppingListItem,
                            Shopping_Item_ID: data.Shopping_Item_ID, // Set the ID from the response
                        }
                    ]);
                    log(`Successfully added shopping list item: ${shoppingListItem.Shopping_Item_Name} for user ID: ${userID}`, "debug");
                    resolve(UpdateState.Successful);
                })
            }
        }).catch((error) => {
            log(`Error adding shopping list item: ${shoppingListItem.Shopping_Item_Name} for user ID: ${userID}: ${error}`, "error");
            resolve(UpdateState.Failed);
        });
    })
    return returnPromise;
}