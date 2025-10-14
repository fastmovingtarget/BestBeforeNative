//2025-10-14 : Initial Implementation of Recipe Plan Page

import React from "react";
import Recipe_Plan from "../../Types/Recipe_Plan";

export const addRecipePlanData = async (    
    serverProps : {DatabaseServer:string, DatabasePort:string},
    userID : number,
    recipePlans : Recipe_Plan[],
    setRecipes : React.Dispatch<React.SetStateAction<Recipe_Plan[]>>,
    recipePlan : Recipe_Plan, ) => {

    const returnPromise = new Promise<"successful" | "failed">((resolve) => {
        fetch(
            `http://${serverProps.DatabaseServer}:${serverProps.DatabasePort}/recipe_plans/${userID}`, 
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
                resolve("failed");
            }
            else {
                rawData.json().then((data) => {//the data returned should be the Recipe Plan that was added including the id
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
                resolve("successful");
            }
        });
    })
    return returnPromise;
    
}