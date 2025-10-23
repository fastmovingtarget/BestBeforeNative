//2025-10-23 : Standardised state to change after response to fetch, server info now accessed internally

//2025-05-22 : Adding asynchronous update implementation

import React from "react";
import Shopping_List_Item from "../../Types/Shopping_List_Item";
import { UpdateState } from "@/Types/DataLoadingState";

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
                setRecipes(shoppingList.filter((item) => item.Item_ID !== shoppingListItem_ID));//remove the deleted recipe from the list
                resolve(UpdateState.Successful);
            }
        });
    })
    return returnPromise;
}