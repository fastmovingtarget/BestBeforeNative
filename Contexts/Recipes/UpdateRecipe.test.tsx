import { render, screen, act } from '@testing-library/react';
import { updateRecipeData } from './UpdateRecipe';
import Recipe from '../../Types/Recipe'; // Adjust the import path as necessary
import fetchMock from 'jest-fetch-mock';
fetchMock.enableMocks();

// Mocking the fetch function
beforeEach(() => {
    fetchMock.resetMocks();
})

test('should fetch recipes data and update state', async () => {

    /*Arrange *******************************************************************/
    const mockSetRecipes = jest.fn();
    const mockServerProps = { DatabaseServer: 'localhost', DatabasePort: '3000' };
    
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

    const recipe_changed : Recipe = {
        Recipe_ID: 1,
        Recipe_Name: 'Updating Recipe 1',
        Recipe_Difficulty: 1,
        Recipe_Time: 11,
        Recipe_Instructions: 'Instructions for Updating Recipe 1',
        Recipe_Ingredients: [{
            Recipe_Ingredient_ID: 11,
            Ingredient_Name: 'Updating Recipe 1 Ingredient 1',
            Ingredient_Quantity: 2,
        },
        {
            Recipe_Ingredient_ID: 12,
            Ingredient_Name: 'Updating Recipe 1 Ingredient 2',
            Ingredient_Quantity: 2,
        }],
    };

    fetchMock.mockResponseOnce(JSON.stringify(
            {
                ...recipe_changed,
                Recipe_ID: 1,
            },
        ), {status: 200}
    );

    /*Act **********************************************************************/
    await updateRecipeData(
        mockServerProps,
        existingRecipes,
        mockSetRecipes,
        recipe_changed
    );

    /*Assert *******************************************************************/

    expect(mockSetRecipes).toHaveBeenCalledWith([
        recipe_changed,
        existingRecipes[1]
    ]);
})

test("should not update state if fetch fails", async () => {
    /*Arrange *******************************************************************/
    const mockSetRecipes = jest.fn();
    const mockServerProps = { DatabaseServer: 'localhost', DatabasePort: '3000' };
    
    
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

    const recipe_changed : Recipe = {
        Recipe_ID: 1,
        Recipe_Name: 'Updating Recipe 1',
        Recipe_Difficulty: 1,
        Recipe_Time: 11,
        Recipe_Instructions: 'Instructions for Updating Recipe 1',
        Recipe_Ingredients: [{
            Recipe_Ingredient_ID: 11,
            Ingredient_Name: 'Updating Recipe 1 Ingredient 1',
            Ingredient_Quantity: 2,
        },
        {
            Recipe_Ingredient_ID: 12,
            Ingredient_Name: 'Updating Recipe 1 Ingredient 2',
            Ingredient_Quantity: 2,
        }],
    };

    fetchMock.mockResponseOnce(
        "",
        {status: 500, statusText: "Internal Server Error"}
    );

    /*Act **********************************************************************/
    const updateResponse = await updateRecipeData(
        mockServerProps,
        existingRecipes,
        mockSetRecipes,
        recipe_changed
    );

    /*Assert *******************************************************************/
    expect(updateResponse).toBe("failed");
})