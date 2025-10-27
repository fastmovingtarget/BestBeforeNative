//2025-10-27 : Updated to get server props inside functions

//2025-10-14 : Initial Implementation of Recipe Plan Page

import React from "react";
import Recipe_Plan from "../../Types/Recipe_Plan";
import { UpdateState } from "@/Types/DataLoadingState";

export const addRecipePlanData = async (    
    userID : number,
    recipePlans : Recipe_Plan[],
    setRecipes : React.Dispatch<React.SetStateAction<Recipe_Plan[]>>,
    recipePlan : Recipe_Plan, ) => {

    const serverProps = {
        DatabaseServer: process.env.REACT_APP_DATABASE_SERVER || "localhost",
        DatabasePort: process.env.REACT_APP_DATABASE_PORT || "5000"
    };

    const returnPromise = new Promise<UpdateState>((resolve) => {
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
                resolve(UpdateState.Failed);
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
                resolve(UpdateState.Successful);
            }
        });
    })
    return returnPromise;
    
}