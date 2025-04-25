import React from "react";
import Recipe_Plan from "../../Types/Recipe_Plan";

export const deleteRecipePlanData = async (
    serverProps : {DatabaseServer:string, DatabasePort:string},
    recipePlans : Recipe_Plan[],
    setRecipes : React.Dispatch<React.SetStateAction<Recipe_Plan[]>>, 
    recipePlanID : number,
) => {

    await fetch(
        `http://${serverProps.DatabaseServer}:${serverProps.DatabasePort}/recipe_plans/${recipePlanID}`, 
        {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            }
        }
    ).then((rawData) => {
        if(!rawData.ok) {
            return;
        }
        setRecipes(recipePlans.filter((recipePlan) => recipePlan.Recipe_ID !== recipePlanID));//remove the deleted recipe from the list
    });
}