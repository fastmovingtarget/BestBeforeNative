import React from "react";
import Ingredient from "../../Types/Ingredient";

export const addIngredientData = async (
    serverProps : {DatabaseServer:string, DatabasePort:string},
    ingredients : Ingredient[],
    setIngredients : React.Dispatch<React.SetStateAction<Ingredient[]>>, 
    ingredient : Ingredient,
) => {

    await fetch(
        `http://${serverProps.DatabaseServer}:${serverProps.DatabasePort}/ingredients/`, 
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
            return;
        }
        rawData.json().then((data) => {//the data returned should be the ingredient that was added including the id
            setIngredients([
                ...ingredients,
                {
                    ...data,
                    Ingredient_Date: new Date(data.Ingredient_Date),//date comes in as a string and doesn't get properly parsed within .json()
                }]);
        })
    });
}