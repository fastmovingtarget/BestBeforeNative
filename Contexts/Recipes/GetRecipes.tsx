//2025-11-19 : Ingredient_Name and Ingredient_Quantity now have Recipe_ prefix

//2025-11-10 : Added improved documentation

//2025-10-24 : Adding catch for fetch errors

//2025-10-20 : Changed to use loading state enumerator, server props populated internally

import React from "react";
import Recipe, {RecipesSearchOptions} from "../../Types/Recipe";
import { SyncState } from "@/Types/DataLoadingState";

/**
 * Fetches recipes from the database based on user ID and optional search criteria,
 * then updates the local state with the retrieved recipes.
 * @param {number} userID - The ID of the user whose recipes are to be fetched.
 * @param {React.Dispatch<React.SetStateAction<Recipe[]>>} setRecipes - State setter function for updating the recipe list.
 * @param {RecipesSearchOptions} [recipesSearchOptions={}] - Optional search criteria for filtering recipes.
 * @returns {Promise<SyncState>} - A promise that resolves to the sync state indicating success or failure.
 */

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
        }).catch(() => {
            console.error("Error fetching recipes data");
            resolve(SyncState.Failed);
        });
    })
    return returnPromise
}