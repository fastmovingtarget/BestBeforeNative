import React from "react";
import Ingredient from "../../Types/Ingredient";

export const updateIngredientData = async (
    serverProps : {DatabaseServer:string, DatabasePort:string},
    ingredients : Ingredient[],
    setIngredients : React.Dispatch<React.SetStateAction<Ingredient[]>>, 
    ingredient : Ingredient,
) => {

    setIngredients(ingredients.map(element => {
        if (element.Ingredient_ID !== ingredient.Ingredient_ID)//if the element's ID isn't the input ingredient's then no change
            return element;
        else //otherwise return the ingredient that was input
            return ingredient;
            
    }));

    const updateBody = JSON.stringify({ 
        ...ingredient,
        Ingredient_Date: new Date(ingredient.Ingredient_Date || "").toISOString().slice(0, 10), // Format date to YYYY-MM-DD
    })

    let returnPromise = new Promise<"successful" | "failed">((resolve) => {

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
                resolve("failed");
            }
            else resolve("successful");//nothing useful passed back from the server, so we can just return successful
        });
    })
    return returnPromise;
}