import { render, screen, act } from '@testing-library/react';
import { getRecipesData } from './GetRecipes';
import Recipe from '../../Types/Recipe'; // Adjust the import path as necessary
import fetchMock from 'jest-fetch-mock';
fetchMock.enableMocks();

// Mocking the fetch function
beforeEach(() => {
    fetch.resetMocks();
})

test('should fetch recipes with amount high and low and update state', async () => {
    const mockSetRecipes = jest.fn();
    const mockServerProps = { DatabaseServer: 'localhost', DatabasePort: '3000' };
    const userID = 1;
    const addedRecipes : Recipe[] = [
        {
            Recipe_ID: 1,
            Recipe_Name: 'Added Recipe 1',
            Recipe_Difficulty: 1,
            Recipe_Time: 11,
            Recipe_Instructions: 'Instructions for Added Recipe 1',
            Recipe_Ingredients: [{
                Recipe_Ingredient_ID: 11,
                Ingredient_Name: 'Added Recipe 1 Ingredient 1',
                Ingredient_Quantity: 2,
            },
            {
                Recipe_Ingredient_ID: 12,
                Ingredient_Name: 'Added Recipe 1 Ingredient 2',
                Ingredient_Quantity: 2,
            }],
        },
        {
            Recipe_ID: 2,
            Recipe_Name: 'Added Recipe 2',
            Recipe_Difficulty: 2,
            Recipe_Time: 22,
            Recipe_Instructions: 'Instructions for Added Recipe 2',
            Recipe_Ingredients: [{
                Recipe_Ingredient_ID: 121,
                Ingredient_Name: 'Added Recipe 2 Ingredient 1',
                Ingredient_Quantity: 2,
            },
            {
                Recipe_Ingredient_ID: 122,
                Ingredient_Name: 'Added Recipe 2 Ingredient 2',
                Ingredient_Quantity: 2,
            }],
        }
    ]; // Assuming recipes is an array of Recipe type

    const existingRecipes: Recipe[] = [
        {
            Recipe_ID: 1,
            Recipe_Name: 'Existing Recipe 1',
            Recipe_Difficulty: 1,
            Recipe_Time: 11,
            Recipe_Instructions: 'Instructions for Existing Recipe 1',
            Recipe_Ingredients: [{
                Recipe_Ingredient_ID: 11,
                Ingredient_Name: 'Existing Recipe 1 Ingredient 1',
                Ingredient_Quantity: 2,
            },
            {
                Recipe_Ingredient_ID: 12,
                Ingredient_Name: 'Existing Recipe 1 Ingredient 2',
                Ingredient_Quantity: 2,
            }],
        },
        {
            Recipe_ID: 2,
            Recipe_Name: 'Existing Recipe 2',
            Recipe_Difficulty: 2,
            Recipe_Time: 22,
            Recipe_Instructions: 'Instructions for Existing Recipe 2',
            Recipe_Ingredients: [{
                Recipe_Ingredient_ID: 121,
                Ingredient_Name: 'Existing Recipe 2 Ingredient 1',
                Ingredient_Quantity: 2,
            },
            {
                Recipe_Ingredient_ID: 122,
                Ingredient_Name: 'Existing Recipe 2 Ingredient 2',
                Ingredient_Quantity: 2,
            }],
        }
    ]

    //if I instance the dates seperately in the call and response, I get different timestamps 'cos the test takes time, so I'll just make 'em here
    fetch.mockResponseOnce(JSON.stringify(addedRecipes));

    await getRecipesData(
        mockServerProps,
        userID,
        existingRecipes,
        mockSetRecipes,
        100,
        300
    );

    expect(mockSetRecipes).toHaveBeenCalledWith([
        ...existingRecipes,
        ...addedRecipes,
    ]);
    
})
test('should handle fetch error', async () => {
    const mockSetRecipes = jest.fn();
    const mockServerProps = { DatabaseServer: 'localhost', DatabasePort: '3000' };
    const userID = 1;
    const recipes = [] as Recipe[]; // Assuming recipes is an array of Recipe type
    fetch.mockResponseOnce(JSON.stringify({}), { status: 500 });

    await getRecipesData(
        mockServerProps,
        userID,
        recipes,
        mockSetRecipes,
    );

    expect(mockSetRecipes).not.toHaveBeenCalled(); // Check if setRecipes was not called
});