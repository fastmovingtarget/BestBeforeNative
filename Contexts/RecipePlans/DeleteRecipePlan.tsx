//2025-11-10 : Correcting fetch call

//2025-10-27 : Updated to get server props inside functions

//2025-10-14 : Initial Implementation of Recipe Plan Page

import React from "react";
import Recipe_Plan from "../../Types/Recipe_Plan";
import { UpdateState } from "@/Types/DataLoadingState";

export const deleteRecipePlanData = async (
    recipePlans : Recipe_Plan[],
    setRecipes : React.Dispatch<React.SetStateAction<Recipe_Plan[]>>, 
    recipePlanID? : number,
) => {

    const serverProps = {
        DatabaseServer: process.env.REACT_APP_DATABASE_SERVER || "192.168.50.183",
        DatabasePort: process.env.REACT_APP_DATABASE_PORT || "5091",
    };

    const returnPromise = new Promise<UpdateState>((resolve) => {
        if(!recipePlanID) {
            resolve(UpdateState.Failed);
        }

        
        fetch(
            `http://${serverProps.DatabaseServer}:${serverProps.DatabasePort}/recipe_plans/${recipePlanID}`, 
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
                setRecipes(recipePlans.filter((recipePlan) => recipePlan.Recipe_ID !== recipePlanID));//remove the deleted recipe from the list
                resolve(UpdateState.Successful);
            }
        });
    })
    return returnPromise;
}