import React from "react";
import Recipe from "../../Types/Recipe";

export const addRecipeData = async (    
    serverProps : {DatabaseServer:string, DatabasePort:string},
    recipes : Recipe[],
    setRecipes : React.Dispatch<React.SetStateAction<Recipe[]>>, 
    recipe : Recipe,) => {
    await fetch(
        `http://${serverProps.DatabaseServer}:${serverProps.DatabasePort}/recipes/`, 
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body : JSON.stringify({
                Recipe: recipe,
            })
        }
    ).then((rawData) => {
        if(!rawData.ok) {
            return;
        }
        rawData.json().then((data) => {//the data returned should be the Recipe that was added including the id
            setRecipes([
                ...recipes,
                data,  
            ]);
        })
    });
}