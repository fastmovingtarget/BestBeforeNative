//2025-10-14 : Initial Implementation of Recipe Plan Page

import React from "react";
import Recipe_Plan from "../../Types/Recipe_Plan";

export const getRecipePlansData = async (
    serverProps : {DatabaseServer:string, DatabasePort:string},
    userID : number, 
    recipePlans : Recipe_Plan[],
    setRecipePlans : React.Dispatch<React.SetStateAction<Recipe_Plan[]>>
) => {

    const returnPromise = new Promise<"successful" | "failed">((resolve) => {
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
                resolve("failed");
            }
            else {
                rawData.json().then((data) => {
                    setRecipePlans(
                        [
                            ...recipePlans,
                            ...data.map((recipePlan : Recipe_Plan) => {
                                if(recipePlan.Plan_Date) 
                                    return {
                                        ...recipePlan,
                                        Plan_Date: new Date(recipePlan.Plan_Date),//date comes in as a string and doesn't get properly parsed within .json()
                                    };
                            })
                        ]
                    );
                    resolve("successful");
                })
            }
        });
    })
    return returnPromise;
}