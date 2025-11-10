//2025-11-10 : Added improved documentation

//2025-10-24 : Adding catch for fetch errors

//2025-10-23 : Standardised to update state on response to fetch

//2025-10-22 : Corrected fail state resolution

//2025-10-20 : Moved server properties into individual files, now return enum states

import React from "react";
import Ingredient from "../../Types/Ingredient";
import { UpdateState } from "@/Types/DataLoadingState";

/**
 * Deletes an ingredient from the database and updates the local state.
 * If the deletion is successful, the ingredient list state is updated to remove the deleted ingredient.
 * @param {Ingredient[]} ingredients - The current list of ingredients.
 * @param {React.Dispatch<React.SetStateAction<Ingredient[]>>} setIngredients - State setter function for updating the ingredient list.
 * @param {number} ingredientID - The ID of the ingredient to be deleted.
 * @returns {Promise<UpdateState>} - A promise that resolves to the update state indicating success or failure.
 */
export const deleteIngredientData = async (
    ingredients : Ingredient[],
    setIngredients : React.Dispatch<React.SetStateAction<Ingredient[]>>, 
    ingredientID : number,
) => {
    const serverProps = {
        DatabaseServer: process.env.REACT_APP_DATABASE_SERVER || "192.168.50.183",
        DatabasePort: process.env.REACT_APP_DATABASE_PORT || "5091",
    }


    let returnPromise = new Promise<UpdateState>((resolve) => {
        fetch(
            `http://${serverProps.DatabaseServer}:${serverProps.DatabasePort}/ingredients/${ingredientID}`, 
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                }
            }
        ).then((rawData) => {
            if(rawData.ok) {
                setIngredients(ingredients.filter((ingredient) => ingredient.Ingredient_ID !== ingredientID));//remove the deleted ingredient from the list
                resolve(UpdateState.Successful);
            }
            else
                resolve(UpdateState.Failed);
        }).catch(() => {
                    resolve(UpdateState.Failed);
        });
    })
    return returnPromise;
}