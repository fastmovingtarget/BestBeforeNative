//2025-11-10 : Added matchIngredient, documentation

//2025-10-22 : Failed sync triggers retry after a cooldown period

//2025-10-20 : Separated ingredients data provider

import { useState, createContext, useContext, useEffect  } from "react";

import Ingredient, { IngredientSearchOptions } from "@/Types/Ingredient";
import { UpdateState, SyncState } from "@/Types/DataLoadingState";

import { getIngredientsData } from "./GetIngredients";
import { deleteIngredientData } from "./DeleteIngredient";
import { addIngredientData } from "./AddIngredient";
import { updateIngredientData } from "./UpdateIngredient";

import { useAuthenticationData } from "@/Contexts/Authentication/AuthenticationDataProvider";
import Recipe_Plan, { Plan_Ingredient } from "@/Types/Recipe_Plan";

/**
 * Ingredients Data Context
 * Provides ingredient data and operations to manage ingredients.
 * Calling alteration functions will trigger a change to the ingredientsDataState,
 * which will cause a re-fetch of the ingredients data.
 * 
 * If getIngredientsData fails, a retry will be attempted after 5 seconds.
 * If any of the alteration functions fail, the ingredientsDataState will be set to the respective failure state, but no retry will occur.
 * 
 * @context IngredientsDataContext
 * @return {Ingredient[]} ingredients - List of ingredients, state.
 * @return {function} deleteIngredient - Function to delete an ingredient by ID.
 * @return {function} addIngredient - Function to add a new ingredient.
 * @return {function} updateIngredient - Function to update an existing ingredient.
 * @return {function} matchIngredient - Function to match an ingredient with a plan ingredient and recipe plan.
 * @return {IngredientSearchOptions} ingredientsSearchOptions - Current search options for filtering ingredients.
 * @return {function} setIngredientsSearchOptions - Function to update search options.
 * @return {SyncState | UpdateState} ingredientsDataState - Current state of ingredient data loading or updating.
 */

const IngredientsDataContext = createContext({
    ingredients: [] as Ingredient[],
    deleteIngredient: (ingredientID: number) => {},
    addIngredient: (ingredient: Ingredient) => {},
    updateIngredient: (ingredient: Ingredient) => {},
    matchIngredient: (ingredient: Ingredient, planIngredient: Plan_Ingredient, recipePlan: Recipe_Plan) => {},
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
        if(ingredientsDataState === SyncState.Loading && userId){
            getIngredientsData(userId, setIngredients, ingredientsSearchOptions).then((result) => {
                setIngredientsDataState(result)
            });
        }
        if(ingredientsDataState === SyncState.Failed && userId){
            setTimeout(() => {
                setIngredientsDataState(SyncState.Loading);
            }, 5000);
        }
    }, [ingredientsDataState, userId, ingredientsSearchOptions]);

    const checkStartSync = (updateState : UpdateState) => {
        if(updateState === UpdateState.Successful){
            setIngredientsDataState(SyncState.Loading);
        }
        else{
            setIngredientsDataState(updateState);
        }
        return updateState;
    }

    const setIngredientsSearchOptions = (options: IngredientSearchOptions) => {setIngredientsSearchOptionsState((oldOptions) => {return {...oldOptions, ...options}}); checkStartSync(UpdateState.Successful);};
    const deleteIngredient = (ingredientID: number) => deleteIngredientData(ingredients, setIngredients, ingredientID).then((result) => checkStartSync(result));
    const addIngredient = (ingredient: Ingredient) => addIngredientData(userId, ingredients, setIngredients, ingredient).then((result) => checkStartSync(result));
    const updateIngredient = (ingredient: Ingredient) => updateIngredientData(ingredients, setIngredients, ingredient).then((result) => checkStartSync(result));

    /**
     * Matches an ingredient with a plan ingredient and recipe plan.
     * if the ingredient has exactly the same quantity as the plan ingredient, it is updated with the recipe plan details.
     * if the ingredient has more quantity than the plan ingredient, it is updated with the plan ingredient quantity and recipe plan details,
     * and a new ingredient is created with the leftover quantity.
     * if the ingredient does not exist, returns a failed update state.
     * 
     * if the addition of the leftover ingredient fails, the ingredientsDataState is set to Failed and no update is attempted.
     * 
     * @param ingredient - The ingredient to match.
     * @param planIngredient - The plan ingredient to match against.
     * @param recipePlan - The recipe plan associated with the plan ingredient.
     * @return {UpdateState} - The result of the match operation.
     */
    const matchIngredient = (ingredient: Ingredient, planIngredient: Plan_Ingredient, recipePlan: Recipe_Plan) => {
        const existingIngredient = ingredients.find((ing) => ing.Ingredient_ID === ingredient.Ingredient_ID);
        if(existingIngredient){            
            //assign the ingredient a recipe plan, recipe id, and plan id
            const newIngredient : Ingredient = {
                ...existingIngredient,
                Recipe_Ingredient_ID: planIngredient.Recipe_Ingredient_ID,
                Recipe_ID: recipePlan.Recipe_ID,
                Plan_ID: recipePlan.Plan_ID,
            }
            
            if((existingIngredient.Ingredient_Quantity || 0) > planIngredient.Ingredient_Quantity){//if there's some initial ingredient left over
                newIngredient.Ingredient_Quantity = planIngredient.Ingredient_Quantity;
                //create a new ingredient with the leftover quantity
                const leftoverIngredient : Ingredient = {
                    ...existingIngredient,
                    Ingredient_ID: undefined,
                    Ingredient_Quantity: (existingIngredient.Ingredient_Quantity || 0) - planIngredient.Ingredient_Quantity,
                }
                addIngredientData(userId, ingredients, setIngredients, leftoverIngredient).then(//we add the ingredient first, but wait for the result before updating the original ingredient
                    //avoid triggering getIngredients until the second update is done
                    (result) => {
                        if(result === UpdateState.Failed){
                            // Handle failed addition of leftover ingredient
                            setIngredientsDataState(UpdateState.Failed);
                            return UpdateState.Failed;
                        }
                        else{
                            updateIngredient(newIngredient);
                        }
                    }
                );
            }
            else
                updateIngredient(newIngredient);
        }
        else{
            return UpdateState.Failed;
        }
        return UpdateState.Successful;
    }

    return (
        <IngredientsDataContext.Provider
            value={{ 
                ingredients, 
                deleteIngredient, 
                addIngredient, 
                updateIngredient, 
                matchIngredient, 
                ingredientsSearchOptions, 
                setIngredientsSearchOptions, 
                ingredientsDataState 
            }}>
            {children}
        </IngredientsDataContext.Provider>
    );
}

export const useIngredients = () => {
  return useContext(IngredientsDataContext);
};