//2025-10-23 : Standardised state to change after response to fetch, server info now accessed internally

//2025-05-28 : Asynchronous fetch implementation

//2025-05-22 : Adding asynchronous update implementation

import React from "react";
import Shopping_List_Item from "../../Types/Shopping_List_Item";
import { UpdateState } from "@/Types/DataLoadingState";

export const addShoppingListItemData = (
    userID : number,
    shoppingList : Shopping_List_Item[],
    setIngredients : React.Dispatch<React.SetStateAction<Shopping_List_Item[]>>, 
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
                rawData.json().then((data) => {//the data returned should be the ingredient that was added including the id
                    setIngredients([
                        ...shoppingList,
                        {
                            ...shoppingListItem,
                            Item_ID: data.Item_ID, // Set the ID from the response
                        }
                    ]);
                    resolve(UpdateState.Successful);
                })
            }
        });
    })
    return returnPromise;
}