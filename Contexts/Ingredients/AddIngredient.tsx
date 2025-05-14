import React from "react";
import Ingredient from "../../Types/Ingredient";

export const addIngredientData = async (
    serverProps : {DatabaseServer:string, DatabasePort:string},
    userID : number,
    ingredients : Ingredient[],
    setIngredients : React.Dispatch<React.SetStateAction<Ingredient[]>>, 
    ingredient : Ingredient,
) => {

    const updateBody = JSON.stringify({ 
        ...ingredient,
        Ingredient_Date: new Date(ingredient.Ingredient_Date || "").toISOString().slice(0, 10), // Format date to YYYY-MM-DD
        Ingredient_User_ID: userID,
    })

    let returnPromise = new Promise<"successful" | "failed">((resolve) => {
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
                resolve("failed");
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
                resolve("successful");
            }
        });
    })
    return returnPromise;
}