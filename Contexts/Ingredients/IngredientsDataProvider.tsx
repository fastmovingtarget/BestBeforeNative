//2025-10-20 : Separated ingredients data provider

import { useState, createContext, useContext, useEffect  } from "react";

import Ingredient, { IngredientSearchOptions } from "@/Types/Ingredient";
import { UpdateState, SyncState } from "@/Types/DataLoadingState";

import { getIngredientsData } from "./GetIngredients";
import { deleteIngredientData } from "./DeleteIngredient";
import { addIngredientData } from "./AddIngredient";
import { updateIngredientData } from "./UpdateIngredient";

import { useAuthenticationData } from "@/Contexts/Authentication/AuthenticationDataProvider";

const IngredientsDataContext = createContext({
    ingredients: [] as Ingredient[],
    deleteIngredient: (ingredientID: number) => {},
    addIngredient: (ingredient: Ingredient) => {},
    updateIngredient: (ingredient: Ingredient) => {},
    ingredientsSearchOptions: {} as IngredientSearchOptions,
    setIngredientsSearchOptions: (options: IngredientSearchOptions) => {},
    ingredientsDataState: SyncState.Loading as SyncState | UpdateState,
});

export const IngredientsDataProvider = ({children}:{children:React.ReactNode}) => {

    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [ingredientsSearchOptions, setIngredientsSearchOptionsState] = useState<IngredientSearchOptions>({})
    const [ingredientsDataState, setIngredientsDataState] = useState<SyncState | UpdateState>(SyncState.Loading)

    const {userId} = useAuthenticationData();

    useEffect(() => {
        if(ingredientsDataState === SyncState.Loading && userId)
            getIngredientsData(userId, setIngredients, ingredientsSearchOptions).then((result) => setIngredientsDataState(result));
    }, [ingredientsDataState, userId, ingredientsSearchOptions]);

    const checkStartSync = (updateState : UpdateState) => {
        if(updateState === UpdateState.Successful)
            setIngredientsDataState(SyncState.Loading);

        return updateState;
    }

    const setIngredientsSearchOptions = (options: IngredientSearchOptions) => {setIngredientsSearchOptionsState((oldOptions) => {return {...oldOptions, ...options}}); checkStartSync(UpdateState.Successful);};
    const deleteIngredient = (ingredientID: number) => deleteIngredientData(ingredients, setIngredients, ingredientID).then((result) => checkStartSync(result));
    const addIngredient = (ingredient: Ingredient) => addIngredientData(userId, ingredients, setIngredients, ingredient).then((result) => checkStartSync(result));
    const updateIngredient = (ingredient: Ingredient) => updateIngredientData(ingredients, setIngredients, ingredient).then((result) => checkStartSync(result));

    return (
        <IngredientsDataContext.Provider
            value={{ ingredients, deleteIngredient, addIngredient, updateIngredient, ingredientsSearchOptions, setIngredientsSearchOptions, ingredientsDataState }}>
            {children}
        </IngredientsDataContext.Provider>
    );
}

export const useIngredients = () => {
  return useContext(IngredientsDataContext);
};