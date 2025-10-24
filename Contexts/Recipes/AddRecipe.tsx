//2025-10-24 : Adding catch for fetch errors

//2025-10-20 : Changed to use loading state enumerator, server props populated internally

import React from "react";
import Recipe from "../../Types/Recipe";
import { UpdateState } from "@/Types/DataLoadingState";

export const addRecipeData = (    
    userId : number,
    recipes : Recipe[],
    setRecipes : React.Dispatch<React.SetStateAction<Recipe[]>>, 
    recipe : Recipe,) => {

    const serverProps = {
        DatabaseServer: process.env.REACT_APP_DATABASE_SERVER || "192.168.50.183",
        DatabasePort: process.env.REACT_APP_DATABASE_PORT || "5091",
    }

    let returnPromise = new Promise<UpdateState>((resolve) => {
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
                resolve(UpdateState.Failed);
            }
            else{
                rawData.json().then((data) => {//the data returned should be the Recipe that was added including the id
                    setRecipes([
                        ...recipes,
                        data,  
                    ]);
                    resolve(UpdateState.Successful);
                })
            }   
        }).catch(() => {
            resolve(UpdateState.Failed);
        });
    })
    return returnPromise;
}