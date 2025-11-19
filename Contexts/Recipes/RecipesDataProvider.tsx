//2025-11-19 : Ingredient_Name and Ingredient_Quantity now have Recipe_ prefix

//2025-11-10 : Added improved documentation

//2025-10-23 : Adding paths for sync and update failures

//2025-10-20 : Recipes Data Context created

import { createContext, useState, useContext, useEffect } from "react";
import Recipe, {RecipesSearchOptions} from "@/Types/Recipe";

import { UpdateState, SyncState } from "@/Types/DataLoadingState";
import { getRecipesData } from "./GetRecipes";
import { deleteRecipeData } from "./DeleteRecipe";
import { addRecipeData } from "./AddRecipe";
import { updateRecipeData } from "./UpdateRecipe";
import { useAuthenticationData } from "../Authentication/AuthenticationDataProvider";

/**
 * Recipes Data Context
 * Provides recipe data and operations to manage recipes.
 * Calling alteration functions will trigger a change to the recipesDataState,
 * which will cause a re-fetch of the recipes data.
 * If getRecipesData fails, a retry will be attempted after 5 seconds.
 * If any of the alteration functions fail, the recipesDataState will be set to the respective failure state, but no retry will occur.
 * @context RecipesDataContext
 * @return {Recipe[]} recipes - List of recipes, state.
 * @return {function} deleteRecipe - Function to delete a recipe by ID.
 * @return {function} addRecipe - Function to add a new recipe.
 * @return {function} updateRecipe - Function to update an existing recipe.
 * @return {RecipesSearchOptions} recipesSearchOptions - Current search options for filtering recipes.
 * @return {function} setRecipesSearchOptions - Function to update search options.
 * @return {SyncState | UpdateState} recipesDataState - Current state of recipe data loading or updating.
 */
    
const RecipesDataContext = createContext({
    recipes: [] as Recipe[],
    deleteRecipe: (recipeID: number) => {},
    addRecipe: (recipe: Recipe) => {},
    updateRecipe: (recipe: Recipe) => {},
    recipesSearchOptions: {} as RecipesSearchOptions,
    setRecipesSearchOptions: (options: RecipesSearchOptions) => {},
    recipesDataState: SyncState.Loading as SyncState | UpdateState,
});

export const RecipesDataProvider = ({children}:{children:React.ReactNode}) => {
    const [recipes, setRecipes] = useState<Recipe[]>([])
    const [recipesSearchOptions, setRecipesSearchOptionsState] = useState<RecipesSearchOptions>({})
    const [recipesDataState, setRecipesDataState] = useState<UpdateState | SyncState>(SyncState.Loading)
    
    const {userId} = useAuthenticationData();
    
    useEffect(() => {
        if(recipesDataState === SyncState.Loading && userId){
            getRecipesData(userId, setRecipes, recipesSearchOptions).then((result) => setRecipesDataState(result));
        }
        if(recipesDataState === SyncState.Failed && userId){
            setTimeout(() => {
                setRecipesDataState(SyncState.Loading);
            }, 5000);
        }
    }, [recipesDataState, userId, recipesSearchOptions]);

    const checkStartSync = (updateState : UpdateState) => {
        if(updateState === UpdateState.Successful){
            setRecipesDataState(SyncState.Loading);
        }
        else{
            setRecipesDataState(updateState);
        }
        return updateState;
    }

    const setRecipesSearchOptions = (options: RecipesSearchOptions) => {setRecipesSearchOptionsState((oldOptions) => {return {...oldOptions, ...options}}); checkStartSync(UpdateState.Successful);};
    const deleteRecipe = (recipeID: number) => deleteRecipeData(recipes, setRecipes, recipeID).then((result) => checkStartSync(result));
    const addRecipe = (recipe: Recipe) => {
        console.log("RecipesDataProvider: addRecipe called with recipe:", recipe);
        addRecipeData(userId, recipes, setRecipes, recipe).then((result) => checkStartSync(result))
    };
    const updateRecipe = (recipe: Recipe) => updateRecipeData(recipes, setRecipes, recipe).then((result) => checkStartSync(result));

    return (
        <RecipesDataContext.Provider
            value={{ recipes, deleteRecipe, addRecipe, updateRecipe, recipesSearchOptions, setRecipesSearchOptions, recipesDataState }}>
            {children}
        </RecipesDataContext.Provider>
    )
}

export const useRecipes = () => {
  return useContext(RecipesDataContext);
};


export interface RecipeDataStruct {
    recipes: Recipe[];
    addRecipe: (recipe: Recipe) => void;
    updateRecipe: (recipe: Recipe) => void;
    deleteRecipe: (recipeID: number) => void;
    recipesSearchOptions: RecipesSearchOptions;
    recipesDataState: SyncState | UpdateState;
    syncRecipes: () => void;
    setRecipesSearchOptions: (options: RecipesSearchOptions) => void;
}