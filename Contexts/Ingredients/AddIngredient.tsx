//2025-11-10 : Added improved documentation

//2025-10-24 : Adding catch for fetch errors

//2025-10-20 : Moved server properties into individual files, now return enum states

//2025-05-28 : Allows for a null date to be sent (from the purchase button in Shopping List tab)

import React from "react";
import Ingredient from "../../Types/Ingredient";
import { UpdateState } from "@/Types/DataLoadingState";

/**
 * Adds a new ingredient to the database and updates the local state.
 * If the addition is successful, the ingredient list state is updated to include the new ingredient.
 * The Ingredient_Date field is formatted to 'YYYY-MM-DD' if provided; otherwise, it is set to null.
 * @param {number} userID - The ID of the user adding the ingredient.
 * @param {Ingredient[]} ingredients - The current list of ingredients.
 * @param {React.Dispatch<React.SetStateAction<Ingredient[]>>} setIngredients - State setter function for updating the ingredient list.
 * @param {Ingredient} ingredient - The ingredient to be added.
 * @returns {Promise<UpdateState>} - A promise that resolves to the update state indicating success or failure.
 */
export const addIngredientData = async (
    userID : number,
    ingredients : Ingredient[],
    setIngredients : React.Dispatch<React.SetStateAction<Ingredient[]>>, 
    ingredient : Ingredient,
) : Promise<UpdateState> => {

    const serverProps = {
        DatabaseServer: process.env.REACT_APP_DATABASE_SERVER || "192.168.50.183",
        DatabasePort: process.env.REACT_APP_DATABASE_PORT || "5091",
    }

    const updateBody = JSON.stringify({ 
        ...ingredient,
        Ingredient_Date: ingredient.Ingredient_Date ? new Date(ingredient.Ingredient_Date).toISOString().slice(0, 10) : undefined, // Format date to YYYY-MM-DD, keep it undefined if not provided
        Ingredient_User_ID: userID,
    })

    let returnPromise = new Promise<UpdateState>((resolve) => {
        fetch(
            `http://${serverProps.DatabaseServer}:${serverProps.DatabasePort}/ingredients/`, 
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body : updateBody
            }
        ).then((rawData) => {
            if(!rawData.ok) {
                resolve(UpdateState.FailedAdd);
            }
            else{
                rawData.json().then((data) => {//the data returned should be the ingredient that was added including the id
                    setIngredients([//we can't add the ingredient to the list until we get the id back from the server
                        ...ingredients,
                        {
                            ...data,
                            Ingredient_Date: new Date(data.Ingredient_Date),//date comes in as a string and doesn't get properly parsed within .json()
                        }]);
                })
                resolve(UpdateState.Successful);
            }
        }).catch(() => {
            resolve(UpdateState.Failed);
        });
    })
    return returnPromise;
}