//2026-10-07 : Pulling inventory list into seperate file
//2026-09-15 : Colours now sourced from ColourProvider
//2026-08-12 : Filter expired items from planner ingredients
//2026-08-11 : improvements to visuals and fixing sync bugs
//2026-06-30 : Text Fix

//2026-06-30 : Improvements to formatting, adding React Icons

//2026-06-01 : Using FadeComponent and ScrollableContainer

//2025-11-21 : Moving common UI elements into their own folder

//2025-11-19 : Renamed RecipePlan/nner to just Planner, Recipe_Plan to just Plan

//2025-11-17 : Full initial implementation and documentation

//2025-10-29 : Placeholder implementation

import {useState, useEffect} from "react";
import {Plan_Ingredient} from "@/Types/Plan";
import Shopping_List_Item from "@/Types/Shopping_List_Item";
import Inventory_Item from "@/Types/Inventory_Item";
import PlannerIngredientsInventoryList from "./PlannerIngredientsInventoryList/PlannerIngredientsInventoryList";
import { useInventory } from "@/Contexts/Inventory/InventoryDataProvider";
import { useShoppingList } from "@/Contexts/ShoppingList/ShoppingListDataProvider";
import { usePlans } from "@/Contexts/Plans/PlansDataProvider";
import { FadeComponent, LabelText, RowContainer, ScrollableContainer, ButtonView, ColumnContainer } from '@/ui/BestBeforeUI';
import { AddShoppingListItemIcon, InventoryIcon, LinkInventoryItemIcon, ShoppingListIcon, WarningIcon } from "@/ui/ReactIcon";
import { SyncState } from "@/Types/DataLoadingState";
import ResizeComponent from "@/ui/ResizeComponent";
import { useColourData } from "@/Contexts/Colours/ColourDataProvider";
import { Keyboard } from "react-native";

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

export default function PlannerIngredients({recipePlanID}: {recipePlanID?: number}) {

    const [selectedPlanIngredientIndex, setSelectedPlanIngredientIndex] = useState<number | null>(null);
    const {matchInventoryItem} = useInventory();
    const {addShoppingItemAsync} = useShoppingList();
    const {updatePlan, setPlansDataState, plans} = usePlans();
    const [containerHeight, setContainerHeight] = useState<number>(0);
    const [keyboardVisible, setKeyboardVisible] = useState<boolean>(false);
    const {colours} = useColourData();
    
    useEffect(() => {
        const showListener = Keyboard.addListener('keyboardDidShow', () => {
            setKeyboardVisible(true);
        });
        const hideListener = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardVisible(false);
        });

        return () => {
            showListener.remove();
            hideListener.remove();
        };
    }, []);

    if(!recipePlanID && recipePlanID !== 0) {
        return (
            <FadeComponent style={{flex:1, padding:10, marginVertical:5, width:"100%", justifyContent: "flex-start", alignItems: "flex-start"}}>
                <LabelText>No Recipe Plan Selected</LabelText>
            </FadeComponent>
        );
    }

    const attachPlanIngredient = (inventoryItem: Inventory_Item ) => {
        const recipePlan = plans.find(plan => plan.Plan_ID === recipePlanID);
        if(selectedPlanIngredientIndex === null || !recipePlan || !recipePlan.Plan_Ingredients || !inventoryItem.Inventory_Item_ID) return;

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
        const recipePlan = plans.find(plan => plan.Plan_ID === recipePlanID);
        if(!recipePlan || !recipePlan.Plan_Ingredients) return;
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
        addShoppingItemAsync(newShoppingListItem).then((result) => {
            updatePlan({
                ...recipePlan,
                Plan_Ingredients: recipePlan.Plan_Ingredients?.map((planIngredient : Plan_Ingredient, index) => {
                    if (index === selectedPlanIngredientIndex) {
                        return {
                            ...planIngredient,
                            Item_ID: 1 // Indicate that this ingredient has been added to the shopping list with a placeholder ID
                        } as Plan_Ingredient;
                    }
                    return planIngredient;
                })
            })
            setPlansDataState(SyncState.Loading);
        });

    };

    return (
        <ColumnContainer style={{ flex: 1, width: "100%"}}>
            <ColumnContainer style={{flex:1, marginVertical:5, width:"100%", justifyContent: "flex-start", alignItems: "flex-start"}} onLayout={(event) => setContainerHeight(event.nativeEvent.layout.height || 0)}>
                <ResizeComponent targetHeight={(containerHeight - 10)*(selectedPlanIngredientIndex === null ? 1 : keyboardVisible ? 0 : 0.4)} style={{ width: "100%", borderWidth: 1, borderColor: colours.primary}} aria-label="planner-ingredients-container">
                    <LabelText>Ingredients to make {plans.find(plan => plan.Plan_ID === recipePlanID)?.Recipe_Name}</LabelText>
                    {/* Implementation for displaying ingredients goes here */}
                        <ScrollableContainer style={{flexGrow:1, marginTop:10, width:"100%",}}>
                        {
                            plans.find(plan => plan.Plan_ID === recipePlanID)?.Plan_Ingredients?.map((planIngredient, index) => {
                                return (
                                    
                                    <FadeComponent key={`plan-ingredient-container-${index}`} style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: "100%"}}>
                                        <RowContainer style={{alignItems: 'center', width: !planIngredient.Shopping_Item_ID && !planIngredient.Inventory_Item_ID ? "auto" : "100%"}}>
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
                                            <ButtonView style={{marginHorizontal: 5}} key={`plan-ingredient-${index}`} aria-label="attach-inventory-item" onPress={() => {
                                                    if(selectedPlanIngredientIndex === index) return;
                                                    setSelectedPlanIngredientIndex(index)
                                                }}>
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
                </ResizeComponent>
            {selectedPlanIngredientIndex !== null && (
                <PlannerIngredientsInventoryList
                    selectedPlanIngredientIndex={selectedPlanIngredientIndex}
                    setSelectedPlanIngredientIndex={setSelectedPlanIngredientIndex}
                    attachPlanIngredient={attachPlanIngredient}
                    ingredientName={selectedPlanIngredientIndex !== null ? plans.find(plan => plan.Plan_ID === recipePlanID)?.Plan_Ingredients?.[selectedPlanIngredientIndex]?.Recipe_Ingredient_Name || "" : ''}
                />
            )}
            </ColumnContainer>
        </ColumnContainer>
    );
}