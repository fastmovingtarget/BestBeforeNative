//2025-10-23 : Updated to use UpdateState enum, improved visual formatting

import { deleteRecipeData } from './DeleteRecipe';
import Recipe from '../../Types/Recipe'; // Adjust the import path as necessary
import fetchMock from 'jest-fetch-mock';
import { UpdateState } from '@/Types/DataLoadingState';
fetchMock.enableMocks();

const recipes : Recipe[] = [
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

// Mocking the fetch function
beforeEach(() => {
    fetchMock.resetMocks();
})

test('should fetch ingredients data and update state', async () => {

    /*Arrange *******************************************************************/
    const mockSetRecipes = jest.fn();
    //input recipes

    //output ingredients
    const recipes_out : Recipe[] = [
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

    fetchMock.mockResponseOnce(
        "",
        {status: 204, statusText: "Recipe Deleted"}
    );

    /*Act **********************************************************************/
    const deleteResponse = await deleteRecipeData(
        recipes,
        mockSetRecipes,
        1
    );

    /*Assert *******************************************************************/
    expect(deleteResponse).toBe(UpdateState.Successful);
    expect(mockSetRecipes).toHaveBeenCalledWith(recipes_out);
})

test("should not update state if fetch fails", async () => {
    /*Arrange *******************************************************************/
    const mockSetRecipes = jest.fn();
    //input recipes

    fetchMock.mockResponseOnce(
        "",
        {status: 500, statusText: "Internal Server Error"}
    );

    /*Act **********************************************************************/
    const deleteResponse = await deleteRecipeData(
        recipes,
        mockSetRecipes,
        -1
    );

    /*Assert *******************************************************************/
    expect(deleteResponse).toBe(UpdateState.Failed);
    expect(mockSetRecipes).not.toHaveBeenCalled();
})