//2025-11-19 : Ingredient_Name and Ingredient_Quantity now have Recipe_ prefix

//2025-10-23 : Updated to use UpdateState enum, improved visual formatting

import { addRecipeData } from './AddRecipe';
import Recipe from '../../Types/Recipe'; // Adjust the import path as necessary
import fetchMock from 'jest-fetch-mock';
import { UpdateState } from '@/Types/DataLoadingState';

const Recipes : Recipe[] = [
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
            Recipe_Ingredient_ID: 21,
            Recipe_Ingredient_Name: 'Recipe 2 Ingredient 1',
            Recipe_Ingredient_Quantity: 2,
        },
        {
            Recipe_Ingredient_ID: 22,
            Recipe_Ingredient_Name: 'Recipe 2 Ingredient 2',
            Recipe_Ingredient_Quantity: 2,
        }],
    },
]; 

const TestRecipe : Recipe = {
    Recipe_Name: 'New Test Recipe',
    Recipe_Difficulty: 1,
    Recipe_Time: 11,
    Recipe_Instructions: 'Instructions for Test Recipe',
    Recipe_Ingredients: [{
        Recipe_Ingredient_ID: 11,
        Recipe_Ingredient_Name: 'Test Recipe Ingredient 1',
        Recipe_Ingredient_Quantity: 2,
    },
    {
        Recipe_Ingredient_ID: 12,
        Recipe_Ingredient_Name: 'Test Recipe Ingredient 2',
        Recipe_Ingredient_Quantity: 2,
    }],
};

const mockSetRecipes = jest.fn();

// Mocking the fetch function
beforeEach(() => {
    jest.resetAllMocks();
    fetchMock.enableMocks();
    fetchMock.doMock();
})

test('should fetch Recipes data and update state', async () => {

    /*Arrange *******************************************************************/
    const expectedRecipes = [
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
                Recipe_Ingredient_ID: 21,
                Recipe_Ingredient_Name: 'Recipe 2 Ingredient 1',
                Recipe_Ingredient_Quantity: 2,
            },
            {
                Recipe_Ingredient_ID: 22,
                Recipe_Ingredient_Name: 'Recipe 2 Ingredient 2',
                Recipe_Ingredient_Quantity: 2,
            }],
        },{
            Recipe_ID: 3,
            Recipe_Name: 'New Test Recipe',
            Recipe_Difficulty: 1,
            Recipe_Time: 11,
            Recipe_Instructions: 'Instructions for Test Recipe',
            Recipe_Ingredients: [{
                Recipe_Ingredient_ID: 11,
                Recipe_Ingredient_Name: 'Test Recipe Ingredient 1',
                Recipe_Ingredient_Quantity: 2,
            },
            {
                Recipe_Ingredient_ID: 12,
                Recipe_Ingredient_Name: 'Test Recipe Ingredient 2',
                Recipe_Ingredient_Quantity: 2,
            }]
        }        
    ]; 
    fetchMock.mockResponseOnce(
        JSON.stringify({
            ...TestRecipe,
            Recipe_ID: 3,
        })
    );

    /*Act **********************************************************************/
    const addRecipeResponse = await addRecipeData(
        1,
        Recipes,
        mockSetRecipes,
        TestRecipe
    );

    /*Assert *******************************************************************/
    expect(addRecipeResponse).toBe(UpdateState.Successful);

    expect(mockSetRecipes).toHaveBeenCalledWith(expectedRecipes);
})
test("should not update state if fetch fails", async () => {
    /*Arrange *******************************************************************/    
    fetchMock.mockResponseOnce(
        "",
        {status: 500, statusText: "Internal Server Error"}
    );

    /*Act **********************************************************************/
    const addRecipeResponse = await addRecipeData(
        1,
        Recipes,
        mockSetRecipes,
        TestRecipe
    );

    /*Assert *******************************************************************/
    expect(addRecipeResponse).toBe(UpdateState.Failed);
    expect(mockSetRecipes).not.toHaveBeenCalled();
});