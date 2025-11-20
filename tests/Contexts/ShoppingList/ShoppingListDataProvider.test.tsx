//2025-11-20 : Shifting test files into their own folder in the hierarchy

//2025-11-19 : Item_(...) now have Shopping_ Prefix

//2025-10-23 : Initial Commit

import { render, waitFor, userEvent } from "@testing-library/react-native";
import { Pressable, Text, View } from "react-native";
import { SyncState, UpdateState } from "@/Types/DataLoadingState";

import { updateShoppingListItemData } from '@/Contexts/ShoppingList/UpdateShoppingListItem';
import { deleteShoppingListItemData } from "@/Contexts/ShoppingList/DeleteShoppingListItem";
import { addShoppingListItemData } from "@/Contexts/ShoppingList/AddShoppingListItem";
import { getShoppingListData } from "@/Contexts/ShoppingList/GetShoppingList";
import { ShoppingListDataProvider, useShoppingList } from "@/Contexts/ShoppingList/ShoppingListDataProvider";

import Shopping_List_Item from '@/Types/Shopping_List_Item';

jest.mock("@/Contexts/ShoppingList/GetShoppingList", () =>{
    return {
        __esModule: true,
        getShoppingListData: jest.fn(),
    }
});

jest.mock("@/Contexts/ShoppingList/DeleteShoppingListItem", () =>{
    return {
        __esModule: true,
        deleteShoppingListItemData: jest.fn(),
    }
});
jest.mock("@/Contexts/ShoppingList/AddShoppingListItem", () =>{
    return {
        __esModule: true,
        addShoppingListItemData: jest.fn(),
    }
});
jest.mock("@/Contexts/ShoppingList/UpdateShoppingListItem", () =>{
    return {
        __esModule: true,
        updateShoppingListItemData: jest.fn(),
    }
});

const mockShoppingList : Shopping_List_Item[] = [
    {
        Shopping_Item_ID: 1,
        Shopping_Item_Name: 'Item 1',
        Shopping_Item_Quantity: 1,
    },
    {
        Shopping_Item_ID: 2,
        Shopping_Item_Name: 'Item 2',
        Shopping_Item_Quantity: 2,
    },
];

beforeEach(() => {
    jest.resetAllMocks();

    (getShoppingListData as jest.Mock).mockImplementation(
        (userId: number, setShoppingList: (items: Shopping_List_Item[]) => void, searchOptions: any) => {
            let returnPromise = new Promise<SyncState>((resolve) => {
                setShoppingList(mockShoppingList);
                resolve(SyncState.Successful);
            });
            return returnPromise;
        }
    );
    (addShoppingListItemData as jest.Mock).mockImplementation(
        (userId: number, currentList: Shopping_List_Item[], setShoppingList: (items: Shopping_List_Item[]) => void, itemToAdd: Shopping_List_Item) => {
            let returnPromise = new Promise<UpdateState>((resolve) => {
                setShoppingList([...currentList, {...itemToAdd, Shopping_Item_ID: 3}]);
                resolve(UpdateState.Successful);
            });
            return returnPromise;
        }
    );
    (deleteShoppingListItemData as jest.Mock).mockImplementation(
        (currentList: Shopping_List_Item[], setShoppingList: (items: Shopping_List_Item[]) => void, itemID: number) => {
            let returnPromise = new Promise<UpdateState>((resolve) => {
                setShoppingList(currentList.filter(item => item.Shopping_Item_ID !== itemID));
                resolve(UpdateState.Successful);
            });
            return returnPromise;
        }
    );
    (updateShoppingListItemData as jest.Mock).mockImplementation(
        (currentList: Shopping_List_Item[], setShoppingList: (items: Shopping_List_Item[]) => void, itemToUpdate: Shopping_List_Item) => {
            let returnPromise = new Promise<UpdateState>((resolve) => {
                setShoppingList(currentList.map(item => item.Shopping_Item_ID === itemToUpdate.Shopping_Item_ID ? itemToUpdate : item));
                resolve(UpdateState.Successful);
            });
            return returnPromise;
        }
    );
});

describe("ShoppingListDataProvider get", () => {
    test("should fetch shopping list data on load", async () => {
        /*Arrange *******************************************************************/
        const TestComponent = () => {
            const {shoppingList, shoppingListDataState} = useShoppingList();
            return (
                <View>
                    <Text >{shoppingListDataState}</Text>
                    <Text >{JSON.stringify(shoppingList)}</Text>
                </View>
            )
        };

        /*Act **********************************************************************/
        const {getByText} = render(
            <ShoppingListDataProvider>
                <TestComponent />
            </ShoppingListDataProvider>
        );
        /*Assert *******************************************************************/
        await waitFor(() => {
            expect(getByText(SyncState.Successful)).toBeTruthy();
        });

        expect(getByText(/"Shopping_Item_ID":1/i)).toBeTruthy();
        expect(getByText(/"Shopping_Item_ID":2/i)).toBeTruthy();
        expect(getByText(/"Shopping_Item_Name":"Item 1"/i)).toBeTruthy();
        expect(getByText(/"Shopping_Item_Name":"Item 2"/i)).toBeTruthy();
        expect(getByText(/"Shopping_Item_Quantity":1/i)).toBeTruthy();
        expect(getByText(/"Shopping_Item_Quantity":2/i)).toBeTruthy();
    });
    test("should not update state if fetch fails", async () => {
        /*Arrange *******************************************************************/
        jest.useFakeTimers();
        const TestComponent = () => {
            const {shoppingList, shoppingListDataState} = useShoppingList();
            return (
                <View>
                    <Text >{shoppingListDataState}</Text>
                    <Text >{JSON.stringify(shoppingList)}</Text>
                </View>
            )
        };
        (getShoppingListData as jest.Mock).mockImplementationOnce(
            (userId: number, setShoppingList: (items: Shopping_List_Item[]) => void, searchOptions: any) => {
                let returnPromise = new Promise<SyncState>((resolve) => {
                    resolve(SyncState.Failed);
                });
                return returnPromise;
            }
        );
        /*Act **********************************************************************/
        const {getByText} = render(
            <ShoppingListDataProvider>
                <TestComponent />
            </ShoppingListDataProvider>
        );
        /*Assert *******************************************************************/
        await waitFor(() => {
            expect(getByText(SyncState.Failed)).toBeTruthy();
        });

        /*Assert 2 *******************************************************************/
        await waitFor(() => {
            jest.runAllTimers();
            expect(getByText(SyncState.Successful)).toBeTruthy();
        });
    });
})
describe("ShoppingListDataProvider on add", () => {
    test("should add shopping list item and update state", async () => {
        /*Arrange *******************************************************************/
        jest.useFakeTimers();
        const user = userEvent.setup();
        const newItem : Shopping_List_Item = {
            Shopping_Item_Name: 'Item 3',
            Shopping_Item_Quantity: 3,
        };
        const TestComponent = () => {
            const {shoppingList, addShoppingItem, shoppingListDataState} = useShoppingList();
            return (
                <View>
                    <Text >{shoppingListDataState}</Text>
                    <Pressable onPress={() => addShoppingItem(newItem)}>
                        <Text>Add Item</Text>
                    </Pressable>
                    <Text >{JSON.stringify(shoppingList)}</Text>
                </View>
            )
        };
        /*Act **********************************************************************/
        const {getByText} = render(
            <ShoppingListDataProvider>
                <TestComponent />
            </ShoppingListDataProvider>
        );
        await waitFor(() => {
            expect(getByText(SyncState.Successful)).toBeTruthy();
        });

        (getShoppingListData as jest.Mock).mockImplementationOnce(//this will be called after adding, a failed get should allow us to see the added item without overwriting, then sync again after a timeout
            (userId: number, setShoppingList: (items: Shopping_List_Item[]) => void, searchOptions: any) => {
                let returnPromise = new Promise<SyncState>((resolve) => {
                    resolve(SyncState.Failed);
                });
                return returnPromise;
            }
        );

        await user.press(getByText("Add Item"));
        /*Assert *******************************************************************/
        await waitFor(() => {
            expect(addShoppingListItemData).toHaveBeenCalled();
        });

        expect(getByText(/"Shopping_Item_ID":3/i)).toBeTruthy();
        expect(getByText(/"Shopping_Item_Name":"Item 3"/i)).toBeTruthy();
        expect(getByText(/"Shopping_Item_Quantity":3/i)).toBeTruthy();
        expect(getByText(SyncState.Failed)).toBeTruthy();

        /*Assert 2 *******************************************************************/
        await waitFor(() => {
            jest.runAllTimers();
            expect(getByText(SyncState.Successful)).toBeTruthy();
        });
    });
    test("should not update state if add fails", async () => {
        /*Arrange *******************************************************************/
        const user = userEvent.setup();
        const newItem : Shopping_List_Item = {
            Shopping_Item_Name: 'Item 3',
            Shopping_Item_Quantity: 3,
        };
        const TestComponent = () => {
            const {shoppingList, addShoppingItem, shoppingListDataState} = useShoppingList();
            return (
                <View>
                    <Text >{shoppingListDataState}</Text>
                    <Pressable onPress={() => addShoppingItem(newItem)}>
                        <Text>Add Item</Text>
                    </Pressable>
                    <Text >{JSON.stringify(shoppingList)}</Text>
                </View>
            )
        };
        (addShoppingListItemData as jest.Mock).mockImplementationOnce(
            (userId: number, currentList: Shopping_List_Item[], setShoppingList: (items: Shopping_List_Item[]) => void, itemToAdd: Shopping_List_Item) => {
                let returnPromise = new Promise<UpdateState>((resolve) => {
                    resolve(UpdateState.Failed);
                });
                return returnPromise;
            }
        );
        /*Act **********************************************************************/
        const {getByText, queryByText} = render(
            <ShoppingListDataProvider>
                <TestComponent />
            </ShoppingListDataProvider>
        );
        await waitFor(() => {
            expect(getByText(SyncState.Successful)).toBeTruthy();
        });
        await user.press(getByText("Add Item"));
        /*Assert *******************************************************************/
        await waitFor(() => {
            expect(addShoppingListItemData).toHaveBeenCalled();
        });
        expect(queryByText(/"Shopping_Item_ID":3/i)).toBeFalsy();
        expect(queryByText(/"Shopping_Item_Name":"Item 3"/i)).toBeFalsy();
        expect(queryByText(/"Shopping_Item_Quantity":3/i)).toBeFalsy();
    });
});
describe("ShoppingListDataProvider on update", () => {
    test("should update shopping list item and update state", async () => {
        /*Arrange *******************************************************************/
        jest.useFakeTimers();
        const shoppingListItem : Shopping_List_Item = {
            Shopping_Item_ID: 1,
            Shopping_Item_Name: 'Updated Item 1',
            Shopping_Item_Quantity: 3,
        };

        const TestComponent = () => {
            const {shoppingList, updateShoppingItem, shoppingListDataState} = useShoppingList();
            return (
                <View>
                    <Text >{shoppingListDataState}</Text>
                    <Pressable onPress={() => updateShoppingItem(shoppingListItem)}>
                        <Text>Update Item</Text>
                    </Pressable>
                    <Text >{JSON.stringify(shoppingList)}</Text>
                </View>
            )
        }
        const user = userEvent.setup();
        /*Act **********************************************************************/
        const {getByText} = render(
            <ShoppingListDataProvider>
                <TestComponent />
            </ShoppingListDataProvider>
        );

        await waitFor(() => {
            expect(getByText(SyncState.Successful)).toBeTruthy();
        });

        (getShoppingListData as jest.Mock).mockImplementationOnce(//this will be called after adding, a failed get should allow us to see the added item without overwriting, then sync again after a timeout
            (userId: number, setShoppingList: (items: Shopping_List_Item[]) => void, searchOptions: any) => {
                let returnPromise = new Promise<SyncState>((resolve) => {
                    resolve(SyncState.Failed);
                });
                return returnPromise;
            }
        );

        await user.press(getByText("Update Item"));

        /*Assert *******************************************************************/
        await waitFor(() => {
            expect(updateShoppingListItemData).toHaveBeenCalled();
        });
        expect(getByText(/"Shopping_Item_ID":1/i)).toBeTruthy();
        expect(getByText(/"Shopping_Item_Name":"Updated Item 1"/i)).toBeTruthy();
        expect(getByText(/"Shopping_Item_Quantity":3/i)).toBeTruthy();
        expect(getByText(SyncState.Failed)).toBeTruthy();

        /*Assert 2 *******************************************************************/
        await waitFor(() => {
            jest.runAllTimers();
            expect(getByText(SyncState.Successful)).toBeTruthy();
        });
    });
    test("should not update state if update fails", async () => {
        /*Arrange *******************************************************************/
        const shoppingListItem : Shopping_List_Item = {
            Shopping_Item_ID: 1,
            Shopping_Item_Name: 'Updated Item 1',
            Shopping_Item_Quantity: 3,
        };
        const TestComponent = () => {
            const {shoppingList, updateShoppingItem, shoppingListDataState} = useShoppingList();
            return (
                <View>
                    <Text >{shoppingListDataState}</Text>
                    <Pressable onPress={() => updateShoppingItem(shoppingListItem)}>
                        <Text>Update Item</Text>
                    </Pressable>
                    <Text >{JSON.stringify(shoppingList)}</Text>
                </View>
            )
        };
        (updateShoppingListItemData as jest.Mock).mockImplementationOnce(
            (currentList: Shopping_List_Item[], setShoppingList: (items: Shopping_List_Item[]) => void, itemToUpdate: Shopping_List_Item) => {
                let returnPromise = new Promise<UpdateState>((resolve) => {
                    resolve(UpdateState.Failed);
                });
                return returnPromise;
            }
        );
        const user = userEvent.setup();
        /*Act **********************************************************************/
        const {getByText, queryByText} = render(
            <ShoppingListDataProvider>
                <TestComponent />
            </ShoppingListDataProvider>
        );
        await waitFor(() => {
            expect(getByText(SyncState.Successful)).toBeTruthy();
        });
        await user.press(getByText("Update Item"));
        /*Assert *******************************************************************/
        await waitFor(() => {
            expect(updateShoppingListItemData).toHaveBeenCalled();
        });
        expect(queryByText(/"Shopping_Item_ID":1/i)).toBeTruthy();
        expect(queryByText(/"Shopping_Item_Name":"Updated Item 1"/i)).toBeFalsy();
        expect(queryByText(/"Shopping_Item_Quantity":3/i)).toBeFalsy();
        expect(getByText(UpdateState.Failed)).toBeTruthy();
    });
});
describe("ShoppingListDataProvider on delete", () => {
    test("should delete shopping list item and update state", async () => {
        /*Arrange *******************************************************************/
        jest.useFakeTimers();
        const itemIDToDelete = 1;
        const TestComponent = () => {
            const {shoppingList, deleteShoppingItem, shoppingListDataState} = useShoppingList();
            return (
                <View>
                    <Text >{shoppingListDataState}</Text>
                    <Pressable onPress={() => deleteShoppingItem(itemIDToDelete)}>
                        <Text>Delete Item</Text>
                    </Pressable>
                    <Text >{JSON.stringify(shoppingList)}</Text>
                </View>
            )
        };
        const user = userEvent.setup();
        /*Act **********************************************************************/
        const {getByText, queryByText} = render(
            <ShoppingListDataProvider>
                <TestComponent />
            </ShoppingListDataProvider>
        );
        await waitFor(() => {
            expect(getByText(SyncState.Successful)).toBeTruthy();
        });
        (getShoppingListData as jest.Mock).mockImplementationOnce(//this will be called after adding, a failed get should allow us to see the added item without overwriting, then sync again after a timeout
            (userId: number, setShoppingList: (items: Shopping_List_Item[]) => void, searchOptions: any) => {
                let returnPromise = new Promise<SyncState>((resolve) => {
                    resolve(SyncState.Failed);
                });
                return returnPromise;
            }
        );
        await user.press(getByText("Delete Item"));
        /*Assert *******************************************************************/
        await waitFor(() => {
            expect(deleteShoppingListItemData).toHaveBeenCalled();
        });
        expect(queryByText(/"Shopping_Item_ID":1/i)).toBeFalsy();
        expect(queryByText(/"Shopping_Item_Name":"Item 1"/i)).toBeFalsy();
        expect(queryByText(/"Shopping_Item_Quantity":1/i)).toBeFalsy();
        expect(getByText(SyncState.Failed)).toBeTruthy();

        /*Assert 2 *******************************************************************/
        await waitFor(() => {
            jest.runAllTimers();
            expect(getByText(SyncState.Successful)).toBeTruthy();
        });
    });
    test("should not update state if delete fails", async () => {
        /*Arrange *******************************************************************/
        const itemIDToDelete = 1;
        const TestComponent = () => {
            const {shoppingList, deleteShoppingItem, shoppingListDataState} = useShoppingList();
            return (
                <View>
                    <Text >{shoppingListDataState}</Text>
                    <Pressable onPress={() => deleteShoppingItem(itemIDToDelete)}>
                        <Text>Delete Item</Text>
                    </Pressable>
                    <Text >{JSON.stringify(shoppingList)}</Text>
                </View>
            )
        };
        (deleteShoppingListItemData as jest.Mock).mockImplementationOnce(
            (currentList: Shopping_List_Item[], setShoppingList: (items: Shopping_List_Item[]) => void, itemID: number) => {
                let returnPromise = new Promise<UpdateState>((resolve) => {
                    resolve(UpdateState.Failed);
                });
                return returnPromise;
            }
        );
        const user = userEvent.setup();
        /*Act **********************************************************************/
        const {getByText, queryByText} = render(
            <ShoppingListDataProvider>
                <TestComponent />
            </ShoppingListDataProvider>
        );
        await waitFor(() => {
            expect(getByText(SyncState.Successful)).toBeTruthy();
        });
        await user.press(getByText("Delete Item"));
        /*Assert *******************************************************************/
        await waitFor(() => {
            expect(deleteShoppingListItemData).toHaveBeenCalled();
        });
        expect(queryByText(/"Shopping_Item_ID":1/i)).toBeTruthy();
        expect(queryByText(/"Shopping_Item_Name":"Item 1"/i)).toBeTruthy();
        expect(queryByText(/"Shopping_Item_Quantity":1/i)).toBeTruthy();
        expect(getByText(UpdateState.Failed)).toBeTruthy();
    });
});
