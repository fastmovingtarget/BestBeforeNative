import React from "react";
import Ingredient from "../../Types/Ingredient";

export const deleteIngredientData = async (
    serverProps : {DatabaseServer:string, DatabasePort:string},
    ingredients : Ingredient[],
    setIngredients : React.Dispatch<React.SetStateAction<Ingredient[]>>, 
    ingredientID : number,
) => {
    setIngredients(ingredients.filter((ingredient) => ingredient.Ingredient_ID !== ingredientID));//remove the deleted ingredient from the list

    let returnPromise = new Promise<"successful" | "failed">((resolve) => {
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
                resolve("successful");
            else
                resolve("failed");
        });
    })
    return returnPromise;
}