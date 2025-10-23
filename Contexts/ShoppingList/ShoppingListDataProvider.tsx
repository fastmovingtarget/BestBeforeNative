//2025-10-23 : Initial Commit

import { createContext, useState, useContext, useEffect } from "react";

import { UpdateState, SyncState } from "@/Types/DataLoadingState";
import { getShoppingListData } from "./GetShoppingList";
import { deleteShoppingListItemData } from "./DeleteShoppingListItem";
import { addShoppingListItemData } from "./AddShoppingListItem";
import { updateShoppingListItemData } from "./UpdateShoppingListItem";

import { useAuthenticationData } from "../Authentication/AuthenticationDataProvider";

import Shopping_List_Item, { ShoppingListSearchOptions } from "@/Types/Shopping_List_Item";

    
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