//2025-05-28 : Searches with options string, returns a promise with success/failure state

import React from "react";
import Shopping_List_Item, { ShoppingListSearchOptions } from "../../Types/Shopping_List_Item";

export const getShoppingListData = (
    serverProps : {DatabaseServer:string, DatabasePort:string},
    userID : number, 
    setShoppingList : React.Dispatch<React.SetStateAction<Shopping_List_Item[]>>, 
    searchOptions : ShoppingListSearchOptions = {}
) => {

    const optionsString = Object.entries(searchOptions).map(([key, value]) => {//map the key and uri encoded value pairs to a string joined by &
        if (value === undefined) return ""; // Skip undefined values
        return `${key}=${encodeURIComponent(value)}`;
    }).join("&");

    let returnPromise = new Promise<"updated" | "failed">((resolve) => {
        fetch(
            `http://${serverProps.DatabaseServer}:${serverProps.DatabasePort}/shoppinglist/${userID}?${optionsString}`, 
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        ).then((rawData) => {
            if(rawData.status !== 200) {
                resolve("failed");
            }
            else{
                rawData.json().then((data) => {
                    setShoppingList(                    
                        data.map((element: Shopping_List_Item) => {
                            if(element.Plan_Date) 
                                return {
                                    ...element,
                                    Plan_Date: new Date(element.Plan_Date),//date comes in as a string and doesn't get properly parsed within .json()
                                };
                            
                            return element
                        }),
                    );
                    resolve("updated");
                })
            }
        });
    })
    return returnPromise;
}