import React from "react";
import Recipe from "../../Types/Recipe";

export const updateRecipeData = (
    serverProps : {DatabaseServer:string, DatabasePort:string},
    recipes : Recipe[],
    setRecipes : React.Dispatch<React.SetStateAction<Recipe[]>>, 
    recipe : Recipe,
) => {
                console.log("Updating recipe: ", recipe);
    setRecipes(recipes.map(element => {
        if (element.Recipe_ID !== recipe.Recipe_ID)//if the element's ID isn't the input recipe's then no change
            return element;
        else //otherwise return the recipe that was input
            return recipe;
            
    }));

    let returnPromise = new Promise<"successful" | "failed">((resolve) => {
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
                resolve("failed");            
            else{
                console.log("Updated recipe: ", recipe);
                resolve("successful");            
            }
        });
    })
    return returnPromise;
}