//2025-11-19 : Renamed Ingredients to Inventory

//2025-11-10 : Added matchIngredient, documentation

//2025-10-22 : Failed sync triggers retry after a cooldown period

//2025-10-20 : Separated ingredients data provider

import { useState, createContext, useContext, useEffect  } from "react";

import Inventory_Item, { InventorySearchOptions } from "@/Types/Inventory_Item";
import { UpdateState, SyncState } from "@/Types/DataLoadingState";

import { getInventoryData } from "./GetInventory";
import { deleteInventoryItemData } from "./DeleteInventoryItem";
import { addInventoryItemData } from "./AddInventoryItem";
import { updateInventoryItemData } from "./UpdateInventoryItem";

import { useAuthenticationData } from "@/Contexts/Authentication/AuthenticationDataProvider";
import Plan, { Plan_Ingredient } from "@/Types/Plan";

/**
 * Inventory Data Context
 * Provides data and operations to manage the inventory.
 * Calling alteration functions will trigger a change to the inventoryDataState,
 * which will cause a re-fetch of the inventory data.
 * 
 * If getInventoryData fails, a retry will be attempted after 5 seconds.
 * If any of the alteration functions fail, the inventoryDataState will be set to the respective failure state, but no retry will occur.
 * 
 * @context InventoryDataContext
 * @return {Inventory_Item[]} inventory - List of inventory items, state.
 * @return {function} deleteInventoryItem - Function to delete an inventory item by ID.
 * @return {function} addInventoryItem - Function to add a new inventory item.
 * @return {function} updateInventoryItem - Function to update an existing inventory item.
 * @return {function} matchInventoryItem - Function to match an inventory item with a plan ingredient and recipe plan.
 * @return {InventorySearchOptions} inventorySearchOptions - Current search options for filtering inventory items.
 * @return {function} setInventorySearchOptions - Function to update search options.
 * @return {SyncState | UpdateState} inventoryDataState - Current state of inventory data loading or updating.
 */

const InventoryDataContext = createContext({
    inventory: [] as Inventory_Item[],
    deleteInventoryItem: (inventoryItemID: number) => {},
    addInventoryItem: (inventoryItem: Inventory_Item) => {},
    updateInventoryItem: (inventoryItem: Inventory_Item) => {},
    matchInventoryItem: (inventoryItem: Inventory_Item, planIngredient: Plan_Ingredient, plan: Plan) => {},
    inventorySearchOptions: {} as InventorySearchOptions,
    setInventorySearchOptions: (options: InventorySearchOptions) => {},
    inventoryDataState: SyncState.Loading as SyncState | UpdateState,
});

export const InventoryDataProvider = ({children}:{children:React.ReactNode}) => {
    const [inventory, setInventory] = useState<Inventory_Item[]>([]);
    const [inventorySearchOptions, setInventorySearchOptionsState] = useState<InventorySearchOptions>({})
    const [inventoryDataState, setInventoryDataState] = useState<SyncState | UpdateState>(SyncState.Loading)

    const {userId} = useAuthenticationData();

    useEffect(() => {
        if(inventoryDataState === SyncState.Loading && userId){
            getInventoryData(userId, setInventory, inventorySearchOptions).then((result) => {
                setInventoryDataState(result)
            });
        }
        if(inventoryDataState === SyncState.Failed && userId){
            setTimeout(() => {
                setInventoryDataState(SyncState.Loading);
            }, 5000);
        }
    }, [inventoryDataState, userId, inventorySearchOptions]);

    const checkStartSync = (updateState : UpdateState) => {
        if(updateState === UpdateState.Successful){
            setInventoryDataState(SyncState.Loading);
        }
        else{
            setInventoryDataState(updateState);
        }
        return updateState;
    }

    const setInventorySearchOptions = (options: InventorySearchOptions) => {setInventorySearchOptionsState((oldOptions) => {return {...oldOptions, ...options}}); checkStartSync(UpdateState.Successful);};
    const deleteInventoryItem = (inventoryItemID: number) => deleteInventoryItemData(inventory, setInventory, inventoryItemID).then((result) => checkStartSync(result));
    const addInventoryItem = (inventoryItem: Inventory_Item) => addInventoryItemData(userId, inventory, setInventory, inventoryItem).then((result) => checkStartSync(result));
    const updateInventoryItem = (inventoryItem: Inventory_Item) => updateInventoryItemData(inventory, setInventory, inventoryItem).then((result) => checkStartSync(result));

    /**
     * Matches an inventory item with a plan ingredient and recipe plan.
     * if the inventory item has exactly the same quantity as the plan ingredient, it is updated with the recipe plan details.
     * if the inventory item has more quantity than the plan ingredient, it is updated with the plan ingredient quantity and recipe plan details,
     * and a new inventory item is created with the leftover quantity.
     * if the inventory item does not exist, returns a failed update state.
     * 
     * if the addition of the leftover inventory item fails, the inventoryDataState is set to Failed and no update is attempted.
     * 
     * @param inventoryItem - The inventory item to match.
     * @param planIngredient - The plan ingredient to match against.
     * @param plan - The plan associated with the plan ingredient.
     * @return {UpdateState} - The result of the match operation.
     */
    const matchInventoryItem = (inventoryItem: Inventory_Item, planIngredient: Plan_Ingredient, plan: Plan) => {
        const existingInventoryItem = inventory.find((item) => item.Inventory_Item_ID === inventoryItem.Inventory_Item_ID);
        if(existingInventoryItem){            
            //assign the inventory item a plan, plan id, and plan id
            const newInventoryItem : Inventory_Item = {
                ...existingInventoryItem,
                Plan_Ingredient_ID: planIngredient.Recipe_Ingredient_ID,
                Plan_Recipe_ID: plan.Recipe_ID,
                Plan_ID: plan.Plan_ID,
            }
            
            if((existingInventoryItem.Inventory_Item_Quantity || 0) > planIngredient.Recipe_Ingredient_Quantity){//if there's some initial inventory item left over
                newInventoryItem.Inventory_Item_Quantity = planIngredient.Recipe_Ingredient_Quantity;
                //create a new inventory item with the leftover quantity
                const leftoverInventoryItem : Inventory_Item = {
                    ...existingInventoryItem,
                    Inventory_Item_ID: undefined,
                    Inventory_Item_Quantity: (existingInventoryItem.Inventory_Item_Quantity || 0) - planIngredient.Recipe_Ingredient_Quantity,
                }
                addInventoryItemData(userId, inventory, setInventory, leftoverInventoryItem).then(//we add the inventory item first, but wait for the result before updating the original inventory item
                    //avoid triggering getInventory until the second update is done
                    (result) => {
                        if(result === UpdateState.Failed){
                            // Handle failed addition of leftover inventory item
                            setInventoryDataState(UpdateState.Failed);
                            return UpdateState.Failed;
                        }
                        else{
                            updateInventoryItem(newInventoryItem);
                        }
                    }
                );
            }
            else
                updateInventoryItem(newInventoryItem);
        }
        else{
            return UpdateState.Failed;
        }
        return UpdateState.Successful;
    }

    return (
        <InventoryDataContext.Provider
            value={{ 
                inventory, 
                deleteInventoryItem, 
                addInventoryItem, 
                updateInventoryItem, 
                matchInventoryItem, 
                inventorySearchOptions, 
                setInventorySearchOptions, 
                inventoryDataState 
            }}>
            {children}
        </InventoryDataContext.Provider>
    );
}

export const useInventory = () => {
  return useContext(InventoryDataContext);
};