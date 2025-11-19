//2025-11-19 : Renamed RecipePlan(s) to just Plan(s)

//2025-11-10 : Removed server call, added documentation

//2025-10-28 : Added promise wrapper, getting server props internally

import React from "react";
import Plan from "../../Types/Plan";
import { UpdateState } from "../../Types/DataLoadingState";

/**
 * Updates an existing recipe plan in the local state.
 * This function does not communicate with the server, as recipe plans are read/delete only once created.
 * It does however still flag the recipe plan as needing to be re-synced with the server
 * @param {Plan[]} plans - The current list of plans.
 * @param {React.Dispatch<React.SetStateAction<Plan[]>>} setPlans - State setter function for updating the plan list.
 * @param {Plan} plan - The plan to be updated.
 * @returns {Promise<UpdateState>} - A promise that resolves to the update state indicating success.
 */

export const updatePlanData = async (
    plans : Plan[],
    setPlans : React.Dispatch<React.SetStateAction<Plan[]>>, 
    plan : Plan,
) => {
    setPlans(plans.map(element => {
        if (element.Plan_ID !== plan.Plan_ID)//if the element's ID isn't the input plan's then no change
            return element;
        else //otherwise return the plan that was input
            return plan;
    }));
    return Promise.resolve(UpdateState.Successful);
}