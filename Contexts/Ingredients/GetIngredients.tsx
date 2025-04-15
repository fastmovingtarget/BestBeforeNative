import React from "react";
import Ingredient from "../../Types/Ingredient";

export const getIngredientsData = async (
    serverProps : {DatabaseServer:string, DatabasePort:string},
    userID : number, 
    ingredients : Ingredient[],
    setIngredients : React.Dispatch<React.SetStateAction<Ingredient[]>>, 
    startIndex = 0,
    amount = 200
) => {

    await fetch(
        `http://${serverProps.DatabaseServer}:${serverProps.DatabasePort}/ingredients/${userID}?startIndex=${startIndex}&amount=${amount}`, 
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }
    ).then((rawData) => {
        if(rawData.status !== 200) {
            console.log("Error fetching ingredients data: ", rawData.statusText);
            return;
        }
        rawData.json().then((data) => {
            setIngredients(data);
        })
    });
}