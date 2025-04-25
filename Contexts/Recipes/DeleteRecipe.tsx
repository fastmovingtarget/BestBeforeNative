import React from "react";
import Recipe from "../../Types/Recipe";

export const deleteRecipeData = async (
    serverProps : {DatabaseServer:string, DatabasePort:string},
    recipes : Recipe[],
    setRecipes : React.Dispatch<React.SetStateAction<Recipe[]>>, 
    recipeID : number,
) => {

    await fetch(
        `http://${serverProps.DatabaseServer}:${serverProps.DatabasePort}/recipes/${recipeID}`, 
        {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            }
        }
    ).then((rawData) => {
        if(!rawData.ok) {
            return;
        }
        setRecipes(recipes.filter((recipe) => recipe.Recipe_ID !== recipeID));//remove the deleted recipe from the list
    });
}