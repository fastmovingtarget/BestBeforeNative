import React from "react";
import Shopping_List_Item from "../../Types/Shopping_List_Item";

export const deleteShoppingListItemData = async (
    serverProps : {DatabaseServer:string, DatabasePort:string},
    shoppingList : Shopping_List_Item[],
    setRecipes : React.Dispatch<React.SetStateAction<Shopping_List_Item[]>>, 
    shoppingListItem_ID : number,
) => {

    await fetch(
        `http://${serverProps.DatabaseServer}:${serverProps.DatabasePort}/shoppingList/${shoppingListItem_ID}`, 
        {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            }
        }
    ).then((rawData) => {
        if(!rawData.ok) {
            return;
        }
        setRecipes(shoppingList.filter((item) => item.Item_ID !== shoppingListItem_ID));//remove the deleted recipe from the list
    });
}