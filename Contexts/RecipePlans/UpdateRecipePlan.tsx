import React from "react";
import Recipe_Plan from "../../Types/Recipe_Plan";

export const updateRecipePlanData = async (
    serverProps : {DatabaseServer:string, DatabasePort:string},
    recipePlans : Recipe_Plan[],
    setRecipePlans : React.Dispatch<React.SetStateAction<Recipe_Plan[]>>, 
    recipePlan : Recipe_Plan,
) => {

    await fetch(
        `http://${serverProps.DatabaseServer}:${serverProps.DatabasePort}/recipeplans/${recipePlan.Recipe_ID}`, 
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body : JSON.stringify(recipePlan)
        }
    ).then((rawData) => {
        if(!rawData.ok) {
            return;
        }
        rawData.json().then((data) => {//the data returned should be the recipe plan that was updated, but we already have that in the input recipe plan, so data isn't used
            setRecipePlans(recipePlans.map(element => {
                if (element.Plan_ID !== recipePlan.Plan_ID)//if the element's ID isn't the input recipe plan's then no change
                    return element;
                else //otherwise return the recipe plan that was input
                    return recipePlan;
            }));
        })
    });
}