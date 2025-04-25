import React from "react";
import Shopping_List_Item from "../../Types/Shopping_List_Item";

export const addShoppingListItemData = async (
    serverProps : {DatabaseServer:string, DatabasePort:string},
    shoppingList : Shopping_List_Item[],
    setIngredients : React.Dispatch<React.SetStateAction<Shopping_List_Item[]>>, 
    shoppingListItem : Shopping_List_Item,
) => {

    await fetch(
        `http://${serverProps.DatabaseServer}:${serverProps.DatabasePort}/shoppinglist/`, 
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body : JSON.stringify({
                ingredient: shoppingListItem,
            })
        }
    ).then((rawData) => {
        if(!rawData.ok) {
            return;
        }
        rawData.json().then((data) => {//the data returned should be the ingredient that was added including the id
            setIngredients([
                ...shoppingList,
                data
            ]);
        })
    });
}