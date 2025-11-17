//2025-11-10 : Removed server call, added documentation

//2025-10-28 : Added promise wrapper, getting server props internally

import React from "react";
import Recipe_Plan from "../../Types/Recipe_Plan";
import { UpdateState } from "../../Types/DataLoadingState";

/**
 * Updates an existing recipe plan in the local state.
 * This function does not communicate with the server, as recipe plans are read/delete only once created.
 * It does however still flag the recipe plan as needing to be re-synced with the server
 * @param {Recipe_Plan[]} recipePlans - The current list of recipe plans.
 * @param {React.Dispatch<React.SetStateAction<Recipe_Plan[]>>} setRecipePlans - State setter function for updating the recipe plan list.
 * @param {Recipe_Plan} recipePlan - The recipe plan to be updated.
 * @returns {Promise<UpdateState>} - A promise that resolves to the update state indicating success.
 */

export const updateRecipePlanData = async (
    recipePlans : Recipe_Plan[],
    setRecipePlans : React.Dispatch<React.SetStateAction<Recipe_Plan[]>>, 
    recipePlan : Recipe_Plan,
) => {
    setRecipePlans(recipePlans.map(element => {
        if (element.Plan_ID !== recipePlan.Plan_ID)//if the element's ID isn't the input recipe plan's then no change
            return element;
        else //otherwise return the recipe plan that was input
            return recipePlan;
    }));
    return Promise.resolve(UpdateState.Successful);
}