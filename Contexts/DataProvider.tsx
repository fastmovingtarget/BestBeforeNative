import React, {useContext, createContext, useState, useEffect} from "react";
import Ingredient, {IngredientSearchOptions} from "../Types/Ingredient";
import Recipe, {RecipesSearchOptions} from "../Types/Recipe";
import Recipe_Plan from "../Types/Recipe_Plan";
import Shopping_List_Item from "../Types/Shopping_List_Item";
import { getIngredientsData } from "./Ingredients/GetIngredients";
import { deleteIngredientData } from "./Ingredients/DeleteIngredient";
import { addIngredientData } from "./Ingredients/AddIngredient";
import { updateIngredientData } from "./Ingredients/UpdateIngredient";
import { getRecipesData } from "./Recipes/GetRecipes";
import { getRecipePlansData } from "./RecipePlans/GetRecipePlans";
import { getShoppingListData } from "./ShoppingList/GetShoppingList";
import RecipesSearch from "@/components/Recipes/RecipesSearch/RecipesSearch";
import { addRecipeData } from "./Recipes/AddRecipe";
import { updateRecipeData } from "./Recipes/UpdateRecipe";

const DataContext = createContext({
    ingredients: [] as Ingredient[],
    deleteIngredient: (ingredientID: number) => {},
    addIngredient: (ingredient: Ingredient) => {},
    updateIngredient: (ingredient: Ingredient) => {},
    ingredientsSearchOptions: {} as IngredientSearchOptions,
    setIngredientsSearchOptions: (options: IngredientSearchOptions) => {},
    recipes: [] as Recipe[],
    addRecipe: (recipe: Recipe) => {},
    updateRecipe: (recipe: Recipe) => {},
    recipesSearchOptions: {} as RecipesSearchOptions,
    setRecipesSearchOptions: (options: RecipesSearchOptions) => {},
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
    const [recipesSearchOptions, setRecipesSearchOptions] = useState<RecipesSearchOptions>({})
    const [recipesDataState, setRecipesDataState] = useState<"loading" | "failed" | "successful" | "updated">("successful")
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
    
    useEffect(() => {
        if(recipesDataState === "loading" || recipesDataState === "updated") 
            return;

        setRecipesDataState("loading");

        getRecipesData(
            databaseProps,
            userID,
            setRecipes,
            recipesSearchOptions
        ).then((result) => {
            setRecipesDataState(result);
        })
    }, [ingredientsDataState, recipesSearchOptions])

    /*useEffect(() => {
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

    const recipesData = {
        recipes,
        recipesSearchOptions,
        setRecipesSearchOptions: (options: RecipesSearchOptions) => {setRecipesSearchOptions((oldOptions) => {return {...oldOptions, ...options}}); setRecipesDataState("successful")},
        addRecipe: (recipe: Recipe) => addRecipeData(databaseProps, userID, recipes, setRecipes, recipe).then((result) => setRecipesDataState(result)),
        updateRecipe: (recipe: Recipe) => updateRecipeData(databaseProps, recipes, setRecipes, recipe).then((result) => setRecipesDataState(result)),
    }

    return (
        <DataContext.Provider 
            value={{
                ...ingredientsData, 
                ...recipesData, 
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