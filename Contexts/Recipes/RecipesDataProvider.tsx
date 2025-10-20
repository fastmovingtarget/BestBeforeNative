//2025-10-20 : Recipes Data Context created

import { createContext, useState, useContext, useEffect } from "react";
import Recipe, {RecipesSearchOptions} from "@/Types/Recipe";

import { UpdateState, SyncState } from "@/Types/DataLoadingState";
import { getRecipesData } from "./GetRecipes";
import { deleteRecipeData } from "./DeleteRecipe";
import { addRecipeData } from "./AddRecipe";
import { updateRecipeData } from "./UpdateRecipe";
import { useAuthenticationData } from "../Authentication/AuthenticationDataProvider";

    
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
        if(recipesDataState === SyncState.Loading && userId)
            getRecipesData(userId, setRecipes, recipesSearchOptions).then((result) => setRecipesDataState(result));
    }, [recipesDataState, userId, recipesSearchOptions]);

    const checkStartSync = (updateState : UpdateState) => {
        if(updateState === UpdateState.Successful)
            setRecipesDataState(SyncState.Loading);
    }

    const setRecipesSearchOptions = (options: RecipesSearchOptions) => {setRecipesSearchOptionsState((oldOptions) => {return {...oldOptions, ...options}}); checkStartSync(UpdateState.Successful);};
    const deleteRecipe = (recipeID: number) => deleteRecipeData(recipes, setRecipes, recipeID).then((result) => checkStartSync(result));
    const addRecipe = (recipe: Recipe) => addRecipeData(userId, recipes, setRecipes, recipe).then((result) => checkStartSync(result));
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