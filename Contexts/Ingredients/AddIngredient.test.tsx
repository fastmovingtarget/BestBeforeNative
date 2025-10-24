//2025-10-22 : Removing server props from test criteria

import { addIngredientData } from './AddIngredient';
import Ingredient from '../../Types/Ingredient'; // Adjust the import path as necessary
import fetchMock from 'jest-fetch-mock';
fetchMock.enableMocks();

// Mocking the fetch function
beforeEach(() => {
    fetchMock.resetMocks();
})

test('should fetch ingredients data and update state', async () => {

    /*Arrange *******************************************************************/
    const mockSetIngredients = jest.fn();
    const today = new Date();
    const ingredients : Ingredient[] = [
        {
            Ingredient_ID: 1,
            Ingredient_Name: 'Ingredient 1',
            Ingredient_Date: today,
            Ingredient_Quantity: 1,
        },
        {
            Ingredient_ID: 2,
            Ingredient_Name: 'Ingredient 2',
            Ingredient_Date: today,
            Ingredient_Quantity: 2,
        },
    ]; 

    const ingredient : Ingredient = {
        Ingredient_Name: 'Ingredient 1',
        Ingredient_Date: today,
        Ingredient_Quantity: 1,
    };

    fetchMock.mockResponseOnce(JSON.stringify(
            {
                ...ingredient,
                Ingredient_ID: 3,
            },
        )
    );

    /*Act **********************************************************************/
    await addIngredientData(
        1,
        ingredients,
        mockSetIngredients,
        ingredient
    );

    /*Assert *******************************************************************/

    expect(fetchMock).toHaveBeenCalledWith(
        `http://${"192.168.50.183"}:${"5091"}/ingredients/`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body : `{\"Ingredient_Name\":\"Ingredient 1\",\"Ingredient_Date\":\"${today.toISOString().slice(0, 10)}\",\"Ingredient_Quantity\":1,\"Ingredient_User_ID\":1}`
        })
    expect(mockSetIngredients).toHaveBeenCalledWith([
        ...ingredients,
        {
            ...ingredient,
            Ingredient_ID: 3,
        },
    ]);
})
test("should not update state if fetch fails", async () => {
    /*Arrange *******************************************************************/
    const mockSetIngredients = jest.fn();
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

    fetchMock.mockResponseOnce(
        "",
        {status: 500, statusText: "Internal Server Error"}
    );

    /*Act **********************************************************************/
    await addIngredientData(
        1,
        ingredients,
        mockSetIngredients,
        ingredient
    );

    /*Assert *******************************************************************/

    expect(mockSetIngredients).not.toHaveBeenCalled();
});