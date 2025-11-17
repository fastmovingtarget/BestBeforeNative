//2025-11-10 : Added matchIngredient, documentation

//2025-10-22 : Tests for get, update, add and delete successful and unsuccessful queries

//2025-10-20 : Separated ingredients data provider

import { render, waitFor, userEvent } from "@testing-library/react-native";

import { IngredientsDataProvider, useIngredients } from "./IngredientsDataProvider";
import { getIngredientsData } from "./GetIngredients";
import { updateIngredientData } from "./UpdateIngredient";
import { addIngredientData } from "./AddIngredient";
import { deleteIngredientData } from "./DeleteIngredient";

import fetchMock from 'jest-fetch-mock';
import Ingredient from "@/Types/Ingredient";
import { Pressable, Text, View } from "react-native";
import { SyncState, UpdateState } from "@/Types/DataLoadingState";
import { Plan_Ingredient } from "@/Types/Recipe_Plan";

fetchMock.enableMocks();

jest.mock("./getIngredients", () => {
    return {
        __esModule: true,
        getIngredientsData: jest.fn(),
    };
});
jest.mock("./UpdateIngredient", () => {
    return {
        __esModule: true,
        updateIngredientData: jest.fn(),
    };
});
jest.mock("./AddIngredient", () => {
    return {
        __esModule: true,
        addIngredientData: jest.fn(),
    };
});
jest.mock("./DeleteIngredient", () => {
    return {
        __esModule: true,
        deleteIngredientData: jest.fn(),
    };
});

jest.mock("../Authentication/AuthenticationDataProvider", () => {
    return {
        __esModule: true,
        useAuthenticationData: () => {
            return { userId: 1 };
        }
    };
});

const today = new Date();

const mockIngredients : Ingredient[] = 
[
    {
        Ingredient_ID: 1,
        Ingredient_Name: 'Ingredient 1',
        Ingredient_Date: today,
        Ingredient_Quantity: 1,
    },
    {
        Ingredient_ID: 2,
        Ingredient_Name: 'Ingredient 2',
        Ingredient_Date: today,
        Ingredient_Quantity: 2,
    },
];

beforeEach(() => {
    fetchMock.resetMocks();
    jest.resetAllMocks();

    (getIngredientsData as jest.Mock).mockImplementation(
        async (
            userID: number,
            setIngredients: (ingredients: Ingredient[]) => void
        ) => {
            let returnPromise = new Promise<SyncState>((resolve) => {
                setIngredients(mockIngredients);
                resolve(SyncState.Successful);
            });
            return returnPromise;
        }
    );

    (addIngredientData as jest.Mock).mockImplementation(
        async (
            userID: number,
            currentIngredients: Ingredient[],
            setIngredients: (ingredients: Ingredient[]) => void,
            ingredientToAdd: Ingredient
        ) => {
            let returnPromise = new Promise<UpdateState>((resolve) => {
                setIngredients([...currentIngredients, ingredientToAdd]);
                resolve(UpdateState.Successful);
            });
            return returnPromise;
        }
    );

    (updateIngredientData as jest.Mock).mockImplementation(
        async (
            currentIngredients: Ingredient[],
            setIngredients: (ingredients: Ingredient[]) => void,
            ingredientToUpdate: Ingredient
        ) => {
            let returnPromise = new Promise<UpdateState>((resolve) => {
                setIngredients(
                    currentIngredients.map((ingredient) =>
                        ingredient.Ingredient_ID === ingredientToUpdate.Ingredient_ID
                            ? ingredientToUpdate
                            : ingredient
                    )
                );
                resolve(UpdateState.Successful);
            });
            return returnPromise;
        }
    );
    (deleteIngredientData as jest.Mock).mockImplementation(
        async (
            currentIngredients: Ingredient[],
            setIngredients: (ingredients: Ingredient[]) => void,
            ingredientIDToDelete: number
        ) => {
            let returnPromise = new Promise<UpdateState>((resolve) => {
                setIngredients(
                    currentIngredients.filter(
                        (ingredient) => ingredient.Ingredient_ID !== ingredientIDToDelete
                    )
                );
                resolve(UpdateState.Successful);
            });
            return returnPromise;
        }
    );
})


describe("Ingredients Data Provider", () => {
    test("should immediately fetch ingredients data and update state", async () => {
        /*Arrange *******************************************************************/
        
        const MockChildComponent = () => {
            const { ingredients, ingredientsDataState } = useIngredients();

            return ( 
                <View>
                    <Text>{JSON.stringify(ingredients)}</Text>
                    <Text>{ingredientsDataState}</Text>
                </View>
            ); // This component does not render anything
        }
        const { getByText } = render(
            <IngredientsDataProvider>
                <MockChildComponent />
            </IngredientsDataProvider>
        );

        /*Act **********************************************************************/
        //wait for the next tick to allow useEffect to run

        await waitFor(() => {
            expect(getByText(`${SyncState.Successful}`)).toBeTruthy();
        });

        /*Assert *******************************************************************/
        expect(getByText(JSON.stringify(mockIngredients))).toBeTruthy();
        expect(getIngredientsData).toHaveBeenCalledTimes(1);
        expect(getIngredientsData).toHaveBeenCalledWith(
            1,
            expect.any(Function),
            {}
        );
    })
    test("should retry fetching data after failure", async () => {
        jest.useFakeTimers();
        /*Arrange *******************************************************************/
        const MockChildComponent = () => {
            const { ingredients, ingredientsDataState } = useIngredients();

            return ( 
                <View>
                    <Text>{JSON.stringify(ingredients)}</Text>
                    <Text>{ingredientsDataState}</Text>
                </View>
            ); // This component does not render anything
        }
        (getIngredientsData as jest.Mock).mockImplementationOnce(
            async (
                userID: number,
                setIngredients: (ingredients: Ingredient[]) => void
            ) => {
                let returnPromise = new Promise<SyncState>((resolve) => {
                    setIngredients(mockIngredients);
                    resolve(SyncState.Failed);
                });
                return returnPromise;
            }
        );

        /*Act **********************************************************************/
        //wait for the next tick to allow useEffect to run
        const { getByText } = render(
            <IngredientsDataProvider>
                <MockChildComponent />
            </IngredientsDataProvider>
        );

        await waitFor(() => {
            expect(getByText(`${SyncState.Failed}`)).toBeTruthy();
        });

        
        await waitFor(() => {
            jest.runAllTimers();
            expect(getByText(`${SyncState.Successful}`)).toBeTruthy();
        });

        /*Assert *******************************************************************/

        expect(getByText(JSON.stringify(mockIngredients))).toBeTruthy();
        expect(getIngredientsData).toHaveBeenCalledTimes(2);
        jest.useRealTimers();
    })
    describe("Add Ingredient triggers state sync", () => {
        test("should trigger sync on successful add", async () => {
            /*Arrange *******************************************************************/
            const user = userEvent.setup();
            const mockAddIngredient : Ingredient = {
                Ingredient_Name: 'Ingredient 3',
                Ingredient_Date: today,
                Ingredient_Quantity: 3,
            };
            const MockChildComponent = () => {
                const { ingredients, ingredientsDataState, addIngredient } = useIngredients();

                return ( 
                    <View>
                        <Text>{JSON.stringify(ingredients)}</Text>
                        <Text>{ingredientsDataState}</Text>
                        <Pressable onPress={async () => {
                            await addIngredient(mockAddIngredient);
                        }}>
                            <Text>Add Ingredient</Text>
                        </Pressable>
                    </View>
                );
            }
            const { getByText } = render(
                <IngredientsDataProvider>
                    <MockChildComponent />
                </IngredientsDataProvider>
            );
            /*Act **********************************************************************/
            //wait for the next tick to allow useEffect to run

            await waitFor(() => {
                expect(getByText(`${SyncState.Successful}`)).toBeTruthy();
            });

            const addButton = getByText(/Add Ingredient/i);
            await user.press(addButton); //simulate press
            

            await waitFor(() => {
                expect(addIngredientData).toHaveBeenCalledTimes(1);
            });

            await waitFor(() => {
                expect(getByText(`${SyncState.Successful}`)).toBeTruthy();
            });

            /*Assert *******************************************************************/
            expect(addIngredientData).toHaveBeenCalledTimes(1);
            expect(addIngredientData).toHaveBeenCalledWith(
                1,
                mockIngredients,
                expect.any(Function),
                mockAddIngredient
            );
            expect(getIngredientsData).toHaveBeenCalledTimes(2); //Called on initial render and after add
        });
        //todo : test for failed add triggering sync
        test("should trigger sync on failed add", async () => {
            /*Arrange *******************************************************************/
            const user = userEvent.setup();
            const MockChildComponent = () => {
                const { ingredients, ingredientsDataState, addIngredient } = useIngredients();
                
                return (
                    <View>
                        <Text>{JSON.stringify(ingredients)}</Text>
                        <Text>{ingredientsDataState}</Text>
                        <Pressable onPress={async () => {
                            await addIngredient({
                                Ingredient_Name: 'Ingredient 3',
                                Ingredient_Date: today,
                                Ingredient_Quantity: 3,
                            });
                        }}>
                            <Text>Add Ingredient</Text>
                        </Pressable>
                    </View>
                );
            }
            (addIngredientData as jest.Mock).mockImplementationOnce(
                async (
                    userID: number,
                    currentIngredients: Ingredient[],
                    setIngredients: (ingredients: Ingredient[]) => void,
                    ingredientToAdd: Ingredient
                ) => {
                    let returnPromise = new Promise<UpdateState>((resolve) => {
                        //do not update ingredients
                        resolve(UpdateState.Failed);
                    });
                    return returnPromise;
                }
            );
            const { getByText } = render(
                <IngredientsDataProvider>
                    <MockChildComponent />
                </IngredientsDataProvider>
            );
            /*Act **********************************************************************/
            //wait for the next tick to allow useEffect to run

            await waitFor(() => {
                expect(getByText(`${SyncState.Successful}`)).toBeTruthy();
            });
            
            const addButton = getByText(/Add Ingredient/i);
            await user.press(addButton); //simulate press
            await waitFor(() => {
                expect(addIngredientData).toHaveBeenCalledTimes(1);
            });
            
            await waitFor(() => {
                expect(getByText(`${UpdateState.Failed}`)).toBeTruthy();
            });
            /*Assert *******************************************************************/
            expect(getIngredientsData).toHaveBeenCalledTimes(1); //called on initial render and after failed add
        });
    });
    //todo : tests for update 
    describe("Update Ingredient Data", () => {
        test("should trigger sync on successful update", async () => {
            /*Arrange *******************************************************************/
            const user = userEvent.setup();
            const updatedIngredient : Ingredient = {
                Ingredient_ID: 1,
                Ingredient_Name: 'Updated Ingredient 1',
                Ingredient_Date: today,
                Ingredient_Quantity: 10,
            };
            const MockChildComponent = () => {
                const { ingredients, ingredientsDataState, updateIngredient } = useIngredients();

                return ( 
                    <View>
                        <Text>{JSON.stringify(ingredients)}</Text>
                        <Text>{ingredientsDataState}</Text>
                        <Pressable onPress={async () => {
                            await updateIngredient(updatedIngredient);
                        }}>
                            <Text>Update Ingredient</Text>
                        </Pressable>
                    </View>
                );
            }
            const { getByText } = render(
                <IngredientsDataProvider>
                    <MockChildComponent />
                </IngredientsDataProvider>
            );
            /*Act **********************************************************************/
            //wait for the next tick to allow useEffect to run

            await waitFor(() => {
                expect(getByText(`${SyncState.Successful}`)).toBeTruthy();
            });

            const updateButton = getByText(/Update Ingredient/i);
            await user.press(updateButton); //simulate press
            

            await waitFor(() => {
                expect(updateIngredientData).toHaveBeenCalledTimes(1);
            });

            await waitFor(() => {
                expect(getByText(`${SyncState.Successful}`)).toBeTruthy();
            });

            /*Assert *******************************************************************/
            expect(updateIngredientData).toHaveBeenCalledTimes(1);
            expect(updateIngredientData).toHaveBeenCalledWith(
                mockIngredients,
                expect.any(Function),
                updatedIngredient
            );
            expect(getIngredientsData).toHaveBeenCalledTimes(2); //Called on initial render and after update
        });
        //todo : test for failed update triggering sync
        test("should not trigger on failed update", async () => {
            /*Arrange *******************************************************************/
            const user = userEvent.setup();
            const updatedIngredient : Ingredient = {
                Ingredient_ID: 1,
                Ingredient_Name: 'Updated Ingredient 1',
                Ingredient_Date: today,
                Ingredient_Quantity: 10,
            };
            const MockChildComponent = () => {
                const { ingredients, ingredientsDataState, updateIngredient } = useIngredients();

                return ( 
                    <View>
                        <Text>{JSON.stringify(ingredients)}</Text>
                        <Text>{ingredientsDataState}</Text>
                        <Pressable onPress={async () => {
                            await updateIngredient(updatedIngredient);
                        }}>
                            <Text>Update Ingredient</Text>
                        </Pressable>
                    </View>
                );
            }
            (updateIngredientData as jest.Mock).mockImplementationOnce(
                async (
                    currentIngredients: Ingredient[],
                    setIngredients: (ingredients: Ingredient[]) => void,
                    ingredientToUpdate: Ingredient
                ) => {
                    let returnPromise = new Promise<UpdateState>((resolve) => {
                        //do not update ingredients
                        resolve(UpdateState.Failed);
                    });
                    return returnPromise;
                }
            );
            const { getByText } = render(
                <IngredientsDataProvider>
                    <MockChildComponent />
                </IngredientsDataProvider>
            );
            /*Act **********************************************************************/
            //wait for the next tick to allow useEffect to run

            await waitFor(() => {
                expect(getByText(`${SyncState.Successful}`)).toBeTruthy();
            });

            const updateButton = getByText(/Update Ingredient/i);
            await user.press(updateButton); //simulate press
            

            await waitFor(() => {
                expect(updateIngredientData).toHaveBeenCalledTimes(1);
            });

            await waitFor(() => {
                expect(getByText(`${UpdateState.Failed}`)).toBeTruthy();
            });

            /*Assert *******************************************************************/
            expect(getIngredientsData).toHaveBeenCalledTimes(1); //called on initial render and after failed update
        });
    });
    //todo : tests for delete
    describe("Delete Ingredient Data", () => {
        test("should trigger sync on successful delete", async () => {
            /*Arrange *******************************************************************/
            const user = userEvent.setup();
            const ingredientIDToDelete = 1;
            const MockChildComponent = () => {
                const { ingredients, ingredientsDataState, deleteIngredient } = useIngredients();

                return ( 
                    <View>
                        <Text>{JSON.stringify(ingredients)}</Text>
                        <Text>{ingredientsDataState}</Text>
                        <Pressable onPress={async () => {
                            await deleteIngredient(ingredientIDToDelete);
                        }}>
                            <Text>Delete Ingredient</Text>
                        </Pressable>
                    </View>
                );
            }
            const { getByText } = render(
                <IngredientsDataProvider>
                    <MockChildComponent />
                </IngredientsDataProvider>
            );
            /*Act **********************************************************************/
            //wait for the next tick to allow useEffect to run

            await waitFor(() => {
                expect(getByText(`${SyncState.Successful}`)).toBeTruthy();
            });

            const deleteButton = getByText(/Delete Ingredient/i);
            await user.press(deleteButton); //simulate press
            

            await waitFor(() => {
                expect(deleteIngredientData).toHaveBeenCalledTimes(1);
            });

            await waitFor(() => {
                expect(getByText(`${SyncState.Successful}`)).toBeTruthy();
            });
            /*Assert *******************************************************************/
            expect(deleteIngredientData).toHaveBeenCalledTimes(1);
            expect(deleteIngredientData).toHaveBeenCalledWith(
                mockIngredients,
                expect.any(Function),
                ingredientIDToDelete
            );
            expect(getIngredientsData).toHaveBeenCalledTimes(2); //Called on initial render and after delete
        });
        //todo : test for failed delete triggering sync
        test("should not trigger sync on failed delete", async () => {
            /*Arrange *******************************************************************/
            const user = userEvent.setup();
            const ingredientIDToDelete = 1;
            const MockChildComponent = () => {
                const { ingredients, ingredientsDataState, deleteIngredient } = useIngredients();

                return ( 
                    <View>
                        <Text>{JSON.stringify(ingredients)}</Text>
                        <Text>{ingredientsDataState}</Text>
                        <Pressable onPress={async () => {
                            await deleteIngredient(ingredientIDToDelete);
                        }}>
                            <Text>Delete Ingredient</Text>
                        </Pressable>
                    </View>
                );
            }
            (deleteIngredientData as jest.Mock).mockImplementationOnce(
                async (
                    currentIngredients: Ingredient[],
                    setIngredients: (ingredients: Ingredient[]) => void,
                    ingredientIDToDelete: number
                ) => {
                    let returnPromise = new Promise<UpdateState>((resolve) => {
                        //do not update ingredients
                        resolve(UpdateState.Failed);
                    });
                    return returnPromise;
                }
            );
            const { getByText } = render(
                <IngredientsDataProvider>
                    <MockChildComponent />
                </IngredientsDataProvider>
            );
            /*Act **********************************************************************/
            //wait for the next tick to allow useEffect to run

            await waitFor(() => {
                expect(getByText(`${SyncState.Successful}`)).toBeTruthy();
            });

            const deleteButton = getByText(/Delete Ingredient/i);
            await user.press(deleteButton); //simulate press
            
            await waitFor(() => {
                expect(deleteIngredientData).toHaveBeenCalledTimes(1);
            });

            await waitFor(() => {
                expect(getByText(`${UpdateState.Failed}`)).toBeTruthy();
            });

            /*Assert *******************************************************************/
            expect(getIngredientsData).toHaveBeenCalledTimes(1); //called on initial render and after delete triggering sync
        });
    });
    describe("Match Ingredient Data", () => {
        test("should add leftover ingredient and update original ingredient", async () => {
            /*Arrange *******************************************************************/
            const user = userEvent.setup();
            const planIngredient : Plan_Ingredient = {
                Recipe_Ingredient_ID: 1,
                Ingredient_Name: 'Ingredient 2',
                Ingredient_ID: 2,
                Ingredient_Quantity: 1,
                Item_ID: undefined,
            };
            const recipePlan = {
                Recipe_ID: 1,
                Plan_ID: 1,
                Plan_Date: today,
                Recipe_Name: "Recipe 1",
            };
            const MockChildComponent = () => {
                const { ingredients, ingredientsDataState, matchIngredient } = useIngredients();
                return ( 
                    <View>
                        <Text>{JSON.stringify(ingredients)}</Text>
                        <Text>{ingredientsDataState}</Text>
                        <Pressable onPress={async () => {
                            await matchIngredient(ingredients[1], planIngredient, recipePlan);
                        }}>
                            <Text>Match Ingredient</Text>
                        </Pressable>
                    </View>
                );
            }

            const { getByText } = render(
                <IngredientsDataProvider>
                    <MockChildComponent />
                </IngredientsDataProvider>
            );
            /*Act **********************************************************************/
            //wait for the next tick to allow useEffect to run
            await waitFor(() => {
                expect(getByText(`${SyncState.Successful}`)).toBeTruthy();
            });

            const matchButton = getByText(/Match Ingredient/i);
            await user.press(matchButton); //simulate press
            await waitFor(() => {
                expect(addIngredientData).toHaveBeenCalledTimes(1);
            });

            await waitFor(() => {
                expect(updateIngredientData).toHaveBeenCalledTimes(1);
            });
            await waitFor(() => {
                expect(getByText(`${SyncState.Successful}`)).toBeTruthy();
            });

            /*Assert *******************************************************************/
            expect(getIngredientsData).toHaveBeenCalledTimes(2); //Called on initial render, after add and update
            expect(addIngredientData).toHaveBeenCalledWith(
                1,
                mockIngredients,
                expect.any(Function),
                {
                    Ingredient_ID: undefined,
                    Ingredient_Name: 'Ingredient 2',
                    Ingredient_Date: today,
                    Ingredient_Quantity: 1,
                }
            );
            expect(updateIngredientData).toHaveBeenCalledWith(
                mockIngredients,
                expect.any(Function),
                {
                    Ingredient_ID: 2,
                    Ingredient_Name: 'Ingredient 2',
                    Ingredient_Date: today,
                    Ingredient_Quantity: 1,
                    Recipe_Ingredient_ID: 1,
                    Recipe_ID: 1,
                    Plan_ID: 1,
                }
            );
        });
        test("Should not update if add fails", async () => {
            /*Arrange *******************************************************************/
            const user = userEvent.setup();
            const planIngredient : Plan_Ingredient = {
                Recipe_Ingredient_ID: 1,
                Ingredient_Name: 'Ingredient 2',
                Ingredient_ID: 2,
                Ingredient_Quantity: 1,
                Item_ID: undefined,
            };
            const recipePlan = {
                Recipe_ID: 1,
                Plan_ID: 1,
                Plan_Date: today,
                Recipe_Name: "Recipe 1",
            };
            const MockChildComponent = () => {
                const { ingredients, ingredientsDataState, matchIngredient } = useIngredients();
                return ( 
                    <View>
                        <Text>{JSON.stringify(ingredients)}</Text>
                        <Text>{ingredientsDataState}</Text>
                        <Pressable onPress={async () => {
                            await matchIngredient(ingredients[1], planIngredient, recipePlan);
                        }}>
                            <Text>Match Ingredient</Text>
                        </Pressable>
                    </View>
                );
            }
            (addIngredientData as jest.Mock).mockImplementationOnce(
                async (
                    userID: number,
                    currentIngredients: Ingredient[],
                    setIngredients: (ingredients: Ingredient[]) => void,
                    ingredientToAdd: Ingredient
                ) => {
                    let returnPromise = new Promise<UpdateState>((resolve) => {
                        //do not update ingredients
                        resolve(UpdateState.Failed);
                    });
                    return returnPromise;
                }
            );
            const { getByText } = render(
                <IngredientsDataProvider>
                    <MockChildComponent />
                </IngredientsDataProvider>
            );
            /*Act **********************************************************************/
            //wait for the next tick to allow useEffect to run
            await waitFor(() => {
                expect(getByText(`${SyncState.Successful}`)).toBeTruthy();
            });
            const matchButton = getByText(/Match Ingredient/i);
            await user.press(matchButton); //simulate press
            await waitFor(() => {
                expect(addIngredientData).toHaveBeenCalledTimes(1);
            });
            await waitFor(() => {
                expect(getByText(`${UpdateState.Failed}`)).toBeTruthy();
            });
            /*Assert *******************************************************************/
            expect(getIngredientsData).toHaveBeenCalledTimes(1); //Called on initial render only
            expect(addIngredientData).toHaveBeenCalledWith(
                1,
                mockIngredients,
                expect.any(Function),
                {
                    Ingredient_ID: undefined,
                    Ingredient_Name: 'Ingredient 2',
                    Ingredient_Date: today,
                    Ingredient_Quantity: 1,
                }
            );
            expect(updateIngredientData).toHaveBeenCalledTimes(0);
        });
        test("should only update original ingredient if no leftover", async () => {
            /*Arrange *******************************************************************/
            const user = userEvent.setup();
            const planIngredient : Plan_Ingredient = {
                Recipe_Ingredient_ID: 1,
                Ingredient_Name: 'Ingredient 1',
                Ingredient_ID: 1,
                Ingredient_Quantity: 1,
                Item_ID: undefined,
            };
            const recipePlan = {
                Recipe_ID: 1,
                Plan_ID: 1,
                Plan_Date: today,
                Recipe_Name: "Recipe 1",
            };
            const MockChildComponent = () => {
                const { ingredients, ingredientsDataState, matchIngredient } = useIngredients();
                return ( 
                    <View>
                        <Text>{JSON.stringify(ingredients)}</Text>
                        <Text>{ingredientsDataState}</Text>
                        <Pressable onPress={async () => {
                            await matchIngredient(ingredients[0], planIngredient, recipePlan);
                        }}>
                            <Text>Match Ingredient</Text>
                        </Pressable>
                    </View>
                );
            }
            const { getByText } = render(
                <IngredientsDataProvider>
                    <MockChildComponent />
                </IngredientsDataProvider>
            );
            /*Act **********************************************************************/
            //wait for the next tick to allow useEffect to run
            await waitFor(() => {
                expect(getByText(`${SyncState.Successful}`)).toBeTruthy();
            });
            const matchButton = getByText(/Match Ingredient/i);
            await user.press(matchButton); //simulate press
            await waitFor(() => {
                expect(updateIngredientData).toHaveBeenCalledTimes(1);
            });

            await waitFor(() => {
                expect(getByText(`${SyncState.Successful}`)).toBeTruthy();
            });
            /*Assert *******************************************************************/
            expect(getIngredientsData).toHaveBeenCalledTimes(2);
            expect(addIngredientData).toHaveBeenCalledTimes(0);
            expect(updateIngredientData).toHaveBeenCalledWith(
                mockIngredients,
                expect.any(Function),
                {
                    Ingredient_ID: 1,
                    Ingredient_Name: 'Ingredient 1',
                    Ingredient_Date: today,
                    Ingredient_Quantity: 1,
                    Recipe_Ingredient_ID: 1,
                    Recipe_ID: 1,
                    Plan_ID: 1,
                }
            );
        });
    });  
});
