//2025-10-24 : Adding catch for fetch errors

//2025-10-23 : Standardised to update state on response to fetch

//2025-10-20 : Changed to use loading state enumerator, server props populated internally

import React from "react";
import Recipe from "../../Types/Recipe";
import { UpdateState } from "@/Types/DataLoadingState";

export const updateRecipeData = (
    recipes : Recipe[],
    setRecipes : React.Dispatch<React.SetStateAction<Recipe[]>>, 
    recipe : Recipe,
) => {
    
    const serverProps = {
        DatabaseServer: process.env.REACT_APP_DATABASE_SERVER || "192.168.50.183",
        DatabasePort: process.env.REACT_APP_DATABASE_PORT || "5091",
    }

    let returnPromise = new Promise<UpdateState>((resolve) => {
        fetch(
            `http://${serverProps.DatabaseServer}:${serverProps.DatabasePort}/recipes/${recipe.Recipe_ID}`, 
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body : JSON.stringify(recipe)
            }
        ).then((rawData) => {
            if(!rawData.ok) 
                resolve(UpdateState.Failed);            
            else{
                setRecipes(recipes.map(element => {
                    if (element.Recipe_ID !== recipe.Recipe_ID)//if the element's ID isn't the input recipe's then no change
                        return element;
                    else //otherwise return the recipe that was input
                        return recipe;
                        
                }));
                resolve(UpdateState.Successful);            
            }
        }).catch(() => {
            resolve(UpdateState.Failed);
        });
    })
    return returnPromise;
}