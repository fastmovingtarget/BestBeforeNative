import { render, screen, act } from '@testing-library/react';
import { updateIngredientData } from './UpdateIngredient';
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

    const ingredient_changed : Ingredient = {
        Ingredient_Name: 'Updated Ingredient 1',
        Ingredient_Date: new Date(),
        Ingredient_Quantity: 1,
        Ingredient_ID: 1,
    };

    fetch.mockResponseOnce(JSON.stringify(
            {
                ...ingredient_changed,
                Ingredient_ID: 1,
            },
        ), {status: 200}
    );

    /*Act **********************************************************************/
    await updateIngredientData(
        mockServerProps,
        ingredients,
        mockSetIngredients,
        ingredient_changed
    );

    /*Assert *******************************************************************/

    expect(mockSetIngredients).toHaveBeenCalledWith([
        ingredient_changed,
        ingredients[1]
    ]);
})

test("should not update state if fetch fails", async () => {
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

    const ingredient_changed : Ingredient = {
        Ingredient_Name: 'Updated Ingredient 1',
        Ingredient_Date: new Date(),
        Ingredient_Quantity: 1,
        Ingredient_ID: 1,
    };

    fetch.mockResponseOnce(
        "",
        {status: 500, statusText: "Internal Server Error"}
    );

    /*Act **********************************************************************/
    await updateIngredientData(
        mockServerProps,
        ingredients,
        mockSetIngredients,
        ingredient_changed
    );

    /*Assert *******************************************************************/

    expect(mockSetIngredients).not.toHaveBeenCalled();
})