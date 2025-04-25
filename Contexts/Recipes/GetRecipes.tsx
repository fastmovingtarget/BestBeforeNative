import React from "react";
import Recipe from "../../Types/Recipe";

export const getRecipesData = async (serverProps : {DatabaseServer:string, DatabasePort:string},
    userID : number, 
    recipes : Recipe[],
    setRecipes : React.Dispatch<React.SetStateAction<Recipe[]>>, 
    startIndex = 0,
    amount = 200
) => {

    await fetch(
        `http://${serverProps.DatabaseServer}:${serverProps.DatabasePort}/recipes/${userID}?startIndex=${startIndex}&amount=${amount}`, 
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
            setRecipes(
                [
                    ...recipes,
                    ...data
                ]
            );
        })
    });
}