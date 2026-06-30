//2026-06-30 : Text Fix

//2026-06-30 : Improvements to formatting, adding React Icons

//2026-06-01 : Using FadeComponent and ScrollableContainer

//2025-11-21 : Moving common UI elements into their own folder

//2025-11-19 : Renamed RecipePlan/nner to just Planner, Recipe_Plan to just Plan

//2025-11-17 : Full initial implementation and documentation

//2025-10-29 : Placeholder implementation

import React, {useState} from "react";
import Recipe_Plan, {Plan_Ingredient} from "@/Types/Plan";
import Shopping_List_Item from "@/Types/Shopping_List_Item";
import Inventory_Item from "@/Types/Inventory_Item";
import { useInventory } from "@/Contexts/Inventory/InventoryDataProvider";
import { useShoppingList } from "@/Contexts/ShoppingList/ShoppingListDataProvider";
import { usePlans } from "@/Contexts/Plans/PlansDataProvider";
import { FadeComponent, LabelText, PressableComponent, RowContainer, ScrollableContainer, ButtonView} from '@/ui/BestBeforeUI';
import { AddShoppingListItemIcon, InventoryIcon, LinkInventoryItemIcon, ShoppingListIcon, WarningIcon } from "@/ui/ReactIcon";

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
    const {inventory, matchInventoryItem} = useInventory();
    const {addShoppingItem} = useShoppingList();
    const {updatePlan} = usePlans();


    const attachPlanIngredient = (inventoryItem: Inventory_Item ) => {
        if(selectedPlanIngredientIndex === null || !recipePlan.Plan_Ingredients || !inventoryItem.Inventory_Item_ID) return;

        matchInventoryItem(inventoryItem, recipePlan.Plan_Ingredients[selectedPlanIngredientIndex], recipePlan);

        const newRecipePlanIngredient = recipePlan.Plan_Ingredients[selectedPlanIngredientIndex || 0];
        newRecipePlanIngredient.Recipe_Ingredient_ID = inventoryItem.Inventory_Item_ID;

        const newPlan = {
            ...recipePlan,
            Plan_Ingredients: recipePlan.Plan_Ingredients.map((ing, index) => index === selectedPlanIngredientIndex ? newRecipePlanIngredient : ing)
        };
        updatePlan(newPlan);
        setSelectedPlanIngredientIndex(null);
    }

    const addToShoppingList = (index: number) => {
        if(!recipePlan.Plan_Ingredients) return;
        const planIngredient : Plan_Ingredient = recipePlan.Plan_Ingredients[index];
        
        const newShoppingListItem : Shopping_List_Item = {
            Shopping_Item_Name: planIngredient.Recipe_Ingredient_Name,
            Shopping_Item_Quantity: planIngredient.Recipe_Ingredient_Quantity,
            Plan_Date: recipePlan.Plan_Date,
            Plan_Recipe_Name: recipePlan.Recipe_Name,
            Plan_Ingredient_ID: planIngredient.Recipe_Ingredient_ID,
            Plan_ID : recipePlan.Plan_ID
        }

        //Add to shopping list context
        addShoppingItem(newShoppingListItem);

        updatePlan({
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
        <FadeComponent style={{flex:1, padding:10, marginVertical:5, width:"100%", justifyContent: "flex-start", alignItems: "flex-start"}}>
            <LabelText>Ingredients to make {recipePlan.Recipe_Name}</LabelText>
            {/* Implementation for displaying ingredients goes here */}
            <ScrollableContainer style={{flexGrow:1, marginTop:10, width:"100%"}}>
            {
                recipePlan.Plan_Ingredients?.map((planIngredient, index) => {
                    return (
                        <FadeComponent key={`plan-ingredient-container-${index}`} style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: "100%"}}>
                            <RowContainer style={{alignItems: 'center', width: "auto"}}>
                                {planIngredient.Inventory_Item_ID ? 
                                <InventoryIcon /> :
                                planIngredient.Shopping_Item_ID ? 
                                <ShoppingListIcon /> :
                                <WarningIcon />}
                                
                                <LabelText> {planIngredient.Recipe_Ingredient_Name}</LabelText>
                            </RowContainer>
                            {
                                !planIngredient.Shopping_Item_ID && !planIngredient.Inventory_Item_ID && (
                                <RowContainer style={{alignItems: 'center', width: "auto"}}>
                                    <ButtonView style={{marginHorizontal: 5}} key={`plan-ingredient-${index}`} aria-label="attach-inventory-item" onPress={() => selectedPlanIngredientIndex !== index && setSelectedPlanIngredientIndex(index)}>
                                        <LinkInventoryItemIcon />
                                    </ButtonView>
                                    <ButtonView style={{marginHorizontal: 5}} key={`add-to-shopping-list-${index}`} aria-label="add-to-shopping-list" onPress={() => addToShoppingList(index)}>
                                        <AddShoppingListItemIcon />
                                    </ButtonView>
                                </RowContainer>
                            )}
                        </FadeComponent>
                    )
                })
            }
            </ScrollableContainer>
            {selectedPlanIngredientIndex !== null && (
                <ScrollableContainer>
                    <LabelText>Available Ingredients:</LabelText>
                    {inventory.map((inventoryItem, index) => (
                        <PressableComponent key={`available-ingredient-${index}`} onPress={() => attachPlanIngredient(inventoryItem)}>
                            <LabelText>{inventoryItem.Inventory_Item_Name}</LabelText>
                        </PressableComponent>
                    ))}
                </ScrollableContainer>
            )}
        </FadeComponent>
    );
}