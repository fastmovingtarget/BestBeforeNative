//2025-05-22 : Adding asynchronous update implementation

import React from "react";
import Shopping_List_Item from "../../Types/Shopping_List_Item";

export const deleteShoppingListItemData = async (
    serverProps : {DatabaseServer:string, DatabasePort:string},
    shoppingList : Shopping_List_Item[],
    setRecipes : React.Dispatch<React.SetStateAction<Shopping_List_Item[]>>, 
    shoppingListItem_ID : number,
) => {

    setRecipes(shoppingList.filter((item) => item.Item_ID !== shoppingListItem_ID));//remove the deleted recipe from the list
    
    let returnPromise = new Promise<"successful" | "failed">((resolve) => {
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
                resolve("failed");
            }
            else {
                resolve("successful");
            }
        });
    })
    return returnPromise;
}