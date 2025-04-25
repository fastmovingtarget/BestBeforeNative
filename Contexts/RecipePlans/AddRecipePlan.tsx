import React from "react";
import Recipe_Plan from "../../Types/Recipe_Plan";

export const addRecipePlanData = async (    
    serverProps : {DatabaseServer:string, DatabasePort:string},
    recipePlans : Recipe_Plan[],
    setRecipes : React.Dispatch<React.SetStateAction<Recipe_Plan[]>>, 
    recipePlan : Recipe_Plan,) => {
    await fetch(
        `http://${serverProps.DatabaseServer}:${serverProps.DatabasePort}/recipes/`, 
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body : JSON.stringify({
                Recipe_Plan: recipePlan,
            })
        }
    ).then((rawData) => {
        if(!rawData.ok) {
            return;
        }
        rawData.json().then((data) => {//the data returned should be the Recipe that was added including the id
            if(data.Plan_Date) 
                setRecipes([
                    ...recipePlans,
                    {
                        ...data,
                        Plan_Date: new Date(data.Plan_Date),//date comes in as a string and doesn't get properly parsed within .json()
                    }
                ]);
            else
                setRecipes([
                    ...recipePlans,
                    data
                ]);
        })
    });
    
}