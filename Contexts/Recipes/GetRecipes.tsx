//2025-10-20 : Changed to use loading state enumerator, server props populated internally

import React from "react";
import Recipe, {RecipesSearchOptions} from "../../Types/Recipe";
import { SyncState } from "@/Types/DataLoadingState";

export const getRecipesData = async (
    userID : number, 
    setRecipes : React.Dispatch<React.SetStateAction<Recipe[]>>, 
    recipesSearchOptions : RecipesSearchOptions = {},
) => {

    const serverProps = {
        DatabaseServer: process.env.REACT_APP_DATABASE_SERVER || "192.168.50.183",
        DatabasePort: process.env.REACT_APP_DATABASE_PORT || "5091",
    }

    const optionsString = Object.entries(recipesSearchOptions).map(([key, value]) => {//map the key and uri encoded value pairs to a string joined by &
        if (value === undefined) return ""; // Skip undefined values
        return `${key}=${encodeURIComponent(value)}`;
    }).join("&");

    const returnPromise = new Promise<SyncState>((resolve, reject) => {
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
                resolve(SyncState.Failed);
            }
            else {
                rawData.json().then((data) => {
                    setRecipes(
                        data
                    );
                    resolve(SyncState.Successful);
                })
            }
        });
    })
    return returnPromise
}