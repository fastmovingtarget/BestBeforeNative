//2025-10-14 : Initial Implementation of Recipe Plan Page

import { render, screen, act } from '@testing-library/react';
import { getRecipePlansData } from './GetRecipePlans';
import Recipe_Plan from '../../Types/Recipe_Plan'; // Adjust the import path as necessary
import fetchMock from 'jest-fetch-mock';
fetchMock.enableMocks();

// Mocking the fetch function
beforeEach(() => {
    fetchMock.resetMocks();
})

test('should fetch recipes', async () => {
    const mockSetRecipes = jest.fn();
    const mockServerProps = { DatabaseServer: 'localhost', DatabasePort: '3000' };
    const userID = 1;
    

    const recipePlans: Recipe_Plan[] = [
        {
            Plan_ID: 1,
            Recipe_ID: 1,
            Recipe_Name: 'Existing Recipe 1',
            Plan_Date: new Date()
        },
        {
            Plan_ID: 2,
            Recipe_ID: 2,
            Recipe_Name: 'Existing Recipe 2',
            Plan_Date: new Date()
        },
    ];

    //if I instance the dates seperately in the call and response, I get different timestamps 'cos the test takes time, so I'll just make 'em here
    fetchMock.mockResponseOnce(JSON.stringify(recipePlans));

    await getRecipePlansData(
        mockServerProps,
        userID,
        [] as Recipe_Plan [],
        mockSetRecipes,
    );

    expect(mockSetRecipes).toHaveBeenCalledWith(recipePlans);
})
test('should handle fetch error', async () => {
    const mockSetRecipes = jest.fn();
    const mockServerProps = { DatabaseServer: 'localhost', DatabasePort: '3000' };
    const userID = 1;
    const recipes = [] as Recipe_Plan[]; // Assuming recipes is an array of Recipe type
    fetchMock.mockResponseOnce(JSON.stringify({}), { status: 500 });

    await getRecipePlansData(
        mockServerProps,
        userID,
        recipes,
        mockSetRecipes,
    );

    expect(mockSetRecipes).not.toHaveBeenCalled(); // Check if setRecipes was not called
});