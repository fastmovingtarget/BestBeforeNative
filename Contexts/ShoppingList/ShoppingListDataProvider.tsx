//2025-11-10 : Added improved documentation

//2025-10-23 : Initial Commit

import { createContext, useState, useContext, useEffect } from "react";

import { UpdateState, SyncState } from "@/Types/DataLoadingState";
import { getShoppingListData } from "./GetShoppingList";
import { deleteShoppingListItemData } from "./DeleteShoppingListItem";
import { addShoppingListItemData } from "./AddShoppingListItem";
import { updateShoppingListItemData } from "./UpdateShoppingListItem";

import { useAuthenticationData } from "../Authentication/AuthenticationDataProvider";

import Shopping_List_Item, { ShoppingListSearchOptions } from "@/Types/Shopping_List_Item";

/**
 * Shopping List Data Context
 * Provides shopping list data and operations to manage shopping list items.
 * Calling alteration functions will trigger a change to the shoppingListDataState,
 * which will cause a re-fetch of the shopping list data.
 * If getShoppingListData fails, a retry will be attempted after 5 seconds.
 * If any of the alteration functions fail, the shoppingListDataState will be set to the respective failure state, but no retry will occur.
 * @context ShoppingListDataContext
 * @return {Shopping_List_Item[]} shoppingList - List of shopping list items, state.
 * @return {function} deleteShoppingItem - Function to delete a shopping list item by ID.
 * @return {function} addShoppingItem - Function to add a new shopping list item.
 * @return {function} updateShoppingItem - Function to update an existing shopping list item.
 * @return {ShoppingListSearchOptions} shoppingListSearchOptions - Current search options for filtering shopping list items.
 * @return {function} setShoppingListSearchOptions - Function to update search options.
 * @return {SyncState | UpdateState} shoppingListDataState - Current state of shopping list data loading or updating.
 */
    
const ShoppingListDataContext = createContext({
    shoppingList: [] as Shopping_List_Item[],
    deleteShoppingItem: (itemID: number) => {},
    addShoppingItem: (item: Shopping_List_Item) => {},
    updateShoppingItem: (item: Shopping_List_Item) => {},
    shoppingListSearchOptions: {} as ShoppingListSearchOptions,
    setShoppingListSearchOptions: (options: ShoppingListSearchOptions) => {},
    shoppingListDataState: SyncState.Loading as SyncState | UpdateState,
});

export const ShoppingListDataProvider = ({children}:{children:React.ReactNode}) => {
    const [shoppingList, setShoppingList] = useState<Shopping_List_Item[]>([])
    const [shoppingListSearchOptions, setShoppingListSearchOptionsState] = useState<ShoppingListSearchOptions>({})
    const [shoppingListDataState, setShoppingListDataState] = useState<UpdateState | SyncState>(SyncState.Loading)

    const {userId} = useAuthenticationData();
    
    useEffect(() => {
        if(shoppingListDataState === SyncState.Loading && userId){
            getShoppingListData(userId, setShoppingList, shoppingListSearchOptions).then((result) => setShoppingListDataState(result));
        }
        if(shoppingListDataState === SyncState.Failed && userId){
            setTimeout(() => {
                setShoppingListDataState(SyncState.Loading);
            }, 5000);
        }
    }, [shoppingListDataState, userId, shoppingListSearchOptions]);

    const checkStartSync = (updateState : UpdateState) => {
        if(updateState === UpdateState.Successful){
            setShoppingListDataState(SyncState.Loading);
        } else{
            setShoppingListDataState(updateState);
        }
    }

    const setShoppingListSearchOptions = (options: ShoppingListSearchOptions) => {setShoppingListSearchOptionsState((oldOptions) => {return {...oldOptions, ...options}}); checkStartSync(UpdateState.Successful);};
    const deleteShoppingItem = (itemID: number) => deleteShoppingListItemData(shoppingList, setShoppingList, itemID).then((result) => checkStartSync(result));
    const addShoppingItem = (item: Shopping_List_Item) => addShoppingListItemData(userId, shoppingList, setShoppingList, item).then((result) => checkStartSync(result));
    const updateShoppingItem = (item: Shopping_List_Item) => updateShoppingListItemData(shoppingList, setShoppingList, item).then((result) => checkStartSync(result));

    return (
        <ShoppingListDataContext.Provider
            value={{ shoppingList, deleteShoppingItem, addShoppingItem, updateShoppingItem, shoppingListSearchOptions, setShoppingListSearchOptions, shoppingListDataState }}>
            {children}
        </ShoppingListDataContext.Provider>
    )
}

export const useShoppingList = () => {
  return useContext(ShoppingListDataContext);
};


export interface ShoppingListDataStruct {
    shoppingList: Shopping_List_Item[];
    addShoppingItem: (item: Shopping_List_Item) => void;
    updateShoppingItem: (item: Shopping_List_Item) => void;
    deleteShoppingItem: (itemID: number) => void;
    shoppingListSearchOptions: ShoppingListSearchOptions;
    shoppingListDataState: SyncState | UpdateState;
    setShoppingListSearchOptions: (options: ShoppingListSearchOptions) => void;
}