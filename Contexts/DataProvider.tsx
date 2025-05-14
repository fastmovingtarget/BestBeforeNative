import React, {useContext, createContext, useState, useEffect} from "react";
import Ingredient, {IngredientSearchOptions} from "../Types/Ingredient";
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
    ingredientsSearchOptions: {} as IngredientSearchOptions,
    setIngredientsSearchOptions: (options: IngredientSearchOptions) => {},
    recipes: [] as Recipe[],
    setRecipes: (recipes: Recipe[]) => {},
    recipePlans: [] as Recipe_Plan[],
    setRecipePlans: (recipePlans: Recipe_Plan[]) => {},
    shoppingList: [] as Shopping_List_Item[],
    setShoppingList: (shoppingList: Shopping_List_Item[]) => {},
});

export const DataProvider = ({children}:{children:React.ReactNode}) => {

    const [ingredients, setIngredients] = useState<Ingredient[]>([])
    const [ingredientsSearchOptions, setIngredientsSearchOptions] = useState<IngredientSearchOptions>({})
    const [ingredientsDataState, setIngredientsDataState] = useState<"loading" | "failed" | "successful" | "updated">("successful")
    const [recipes, setRecipes] = useState<Recipe[]>([])
    const [recipePlans, setRecipePlans] = useState<Recipe_Plan[]>([])
    const [shoppingList, setShoppingList] = useState<Shopping_List_Item[]>([])

    const databaseProps = {
        DatabaseServer: process.env.REACT_APP_DATABASE_SERVER || "192.168.50.183",
        DatabasePort: process.env.REACT_APP_DATABASE_PORT || "5091",
    }

    const userID = 1;

    useEffect(() => {
        if(ingredientsDataState === "loading" || ingredientsDataState === "updated") 
            return;

        setIngredientsDataState("loading");

        getIngredientsData(
            databaseProps,
            userID,
            setIngredients,
            ingredientsSearchOptions,
        ).then((result) => {
            setIngredientsDataState(result);
        })
    }, [ingredientsDataState, ingredientsSearchOptions])
    
    /*useEffect(() => {
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
    }, [shoppingList])*/

    const ingredientsData = {
        ingredients,
        deleteIngredient: (ingredientID: number) => deleteIngredientData(databaseProps, ingredients, setIngredients, ingredientID).then((result) => setIngredientsDataState(result)),
        addIngredient: (ingredient: Ingredient) => addIngredientData(databaseProps, userID, ingredients, setIngredients, ingredient).then((result) => setIngredientsDataState(result)),
        updateIngredient: (ingredient: Ingredient) => updateIngredientData(databaseProps, ingredients, setIngredients, ingredient).then((result) => setIngredientsDataState(result)),
        ingredientsSearchOptions,
        setIngredientsSearchOptions: (options: IngredientSearchOptions) => {setIngredientsSearchOptions((oldOptions) => {return {...oldOptions, ...options}}); setIngredientsDataState("successful")},
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