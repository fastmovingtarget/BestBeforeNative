import { render, screen, act } from '@testing-library/react';
import { getIngredientsData } from './GetIngredients';
import Ingredient from '../../Types/Ingredient'; // Adjust the import path as necessary
import fetchMock from 'jest-fetch-mock';
fetchMock.enableMocks();

// Mocking the fetch function
beforeEach(() => {
    fetch.resetMocks();
})

describe('getIngredientsData', () => {
    test('should fetch ingredients data and update state', async () => {
        const mockSetIngredients = jest.fn();
        const mockServerProps = { DatabaseServer: 'localhost', DatabasePort: '3000' };
        const userID = 1;
        const ingredients = [] as Ingredient[]; // Assuming ingredients is an array of Ingredient type

        const now = new Date();
        const tomorrow = new Date(now.getUTCMilliseconds() + 86400000); // 1 day later
        //if I instance the dates seperately in the call and response, I get different timestamps 'cos the test takes time, so I'll just make 'em here
        
        fetch.mockResponseOnce(JSON.stringify([
            {
                Ingredient_ID: 1,
                Ingredient_Name: 'Ingredient 1',
                Ingredient_Date: now,
                Ingredient_Quantity: 1,
            },
            {
                Ingredient_ID: 2,
                Ingredient_Name: 'Ingredient 2',
                Ingredient_Date: tomorrow,
                Ingredient_Quantity: 2,
            },
        ])
        );

        await getIngredientsData(
            mockServerProps,
            userID,
            ingredients,
            mockSetIngredients,
        );

        expect(mockSetIngredients).toHaveBeenCalledWith([
            {
                Ingredient_ID: 1,
                Ingredient_Name: 'Ingredient 1',
                Ingredient_Date: now,
                Ingredient_Quantity: 1,
            },
            {
                Ingredient_ID: 2,
                Ingredient_Name: 'Ingredient 2',
                Ingredient_Date: tomorrow,
                Ingredient_Quantity: 2,
            },
        ]);
    }),
    test('test get ingredients works when date isn\'t in the fetched data', async () => {
        const mockSetIngredients = jest.fn();
        const mockServerProps = { DatabaseServer: 'localhost', DatabasePort: '3000' };
        const userID = 1;
        const ingredients = [] as Ingredient[]; // Assuming ingredients is an array of Ingredient type

        const now = new Date();
        const tomorrow = new Date(now.getUTCMilliseconds() + 86400000); // 1 day later
        //if I instance the dates seperately in the call and response, I get different timestamps 'cos the test takes time, so I'll just make 'em here
        
        fetch.mockResponseOnce(JSON.stringify([
            {
                Ingredient_ID: 1,
                Ingredient_Name: 'Ingredient 1',
                Ingredient_Quantity: 1,
            },
            {
                Ingredient_ID: 2,
                Ingredient_Name: 'Ingredient 2',
                Ingredient_Quantity: 2,
            },
        ])
        );

        await getIngredientsData(
            mockServerProps,
            userID,
            ingredients,
            mockSetIngredients,
        );

        expect(mockSetIngredients).toHaveBeenCalledWith([
            {
                Ingredient_ID: 1,
                Ingredient_Name: 'Ingredient 1',
                Ingredient_Quantity: 1,
            },
            {
                Ingredient_ID: 2,
                Ingredient_Name: 'Ingredient 2',
                Ingredient_Quantity: 2,
            },
        ]);
    }),
    test('should fetch ingredients with amount high and low and update state', async () => {
        const mockSetIngredients = jest.fn();
        const mockServerProps = { DatabaseServer: 'localhost', DatabasePort: '3000' };
        const userID = 1;
        const ingredients = [] as Ingredient[]; // Assuming ingredients is an array of Ingredient type

        const now = new Date();
        const tomorrow = new Date(now.getUTCMilliseconds() + 86400000); // 1 day later

        //if I instance the dates seperately in the call and response, I get different timestamps 'cos the test takes time, so I'll just make 'em here
        fetch.mockResponseOnce(JSON.stringify([
            {
                Ingredient_ID: 1,
                Ingredient_Name: 'Ingredient 1',
                Ingredient_Date: now,
                Ingredient_Quantity: 1,
            },
            {
                Ingredient_ID: 2,
                Ingredient_Name: 'Ingredient 2',
                Ingredient_Date: tomorrow,
                Ingredient_Quantity: 2,
            },
        ])
        );

        await getIngredientsData(
            mockServerProps,
            userID,
            ingredients,
            mockSetIngredients,
            100,
            300
        );

        expect(mockSetIngredients).toHaveBeenCalledWith([
            {
                Ingredient_ID: 1,
                Ingredient_Name: 'Ingredient 1',
                Ingredient_Date: now,
                Ingredient_Quantity: 1,
            },
            {
                Ingredient_ID: 2,
                Ingredient_Name: 'Ingredient 2',
                Ingredient_Date: tomorrow,
                Ingredient_Quantity: 2,
            },
        ]);
        expect(mockSetIngredients.mock.calls[0][0]).toHaveLength(2); // Check if the length of the array is 2
        
    })
    test('should handle fetch error', async () => {
        const mockSetIngredients = jest.fn();
        const mockServerProps = { DatabaseServer: 'localhost', DatabasePort: '3000' };
        const userID = 1;
        const ingredients = [] as Ingredient[]; // Assuming ingredients is an array of Ingredient type
        fetch.mockResponseOnce(JSON.stringify({}), { status: 500 });

        await getIngredientsData(
            mockServerProps,
            userID,
            ingredients,
            mockSetIngredients,
        );

        expect(mockSetIngredients).not.toHaveBeenCalled(); // Check if setIngredients was not called
    });
})