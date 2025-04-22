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
        fetch.mockResponseOnce(JSON.stringify([
                { id: 1, name: 'Ingredient 1' },
                { id: 2, name: 'Ingredient 2' },
            ])
        );

        await getIngredientsData(
            mockServerProps,
            userID,
            ingredients,
            mockSetIngredients,
        );

        expect(mockSetIngredients).toHaveBeenCalledWith([
            { id: 1, name: 'Ingredient 1' },
            { id: 2, name: 'Ingredient 2' },
        ]);
    }),
    test('should fetch ingredients with amount high and low and update state', async () => {
        const mockSetIngredients = jest.fn();
        const mockServerProps = { DatabaseServer: 'localhost', DatabasePort: '3000' };
        const userID = 1;
        const ingredients = [] as Ingredient[]; // Assuming ingredients is an array of Ingredient type
        fetch.mockResponseOnce(JSON.stringify([
                { id: 1, name: 'Ingredient 1' },
                { id: 2, name: 'Ingredient 2' },
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
            { id: 1, name: 'Ingredient 1' },
            { id: 2, name: 'Ingredient 2' },
        ]);
        expect(mockSetIngredients.mock.calls[0][0]).toHaveLength(2); // Check if the length of the array is 2
        
    })
})