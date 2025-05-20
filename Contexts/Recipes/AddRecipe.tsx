import React from "react";
import Recipe from "../../Types/Recipe";

export const addRecipeData = (    
    serverProps : {DatabaseServer:string, DatabasePort:string},
    userId : number,
    recipes : Recipe[],
    setRecipes : React.Dispatch<React.SetStateAction<Recipe[]>>, 
    recipe : Recipe,) => {

    let returnPromise = new Promise<"successful" | "failed">((resolve) => {
        fetch(
            `http://${serverProps.DatabaseServer}:${serverProps.DatabasePort}/recipes/`, 
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body : JSON.stringify({
                    ...recipe,
                    Recipe_User_ID: userId,
                } as Recipe),
            }
        ).then((rawData) => {
            if(!rawData.ok) {
                resolve("failed");
            }
            else{
                rawData.json().then((data) => {//the data returned should be the Recipe that was added including the id
                    setRecipes([
                        ...recipes,
                        data,  
                    ]);
                    resolve("successful");
                })
            }   
        });
    })
    return returnPromise;
}