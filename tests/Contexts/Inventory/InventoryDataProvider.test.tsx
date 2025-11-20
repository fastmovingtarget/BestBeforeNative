//2025-11-20 : Shifting test files into their own folder in the hierarchy

//2025-11-19 : Renamed Ingredients to Inventory

//2025-11-10 : Added matchIngredient, documentation

//2025-10-22 : Tests for get, update, add and delete successful and unsuccessful queries

//2025-10-20 : Separated ingredients data provider

import { render, waitFor, userEvent } from "@testing-library/react-native";

import { InventoryDataProvider, useInventory } from "@/Contexts/Inventory/InventoryDataProvider";
import { getInventoryData } from "@/Contexts/Inventory/GetInventory";
import { updateInventoryItemData } from "@/Contexts/Inventory/UpdateInventoryItem";
import { addInventoryItemData } from "@/Contexts/Inventory/AddInventoryItem";
import { deleteInventoryItemData } from "@/Contexts/Inventory/DeleteInventoryItem";

import fetchMock from 'jest-fetch-mock';
import Inventory_Item from "@/Types/Inventory_Item";
import { Pressable, Text, View } from "react-native";
import { SyncState, UpdateState } from "@/Types/DataLoadingState";
import { Plan_Ingredient } from "@/Types/Plan";

fetchMock.enableMocks();

jest.mock("@/Contexts/Inventory/GetInventory", () => {
    return {
        __esModule: true,
        getInventoryData: jest.fn(),
    };
});
jest.mock("@/Contexts/Inventory/UpdateInventoryItem", () => {
    return {
        __esModule: true,
        updateInventoryItemData: jest.fn(),
    };
});
jest.mock("@/Contexts/Inventory/AddInventoryItem", () => {
    return {
        __esModule: true,
        addInventoryItemData: jest.fn(),
    };
});
jest.mock("@/Contexts/Inventory/DeleteInventoryItem", () => {
    return {
        __esModule: true,
        deleteInventoryItemData: jest.fn(),
    };
});

jest.mock("@/Contexts/Authentication/AuthenticationDataProvider", () => {
    return {
        __esModule: true,
        useAuthenticationData: () => {
            return { userId: 1 };
        }
    };
});

const today = new Date();

const mockInventory : Inventory_Item[] = 
[
    {
        Inventory_Item_ID: 1,
        Inventory_Item_Name: 'Inventory Item 1',
        Inventory_Item_Date: today,
        Inventory_Item_Quantity: 1,
    },
    {
        Inventory_Item_ID: 2,
        Inventory_Item_Name: 'Inventory Item 2',
        Inventory_Item_Date: today,
        Inventory_Item_Quantity: 2,
    },
];

beforeEach(() => {
    fetchMock.resetMocks();
    jest.resetAllMocks();

    (getInventoryData as jest.Mock).mockImplementation(
        async (
            userID: number,
            setInventory: (inventory: Inventory_Item[]) => void
        ) => {
            let returnPromise = new Promise<SyncState>((resolve) => {
                setInventory(mockInventory);
                resolve(SyncState.Successful);
            });
            return returnPromise;
        }
    );

    (addInventoryItemData as jest.Mock).mockImplementation(
        async (
            userID: number,
            currentInventoryItems: Inventory_Item[],
            setInventory: (inventory: Inventory_Item[]) => void,
            inventoryItemToAdd: Inventory_Item  
        ) => {
            let returnPromise = new Promise<UpdateState>((resolve) => {
                setInventory([...currentInventoryItems, inventoryItemToAdd]);
                resolve(UpdateState.Successful);
            });
            return returnPromise;
        }
    );

    (updateInventoryItemData as jest.Mock).mockImplementation(
        async (
            currentInventoryItems: Inventory_Item[],
            setInventory: (inventory: Inventory_Item[]) => void,
            inventoryItemToUpdate: Inventory_Item
        ) => {
            let returnPromise = new Promise<UpdateState>((resolve) => {
                setInventory(
                    currentInventoryItems.map((item) =>
                        item.Inventory_Item_ID === inventoryItemToUpdate.Inventory_Item_ID
                            ? inventoryItemToUpdate
                            : item
                    )
                );
                resolve(UpdateState.Successful);
            });
            return returnPromise;
        }
    );
    (deleteInventoryItemData as jest.Mock).mockImplementation(
        async (
            currentInventoryItems: Inventory_Item[],
            setInventory: (inventory: Inventory_Item[]) => void,
            inventoryItemIDToDelete: number
        ) => {
            let returnPromise = new Promise<UpdateState>((resolve) => {
                setInventory(
                    currentInventoryItems.filter(
                        (item) => item.Inventory_Item_ID !== inventoryItemIDToDelete
                    )
                );
                resolve(UpdateState.Successful);
            });
            return returnPromise;
        }
    );
})


describe("Inventory Data Provider", () => {
    test("should immediately fetch inventory data and update state", async () => {
        /*Arrange *******************************************************************/
        
        const MockChildComponent = () => {
            const { inventory, inventoryDataState } = useInventory();

            return ( 
                <View>
                    <Text>{JSON.stringify(inventory)}</Text>
                    <Text>{inventoryDataState}</Text>
                </View>
            ); // This component does not render anything
        }
        const { getByText } = render(
            <InventoryDataProvider>
                <MockChildComponent />
            </InventoryDataProvider>
        );

        /*Act **********************************************************************/
        //wait for the next tick to allow useEffect to run

        await waitFor(() => {
            expect(getByText(`${SyncState.Successful}`)).toBeTruthy();
        });

        /*Assert *******************************************************************/
        expect(getByText(JSON.stringify(mockInventory))).toBeTruthy();
        expect(getInventoryData).toHaveBeenCalledTimes(1);
        expect(getInventoryData).toHaveBeenCalledWith(
            1,
            expect.any(Function),
            {}
        );
    })
    test("should retry fetching data after failure", async () => {
        jest.useFakeTimers();
        /*Arrange *******************************************************************/
        const MockChildComponent = () => {
            const { inventory, inventoryDataState } = useInventory();

            return ( 
                <View>
                    <Text>{JSON.stringify(inventory)}</Text>
                    <Text>{inventoryDataState}</Text>
                </View>
            ); // This component does not render anything
        }
        (getInventoryData as jest.Mock).mockImplementationOnce(
            async (
                userID: number,
                setInventory: (inventory: Inventory_Item[]) => void
            ) => {
                let returnPromise = new Promise<SyncState>((resolve) => {
                    setInventory(mockInventory);
                    resolve(SyncState.Failed);
                });
                return returnPromise;
            }
        );

        /*Act **********************************************************************/
        //wait for the next tick to allow useEffect to run
        const { getByText } = render(
            <InventoryDataProvider>
                <MockChildComponent />
            </InventoryDataProvider>
        );

        await waitFor(() => {
            expect(getByText(`${SyncState.Failed}`)).toBeTruthy();
        });

        
        await waitFor(() => {
            jest.runAllTimers();
            expect(getByText(`${SyncState.Successful}`)).toBeTruthy();
        });

        /*Assert *******************************************************************/

        expect(getByText(JSON.stringify(mockInventory))).toBeTruthy();
        expect(getInventoryData).toHaveBeenCalledTimes(2);
        jest.useRealTimers();
    })
    describe("Add Inventory Item triggers state sync", () => {
        test("should trigger sync on successful add", async () => {
            /*Arrange *******************************************************************/
            const user = userEvent.setup();
            const mockAddInventoryItem : Inventory_Item = {
                Inventory_Item_Name: 'Inventory Item 3',
                Inventory_Item_Date: today,
                Inventory_Item_Quantity: 3,
            };
            const MockChildComponent = () => {
                const { inventory, inventoryDataState, addInventoryItem } = useInventory();

                return ( 
                    <View>
                        <Text>{JSON.stringify(inventory)}</Text>
                        <Text>{inventoryDataState}</Text>
                        <Pressable onPress={async () => {
                            await addInventoryItem(mockAddInventoryItem);
                        }}>
                            <Text>Add Inventory Item</Text>
                        </Pressable>
                    </View>
                );
            }
            const { getByText } = render(
                <InventoryDataProvider>
                    <MockChildComponent />
                </InventoryDataProvider>
            );
            /*Act **********************************************************************/
            //wait for the next tick to allow useEffect to run

            await waitFor(() => {
                expect(getByText(`${SyncState.Successful}`)).toBeTruthy();
            });

            const addButton = getByText(/Add Inventory Item/i);
            await user.press(addButton); //simulate press
            

            await waitFor(() => {
                expect(addInventoryItemData).toHaveBeenCalledTimes(1);
            });

            await waitFor(() => {
                expect(getByText(`${SyncState.Successful}`)).toBeTruthy();
            });

            /*Assert *******************************************************************/
            expect(addInventoryItemData).toHaveBeenCalledTimes(1);
            expect(addInventoryItemData).toHaveBeenCalledWith(
                1,
                mockInventory,
                expect.any(Function),
                mockAddInventoryItem
            );
            expect(getInventoryData).toHaveBeenCalledTimes(2); //Called on initial render and after add
        });
        //todo : test for failed add triggering sync
        test("should trigger sync on failed add", async () => {
            /*Arrange *******************************************************************/
            const user = userEvent.setup();
            const MockChildComponent = () => {
                const { inventory, inventoryDataState, addInventoryItem } = useInventory();
                
                return (
                    <View>
                        <Text>{JSON.stringify(inventory)}</Text>
                        <Text>{inventoryDataState}</Text>
                        <Pressable onPress={async () => {
                            await addInventoryItem({
                                Inventory_Item_Name: 'Inventory Item 3',
                                Inventory_Item_Date: today,
                                Inventory_Item_Quantity: 3,
                            });
                        }}>
                            <Text>Add Inventory Item</Text>
                        </Pressable>
                    </View>
                );
            }
            (addInventoryItemData as jest.Mock).mockImplementationOnce(
                async (
                    userID: number,
                    currentInventoryItems: Inventory_Item[],
                    setInventoryItems: (inventoryItems: Inventory_Item[]) => void,
                    inventoryItemToAdd: Inventory_Item
                ) => {
                    let returnPromise = new Promise<UpdateState>((resolve) => {
                        //do not update inventory
                        resolve(UpdateState.Failed);
                    });
                    return returnPromise;
                }
            );
            const { getByText } = render(
                <InventoryDataProvider>
                    <MockChildComponent />
                </InventoryDataProvider>
            );
            /*Act **********************************************************************/
            //wait for the next tick to allow useEffect to run

            await waitFor(() => {
                expect(getByText(`${SyncState.Successful}`)).toBeTruthy();
            });
            
            const addButton = getByText(/Add Inventory Item/i);
            await user.press(addButton); //simulate press
            await waitFor(() => {
                expect(addInventoryItemData).toHaveBeenCalledTimes(1);
            });
            
            await waitFor(() => {
                expect(getByText(`${UpdateState.Failed}`)).toBeTruthy();
            });
            /*Assert *******************************************************************/
            expect(getInventoryData).toHaveBeenCalledTimes(1); //called on initial render and after failed add
        });
    });
    //todo : tests for update 
    describe("Update Inventory Item Data", () => {
        test("should trigger sync on successful update", async () => {
            /*Arrange *******************************************************************/
            const user = userEvent.setup();
            const updatedInventoryItem : Inventory_Item = {
                Inventory_Item_ID: 1,
                Inventory_Item_Name: 'Updated Inventory Item 1',
                Inventory_Item_Date: today,
                Inventory_Item_Quantity: 10,
            };
            const MockChildComponent = () => {
                const { inventory, inventoryDataState, updateInventoryItem } = useInventory();

                return ( 
                    <View>
                        <Text>{JSON.stringify(inventory)}</Text>
                        <Text>{inventoryDataState}</Text>
                        <Pressable onPress={async () => {
                            await updateInventoryItem(updatedInventoryItem);
                        }}>
                            <Text>Update Inventory Item</Text>
                        </Pressable>
                    </View>
                );
            }
            const { getByText } = render(
                <InventoryDataProvider>
                    <MockChildComponent />
                </InventoryDataProvider>
            );
            /*Act **********************************************************************/
            //wait for the next tick to allow useEffect to run

            await waitFor(() => {
                expect(getByText(`${SyncState.Successful}`)).toBeTruthy();
            });

            const updateButton = getByText(/Update Inventory Item/i);
            await user.press(updateButton); //simulate press
            

            await waitFor(() => {
                expect(updateInventoryItemData).toHaveBeenCalledTimes(1);
            });

            await waitFor(() => {
                expect(getByText(`${SyncState.Successful}`)).toBeTruthy();
            });

            /*Assert *******************************************************************/
            expect(updateInventoryItemData).toHaveBeenCalledTimes(1);
            expect(updateInventoryItemData).toHaveBeenCalledWith(
                mockInventory,
                expect.any(Function),
                updatedInventoryItem
            );
            expect(getInventoryData).toHaveBeenCalledTimes(2); //Called on initial render and after update
        });
        //todo : test for failed update triggering sync
        test("should not trigger on failed update", async () => {
            /*Arrange *******************************************************************/
            const user = userEvent.setup();
            const updatedInventoryItem : Inventory_Item = {
                Inventory_Item_ID: 1,
                Inventory_Item_Name: 'Updated Inventory Item 1',
                Inventory_Item_Date: today,
                Inventory_Item_Quantity: 10,
            };
            const MockChildComponent = () => {
                const { inventory, inventoryDataState, updateInventoryItem } = useInventory();

                return ( 
                    <View>
                        <Text>{JSON.stringify(inventory)}</Text>
                        <Text>{inventoryDataState}</Text>
                        <Pressable onPress={async () => {
                            await updateInventoryItem(updatedInventoryItem);
                        }}>
                            <Text>Update Inventory Item</Text>
                        </Pressable>
                    </View>
                );
            }
            (updateInventoryItemData as jest.Mock).mockImplementationOnce(
                async (
                    currentInventory: Inventory_Item[],
                    setInventory: (inventory: Inventory_Item[]) => void,
                    inventoryItemToUpdate: Inventory_Item
                ) => {
                    let returnPromise = new Promise<UpdateState>((resolve) => {
                        //do not update ingredients
                        resolve(UpdateState.Failed);
                    });
                    return returnPromise;
                }
            );
            const { getByText } = render(
                <InventoryDataProvider>
                    <MockChildComponent />
                </InventoryDataProvider>
            );
            /*Act **********************************************************************/
            //wait for the next tick to allow useEffect to run

            await waitFor(() => {
                expect(getByText(`${SyncState.Successful}`)).toBeTruthy();
            });

            const updateButton = getByText(/Update Inventory Item/i);
            await user.press(updateButton); //simulate press
            

            await waitFor(() => {
                expect(updateInventoryItemData).toHaveBeenCalledTimes(1);
            });

            await waitFor(() => {
                expect(getByText(`${UpdateState.Failed}`)).toBeTruthy();
            });

            /*Assert *******************************************************************/
            expect(getInventoryData).toHaveBeenCalledTimes(1); //called on initial render and after failed update
        });
    });
    //todo : tests for delete
    describe("Delete Inventory Item Data", () => {
        test("should trigger sync on successful delete", async () => {
            /*Arrange *******************************************************************/
            const user = userEvent.setup();
            const inventoryItemIDToDelete = 1;
            const MockChildComponent = () => {
                const { inventory, inventoryDataState, deleteInventoryItem } = useInventory();

                return ( 
                    <View>
                        <Text>{JSON.stringify(inventory)}</Text>
                        <Text>{inventoryDataState}</Text>
                        <Pressable onPress={async () => {
                            await deleteInventoryItem(inventoryItemIDToDelete);
                        }}>
                            <Text>Delete Inventory Item</Text>
                        </Pressable>
                    </View>
                );
            }
            const { getByText } = render(
                <InventoryDataProvider>
                    <MockChildComponent />
                </InventoryDataProvider>
            );
            /*Act **********************************************************************/
            //wait for the next tick to allow useEffect to run

            await waitFor(() => {
                expect(getByText(`${SyncState.Successful}`)).toBeTruthy();
            });

            const deleteButton = getByText(/Delete Inventory Item/i);
            await user.press(deleteButton); //simulate press
            

            await waitFor(() => {
                expect(deleteInventoryItemData).toHaveBeenCalledTimes(1);
            });

            await waitFor(() => {
                expect(getByText(`${SyncState.Successful}`)).toBeTruthy();
            });
            /*Assert *******************************************************************/
            expect(deleteInventoryItemData).toHaveBeenCalledTimes(1);
            expect(deleteInventoryItemData).toHaveBeenCalledWith(
                mockInventory,
                expect.any(Function),
                inventoryItemIDToDelete
            );
            expect(getInventoryData).toHaveBeenCalledTimes(2); //Called on initial render and after delete
        });
        //todo : test for failed delete triggering sync
        test("should not trigger sync on failed delete", async () => {
            /*Arrange *******************************************************************/
            const user = userEvent.setup();
            const inventoryItemIDToDelete = 1;
            const MockChildComponent = () => {
                const { inventory, inventoryDataState, deleteInventoryItem } = useInventory();

                return ( 
                    <View>
                        <Text>{JSON.stringify(inventory)}</Text>
                        <Text>{inventoryDataState}</Text>
                        <Pressable onPress={async () => {
                            await deleteInventoryItem(inventoryItemIDToDelete);
                        }}>
                            <Text>Delete Inventory Item</Text>
                        </Pressable>
                    </View>
                );
            }
            (deleteInventoryItemData as jest.Mock).mockImplementationOnce(
                async (
                    currentInventory: Inventory_Item[],
                    setInventory: (inventory: Inventory_Item[]) => void,
                    inventoryItemIDToDelete: number
                ) => {
                    let returnPromise = new Promise<UpdateState>((resolve) => {
                        //do not update inventory
                        resolve(UpdateState.Failed);
                    });
                    return returnPromise;
                }
            );
            const { getByText } = render(
                <InventoryDataProvider>
                    <MockChildComponent />
                </InventoryDataProvider>
            );
            /*Act **********************************************************************/
            //wait for the next tick to allow useEffect to run

            await waitFor(() => {
                expect(getByText(`${SyncState.Successful}`)).toBeTruthy();
            });

            const deleteButton = getByText(/Delete Inventory Item/i);
            await user.press(deleteButton); //simulate press
            
            await waitFor(() => {
                expect(deleteInventoryItemData).toHaveBeenCalledTimes(1);
            });

            await waitFor(() => {
                expect(getByText(`${UpdateState.Failed}`)).toBeTruthy();
            });

            /*Assert *******************************************************************/
            expect(getInventoryData).toHaveBeenCalledTimes(1); //called on initial render and after delete triggering sync
        });
    });
    describe("Match Inventory Item Data", () => {
        test("should add leftover inventory item and update original inventory item", async () => {
            /*Arrange *******************************************************************/
            const user = userEvent.setup();
            const planIngredient : Plan_Ingredient = {
                Recipe_Ingredient_ID: 1,
                Recipe_Ingredient_Name: 'Ingredient 2',
                Recipe_Ingredient_Quantity: 1,
                Inventory_Item_ID: 2,
                Shopping_Item_ID: undefined,
            };
            const recipePlan = {
                Recipe_ID: 1,
                Plan_ID: 1,
                Plan_Date: today,
                Recipe_Name: "Recipe 1",
            };
            const MockChildComponent = () => {
                const { inventory, inventoryDataState, matchInventoryItem } = useInventory();
                return ( 
                    <View>
                        <Text>{JSON.stringify(inventory)}</Text>
                        <Text>{inventoryDataState}</Text>
                        <Pressable onPress={async () => {
                            await matchInventoryItem(inventory[1], planIngredient, recipePlan);
                        }}>
                            <Text>Match Inventory Item</Text>
                        </Pressable>
                    </View>
                );
            }

            const { getByText } = render(
                <InventoryDataProvider>
                    <MockChildComponent />
                </InventoryDataProvider>
            );
            /*Act **********************************************************************/
            //wait for the next tick to allow useEffect to run
            await waitFor(() => {
                expect(getByText(`${SyncState.Successful}`)).toBeTruthy();
            });

            const matchButton = getByText(/Match Inventory Item/i);
            await user.press(matchButton); //simulate press
            await waitFor(() => {
                expect(addInventoryItemData).toHaveBeenCalledTimes(1);
            });

            await waitFor(() => {
                expect(updateInventoryItemData).toHaveBeenCalledTimes(1);
            });
            await waitFor(() => {
                expect(getByText(`${SyncState.Successful}`)).toBeTruthy();
            });

            /*Assert *******************************************************************/
            expect(getInventoryData).toHaveBeenCalledTimes(2); //Called on initial render, after add and update
            expect(addInventoryItemData).toHaveBeenCalledWith(
                1,
                mockInventory,
                expect.any(Function),
                {
                    Inventory_Item_ID: undefined,
                    Inventory_Item_Name: 'Inventory Item 2',
                    Inventory_Item_Date: today,
                    Inventory_Item_Quantity: 1,
                }
            );
            expect(updateInventoryItemData).toHaveBeenCalledWith(
                mockInventory,
                expect.any(Function),
                {
                    Inventory_Item_ID: 2,
                    Inventory_Item_Name: 'Inventory Item 2',
                    Inventory_Item_Date: today,
                    Inventory_Item_Quantity: 1,
                    Plan_Ingredient_ID: 1,
                    Plan_Recipe_ID: 1,
                    Plan_ID: 1,
                }
            );
        });
        test("Should not update if add fails", async () => {
            /*Arrange *******************************************************************/
            const user = userEvent.setup();
            const planIngredient : Plan_Ingredient = {
                Recipe_Ingredient_ID: 1,
                Recipe_Ingredient_Name: 'Ingredient 2',
                Recipe_Ingredient_Quantity: 1,
                Inventory_Item_ID: 2,
                Shopping_Item_ID: undefined,
            };
            const recipePlan = {
                Recipe_ID: 1,
                Plan_ID: 1,
                Plan_Date: today,
                Recipe_Name: "Recipe 1",
            };
            const MockChildComponent = () => {
                const { inventory, inventoryDataState, matchInventoryItem } = useInventory();
                return ( 
                    <View>
                        <Text>{JSON.stringify(inventory)}</Text>
                        <Text>{inventoryDataState}</Text>
                        <Pressable onPress={async () => {
                            await matchInventoryItem(inventory[1], planIngredient, recipePlan);
                        }}>
                            <Text>Match Inventory Item</Text>
                        </Pressable>
                    </View>
                );
            }
            (addInventoryItemData as jest.Mock).mockImplementationOnce(
                async (
                    userID: number,
                    currentInventory: Inventory_Item[],
                    setInventory: (inventory: Inventory_Item[]) => void,
                    inventoryItemToAdd: Inventory_Item
                ) => {
                    let returnPromise = new Promise<UpdateState>((resolve) => {
                        //do not update ingredients
                        resolve(UpdateState.Failed);
                    });
                    return returnPromise;
                }
            );
            const { getByText } = render(
                <InventoryDataProvider>
                    <MockChildComponent />
                </InventoryDataProvider>
            );
            /*Act **********************************************************************/
            //wait for the next tick to allow useEffect to run
            await waitFor(() => {
                expect(getByText(`${SyncState.Successful}`)).toBeTruthy();
            });
            const matchButton = getByText(/Match Inventory Item/i);
            await user.press(matchButton); //simulate press
            await waitFor(() => {
                expect(addInventoryItemData).toHaveBeenCalledTimes(1);
            });
            await waitFor(() => {
                expect(getByText(`${UpdateState.Failed}`)).toBeTruthy();
            });
            /*Assert *******************************************************************/
            expect(getInventoryData).toHaveBeenCalledTimes(1); //Called on initial render only
            expect(addInventoryItemData).toHaveBeenCalledWith(
                1,
                mockInventory,
                expect.any(Function),
                {
                    Inventory_Item_ID: undefined,
                    Inventory_Item_Name: 'Inventory Item 2',
                    Inventory_Item_Date: today,
                    Inventory_Item_Quantity: 1,
                } as Inventory_Item
            );
            expect(updateInventoryItemData).toHaveBeenCalledTimes(0);
        });
        test("should only update original ingredient if no leftover", async () => {
            /*Arrange *******************************************************************/
            const user = userEvent.setup();
            const planIngredient : Plan_Ingredient = {
                Recipe_Ingredient_ID: 1,
                Recipe_Ingredient_Name: 'Ingredient 1',
                Recipe_Ingredient_Quantity: 1,
                Inventory_Item_ID: 1,
                Shopping_Item_ID: undefined,
            };
            const recipePlan = {
                Recipe_ID: 1,
                Plan_ID: 1,
                Plan_Date: today,
                Recipe_Name: "Recipe 1",
            };
            const MockChildComponent = () => {
                const { inventory, inventoryDataState, matchInventoryItem } = useInventory();
                return ( 
                    <View>
                        <Text>{JSON.stringify(inventory)}</Text>
                        <Text>{inventoryDataState}</Text>
                        <Pressable onPress={async () => {
                            await matchInventoryItem(inventory[0], planIngredient, recipePlan);
                        }}>
                            <Text>Match Inventory Item</Text>
                        </Pressable>
                    </View>
                );
            }
            const { getByText } = render(
                <InventoryDataProvider>
                    <MockChildComponent />
                </InventoryDataProvider>
            );
            /*Act **********************************************************************/
            //wait for the next tick to allow useEffect to run
            await waitFor(() => {
                expect(getByText(`${SyncState.Successful}`)).toBeTruthy();
            });
            const matchButton = getByText(/Match Inventory Item/i);
            await user.press(matchButton); //simulate press
            await waitFor(() => {
                expect(updateInventoryItemData).toHaveBeenCalledTimes(1);
            });

            await waitFor(() => {
                expect(getByText(`${SyncState.Successful}`)).toBeTruthy();
            });
            /*Assert *******************************************************************/
            expect(getInventoryData).toHaveBeenCalledTimes(2);
            expect(addInventoryItemData).toHaveBeenCalledTimes(0);
            expect(updateInventoryItemData).toHaveBeenCalledWith(
                mockInventory,
                expect.any(Function),
                {
                    Inventory_Item_ID: 1,
                    Inventory_Item_Name: 'Inventory Item 1',
                    Inventory_Item_Date: today,
                    Inventory_Item_Quantity: 1,
                    Plan_Ingredient_ID: 1,
                    Plan_Recipe_ID: 1,
                    Plan_ID: 1,
                }
            );
        });
    });  
});
