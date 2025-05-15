import { render, screen, act } from '@testing-library/react';
import { getRecipesData } from './GetRecipes';
import Recipe, {RecipesSearchOptions} from '../../Types/Recipe'; // Adjust the import path as necessary
import fetchMock from 'jest-fetch-mock';
fetchMock.enableMocks();

const mockServerProps = { DatabaseServer: 'localhost', DatabasePort: '3000' };
const userID = 1;
//         
// Mocking the fetch function
beforeEach(() => {
    fetchMock.resetMocks();
})

test('should fetch recipes and add to empty recipes array', async () => {
    const mockSetRecipes = jest.fn();
    const fetchedRecipes : Recipe[] = [
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
                Recipe_Ingredient_ID: 121,
                Ingredient_Name: 'Recipe 2 Ingredient 1',
                Ingredient_Quantity: 2,
            },
            {
                Recipe_Ingredient_ID: 122,
                Ingredient_Name: 'Recipe 2 Ingredient 2',
                Ingredient_Quantity: 2,
            }],
        }
    ]; // Assuming recipes is an array of Recipe type

    //if I instance the dates seperately in the call and response, I get different timestamps 'cos the test takes time, so I'll just make 'em here
    fetchMock.mockResponseOnce(JSON.stringify(fetchedRecipes));

    await getRecipesData(
        mockServerProps,
        userID,
        mockSetRecipes,
    );

    expect(mockSetRecipes).toHaveBeenCalledWith([
        ...fetchedRecipes,
    ]);
    
})

test('should handle fetch error', async () => {
    const mockSetRecipes = jest.fn();
    fetchMock.mockResponseOnce(JSON.stringify({}), { status: 500 });

    await getRecipesData(
        mockServerProps,
        userID,
        mockSetRecipes,
    );

    expect(mockSetRecipes).not.toHaveBeenCalled(); // Check if setRecipes was not called
});

describe("Should be called with options: ", () => {
    test('search string', async () => {
        const mockSetRecipes = jest.fn();

        const searchOptions : RecipesSearchOptions = {
            searchText: 'Recipe 1',
        }

        const fetchedRecipes : Recipe[] = [// we don't care for the full recipe data, so will just mock a single simple recipe
            {
                Recipe_ID: 1,
                Recipe_Name: 'Recipe 1',
                Recipe_Difficulty: 1,
                Recipe_Time: 11,
                Recipe_Instructions: 'Instructions for Recipe 1',
                Recipe_Ingredients: [],
            }
        ];

        fetchMock.mockResponseOnce(JSON.stringify(fetchedRecipes));

        await getRecipesData(
            mockServerProps,
            userID,
            mockSetRecipes,
            searchOptions
        );

        expect(mockSetRecipes).toHaveBeenCalledWith(fetchedRecipes);

        expect(fetchMock).toHaveBeenCalledWith(
            `http://${mockServerProps.DatabaseServer}:${mockServerProps.DatabasePort}/recipes/${userID}?searchText=Recipe%201`, 
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        )
    })
    test('search called with all options', async () => {
        const mockSetRecipes = jest.fn();

        const searchOptions : RecipesSearchOptions = {
            searchText: 'Recipe 1',
            sortBy: 'Recipe_Name',
            sortOrder: 'asc',
            amount: 10,            
        }

        const fetchedRecipes : Recipe[] = [
            {
                Recipe_ID: 1,
                Recipe_Name: 'Recipe 1',
                Recipe_Difficulty: 1,
                Recipe_Time: 11,
                Recipe_Instructions: 'Instructions for Recipe 1',
                Recipe_Ingredients: [],
            }
        ]; 

        fetchMock.mockResponseOnce(JSON.stringify(fetchedRecipes));

        await getRecipesData(
            mockServerProps,
            userID,
            mockSetRecipes,
            searchOptions
        );

        expect(mockSetRecipes).toHaveBeenCalledWith(fetchedRecipes);

        expect(fetchMock).toHaveBeenCalledWith(
            `http://${mockServerProps.DatabaseServer}:${mockServerProps.DatabasePort}/recipes/${userID}?searchText=Recipe%201&sortBy=Recipe_Name&sortOrder=asc&amount=10`, 
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        )
    })
})