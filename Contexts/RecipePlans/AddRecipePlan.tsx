//2025-11-10 : Added improved documentation

//2025-11-10 : Correcting fetch call

//2025-10-27 : Updated to get server props inside functions

//2025-10-14 : Initial Implementation of Recipe Plan Page

import React from "react";
import Recipe_Plan from "../../Types/Recipe_Plan";
import { UpdateState } from "@/Types/DataLoadingState";

/**
 * Adds a new recipe plan to the database and updates the local state.
 * If the addition is successful, the recipe plan list state is updated to include the new plan.
 * @param {number} userID - The ID of the user adding the recipe plan.
 * @param {Recipe_Plan[]} recipePlans - The current list of recipe plans.
 * @param {React.Dispatch<React.SetStateAction<Recipe_Plan[]>>} setRecipes - State setter function for updating the recipe plan list.
 * @param {Recipe_Plan} recipePlan - The recipe plan to be added.
 * @returns {Promise<UpdateState>} - A promise that resolves to the update state indicating success or failure.
 */

export const addRecipePlanData = async (    
    userID : number,
    recipePlans : Recipe_Plan[],
    setRecipes : React.Dispatch<React.SetStateAction<Recipe_Plan[]>>,
    recipePlan : Recipe_Plan, ) => {

    const serverProps = {
        DatabaseServer: process.env.REACT_APP_DATABASE_SERVER || "192.168.50.183",
        DatabasePort: process.env.REACT_APP_DATABASE_PORT || "5091",
    };

    const addBody = JSON.stringify({
        ...recipePlan,
        Plan_Date: recipePlan.Plan_Date ? new Date(recipePlan.Plan_Date).toISOString().slice(0, 10) : undefined, // Format date to YYYY-MM-DD, keep it undefined if not provided
        User_ID: userID,
    });

    const returnPromise = new Promise<UpdateState>((resolve) => {
        fetch(
            `http://${serverProps.DatabaseServer}:${serverProps.DatabasePort}/recipeplans/`, 
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body : addBody,
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