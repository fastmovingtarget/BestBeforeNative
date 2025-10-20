//2025-10-20 : Changed to use loading state enumerator, server props populated internally

import React from "react";
import Recipe from "../../Types/Recipe";
import { UpdateState } from "@/Types/DataLoadingState";

export const deleteRecipeData = async (
    recipes : Recipe[],
    setRecipes : React.Dispatch<React.SetStateAction<Recipe[]>>, 
    recipeID : number,
) => {

    const serverProps = {
        DatabaseServer: process.env.REACT_APP_DATABASE_SERVER || "192.168.50.183",
        DatabasePort: process.env.REACT_APP_DATABASE_PORT || "5091",
    }

    setRecipes(recipes.filter((recipe) => recipe.Recipe_ID !== recipeID));//remove the deleted recipe from the list

    let returnPromise = new Promise<UpdateState>((resolve) => {
        fetch(
            `http://${serverProps.DatabaseServer}:${serverProps.DatabasePort}/recipes/${recipeID}`, 
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                }
            }
        ).then((rawData) => {
            if(!rawData.ok) 
                resolve(UpdateState.Failed);
            else
                resolve(UpdateState.Successful);
        });
    })

    return returnPromise;
}