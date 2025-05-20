import React from "react";
import Recipe from "../../Types/Recipe";

export const deleteRecipeData = async (
    serverProps : {DatabaseServer:string, DatabasePort:string},
    recipes : Recipe[],
    setRecipes : React.Dispatch<React.SetStateAction<Recipe[]>>, 
    recipeID : number,
) => {
    setRecipes(recipes.filter((recipe) => recipe.Recipe_ID !== recipeID));//remove the deleted recipe from the list

    let returnPromise = new Promise<"successful" | "failed">((resolve) => {
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
                resolve("failed");
            else
                resolve("successful");
        });
    })

    return returnPromise;
}