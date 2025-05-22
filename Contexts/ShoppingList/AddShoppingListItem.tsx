//2025-05-22 : Adding asynchronous update implementation

import React from "react";
import Shopping_List_Item from "../../Types/Shopping_List_Item";

export const addShoppingListItemData = (
    serverProps : {DatabaseServer:string, DatabasePort:string},
    userID : number,
    shoppingList : Shopping_List_Item[],
    setIngredients : React.Dispatch<React.SetStateAction<Shopping_List_Item[]>>, 
    shoppingListItem : Shopping_List_Item,
) => {

    let returnPromise = new Promise<"successful" | "failed">((resolve) => {
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
                resolve("failed");
            }
            else{
                resolve("successful");
                rawData.json().then((data) => {//the data returned should be the ingredient that was added including the id
                    setIngredients([
                        ...shoppingList,
                        data
                    ]);
                })
            }
        });
    })
    return returnPromise;
}