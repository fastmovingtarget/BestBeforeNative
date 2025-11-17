//2025-11-10 : Added improved documentation

//2025-10-24 : Adding catch for fetch errors

//2025-10-23 : Standardised to update state on response to fetch

//2025-10-20 : Changed to use loading state enumerator, server props populated internally

import React from "react";
import Recipe from "../../Types/Recipe";
import { UpdateState } from "@/Types/DataLoadingState";

/**
 * Deletes a recipe from the database and updates the local state.
 * If the deletion is successful, the recipe list state is updated to remove the deleted recipe.
 * @param {Recipe[]} recipes - The current list of recipes.
 * @param {React.Dispatch<React.SetStateAction<Recipe[]>>} setRecipes - State setter function for updating the recipe list.
 * @param {number} recipeID - The ID of the recipe to be deleted.
 * @returns {Promise<UpdateState>} - A promise that resolves to the update state indicating success or failure.
 */

export const deleteRecipeData = async (
    recipes : Recipe[],
    setRecipes : React.Dispatch<React.SetStateAction<Recipe[]>>, 
    recipeID : number,
) => {

    const serverProps = {
        DatabaseServer: process.env.REACT_APP_DATABASE_SERVER || "192.168.50.183",
        DatabasePort: process.env.REACT_APP_DATABASE_PORT || "5091",
    }

    let returnPromise = new Promise<UpdateState>((resolve) => {
        fetch(
            `http://${serverProps.DatabaseServer}:${serverProps.DatabasePort}/recipes/${recipeID}`, 
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                }
            }
        ).then((rawData) => {
            if(!rawData.ok) 
                resolve(UpdateState.Failed);
            else{
                setRecipes(recipes.filter((recipe) => recipe.Recipe_ID !== recipeID));//remove the deleted recipe from the list
                resolve(UpdateState.Successful);
            }
        }).catch(() => {
            resolve(UpdateState.Failed);
        });
    })

    return returnPromise;
}