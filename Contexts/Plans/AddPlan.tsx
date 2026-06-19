//2026-06-19 : Logs for API calls

//2026-06-15 : plan date now timezone independent

//2026-06-01 : updating local IP Address

//2025-11-19 : Renamed RecipePlan(s) to just Plan(s)

//2025-11-10 : Added improved documentation

//2025-11-10 : Correcting fetch call

//2025-10-27 : Updated to get server props inside functions

//2025-10-14 : Initial Implementation of Recipe Plan Page

import React from "react";
import Plan from "../../Types/Plan";
import { UpdateState } from "@/Types/DataLoadingState";
import log from "@/utils/log";

/**
 * Adds a new recipe plan to the database and updates the local state.
 * If the addition is successful, the recipe plan list state is updated to include the new plan.
 * @param {number} userID - The ID of the user adding the recipe plan.
 * @param {Plan[]} Plans - The current list of recipe plans.
 * @param {React.Dispatch<React.SetStateAction<Plan[]>>} setPlans - State setter function for updating the recipe plan list.
 * @param {Plan} Plan - The recipe plan to be added.
 * @returns {Promise<UpdateState>} - A promise that resolves to the update state indicating success or failure.
 */

export const addPlanData = async (    
    userID : number,
    Plans : Plan[],
    setRecipes : React.Dispatch<React.SetStateAction<Plan[]>>,
    Plan : Plan, ) => {

    const serverProps = {
        DatabaseServer: process.env.REACT_APP_DATABASE_SERVER || "192.168.50.201",
        DatabasePort: process.env.REACT_APP_DATABASE_PORT || "5091",
    };
    

    const addBody = JSON.stringify({
        ...Plan,
        Plan_Date: Plan.Plan_Date ? `${Plan.Plan_Date.getFullYear()}-${(Plan.Plan_Date.getMonth() + 1).toString().padStart(2, '0')}-${Plan.Plan_Date.getDate().toString().padStart(2, '0')}` : undefined, // Format date to YYYY-MM-DD, keep it undefined if not provided
        User_ID: userID,
    });
    
    log(`Adding plan: ${Plan.Recipe_Name} ${Plan.Plan_Date} for user ID: ${userID}`, "debug");

    const returnPromise = new Promise<UpdateState>((resolve) => {
        fetch(
            `http://${serverProps.DatabaseServer}:${serverProps.DatabasePort}/plans/`, 
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body : addBody,
            }
        ).then((rawData) => {
            if(!rawData.ok) {
                log(`Failed to add plan: ${Plan.Recipe_Name} ${Plan.Plan_Date} for user ID: ${userID}`, "error");
                resolve(UpdateState.Failed);
            }
            else {
                rawData.json().then((data) => {//the data returned should be the Recipe Plan that was added including the id
                    if(data.Plan_Date) 
                        setRecipes([
                            ...Plans,
                            {
                                ...data,
                                Plan_Date: new Date(data.Plan_Date),//date comes in as a string and doesn't get properly parsed within .json()
                            }
                        ]);
                    else
                        setRecipes([
                            ...Plans,
                            data
                        ]);
                })
                log(`Successfully added plan: ${Plan.Recipe_Name} ${Plan.Plan_Date} for user ID: ${userID}`, "debug");
                resolve(UpdateState.Successful);
            }
        }).catch((error) => {
            log(`Error adding plan: ${Plan.Recipe_Name} ${Plan.Plan_Date} for user ID: ${userID}: ${error}`, "error");
            resolve(UpdateState.Failed);
        });
    })
    return returnPromise;
    
}