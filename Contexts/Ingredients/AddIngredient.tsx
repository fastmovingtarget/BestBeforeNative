//2025-10-20 : Moved server properties into individual files, now return enum states

//2025-05-28 : Allows for a null date to be sent (from the purchase button in Shopping List tab)

import React from "react";
import Ingredient from "../../Types/Ingredient";
import { UpdateState } from "@/Types/DataLoadingState";

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
        });
    })
    return returnPromise;
}