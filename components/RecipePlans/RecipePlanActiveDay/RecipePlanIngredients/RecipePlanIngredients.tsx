//2025-11-17 : Full initial implementation and documentation

//2025-10-29 : Placeholder implementation

import React, {useState} from "react";
import Recipe_Plan, {Plan_Ingredient} from "@/Types/Recipe_Plan";
import Shopping_List_Item from "@/Types/Shopping_List_Item";
import Ingredient from "@/Types/Ingredient";
import PressableComponent from "@/components/CustomComponents/PressableComponent";
import { useIngredients } from "@/Contexts/Ingredients/IngredientsDataProvider";
import { useShoppingList } from "@/Contexts/ShoppingList/ShoppingListDataProvider";
import ListView from "@/components/CustomComponents/ListView";
import { useRecipePlans } from "@/Contexts/RecipePlans/RecipePlansDataProvider";
import LabelText from "@/components/CustomComponents/LabelText";
import ComponentView from "@/components/CustomComponents/ComponentView";

/**
 * React Component for displaying the ingredients of a selected recipe plan
 * Allows attaching ingredients from the ingredient list to the recipe plan ingredients
 * and adding ingredients to the shopping list
 * 
 * Behaviour:
 * - Displays the list of ingredients in the recipe plan
 * - On selecting a recipe plan ingredient, displays the list of available ingredients to attach
 * - On selecting an available ingredient, attaches the selected recipe plan ingredient to it
 * - Provides an option to add the selected recipe plan ingredient to the shopping list
 * 
 * @param recipePlan The recipe plan for which to display ingredients
 * @states selectedPlanIngredientIndex/setSelectedPlanIngredientIndex The index of the selected ingredient in the recipe plan
 * @returns React Component
 */

export default function RecipePlanActiveDayRecipeIngredients({recipePlan}: {recipePlan: Recipe_Plan}) {

    const [selectedPlanIngredientIndex, setSelectedPlanIngredientIndex] = useState<number | null>(null);
    const {ingredients, matchIngredient} = useIngredients();
    const {addShoppingItem} = useShoppingList();
    const {updateRecipePlan} = useRecipePlans();


    const attachPlanIngredient = (ingredient: Ingredient ) => {
        if(selectedPlanIngredientIndex === null || !recipePlan.Plan_Ingredients || !ingredient.Ingredient_ID) return;

        matchIngredient(ingredient, recipePlan.Plan_Ingredients[selectedPlanIngredientIndex], recipePlan);

        const newRecipePlanIngredient = recipePlan.Plan_Ingredients[selectedPlanIngredientIndex || 0];
        newRecipePlanIngredient.Ingredient_ID = ingredient.Ingredient_ID;

        const newRecipePlan = {
            ...recipePlan,
            Plan_Ingredients: recipePlan.Plan_Ingredients.map((ing, index) => index === selectedPlanIngredientIndex ? newRecipePlanIngredient : ing)
        };
        updateRecipePlan(newRecipePlan);
        setSelectedPlanIngredientIndex(null);
    }

    const addToShoppingList = (index: number) => {
        if(!recipePlan.Plan_Ingredients) return;
        const planIngredient : Plan_Ingredient = recipePlan.Plan_Ingredients[index];
        
        const newShoppingListItem : Shopping_List_Item = {
            Item_Name: planIngredient.Ingredient_Name,
            Item_Quantity: planIngredient.Ingredient_Quantity,
            Item_Recipe_Plan_Date: recipePlan.Plan_Date,
            Item_Recipe_Name: recipePlan.Recipe_Name,
            Item_Recipe_Plan_Ingredient: planIngredient.Recipe_Ingredient_ID,
            Item_Recipe_Plan_ID : recipePlan.Plan_ID
        }

        //Add to shopping list context
        addShoppingItem(newShoppingListItem);

        updateRecipePlan({
            ...recipePlan,
            Plan_Ingredients: recipePlan.Plan_Ingredients.map((planIngredient : Plan_Ingredient, index) => {
                if (index === selectedPlanIngredientIndex) {
                    return {
                        ...planIngredient,
                        Item_ID: 1 // Indicate that this ingredient has been added to the shopping list with a placeholder ID
                    } as Plan_Ingredient;
                }
                return planIngredient;
            })
        })
    };

    return (
        <ComponentView>
            <LabelText>Ingredients for {recipePlan.Recipe_Name}</LabelText>
            {/* Implementation for displaying ingredients goes here */}
            {
                recipePlan.Plan_Ingredients?.map((planIngredient, index) => {
                    const indicatorIcon = planIngredient.Ingredient_ID ? '✅' : (planIngredient.Item_ID ? '\u{1F6D2}' : '\u2757');//using the curly braces allows us to use unicode emojis with >4 characters
                    return (
                        <ComponentView key={`plan-ingredient-container-${index}`} style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                            <LabelText>{indicatorIcon} {planIngredient.Ingredient_Name}</LabelText>
                            {
                                !planIngredient.Item_ID && !planIngredient.Ingredient_ID && (
                                <>
                                    <PressableComponent key={`plan-ingredient-${index}`} onPress={() => selectedPlanIngredientIndex !== index && setSelectedPlanIngredientIndex(index)}>
                                            <LabelText>{'\u{1F517}'}</LabelText>
                                        </PressableComponent>
                                        <PressableComponent key={`add-to-shopping-list-${index}`} onPress={() => addToShoppingList(index)}>
                                            <LabelText>{'\u{1F4CB}'}</LabelText>
                                    </PressableComponent>
                                </>
                            )}
                        </ComponentView>
                    )
                })
            }
            {selectedPlanIngredientIndex !== null && (
                <ListView>
                    <LabelText>Available Ingredients:</LabelText>
                    {ingredients.map((ingredient, index) => (
                        <PressableComponent key={`available-ingredient-${index}`} onPress={() => attachPlanIngredient(ingredient)}>
                            <LabelText>{ingredient.Ingredient_Name}</LabelText>
                        </PressableComponent>
                    ))}
                </ListView>
            )}
        </ComponentView>
    );
}