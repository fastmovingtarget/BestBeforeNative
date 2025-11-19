//2025-11-19 : Item_(...) now have Shopping_ Prefix

//2025-11-10 : Added improved documentation

//2025-10-24 : Adding catch for fetch errors

//2025-10-23 : Standardised state to change after response to fetch, server info now accessed internally

//2025-05-22 : Adding asynchronous update implementation

import React from "react";
import Shopping_List_Item from "../../Types/Shopping_List_Item";
import { UpdateState } from "@/Types/DataLoadingState";

/**
 * Deletes a shopping list item from the database and updates the local state.
 * If the deletion is successful, the shopping list state is updated to remove the deleted item.
 * @param {Shopping_List_Item[]} shoppingList - The current list of shopping list items.
 * @param {React.Dispatch<React.SetStateAction<Shopping_List_Item[]>>} setRecipes - State setter function for updating the shopping list.
 * @param {number} shoppingListItem_ID - The ID of the shopping list item to be deleted.
 * @returns {Promise<UpdateState>} - A promise that resolves to the update state indicating success or failure.
 */

export const deleteShoppingListItemData = async (
    shoppingList : Shopping_List_Item[],
    setRecipes : React.Dispatch<React.SetStateAction<Shopping_List_Item[]>>, 
    shoppingListItem_ID : number,
) => {
    const serverProps = {
        DatabaseServer: process.env.REACT_APP_DATABASE_SERVER || "192.168.50.183",
        DatabasePort: process.env.REACT_APP_DATABASE_PORT || "5091",
    }

    let returnPromise = new Promise<UpdateState>((resolve) => {
        fetch(
            `http://${serverProps.DatabaseServer}:${serverProps.DatabasePort}/shoppingList/${shoppingListItem_ID}`, 
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                }
            }
        ).then((rawData) => {
            if(!rawData.ok) {
                resolve(UpdateState.Failed);
            }
            else {
                setRecipes(shoppingList.filter((item) => item.Shopping_Item_ID !== shoppingListItem_ID));//remove the deleted recipe from the list
                resolve(UpdateState.Successful);
            }
        }).catch(() => {
            resolve(UpdateState.Failed);
        });
    })
    return returnPromise;
}