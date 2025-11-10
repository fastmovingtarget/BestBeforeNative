//2025-11-10 : Update now handles null date correctly

//2025-10-24 : Adding catch for fetch errors

//2025-10-23 : Standardised to update state on response to fetch

//2025-10-22 : Corrected fail state resolution

//2025-10-20 : Moved server properties into individual files, now return enum states

import React from "react";
import Ingredient from "../../Types/Ingredient";
import { UpdateState } from "@/Types/DataLoadingState";

export const updateIngredientData = async (
    ingredients : Ingredient[],
    setIngredients : React.Dispatch<React.SetStateAction<Ingredient[]>>, 
    ingredient : Ingredient,
) => {

    const serverProps = {
        DatabaseServer: process.env.REACT_APP_DATABASE_SERVER || "192.168.50.183",
        DatabasePort: process.env.REACT_APP_DATABASE_PORT || "5091",
    }

    const updateBody = JSON.stringify({ 
        ...ingredient,
        Ingredient_Date: ingredient.Ingredient_Date ? new Date(ingredient.Ingredient_Date).toISOString().slice(0, 10) : null, // Format date to YYYY-MM-DD
    })

    let returnPromise = new Promise<UpdateState>((resolve) => {

        fetch(
            `http://${serverProps.DatabaseServer}:${serverProps.DatabasePort}/ingredients/${ingredient.Ingredient_ID}`, 
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body : updateBody
            }
        ).then((rawData) => {
            if(!rawData.ok) {//this should encompass all errors
                resolve(UpdateState.Failed);
            }
            else {
                resolve(UpdateState.Successful);//nothing useful passed back from the server, so we can just return successful
                setIngredients(ingredients.map(element => {
                    if (element.Ingredient_ID !== ingredient.Ingredient_ID)//if the element's ID isn't the input ingredient's then no change
                        return element;
                    else //otherwise return the ingredient that was input
                        return ingredient;
                }));
            }
        }).catch(() => {
            resolve(UpdateState.Failed);
        });
    })
    return returnPromise;
}