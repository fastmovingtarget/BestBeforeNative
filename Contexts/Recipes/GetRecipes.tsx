import React from "react";
import Recipe, {RecipesSearchOptions} from "../../Types/Recipe";

export const getRecipesData = async (serverProps : {DatabaseServer:string, DatabasePort:string},
    userID : number, 
    setRecipes : React.Dispatch<React.SetStateAction<Recipe[]>>, 
    recipesSearchOptions : RecipesSearchOptions = {},
) => {

    const optionsString = Object.entries(recipesSearchOptions).map(([key, value]) => {//map the key and uri encoded value pairs to a string joined by &
        if (value === undefined) return ""; // Skip undefined values
        return `${key}=${encodeURIComponent(value)}`;
    }).join("&");

    const returnPromise = new Promise<"updated" | "failed">((resolve, reject) => {
        fetch(
            `http://${serverProps.DatabaseServer}:${serverProps.DatabasePort}/recipes/${userID}?${optionsString}`, 
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
            else {
                rawData.json().then((data) => {
                    setRecipes(
                        data
                    );
                    resolve("updated");
                })
            }
        });
    })
    return returnPromise
}