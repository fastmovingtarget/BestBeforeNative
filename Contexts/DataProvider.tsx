import React, {useContext, createContext, useState, useEffect} from "react";
import Ingredient from "../Types/Ingredient";
import Recipe from "../Types/Recipe";
import Recipe_Plan from "../Types/Recipe_Plan";
import Shopping_List_Item from "../Types/Shopping_List_Item";

const DataContext = createContext({});

const DataProvider = ({children}:{children:React.ReactNode}) => {

    const [ingredients, setIngredients] = useState<Ingredient[]>([])
    const [recipes, setRecipes] = useState<Recipe[]>([])
    const [recipePlans, setRecipePlans] = useState<Recipe_Plan[]>([])
    const [shoppingList, setShoppingList] = useState<Shopping_List_Item[]>([])

    useEffect(() => {
        
    }, [])


    return (
        <DataContext.Provider 
            value={{
                ingredients, setIngredients, 
                recipes, setRecipes, 
                recipePlans, setRecipePlans,
                shoppingList, setShoppingList
            }}>
        {children}
        </DataContext.Provider>
    );
}

export const useData = () => {
  return useContext(DataContext);
};