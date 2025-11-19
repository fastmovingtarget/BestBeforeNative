//2025-11-19 : Ingredient_Name and Ingredient_Quantity now have Recipe_ prefix

//2025-10-23 : Updated to use UpdateState enum, improved visual formatting

import { updateRecipeData } from './UpdateRecipe';
import Recipe from '../../Types/Recipe'; // Adjust the import path as necessary
import fetchMock from 'jest-fetch-mock';
import { UpdateState } from '@/Types/DataLoadingState';

const existingRecipes: Recipe[] = [
    {
        Recipe_ID: 1,
        Recipe_Name: 'Existing Recipe 1',
        Recipe_Difficulty: 1,
        Recipe_Time: 11,
        Recipe_Instructions: 'Instructions for Existing Recipe 1',
        Recipe_Ingredients: [{
            Recipe_Ingredient_ID: 11,
            Recipe_Ingredient_Name: 'Existing Recipe 1 Ingredient 1',
            Recipe_Ingredient_Quantity: 2,
        },
        {
            Recipe_Ingredient_ID: 12,
            Recipe_Ingredient_Name: 'Existing Recipe 1 Ingredient 2',
            Recipe_Ingredient_Quantity: 2,
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
            Recipe_Ingredient_Name: 'Existing Recipe 2 Ingredient 1',
            Recipe_Ingredient_Quantity: 2,
        },
        {
            Recipe_Ingredient_ID: 122,
            Recipe_Ingredient_Name: 'Existing Recipe 2 Ingredient 2',
            Recipe_Ingredient_Quantity: 2,
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
        Recipe_Ingredient_Name: 'Updating Recipe 1 Ingredient 1',
        Recipe_Ingredient_Quantity: 2,
    },
    {
        Recipe_Ingredient_ID: 12,
        Recipe_Ingredient_Name: 'Updating Recipe 1 Ingredient 2',
        Recipe_Ingredient_Quantity: 2,
    }],
};



// Mocking the fetch function
beforeEach(() => {
    jest.resetAllMocks();
    fetchMock.enableMocks();
    fetchMock.doMock();
})

test('should fetch recipes data and update state', async () => {

    /*Arrange *******************************************************************/
    const mockSetRecipes = jest.fn();
    
    const expectedRecipes = [
        {
            Recipe_ID: 1,
            Recipe_Name: 'Updating Recipe 1',
            Recipe_Difficulty: 1,
            Recipe_Time: 11,
            Recipe_Instructions: 'Instructions for Updating Recipe 1',
            Recipe_Ingredients: [{
                Recipe_Ingredient_ID: 11,
                Recipe_Ingredient_Name: 'Updating Recipe 1 Ingredient 1',
                Recipe_Ingredient_Quantity: 2,
            },
            {
                Recipe_Ingredient_ID: 12,
                Recipe_Ingredient_Name: 'Updating Recipe 1 Ingredient 2',
                Recipe_Ingredient_Quantity: 2,
            }],
        },
        {
            Recipe_ID: 2,
            Recipe_Name: 'Existing Recipe 2',
            Recipe_Difficulty: 2,
            Recipe_Time: 22,
            Recipe_Instructions: 'Instructions for Existing Recipe 2',
            Recipe_Ingredients: [
                {
                    Recipe_Ingredient_ID: 121,
                    Recipe_Ingredient_Name: 'Existing Recipe 2 Ingredient 1',
                    Recipe_Ingredient_Quantity: 2,
                },
                {
                    Recipe_Ingredient_ID: 122,
                    Recipe_Ingredient_Name: 'Existing Recipe 2 Ingredient 2',
                    Recipe_Ingredient_Quantity: 2,
                }
            ],
        }
    ]


    fetchMock.mockResponseOnce(JSON.stringify(
            {
                ...recipe_changed,
                Recipe_ID: 1,
            },
        ), {status: 200}
    );

    /*Act **********************************************************************/
    await updateRecipeData(
        existingRecipes,
        mockSetRecipes,
        recipe_changed
    );

    /*Assert *******************************************************************/

    expect(mockSetRecipes).toHaveBeenCalledWith(expectedRecipes);
})

test("should not update state if fetch fails", async () => {
    /*Arrange *******************************************************************/
    const mockSetRecipes = jest.fn();
    
    fetchMock.mockResponseOnce(
        "",
        {status: 500, statusText: "Internal Server Error"}
    );

    /*Act **********************************************************************/
    const updateResponse = await updateRecipeData(
        existingRecipes,
        mockSetRecipes,
        recipe_changed
    );

    /*Assert *******************************************************************/
    expect(updateResponse).toBe(UpdateState.Failed);
    expect(mockSetRecipes).not.toHaveBeenCalled();
})