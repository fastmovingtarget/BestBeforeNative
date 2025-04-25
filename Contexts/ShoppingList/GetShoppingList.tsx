import React from "react";
import Shopping_List_Item from "../../Types/Shopping_List_Item";

export const getShoppingListData = async (
    serverProps : {DatabaseServer:string, DatabasePort:string},
    userID : number, 
    ingredients : Shopping_List_Item[],
    setShoppingList : React.Dispatch<React.SetStateAction<Shopping_List_Item[]>>, 
    startIndex = 0,
    amount = 200
) => {

    await fetch(
        `http://${serverProps.DatabaseServer}:${serverProps.DatabasePort}/shoppinglist/${userID}?startIndex=${startIndex}&amount=${amount}`, 
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }
    ).then((rawData) => {
        if(rawData.status !== 200) {
            return;
        }
        rawData.json().then((data) => {
            setShoppingList(
                [
                    ...ingredients,
                    ...data.map((element: Shopping_List_Item) => {
                        if(element.Plan_Date) 
                            return {
                                ...element,
                                Plan_Date: new Date(element.Plan_Date),//date comes in as a string and doesn't get properly parsed within .json()
                            };
                        
                        return element
                    }),
                ]
            );
        })
    });
}