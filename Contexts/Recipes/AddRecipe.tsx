//2026-06-19 : Logs for API calls

//2026-06-17 : Text fix to AddRecipe body

//2026-06-01 : updating local IP Address

//2025-11-20 : Cleanup of debug logs

//2025-11-19 : Ingredient_Name and Ingredient_Quantity now have Recipe_ prefix

//2025-11-10 : Added improved documentation

//2025-10-24 : Adding catch for fetch errors

//2025-10-20 : Changed to use loading state enumerator, server props populated internally

import React from "react";
import Recipe from "../../Types/Recipe";
import { UpdateState } from "@/Types/DataLoadingState";
import log from "@/utils/log";

/**
 * Adds a new recipe to the database and updates the local state.
 * If the addition is successful, the recipe list state is updated to include the new recipe.
 * @param {number} userId - The ID of the user adding the recipe.
 * @param {Recipe[]} recipes - The current list of recipes.
 * @param {React.Dispatch<React.SetStateAction<Recipe[]>>} setRecipes - State setter function for updating the recipe list.
 * @param {Recipe} recipe - The recipe to be added.
 * @returns {Promise<UpdateState>} - A promise that resolves to the update state indicating success or failure.
 */

export const addRecipeData = (    
    userId : number,
    recipes : Recipe[],
    setRecipes : React.Dispatch<React.SetStateAction<Recipe[]>>, 
    recipe : Recipe,) => {

    const serverProps = {
        DatabaseServer: process.env.REACT_APP_DATABASE_SERVER || "192.168.50.201",
        DatabasePort: process.env.REACT_APP_DATABASE_PORT || "5091",
    }

    const requestBody = {
        ...recipe,
        User_ID: userId,
    } as Recipe;

    log(`Adding recipe: ${recipe.Recipe_Name} for user ID: ${userId}`, "debug");

    let returnPromise = new Promise<UpdateState>((resolve) => {
        fetch(
            `http://${serverProps.DatabaseServer}:${serverProps.DatabasePort}/recipes/`, 
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body : JSON.stringify(requestBody),
            }
        ).then((rawData) => {
            if(!rawData.ok) {
                log(`Error adding recipe: ${rawData.statusText}`, "error");
                resolve(UpdateState.Failed);
            }
            else{
                rawData.json().then((data) => {//the data returned should be the Recipe that was added including the id
                    setRecipes([
                        ...recipes,
                        data,  
                    ]);
                    log(`Successfully added recipe: ${recipe.Recipe_Name} for user ID: ${userId}`, "debug");
                    resolve(UpdateState.Successful);
                })
            }   
        }).catch((error) => {
            log(`Error adding recipe: ${error}`, "error");
            resolve(UpdateState.Failed);
        });
    })
    return returnPromise;
}