import React, {useContext, createContext, useState, useEffect} from "react";
import Ingredient from "../Types/Ingredient";
import Recipe from "../Types/Recipe";
import Recipe_Plan from "../Types/Recipe_Plan";
import Shopping_List_Item from "../Types/Shopping_List_Item";
import { getIngredientsData } from "./Ingredients/GetIngredients";
import { deleteIngredientData } from "./Ingredients/DeleteIngredient";
import { addIngredientData } from "./Ingredients/AddIngredient";
import { updateIngredientData } from "./Ingredients/UpdateIngredient";
import { getRecipesData } from "./Recipes/GetRecipes";
import { getRecipePlansData } from "./RecipePlans/GetRecipePlans";
import { getShoppingListData } from "./ShoppingList/GetShoppingList";

const DataContext = createContext({
    ingredients: [] as Ingredient[],
    deleteIngredient: (ingredientID: number) => {},
    addIngredient: (ingredient: Ingredient) => {},
    updateIngredient: (ingredient: Ingredient) => {},
    recipes: [] as Recipe[],
    setRecipes: (recipes: Recipe[]) => {},
    recipePlans: [] as Recipe_Plan[],
    setRecipePlans: (recipePlans: Recipe_Plan[]) => {},
    shoppingList: [] as Shopping_List_Item[],
    setShoppingList: (shoppingList: Shopping_List_Item[]) => {},
});

export const DataProvider = ({children}:{children:React.ReactNode}) => {

    const [ingredients, setIngredients] = useState<Ingredient[]>([])
    const [recipes, setRecipes] = useState<Recipe[]>([])
    const [recipePlans, setRecipePlans] = useState<Recipe_Plan[]>([])
    const [shoppingList, setShoppingList] = useState<Shopping_List_Item[]>([])

    const databaseProps = {
        DatabaseServer: process.env.REACT_APP_DATABASE_SERVER || "localhost",
        DatabasePort: process.env.REACT_APP_DATABASE_PORT || "8080",
    }

    const userID = 1;

    useEffect(() => {
        getIngredientsData(
            databaseProps,
            userID,
            ingredients,
            setIngredients,
        )
    }, [ingredients])
    
    useEffect(() => {
        getRecipesData(
            databaseProps,
            userID,
            recipes,
            setRecipes,
        )
    }, [recipes])

    useEffect(() => {
        getRecipePlansData(
            databaseProps,
            userID,
            recipePlans,
            setRecipePlans,
        )
    }, [recipePlans])

    useEffect(() => {
        getShoppingListData(
            databaseProps,
            userID,
            shoppingList,
            setShoppingList,
        )
    }, [shoppingList])

    const ingredientsData = {
        ingredients,
        deleteIngredient: (ingredientID: number) => deleteIngredientData(databaseProps, ingredients, setIngredients, ingredientID),
        addIngredient: (ingredient: Ingredient) => addIngredientData(databaseProps, ingredients, setIngredients, ingredient),
        updateIngredient: (ingredient: Ingredient) => updateIngredientData(databaseProps, ingredients, setIngredients, ingredient),
    }

    return (
        <DataContext.Provider 
            value={{
                ...ingredientsData, 
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