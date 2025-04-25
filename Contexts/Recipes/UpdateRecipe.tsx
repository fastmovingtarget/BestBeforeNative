import React from "react";
import Recipe from "../../Types/Recipe";

export const updateRecipeData = async (
    serverProps : {DatabaseServer:string, DatabasePort:string},
    recipes : Recipe[],
    setRecipes : React.Dispatch<React.SetStateAction<Recipe[]>>, 
    recipe : Recipe,
) => {

    await fetch(
        `http://${serverProps.DatabaseServer}:${serverProps.DatabasePort}/recipes/${recipe.Recipe_ID}`, 
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body : JSON.stringify({
                recipe: recipe,
            })
        }
    ).then((rawData) => {
        if(!rawData.ok) {
            return;
        }
        rawData.json().then((data) => {//the data returned should be the recipe that was added including the id
            setRecipes(recipes.map(element => {
                if (element.Recipe_ID !== recipe.Recipe_ID)//if the element's ID isn't the input recipe's then no change
                    return element;
                else //otherwise return the recipe that was input
                    return recipe;
                    
            }));
        })
    });
}