//2025-11-20 : Shifting test files into their own folder in the hierarchy

//2025-11-19 : Ingredient_Name and Ingredient_Quantity now have Recipe_ prefix

//2025-10-23 : Removed unneccessary fetch mocks

//2025-10-23 : Basic success and failure tests for load, sync and update states


import { render, waitFor, userEvent } from "@testing-library/react-native";

import { RecipesDataProvider, useRecipes } from "@/Contexts/Recipes/RecipesDataProvider";
import { getRecipesData } from "@/Contexts/Recipes/GetRecipes";
import { deleteRecipeData } from "@/Contexts/Recipes/DeleteRecipe";
import { addRecipeData } from "@/Contexts/Recipes/AddRecipe";
import { updateRecipeData } from "@/Contexts/Recipes/UpdateRecipe";

import Recipe from "@/Types/Recipe";
import { Pressable, Text, View } from "react-native";
import { SyncState, UpdateState } from "@/Types/DataLoadingState";

jest.mock("@/Contexts/Recipes/GetRecipes", () =>{
    return {
        __esModule: true,
        getRecipesData: jest.fn(),
    }
});

jest.mock("@/Contexts/Recipes/DeleteRecipe", () =>{
    return {
        __esModule: true,
        deleteRecipeData: jest.fn(),
    }
});

jest.mock("@/Contexts/Recipes/AddRecipe", () =>{
    return {
        __esModule: true,
        addRecipeData: jest.fn(),
    }
});

jest.mock("@/Contexts/Recipes/UpdateRecipe", () =>{
    return {
        __esModule: true,
        updateRecipeData: jest.fn(),
    }
});

const mockRecipes : Recipe[] = [
        {
            Recipe_ID: 1,
            Recipe_Name: 'Recipe 1',
            Recipe_Difficulty: 1,
            Recipe_Time: 11,
            Recipe_Instructions: 'Instructions for Recipe 1',
            Recipe_Ingredients: [{
                Recipe_Ingredient_ID: 11,
                Recipe_Ingredient_Name: 'Recipe 1 Ingredient 1',
                Recipe_Ingredient_Quantity: 2,
            },
            {
                Recipe_Ingredient_ID: 12,
                Recipe_Ingredient_Name: 'Recipe 1 Ingredient 2',
                Recipe_Ingredient_Quantity: 2,
            }],
        },
        {
            Recipe_ID: 2,
            Recipe_Name: 'Recipe 2',
            Recipe_Difficulty: 2,
            Recipe_Time: 22,
            Recipe_Instructions: 'Instructions for Recipe 2',
            Recipe_Ingredients: [{
                Recipe_Ingredient_ID: 121,
                Recipe_Ingredient_Name: 'Recipe 2 Ingredient 1',
                Recipe_Ingredient_Quantity: 2,
            },
            {
                Recipe_Ingredient_ID: 122,
                Recipe_Ingredient_Name: 'Recipe 2 Ingredient 2',
                Recipe_Ingredient_Quantity: 2,
            }],
        }
    ];

beforeEach(() => {
    jest.resetAllMocks();

    (getRecipesData as jest.Mock).mockImplementation(
        (
            userId: number,
            setRecipes: (recipes: Recipe[]) => void,
        ) => {
            let returnPromise = new Promise<SyncState>((resolve) => {
                setRecipes(mockRecipes);
                resolve(SyncState.Successful);
            });
            return returnPromise;
        }
    );
    (addRecipeData as jest.Mock).mockImplementation(
        (
            userId: number,
            recipes: Recipe[],
            setRecipes: (recipes: Recipe[]) => void,
            recipe: Recipe
        ) => {
            let returnPromise = new Promise<UpdateState>((resolve) => {
                setRecipes([...recipes, recipe]);
                resolve(UpdateState.Successful);
            });
            return returnPromise;
        }
    );
    (updateRecipeData as jest.Mock).mockImplementation(
        (
            recipes: Recipe[],
            setRecipes: (recipes: Recipe[]) => void,
            recipe: Recipe
        ) => {
            let returnPromise = new Promise<UpdateState>((resolve) => {
                const updatedRecipes = recipes.map((r) => r.Recipe_ID === recipe.Recipe_ID ? recipe : r);
                setRecipes(updatedRecipes);
                resolve(UpdateState.Successful);
            });
            return returnPromise;
        }
    );
    (deleteRecipeData as jest.Mock).mockImplementation(
        (
            recipes: Recipe[],
            setRecipes: (recipes: Recipe[]) => void,
            recipeID: number
        ) => {
            let returnPromise = new Promise<UpdateState>((resolve) => {
                const updatedRecipes = recipes.filter((r) => r.Recipe_ID !== recipeID);
                setRecipes(updatedRecipes);
                resolve(UpdateState.Successful);
            });
            return returnPromise;
        }
    );
});

describe("Recipes Data Provider get", () => {
    test("should immediately fetch recipes data and update state", async () => {
        /*Arrange *******************************************************************/
        const TestComponent = () => {
            const { recipes, recipesDataState } = useRecipes();

            return (
                <View>
                    <Text >{recipesDataState}</Text>
                    <Text >{JSON.stringify(recipes)}</Text>
                </View>
            );
        }

        /*Act***********************************************************************/

        const {getByText} = render(
            <RecipesDataProvider>
                <TestComponent />
            </RecipesDataProvider>
        );

        /*Assert********************************************************************/

        await waitFor(() => {//Wait for async state updates
            expect(getByText("SyncSuccessful")).toBeTruthy();
        });

        expect(getByText(/"Recipe_Name":"Recipe 1"/i)).toBeTruthy();
        expect(getByText(/"Recipe_Name":"Recipe 2"/i)).toBeTruthy();
        expect(getByText(/"Recipe_ID":1/i)).toBeTruthy();
        expect(getByText(/"Recipe_ID":2/i)).toBeTruthy();
        expect(getByText(/"Recipe_Difficulty":1/i)).toBeTruthy();
        expect(getByText(/"Recipe_Difficulty":2/i)).toBeTruthy();
        expect(getByText(/"Recipe_Time":11/i)).toBeTruthy();
        expect(getByText(/"Recipe_Time":22/i)).toBeTruthy();
        expect(getByText(/"Recipe_Ingredient_ID":11/i)).toBeTruthy();
        expect(getByText(/"Recipe_Ingredient_ID":121/i)).toBeTruthy();
        expect(getByText(/"Recipe_Ingredient_Name":"Recipe 1 Ingredient 1"/i)).toBeTruthy();
        expect(getByText(/"Recipe_Ingredient_Name":"Recipe 2 Ingredient 1"/i)).toBeTruthy();
    });
    test("should retry fetching recipes data on failure", async () => {
        /*Arrange *******************************************************************/
        jest.useFakeTimers();

        const TestComponent = () => {
            const { recipes, recipesDataState } = useRecipes();

            return (
                <View>
                    <Text >{recipesDataState}</Text>
                    <Text >{JSON.stringify(recipes)}</Text>
                </View>
            );
        }
        (getRecipesData as jest.Mock).mockImplementationOnce(
            (
                userId: number,
                setRecipes: (recipes: Recipe[]) => void,
            ) => {
                let returnPromise = new Promise<SyncState>((resolve) => {
                    resolve(SyncState.Failed);
                });
                return returnPromise;
            }
        );
        /*Act***********************************************************************/

        const {getByText} = render(
            <RecipesDataProvider>
                <TestComponent />
            </RecipesDataProvider>
        );
        await waitFor(() => {//Wait for async state updates
            expect(getByText("SyncFailed")).toBeTruthy();
        });
        
        await waitFor(() => {
            jest.runAllTimers();
            expect(getByText(`${SyncState.Successful}`)).toBeTruthy();
        });

        /*Assert********************************************************************/

        expect(getByText(/"Recipe_Name":"Recipe 1"/i)).toBeTruthy();//check that it eventually loaded data
        expect(getByText(/"Recipe_Name":"Recipe 2"/i)).toBeTruthy();

        expect(getRecipesData).toHaveBeenCalledTimes(2);//once initially, once on retry
    });
});
describe("Recipes Data Provider add", () => {
    test("should add recipe and trigger data reload", async () => {
        const user = userEvent.setup();
        /*Arrange *******************************************************************/
        const newRecipe : Recipe = {
            Recipe_ID: 3,
            Recipe_Name: 'Recipe 3',
            Recipe_Difficulty: 2,
            Recipe_Time: 30,
            Recipe_Instructions: 'Instructions for Recipe 3',
            Recipe_Ingredients: [{
                Recipe_Ingredient_ID: 13,
                Recipe_Ingredient_Name: 'Recipe 3 Ingredient 1',
                Recipe_Ingredient_Quantity: 3,
            }]
        };

        const TestComponent = () => {
            const { recipes, addRecipe, recipesDataState } = useRecipes();
            return (
                <View>
                    <Text >{recipesDataState}</Text>
                    <Text >{JSON.stringify(recipes)}</Text>
                    <Pressable onPress={() => addRecipe(newRecipe)}>
                        <Text>Add Recipe</Text>
                    </Pressable>
                </View>
            );
        }
        /*Act***********************************************************************/

        const {getByText} = render(
            <RecipesDataProvider>
                <TestComponent />
            </RecipesDataProvider>
        );
        await waitFor(() => {//Wait for async state updates
            expect(getByText("SyncSuccessful")).toBeTruthy();
        });

        (getRecipesData as jest.Mock).mockImplementationOnce(
            (
                userId: number,
                setRecipes: (recipes: Recipe[]) => void,
            ) => {
                let returnPromise = new Promise<SyncState>((resolve) => {//this means that after adding, the data reload will include the cached change to the recipes set by the add function
                    resolve(SyncState.Successful);
                });
                return returnPromise;
            }
        );

        const addButton = getByText("Add Recipe");
        await user.press(addButton);

        /*Assert********************************************************************/

        await waitFor(() => {//Wait for async state updates
            expect(getByText("SyncSuccessful")).toBeTruthy();
        });

        expect(getByText(/"Recipe_Name":"Recipe 3"/i)).toBeTruthy();
        expect(getByText(/"Recipe_ID":3/i)).toBeTruthy();
    });
    test("should handle add recipe failure", async () => {
        const user = userEvent.setup();
        /*Arrange *******************************************************************/
        const newRecipe : Recipe = {
            Recipe_ID: 3,
            Recipe_Name: 'Recipe 3',
            Recipe_Difficulty: 2,
            Recipe_Time: 30,
            Recipe_Instructions: 'Instructions for Recipe 3',
            Recipe_Ingredients: [{
                Recipe_Ingredient_ID: 13,
                Recipe_Ingredient_Name: 'Recipe 3 Ingredient 1',
                Recipe_Ingredient_Quantity: 3,
            }]
        };
        const TestComponent = () => {
            const { recipes, addRecipe, recipesDataState } = useRecipes();
            return (
                <View>
                    <Text >{recipesDataState}</Text>
                    <Text >{JSON.stringify(recipes)}</Text>
                    <Pressable onPress={() => addRecipe(newRecipe)}>
                        <Text>Add Recipe</Text>
                    </Pressable>
                </View>
            );
        }
        (addRecipeData as jest.Mock).mockImplementationOnce(
            (
                userId: number,
                recipes: Recipe[],
                setRecipes: (recipes: Recipe[]) => void,
                recipe: Recipe
            ) => {
                let returnPromise = new Promise<UpdateState>((resolve) => {
                    resolve(UpdateState.Failed);
                });
                return returnPromise;
            }
        );
        /*Act***********************************************************************/
        const {getByText, queryByText} = render(
            <RecipesDataProvider>
                <TestComponent />
            </RecipesDataProvider>
        );

        await waitFor(() => {//Wait for async state updates
            expect(getByText("SyncSuccessful")).toBeTruthy();
        });
        

        const addButton = getByText("Add Recipe");
        await user.press(addButton);
        /*Assert********************************************************************/
        await waitFor(() => {//Wait for async state updates: Update failed state
            expect(getByText("UpdateFailed")).toBeTruthy();
        });
        expect(queryByText(/"Recipe_Name":"Recipe 3"/i)).toBeFalsy();//should not be added

        /*Arrange 2*******************************************************************/
        (getRecipesData as jest.Mock).mockImplementationOnce(
            (
                userId: number,
                setRecipes: (recipes: Recipe[]) => void,
            ) => {
                let returnPromise = new Promise<SyncState>((resolve) => {//this means that after adding, the data reload will include the cached change to the recipes set by the add function
                    resolve(SyncState.Successful);
                });
                return returnPromise;
            }
        );

        /*Act 2**********************************************************************/
        await user.press(addButton);
        await waitFor(() => {//Wait for async state updates: Successful retry
            expect(getByText("SyncSuccessful")).toBeTruthy();

        });
        /*Assert 2******************************************************************/
        expect(getByText(/"Recipe_Name":"Recipe 3"/i)).toBeTruthy();//should be added now
        expect(getRecipesData).toHaveBeenCalledTimes(2);//initial load, NOT after first add attempt, after second add attempt
        expect(addRecipeData).toHaveBeenCalledTimes(2);//two add attempts, first failed, second successful
    });
});
describe("Recipes Data Provider update", () => {
    test("should update recipe and trigger data reload", async () => {
        const user = userEvent.setup();
        /*Arrange *******************************************************************/
        const updatedRecipe : Recipe = {
            Recipe_ID: 2,
            Recipe_Name: 'Updated Recipe 2',
            Recipe_Difficulty: 3,
            Recipe_Time: 25,
            Recipe_Instructions: 'Updated Instructions for Recipe 2',
            Recipe_Ingredients: [{
                Recipe_Ingredient_ID: 121,
                Recipe_Ingredient_Name: 'Updated Recipe 2 Ingredient 1',
                Recipe_Ingredient_Quantity: 4,
            }]
        };
        const TestComponent = () => {
            const { recipes, updateRecipe, recipesDataState } = useRecipes();
            return (
                <View>
                    <Text >{recipesDataState}</Text>
                    <Text >{JSON.stringify(recipes)}</Text>
                    <Pressable onPress={() => updateRecipe(updatedRecipe)}>
                        <Text>Update Recipe</Text>
                    </Pressable>
                </View>
            );
        }
        /*Act***********************************************************************/
        const {getByText} = render(
            <RecipesDataProvider>
                <TestComponent />
            </RecipesDataProvider>
        );
        await waitFor(() => {//Wait for async state updates
            expect(getByText("SyncSuccessful")).toBeTruthy();
        });

        (getRecipesData as jest.Mock).mockImplementationOnce(
            (
                userId: number,
                setRecipes: (recipes: Recipe[]) => void,
            ) => {
                let returnPromise = new Promise<SyncState>((resolve) => {
                    resolve(SyncState.Successful);
                });
                return returnPromise;
            }
        );
        const updateButton = getByText("Update Recipe");
        await user.press(updateButton);
        /*Assert********************************************************************/

        await waitFor(() => {//Wait for async state updates
            expect(getByText("SyncSuccessful")).toBeTruthy();
        });
        expect(getByText(/"Recipe_Name":"Updated Recipe 2"/i)).toBeTruthy();
        expect(getByText(/"Recipe_Difficulty":3/i)).toBeTruthy();
        expect(getByText(/"Recipe_Time":25/i)).toBeTruthy();
        expect(getByText(/"Recipe_Ingredient_Name":"Updated Recipe 2 Ingredient 1"/i)).toBeTruthy();
    });
    test("should handle update recipe failure", async () => {
        const user = userEvent.setup();
        /*Arrange *******************************************************************/
        const updatedRecipe : Recipe = {
            Recipe_ID: 2,
            Recipe_Name: 'Updated Recipe 2',
            Recipe_Difficulty: 3,
            Recipe_Time: 25,
            Recipe_Instructions: 'Updated Instructions for Recipe 2',   
            Recipe_Ingredients: [{
                Recipe_Ingredient_ID: 121,
                Recipe_Ingredient_Name: 'Updated Recipe 2 Ingredient 1',
                Recipe_Ingredient_Quantity: 4,
            }]
        };
        const TestComponent = () => {
            const { recipes, updateRecipe, recipesDataState } = useRecipes();
            return (
                <View>
                    <Text >{recipesDataState}</Text>
                    <Text >{JSON.stringify(recipes)}</Text>
                    <Pressable onPress={() => updateRecipe(updatedRecipe)}>
                        <Text>Update Recipe</Text>
                    </Pressable>
                </View>
            );
        }
        (updateRecipeData as jest.Mock).mockImplementationOnce(
            (
                recipes: Recipe[],
                setRecipes: (recipes: Recipe[]) => void,
                recipe: Recipe
            ) => { 
                let returnPromise = new Promise<UpdateState>((resolve) => {
                    resolve(UpdateState.Failed);
                });
                return returnPromise;
            }
        );
        /*Act***********************************************************************/
        const {getByText, queryByText} = render(
            <RecipesDataProvider>
                <TestComponent />
            </RecipesDataProvider>
        );
        await waitFor(() => {//Wait for async state updates
            expect(getByText("SyncSuccessful")).toBeTruthy();
        });
        const updateButton = getByText("Update Recipe");
        await user.press(updateButton);
        /*Assert********************************************************************/
        await waitFor(() => {//Wait for async state updates: Update failed state
            expect(getByText("UpdateFailed")).toBeTruthy();
        });
        expect(queryByText(/"Recipe_Name":"Updated Recipe 2"/i)).toBeFalsy();//should not be updated

        /*Arrange 2*******************************************************************/
        (getRecipesData as jest.Mock).mockImplementationOnce(
            (
                userId: number, 
                setRecipes: (recipes: Recipe[]) => void,
            ) => {
                let returnPromise = new Promise<SyncState>((resolve) => {
                    resolve(SyncState.Successful);
                });
                return returnPromise;
            }
        );
        /*Act 2**********************************************************************/
        await user.press(updateButton);
        await waitFor(() => {//Wait for async state updates: Successful retry
            expect(getByText("SyncSuccessful")).toBeTruthy();
        });
        /*Assert 2******************************************************************/
        expect(getByText(/"Recipe_Name":"Updated Recipe 2"/i)).toBeTruthy();//should be updated now
        expect(getRecipesData).toHaveBeenCalledTimes(2);//initial load, NOT after first update attempt, after second update attempt
        expect(updateRecipeData).toHaveBeenCalledTimes(2);//two update attempts, first failed, second successful
    });
});
describe("Recipes Data Provider delete", () => {
    test("should delete recipe and trigger data reload", async () => {
        const user = userEvent.setup();
        /*Arrange *******************************************************************/
        const TestComponent = () => {
            const { recipes, deleteRecipe, recipesDataState } = useRecipes();
            return (
                <View>
                    <Text >{recipesDataState}</Text>
                    <Text >{JSON.stringify(recipes)}</Text>
                    <Pressable onPress={() => deleteRecipe(1)}>
                        <Text>Delete Recipe</Text>
                    </Pressable>
                </View>
            );
        }
        /*Act***********************************************************************/
        const {getByText, queryByText} = render(
            <RecipesDataProvider>
                <TestComponent />
            </RecipesDataProvider>
        );
        await waitFor(() => {//Wait for async state updates
            expect(getByText("SyncSuccessful")).toBeTruthy();
        });

        (getRecipesData as jest.Mock).mockImplementationOnce(
            (
                userId: number,
                setRecipes: (recipes: Recipe[]) => void,
            ) => {
                let returnPromise = new Promise<SyncState>((resolve) => {
                    resolve(SyncState.Successful);
                });
                return returnPromise;
            }
        );
        const deleteButton = getByText("Delete Recipe");
        await user.press(deleteButton);
        /*Assert********************************************************************/   
        await waitFor(() => {//Wait for async state updates
            expect(getByText("SyncSuccessful")).toBeTruthy();
        });
        expect(getByText(/"Recipe_Name":"Recipe 2"/i)).toBeTruthy();
        expect(queryByText(/"Recipe_Name":"Recipe 1"/i)).toBeFalsy();
    });
    test("should handle delete recipe failure", async () => {
        const user = userEvent.setup();
        /*Arrange *******************************************************************/
        const TestComponent = () => {
            const { recipes, deleteRecipe, recipesDataState } = useRecipes();
            return (
                <View>
                    <Text >{recipesDataState}</Text>
                    <Text >{JSON.stringify(recipes)}</Text>
                    <Pressable onPress={() => deleteRecipe(1)}>
                        <Text>Delete Recipe</Text>
                    </Pressable>
                </View>
            );
        }
        (deleteRecipeData as jest.Mock).mockImplementationOnce(
            (
                recipes: Recipe[],
                setRecipes: (recipes: Recipe[]) => void,
                recipeID: number
            ) => {
                let returnPromise = new Promise<UpdateState>((resolve) => {
                    resolve(UpdateState.Failed);
                });
                return returnPromise;
            }
        );
        /*Act***********************************************************************/
        const {getByText, queryByText} = render(
            <RecipesDataProvider>
                <TestComponent />
            </RecipesDataProvider>
        );
        await waitFor(() => {//Wait for async state updates
            expect(getByText("SyncSuccessful")).toBeTruthy();
        });
        const deleteButton = getByText("Delete Recipe");
        await user.press(deleteButton);
        /*Assert********************************************************************/
        await waitFor(() => {//Wait for async state updates: Update failed state
            expect(getByText("UpdateFailed")).toBeTruthy();
        });
        expect(queryByText(/"Recipe_Name":"Recipe 1"/i)).toBeTruthy();//should not be deleted
        /*Arrange 2*******************************************************************/
        (getRecipesData as jest.Mock).mockImplementationOnce(
            (
                userId: number,
                setRecipes: (recipes: Recipe[]) => void,
            ) => {
                let returnPromise = new Promise<SyncState>((resolve) => {
                    resolve(SyncState.Successful);
                });
                return returnPromise;
            }
        );
        /*Act 2**********************************************************************/
        await user.press(deleteButton);
        await waitFor(() => {//Wait for async state updates: Successful retry
            expect(getByText("SyncSuccessful")).toBeTruthy();
        });
        /*Assert 2******************************************************************/
        expect(queryByText(/"Recipe_Name":"Recipe 1"/i)).toBeFalsy();//should be deleted now
        expect(getRecipesData).toHaveBeenCalledTimes(2);//initial load, NOT after first delete attempt, after second delete attempt
        expect(deleteRecipeData).toHaveBeenCalledTimes(2);//two delete attempts, first failed, second successful
    });
});
