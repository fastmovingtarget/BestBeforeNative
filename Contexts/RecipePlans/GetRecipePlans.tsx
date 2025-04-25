import React from "react";
import Recipe_Plan from "../../Types/Recipe_Plan";

export const getRecipePlansData = async (
    serverProps : {DatabaseServer:string, DatabasePort:string},
    userID : number, 
    recipePlans : Recipe_Plan[],
    setRecipePlans : React.Dispatch<React.SetStateAction<Recipe_Plan[]>>, 
    startIndex = 0,
    amount = 200
) => {

    await fetch(
        `http://${serverProps.DatabaseServer}:${serverProps.DatabasePort}/recipeplans/${userID}?startIndex=${startIndex}&amount=${amount}`, 
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }
    ).then((rawData) => {
        if(rawData.status !== 200) {
            return;
        }
        rawData.json().then((data) => {
            setRecipePlans(
                [
                    ...recipePlans,
                    ...data
                ]
            );
        })
    });
}