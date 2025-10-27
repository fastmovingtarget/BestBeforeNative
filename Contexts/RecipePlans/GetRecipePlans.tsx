//2025-10-27 : Updated server prop location, no longer takes cache to update

//2025-10-14 : Initial Implementation of Recipe Plan Page

import React from "react";
import Recipe_Plan from "../../Types/Recipe_Plan";
import { SyncState } from "@/Types/DataLoadingState";

export const getRecipePlansData = async (
    userID : number, 
    setRecipePlans : React.Dispatch<React.SetStateAction<Recipe_Plan[]>>
) => {

    const serverProps = {
        DatabaseServer: process.env.REACT_APP_DATABASE_SERVER || "localhost",
        DatabasePort: process.env.REACT_APP_DATABASE_PORT || "5000"
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