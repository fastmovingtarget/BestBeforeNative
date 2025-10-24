//2025-10-24 : Deleting parts of Data Provider until nothing is left :D

//2025-10-14 : Initial Implementation of Recipe Plan Page

//2025-05-27 : Adding in async shopping list implementation

//2025-05-22 : Updating to include delete, add and update shopping list items

import React, {useContext, createContext, useState, useEffect} from "react";
import Recipe_Plan from "../Types/Recipe_Plan";
import { getRecipePlansData } from "./RecipePlans/GetRecipePlans";
import { addRecipePlanData } from "./RecipePlans/AddRecipePlan";
import { deleteRecipePlanData } from "./RecipePlans/DeleteRecipePlan";

const DataContext = createContext({
    /*
    recipePlans: [] as Recipe_Plan[],
    addRecipePlan: (recipePlan: Recipe_Plan) => {},
    deleteRecipePlan: (recipePlanID?: number) => {},
    shoppingList: [] as Shopping_List_Item[],
    deleteShoppingListItem: (itemID: number) => {},
    addShoppingListItem: (item: Shopping_List_Item) => {},
    updateShoppingListItem: (item: Shopping_List_Item) => {},
    shoppingListSearchOptions: {} as ShoppingListSearchOptions,
    setShoppingListSearchOptions: (options: ShoppingListSearchOptions) => {},*/
});

export const DataProvider = ({children}:{children:React.ReactNode}) => {
    const [recipePlans, setRecipePlans] = useState<Recipe_Plan[]>([])
    const [recipePlansDataState, setRecipePlansDataState] = useState<"loading" | "failed" | "successful" | "updated">("successful")

    const databaseProps = {
        DatabaseServer: process.env.REACT_APP_DATABASE_SERVER || "192.168.50.183",
        DatabasePort: process.env.REACT_APP_DATABASE_PORT || "5091",
    }

    const userID = 1;

    

    /*

    useEffect(() => {
        if(recipePlansDataState === "loading" || recipePlansDataState === "updated") 
            return;
        if(recipePlansDataState === "failed") {
            setTimeout(() => {
                setRecipePlansDataState("loading");
                getRecipePlansData(
                    databaseProps,
                    userID,
                    recipePlans,
                    setRecipePlans,
                ).then((result) => {
                    setRecipePlansDataState(result);
                })
            }, 1000);
        }
        getRecipePlansData(
            databaseProps,
            userID,
            recipePlans,
            setRecipePlans,
        )
    }, [databaseProps, recipePlansDataState, recipePlans])

    const recipePlansData = {
        recipePlans,
        addRecipePlan: (recipePlan: Recipe_Plan) => {addRecipePlanData(databaseProps, userID, recipePlans, setRecipePlans, recipePlan).then((result) => setRecipePlansDataState(result))},
        deleteRecipePlan : (recipePlanID?: number) => {deleteRecipePlanData(databaseProps, recipePlans, setRecipePlans, recipePlanID).then((result) => setRecipePlansDataState(result))},
        updateRecipePlan : (recipePlan: Recipe_Plan) => {},
    }*/

    return (
        <DataContext.Provider 
            value={{
                //...recipePlansData,
            }}>
        {children}
        </DataContext.Provider>
    );
}

export const useData = () => {
  return useContext(DataContext);
};