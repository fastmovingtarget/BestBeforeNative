//2025-11-10 : Added improved documentation

//2025-11-10 : Correcting fetch call

//2025-10-27 : Updated server prop location, no longer takes cache to update

//2025-10-14 : Initial Implementation of Recipe Plan Page

import React from "react";
import Recipe_Plan from "../../Types/Recipe_Plan";
import { SyncState } from "@/Types/DataLoadingState";

/**
 * Fetches recipe plans from the database based on user ID and updates the local state.
 * @param {number} userID - The ID of the user whose recipe plans are to be fetched.
 * @param {React.Dispatch<React.SetStateAction<Recipe_Plan[]>>} setRecipePlans - State setter function for updating the recipe plan list.
 * @returns {Promise<SyncState>} - A promise that resolves to the sync state indicating success or failure.
 */

export const getRecipePlansData = async (
    userID : number, 
    setRecipePlans : React.Dispatch<React.SetStateAction<Recipe_Plan[]>>
) => {

    const serverProps = {
        DatabaseServer: process.env.REACT_APP_DATABASE_SERVER || "192.168.50.183",
        DatabasePort: process.env.REACT_APP_DATABASE_PORT || "5091",
    };

    const returnPromise = new Promise<SyncState>((resolve) => {
        fetch(
            `http://${serverProps.DatabaseServer}:${serverProps.DatabasePort}/recipeplans/${userID}`, 
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        ).then((rawData) => {
            if(rawData.status !== 200) {
                resolve(SyncState.Failed);
            }
            else {
                rawData.json().then((data) => {
                    setRecipePlans(
                        data.map((recipePlan : Recipe_Plan) => {
                            if(recipePlan.Plan_Date) 
                                return {
                                    ...recipePlan,
                                    Plan_Date: new Date(recipePlan.Plan_Date),//date comes in as a string and doesn't get properly parsed within .json()
                                };
                            })
                        );
                    resolve(SyncState.Successful);
                })
            }
        });
    })
    return returnPromise;
}