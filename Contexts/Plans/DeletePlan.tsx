//2025-11-19 : Renamed RecipePlan(s) to just Plan(s)

//2025-11-10 : Added improved documentation

//2025-11-10 : Correcting fetch call

//2025-10-27 : Updated to get server props inside functions

//2025-10-14 : Initial Implementation of Recipe Plan Page

import React from "react";
import Plan from "../../Types/Plan";
import { UpdateState } from "@/Types/DataLoadingState";

/**
 * Deletes a recipe plan from the database and updates the local state.
 * If the deletion is successful, the recipe plan list state is updated to remove the deleted plan.
 * @param {Plan[]} Plans - The current list of recipe plans.
 * @param {React.Dispatch<React.SetStateAction<Plan[]>>} setPlans - State setter function for updating the recipe plan list.
 * @param {number} [planID] - The ID of the recipe plan to be deleted.
 * @returns {Promise<UpdateState>} - A promise that resolves to the update state indicating success or failure.
 */

export const deletePlanData = async (
    Plans : Plan[],
    setPlans : React.Dispatch<React.SetStateAction<Plan[]>>, 
    planID? : number,
) => {

    const serverProps = {
        DatabaseServer: process.env.REACT_APP_DATABASE_SERVER || "192.168.50.183",
        DatabasePort: process.env.REACT_APP_DATABASE_PORT || "5091",
    };

    const returnPromise = new Promise<UpdateState>((resolve) => {
        if(!planID) {
            resolve(UpdateState.Failed);
        }

        
        fetch(
            `http://${serverProps.DatabaseServer}:${serverProps.DatabasePort}/plans/${planID}`, 
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                }
            }
        ).then((rawData) => {
            if(!rawData.ok) 
                resolve(UpdateState.Failed);
            else {
                setPlans(Plans.filter((plan) => plan.Plan_ID !== planID));//remove the deleted recipe from the list
                resolve(UpdateState.Successful);
            }
        });
    })
    return returnPromise;
}