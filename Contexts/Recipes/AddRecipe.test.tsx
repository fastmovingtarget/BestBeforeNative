import { render, screen, act } from '@testing-library/react';
import { addRecipeData } from './AddRecipe';
import Recipe from '../../Types/Recipe'; // Adjust the import path as necessary
import fetchMock from 'jest-fetch-mock';
fetchMock.enableMocks();

// Mocking the fetch function
beforeEach(() => {
    fetchMock.resetMocks();
})

test('should fetch Recipes data and update state', async () => {

    /*Arrange *******************************************************************/
    const mockSetRecipes = jest.fn();
    const mockServerProps = { DatabaseServer: 'localhost', DatabasePort: '3000' };
    const Recipes : Recipe[] = [
        {
            Recipe_ID: 1,
            Recipe_Name: 'Recipe 1',
            Recipe_Difficulty: 1,
            Recipe_Time: 11,
            Recipe_Instructions: 'Instructions for Recipe 1',
            Recipe_Ingredients: [{
                Recipe_Ingredient_ID: 11,
                Ingredient_Name: 'Recipe 1 Ingredient 1',
                Ingredient_Quantity: 2,
            },
            {
                Recipe_Ingredient_ID: 12,
                Ingredient_Name: 'Recipe 1 Ingredient 2',
                Ingredient_Quantity: 2,
            }],
        },
        {
            Recipe_ID: 2,
            Recipe_Name: 'Recipe 2',
            Recipe_Difficulty: 2,
            Recipe_Time: 22,
            Recipe_Instructions: 'Instructions for Recipe 2',
            Recipe_Ingredients: [{
                Recipe_Ingredient_ID: 21,
                Ingredient_Name: 'Recipe 2 Ingredient 1',
                Ingredient_Quantity: 2,
            },
            {
                Recipe_Ingredient_ID: 22,
                Ingredient_Name: 'Recipe 2 Ingredient 2',
                Ingredient_Quantity: 2,
            }],
        },
    ]; 

    const Recipe : Recipe = {
        Recipe_ID: 1,
        Recipe_Name: 'New Test Recipe',
        Recipe_Difficulty: 1,
        Recipe_Time: 11,
        Recipe_Instructions: 'Instructions for Test Recipe',
        Recipe_Ingredients: [{
            Recipe_Ingredient_ID: 11,
            Ingredient_Name: 'Test Recipe Ingredient 1',
            Ingredient_Quantity: 2,
        },
        {
            Recipe_Ingredient_ID: 12,
            Ingredient_Name: 'Test Recipe Ingredient 2',
            Ingredient_Quantity: 2,
        }],
    };

    fetchMock.mockResponseOnce(
        JSON.stringify({
            ...Recipe,
            Recipe_ID: 3,
        })
    );

    /*Act **********************************************************************/
    const addRecipeResponse = await addRecipeData(
        mockServerProps,
        1,
        Recipes,
        mockSetRecipes,
        Recipe
    );

    /*Assert *******************************************************************/
    expect(addRecipeResponse).toBe("successful");

    expect(mockSetRecipes).toHaveBeenCalledWith([
        ...Recipes,
        {
            ...Recipe,
            Recipe_ID: 3,
        },
    ]);
})
test("should not update state if fetch fails", async () => {
    /*Arrange *******************************************************************/
    const mockSetRecipes = jest.fn();
    const mockServerProps = { DatabaseServer: 'localhost', DatabasePort: '3000' };
    const Recipes : Recipe[] = [
        {
            Recipe_ID: 1,
            Recipe_Name: 'Recipe 1',
            Recipe_Difficulty: 1,
            Recipe_Time: 11,
            Recipe_Instructions: 'Instructions for Recipe 1',
            Recipe_Ingredients: [{
                Recipe_Ingredient_ID: 11,
                Ingredient_Name: 'Recipe 1 Ingredient 1',
                Ingredient_Quantity: 2,
            },
            {
                Recipe_Ingredient_ID: 12,
                Ingredient_Name: 'Recipe 1 Ingredient 2',
                Ingredient_Quantity: 2,
            }],
        },
        {
            Recipe_ID: 2,
            Recipe_Name: 'Recipe 2',
            Recipe_Difficulty: 2,
            Recipe_Time: 22,
            Recipe_Instructions: 'Instructions for Recipe 2',
            Recipe_Ingredients: [{
                Recipe_Ingredient_ID: 21,
                Ingredient_Name: 'Recipe 2 Ingredient 1',
                Ingredient_Quantity: 2,
            },
            {
                Recipe_Ingredient_ID: 22,
                Ingredient_Name: 'Recipe 2 Ingredient 2',
                Ingredient_Quantity: 2,
            }],
        },
    ]; 

    const Recipe : Recipe = {
        Recipe_ID: 1,
        Recipe_Name: 'New Test Recipe',
        Recipe_Difficulty: 1,
        Recipe_Time: 11,
        Recipe_Instructions: 'Instructions for Test Recipe',
        Recipe_Ingredients: [{
            Recipe_Ingredient_ID: 11,
            Ingredient_Name: 'Test Recipe Ingredient 1',
            Ingredient_Quantity: 2,
        },
        {
            Recipe_Ingredient_ID: 12,
            Ingredient_Name: 'Test Recipe Ingredient 2',
            Ingredient_Quantity: 2,
        }],
    };

    fetchMock.mockResponseOnce(
        "",
        {status: 500, statusText: "Internal Server Error"}
    );

    /*Act **********************************************************************/
    const addRecipeResponse = await addRecipeData(
        mockServerProps,
        1,
        Recipes,
        mockSetRecipes,
        Recipe
    );

    /*Assert *******************************************************************/
    expect(addRecipeResponse).toBe("failed");
    expect(mockSetRecipes).not.toHaveBeenCalled();
});