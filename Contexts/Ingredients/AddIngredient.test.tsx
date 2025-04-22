import { render, screen, act } from '@testing-library/react';
import { addIngredientData } from './AddIngredient';
import Ingredient from '../../Types/Ingredient'; // Adjust the import path as necessary
import fetchMock from 'jest-fetch-mock';
fetchMock.enableMocks();

// Mocking the fetch function
beforeEach(() => {
    fetch.resetMocks();
})

test('should fetch ingredients data and update state', async () => {

    /*Arrange *******************************************************************/
    const mockSetIngredients = jest.fn();
    const mockServerProps = { DatabaseServer: 'localhost', DatabasePort: '3000' };
    const ingredients : Ingredient[] = [
        {
            Ingredient_ID: 1,
            Ingredient_Name: 'Ingredient 1',
            Ingredient_Date: new Date(),
            Ingredient_Quantity: 1,
        },
        {
            Ingredient_ID: 2,
            Ingredient_Name: 'Ingredient 2',
            Ingredient_Date: new Date(),
            Ingredient_Quantity: 2,
        },
    ]; 

    const ingredient : Ingredient = {
        Ingredient_Name: 'Ingredient 1',
        Ingredient_Date: new Date(),
        Ingredient_Quantity: 1,
    };

    fetch.mockResponseOnce(JSON.stringify(
            {
                ...ingredient,
                Ingredient_ID: 3,
            },
        )
    );

    /*Act **********************************************************************/
    await addIngredientData(
        mockServerProps,
        ingredients,
        mockSetIngredients,
        ingredient
    );

    /*Assert *******************************************************************/

    expect(mockSetIngredients).toHaveBeenCalledWith([
        ...ingredients,
        {
            ...ingredient,
            Ingredient_ID: 3,
        },
    ]);
})