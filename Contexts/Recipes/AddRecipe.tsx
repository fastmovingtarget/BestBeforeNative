//2025-11-10 : Added improved documentation

//2025-10-24 : Adding catch for fetch errors

//2025-10-20 : Changed to use loading state enumerator, server props populated internally

import React from "react";
import Recipe from "../../Types/Recipe";
import { UpdateState } from "@/Types/DataLoadingState";

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
        DatabaseServer: process.env.REACT_APP_DATABASE_SERVER || "192.168.50.183",
        DatabasePort: process.env.REACT_APP_DATABASE_PORT || "5091",
    }

    let returnPromise = new Promise<UpdateState>((resolve) => {
        fetch(
            `http://${serverProps.DatabaseServer}:${serverProps.DatabasePort}/recipes/`, 
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body : JSON.stringify({
                    ...recipe,
                    Recipe_User_ID: userId,
                } as Recipe),
            }
        ).then((rawData) => {
            if(!rawData.ok) {
                resolve(UpdateState.Failed);
            }
            else{
                rawData.json().then((data) => {//the data returned should be the Recipe that was added including the id
                    setRecipes([
                        ...recipes,
                        data,  
                    ]);
                    resolve(UpdateState.Successful);
                })
            }   
        }).catch(() => {
            resolve(UpdateState.Failed);
        });
    })
    return returnPromise;
}