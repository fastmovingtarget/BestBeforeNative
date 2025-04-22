import React from "react";
import Ingredient from "../../Types/Ingredient";

export const updateIngredientData = async (
    serverProps : {DatabaseServer:string, DatabasePort:string},
    ingredients : Ingredient[],
    setIngredients : React.Dispatch<React.SetStateAction<Ingredient[]>>, 
    ingredient : Ingredient,
) => {

    await fetch(
        `http://${serverProps.DatabaseServer}:${serverProps.DatabasePort}/ingredients/${ingredient.Ingredient_ID}`, 
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body : JSON.stringify({
                ingredient: ingredient,
            })
        }
    ).then((rawData) => {
        if(!rawData.ok) {
            console.log("Error fetching ingredients data: ", rawData.statusText);
            return;
        }
        rawData.json().then((data) => {//the data returned should be the ingredient that was added including the id
            setIngredients(ingredients.map(element => {
                if (element.Ingredient_ID !== ingredient.Ingredient_ID)//if the element's ID isn't the input ingredient's then no change
                    return element;
                else //otherwise return the ingredient that was input
                    return ingredient;
                    
            }));
        })
    });
}