//2025-05-27 : Adding in async shopping list implementation

//2025-05-22 : Updating to include delete, add and update shopping list items

import React, {useContext, createContext, useState, useEffect} from "react";
import Ingredient, {IngredientSearchOptions} from "../Types/Ingredient";
import Recipe, {RecipesSearchOptions} from "../Types/Recipe";
import Recipe_Plan from "../Types/Recipe_Plan";
import Shopping_List_Item, {ShoppingListSearchOptions} from "../Types/Shopping_List_Item";
import { getIngredientsData } from "./Ingredients/GetIngredients";
import { deleteIngredientData } from "./Ingredients/DeleteIngredient";
import { addIngredientData } from "./Ingredients/AddIngredient";
import { updateIngredientData } from "./Ingredients/UpdateIngredient";
import { getRecipesData } from "./Recipes/GetRecipes";
import { addRecipeData } from "./Recipes/AddRecipe";
import { updateRecipeData } from "./Recipes/UpdateRecipe";
import { deleteRecipeData } from "./Recipes/DeleteRecipe";
import { getRecipePlansData } from "./RecipePlans/GetRecipePlans";
import { getShoppingListData } from "./ShoppingList/GetShoppingList";
import { deleteShoppingListItemData } from "./ShoppingList/DeleteShoppingListItem";
import { addShoppingListItemData } from "./ShoppingList/AddShoppingListItem";
import { updateShoppingListItemData } from "./ShoppingList/UpdateShoppingListItem";
import RecipesSearch from "@/components/Recipes/RecipesSearch/RecipesSearch";

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
    deleteRecipe: (recipeID: number) => {},
    recipesSearchOptions: {} as RecipesSearchOptions,
    setRecipesSearchOptions: (options: RecipesSearchOptions) => {},
    recipePlans: [] as Recipe_Plan[],
    setRecipePlans: (recipePlans: Recipe_Plan[]) => {},
    shoppingList: [] as Shopping_List_Item[],
    deleteShoppingListItem: (itemID: number) => {},
    addShoppingListItem: (item: Shopping_List_Item) => {},
    updateShoppingListItem: (item: Shopping_List_Item) => {},
    shoppingListSearchOptions: {} as ShoppingListSearchOptions,
    setShoppingListSearchOptions: (options: ShoppingListSearchOptions) => {},
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
    const [shoppingListSearchOptions, setShoppingListSearchOptions] = useState<ShoppingListSearchOptions>({})
    const [shoppingListDataState, setShoppingListDataState] = useState<"loading" | "failed" | "successful" | "updated">("successful")

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

        if(recipesDataState === "failed") {
            setTimeout(() => {
                setRecipesDataState("loading");
                getRecipesData(
                    databaseProps,
                    userID,
                    setRecipes,
                    recipesSearchOptions
                ).then((result) => {
                    setRecipesDataState(result);
                })
            }, 1000);
        }
        else{
            setRecipesDataState("loading");

            getRecipesData(
                databaseProps,
                userID,
                setRecipes,
                recipesSearchOptions
            ).then((result) => {
                setRecipesDataState(result);
            })
        }
    }, [recipesDataState, recipesSearchOptions])

    useEffect(() => {
        if(shoppingListDataState === "loading" || shoppingListDataState === "updated") 
            return;

        if(shoppingListDataState === "failed") {
            setTimeout(() => {
                setShoppingListDataState("loading");
                getShoppingListData(
                    databaseProps,
                    userID,
                    setShoppingList,
                    shoppingListSearchOptions
                ).then((result) => {
                    setShoppingListDataState(result);
                })
            }, 1000);
        }
        getShoppingListData(
            databaseProps,
            userID,
            setShoppingList,
            shoppingListSearchOptions
        )
    }, [shoppingListDataState, shoppingListSearchOptions])

    /*useEffect(() => {
        getRecipePlansData(
            databaseProps,
            userID,
            recipePlans,
            setRecipePlans,
        )
    }, [recipePlans])*/


    const ingredientsData = {
        ingredients,
        ingredientsSearchOptions,
        setIngredientsSearchOptions: (options: IngredientSearchOptions) => {setIngredientsSearchOptions((oldOptions) => {return {...oldOptions, ...options}}); setIngredientsDataState("successful")},
        deleteIngredient: (ingredientID: number) => deleteIngredientData(databaseProps, ingredients, setIngredients, ingredientID).then((result) => setIngredientsDataState(result)),
        addIngredient: (ingredient: Ingredient) => addIngredientData(databaseProps, userID, ingredients, setIngredients, ingredient).then((result) => setIngredientsDataState(result)),
        updateIngredient: (ingredient: Ingredient) => updateIngredientData(databaseProps, ingredients, setIngredients, ingredient).then((result) => setIngredientsDataState(result)),
    }

    const recipesData = {
        recipes,
        recipesSearchOptions,
        setRecipesSearchOptions: (options: RecipesSearchOptions) => {setRecipesSearchOptions((oldOptions) => { return {...oldOptions, ...options}}); setRecipesDataState("successful")},
        deleteRecipe: (recipeID: number) => deleteRecipeData(databaseProps, recipes, setRecipes, recipeID).then((result) => setRecipesDataState(result)),
        addRecipe: (recipe: Recipe) => addRecipeData(databaseProps, userID, recipes, setRecipes, recipe).then((result) => setRecipesDataState(result)),
        updateRecipe: (recipe: Recipe) => updateRecipeData(databaseProps, recipes, setRecipes, recipe).then((result) => setRecipesDataState(result)),
    }

    const shoppingListData = {
        shoppingList,
        shoppingListSearchOptions,
        setShoppingListSearchOptions: (options: ShoppingListSearchOptions) => {setShoppingListSearchOptions((oldOptions) => { return {...oldOptions, ...options}}); setShoppingListDataState("successful")},
        deleteShoppingListItem: (itemID: number) => deleteShoppingListItemData(databaseProps, shoppingList, setShoppingList, itemID).then((result) => setShoppingListDataState(result)),
        addShoppingListItem: (item: Shopping_List_Item) => addShoppingListItemData(databaseProps, userID, shoppingList, setShoppingList, item).then((result) => setShoppingListDataState(result)),
        updateShoppingListItem: (item: Shopping_List_Item) => updateShoppingListItemData(databaseProps, shoppingList, setShoppingList, item).then((result) => setShoppingListDataState(result)),
    }

    return (
        <DataContext.Provider 
            value={{
                ...ingredientsData, 
                ...recipesData, 
                ...shoppingListData,
                recipePlans, setRecipePlans,
            }}>
        {children}
        </DataContext.Provider>
    );
}

export const useData = () => {
  return useContext(DataContext);
};