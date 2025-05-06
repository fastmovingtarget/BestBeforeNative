import React from "react";
import Ingredient, {IngredientSearchOptions} from "../../Types/Ingredient";

export const getIngredientsData = async (
    serverProps : {DatabaseServer:string, DatabasePort:string},
    userID : number, 
    ingredients : Ingredient[],
    setIngredients : React.Dispatch<React.SetStateAction<Ingredient[]>>, 
    searchOptions : IngredientSearchOptions = {},
) => {

    let returnCode : "failed" | "successful" = "failed"; // Initialize returnCode to "failed"

    const optionsString = Object.entries(searchOptions).map(([key, value]) => {//map the key and uri encoded value pairs to a string joined by &
        if (value === undefined) return ""; // Skip undefined values
        return `${key}=${encodeURIComponent(value)}`;
    }).join("&");

    await fetch(
        `http://${serverProps.DatabaseServer}:${serverProps.DatabasePort}/ingredients/${userID}?${optionsString}`, 
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }
    ).then((rawData) => {
        if(rawData.status !== 200) {
            returnCode = "failed";
        }
        rawData.json().then((data) => {
            setIngredients(
                data.map((element: Ingredient) => {
                    if(element.Ingredient_Date) 
                        return {
                            ...element,
                            Ingredient_Date: new Date(element.Ingredient_Date),//date comes in as a string and doesn't get properly parsed within .json()
                        };
                    
                    return element
                }),
            );
            returnCode = "successful";
        })
    });
    return returnCode;
}