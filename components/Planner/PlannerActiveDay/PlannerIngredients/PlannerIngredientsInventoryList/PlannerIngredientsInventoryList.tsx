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

import React, {useState} from "react";
import Inventory_Item from "@/Types/Inventory_Item";
import { useInventory } from "@/Contexts/Inventory/InventoryDataProvider";
import { FadeComponent, LabelText, PressableComponent, RowContainer, ScrollableContainer, ButtonView, ColumnContainer, FormTextInput} from '@/ui/BestBeforeUI';
import { useColourData } from "@/Contexts/Colours/ColourDataProvider";

type PlannerIngredientsInventoryListProps = {
    selectedPlanIngredientIndex: number | null, 
    setSelectedPlanIngredientIndex: React.Dispatch<React.SetStateAction<number | null>>,
    attachPlanIngredient: (inventoryItem: Inventory_Item) => void
    ingredientName: string
};

/**
 * PlannerIngredientsInventoryList Component
 * Displays a list of available inventory items that can be linked to a selected plan ingredient.
 * Allows searching and filtering of inventory items.
 * Props:
 * - selectedPlanIngredientIndex: Index of the currently selected plan ingredient
 * - setSelectedPlanIngredientIndex: Function to update the selected plan ingredient index
 * - attachPlanIngredient: Function to attach an inventory item to the selected plan ingredient
 * - ingredientName: Name of the selected plan ingredient
 */
export default function PlannerIngredientsInventoryList({   
        setSelectedPlanIngredientIndex, 
        attachPlanIngredient,
        ingredientName
    }: PlannerIngredientsInventoryListProps) {

    const {inventory} = useInventory();
    const [filteredInventory, setFilteredInventory] = useState<Inventory_Item[]>(inventory.filter(inventoryItem => {
        if(inventoryItem?.Inventory_Item_Date && new Date(inventoryItem.Inventory_Item_Date) < new Date()) {
            return false; // Exclude expired items
        }
        return true;
    }));
    const {colours} = useColourData();
    
    const onIngredientSearchChange = (text: string) => {
        const filtered = inventory.filter(inventoryItem => {
            if(inventoryItem?.Inventory_Item_Date && new Date(inventoryItem.Inventory_Item_Date) < new Date()) {
                return false; // Exclude expired items
            }
            return inventoryItem?.Inventory_Item_Name?.toLowerCase().includes(text.toLowerCase());
        });
        setFilteredInventory(filtered);
    }

    return (
        <ColumnContainer style={{flex:1, marginTop: 10, width:"100%", justifyContent: "flex-start", alignItems: "flex-start", borderWidth: 1, borderRadius: 10, borderColor: colours.primary}} aria-label="available-ingredients-container">
            <LabelText style={{width: "100%", textAlign: "center"}}>Linkable Ingredients:</LabelText>
            <FadeComponent style={{width: "100%", marginTop: 10, padding: 5}}>
                <RowContainer style={{width: "100%", justifyContent: "space-between", alignItems: "center"}}>
                    <FormTextInput 
                        defaultValue={ingredientName || ""}
                        placeholder="Search Ingredients..."
                        aria-label='available-ingredients-search'
                        onChangeText={(text) => {
                            onIngredientSearchChange(text);
                        }}
                        />
                </RowContainer>
            </FadeComponent>
            <ScrollableContainer >
            {
                filteredInventory.map((inventoryItem, index) => {
                    if (index % 2 === 1) return null;
                    return (
                        <RowContainer key={`available-ingredient-row-${index}`} style={{flexDirection: 'row', justifyContent: 'space-between', width: "100%", padding: 0}}>
                            <PressableComponent 
                                key={`available-ingredient-${index}`} 
                                onPress={() => attachPlanIngredient(filteredInventory[index])} 
                                style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: "49%", marginVertical: 5, borderWidth: 1, borderColor: "black", margin: 0, flexGrow: 0}}
                                aria-label={`available-ingredient-${index}`}>
                                <LabelText>{filteredInventory[index]?.Inventory_Item_Name}</LabelText>
                            </PressableComponent>
                            {index + 1 < filteredInventory.length && (
                                <PressableComponent 
                                    key={`available-ingredient-${index + 1}`} 
                                    onPress={() => attachPlanIngredient(filteredInventory[index + 1])} 
                                    style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: "49%", marginVertical: 5, borderWidth: 1, borderColor: "black", margin: 0, flexGrow: 0}} 
                                    aria-label={`available-ingredient-${index + 1}`}>
                                    <LabelText>{filteredInventory[index + 1]?.Inventory_Item_Name}</LabelText>
                                </PressableComponent>
                            )}
                        </RowContainer>
                    )
                })
            }
            </ScrollableContainer>
            <ButtonView style={{marginTop: 10, width: "100%"}} onPress={() => setSelectedPlanIngredientIndex(null)}>
                <LabelText>Close</LabelText>
            </ButtonView>
        </ColumnContainer>
    );
}