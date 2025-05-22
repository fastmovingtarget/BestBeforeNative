//2025-05-22 : Adding asynchronous update implementation

import React from "react";
import Shopping_List_Item from "../../Types/Shopping_List_Item";

export const updateShoppingListItemData = async (
    serverProps : {DatabaseServer:string, DatabasePort:string},
    shoppingList : Shopping_List_Item[],
    setIngredients : React.Dispatch<React.SetStateAction<Shopping_List_Item[]>>, 
    shoppingListItem : Shopping_List_Item,
) => {

    setIngredients(shoppingList.map(element => {
        if (element.Item_ID !== shoppingListItem.Item_ID)//if the element's ID isn't the input ingredient's then no change
            return element;
        else //otherwise return the ingredient that was input
            return shoppingListItem;
    }));

    let returnPromise = new Promise<"successful" | "failed">((resolve) => {
        fetch(
            `http://${serverProps.DatabaseServer}:${serverProps.DatabasePort}/ingredients/${shoppingListItem.Item_ID}`, 
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body : JSON.stringify({
                    shoppingListItem: shoppingListItem,
                })
            }
        ).then((rawData) => {
            if(!rawData.ok) {
                resolve("failed");
            }
            else
                resolve("successful");
        });
    })
    return returnPromise;
}