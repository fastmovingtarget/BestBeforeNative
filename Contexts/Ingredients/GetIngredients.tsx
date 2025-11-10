//2025-11-10 : Added improved documentation

//2025-10-24 : Adding catch for fetch errors

//2025-10-20 : Moved server properties into individual files, now return enum states

//2025-05-28 : When null Ingredient Date comes in, retains null value

import React from "react";
import Ingredient, {IngredientSearchOptions} from "../../Types/Ingredient";
import { SyncState } from "@/Types/DataLoadingState";
/**
 * Fetches ingredients from the database based on user ID and optional search criteria,
 * then updates the local state with the retrieved ingredients.
 * @param {number} userID - The ID of the user whose ingredients are to be fetched.
 * @param {React.Dispatch<React.SetStateAction<Ingredient[]>>} setIngredients - State setter function for updating the ingredient list.
 * @param {IngredientSearchOptions} [searchOptions={}] - Optional search criteria for filtering ingredients.
 * @returns {Promise<SyncState>} - A promise that resolves to the sync state indicating success or failure.
 */

export const getIngredientsData = async (
    userID : number, 
    setIngredients : React.Dispatch<React.SetStateAction<Ingredient[]>>, 
    searchOptions : IngredientSearchOptions = {},
) => {
    
    const serverProps = {
        DatabaseServer: process.env.REACT_APP_DATABASE_SERVER || "192.168.50.183",
        DatabasePort: process.env.REACT_APP_DATABASE_PORT || "5091",
    }

    const optionsString = Object.entries(searchOptions).map(([key, value]) => {//map the key and uri encoded value pairs to a string joined by &
        if (value === undefined) return ""; // Skip undefined values
        return `${key}=${encodeURIComponent(value)}`;
    }).join("&");

    let returnPromise = new Promise<SyncState>((resolve) => {
        fetch(
            `http://${serverProps.DatabaseServer}:${serverProps.DatabasePort}/ingredients/${userID}?${optionsString}`, 
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
                rawData.json().then((data : Ingredient[]) => {
                    setIngredients(
                        data.map((element: Ingredient) => {
                            if(element.Ingredient_Date) 
                                return {
                                    ...element,
                                    Ingredient_Date: element.Ingredient_Date ? new Date(element.Ingredient_Date) : undefined,//date comes in as a string and doesn't get properly parsed within .json()
                                };
                            
                            return element
                        }),
                    );
                    resolve(SyncState.Successful);
                })
            }
        }).catch(() => {
            resolve(SyncState.Failed);
        });
    });
    return returnPromise;
}