//2025-10-20 : Moved server properties into individual files, now return enum states

import React from "react";
import Ingredient from "../../Types/Ingredient";
import { UpdateState } from "@/Types/DataLoadingState";

export const deleteIngredientData = async (
    ingredients : Ingredient[],
    setIngredients : React.Dispatch<React.SetStateAction<Ingredient[]>>, 
    ingredientID : number,
) => {
    const serverProps = {
        DatabaseServer: process.env.REACT_APP_DATABASE_SERVER || "192.168.50.183",
        DatabasePort: process.env.REACT_APP_DATABASE_PORT || "5091",
    }

    setIngredients(ingredients.filter((ingredient) => ingredient.Ingredient_ID !== ingredientID));//remove the deleted ingredient from the list

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
            if(rawData.ok) 
                resolve(UpdateState.Successful);
            else
                resolve(UpdateState.FailedDelete);
        });
    })
    return returnPromise;
}