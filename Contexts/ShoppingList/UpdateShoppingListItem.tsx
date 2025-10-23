//2025-10-23 : Standardised state to change after response to fetch, server info now accessed internally

//2025-05-22 : Adding asynchronous update implementation

import React from "react";
import Shopping_List_Item from "../../Types/Shopping_List_Item";
import { UpdateState } from "@/Types/DataLoadingState";

export const updateShoppingListItemData = async (
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
                resolve(UpdateState.Failed);
            }
            else{
                setIngredients(shoppingList.map(element => {
                    if (element.Item_ID !== shoppingListItem.Item_ID)//if the element's ID isn't the input ingredient's then no change
                        return element;
                    else //otherwise return the ingredient that was input
                        return shoppingListItem;
                }));
                resolve(UpdateState.Successful);
            }
        });
    })
    return returnPromise;
}