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
            return;
        }
        rawData.json().then((data) => {
            setIngredients(
                [
                    ...ingredients,
                    ...data.map((element: Ingredient) => {
                        if(element.Ingredient_Date) 
                            return {
                                ...element,
                                Ingredient_Date: new Date(element.Ingredient_Date),//date comes in as a string and doesn't get properly parsed within .json()
                            };
                        
                        return element
                    }),
                ]
            );
        })
    });
}