import { render, screen, act } from '@testing-library/react';
import { deleteIngredientData } from './DeleteIngredient';
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
    const mockServerProps = { DatabaseServer: 'localhost', DatabasePort: '3000' };
    //input ingredients
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
    //output ingredients
    const ingredients_out : Ingredient[] = [
        {
            Ingredient_ID: 2,
            Ingredient_Name: 'Ingredient 2',
            Ingredient_Date: new Date(),
            Ingredient_Quantity: 2,
        },
    ]; 

    fetchMock.mockResponseOnce(
        "",
        {status: 204, statusText: "Ingredient Deleted"}
    );

    /*Act **********************************************************************/
    await deleteIngredientData(
        mockServerProps,
        ingredients,
        mockSetIngredients,
        1
    );

    /*Assert *******************************************************************/

    expect(mockSetIngredients).toHaveBeenCalledWith(ingredients_out);
})

test("should not update state if fetch fails", async () => {
    /*Arrange *******************************************************************/
    const mockSetIngredients = jest.fn();
    const mockServerProps = { DatabaseServer: 'localhost', DatabasePort: '3000' };
    //input ingredients
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

    fetchMock.mockResponseOnce(
        "",
        {status: 500, statusText: "Internal Server Error"}
    );

    /*Act **********************************************************************/
    const deleteStatus = await deleteIngredientData(
        mockServerProps,
        ingredients,
        mockSetIngredients,
        -1
    );

    /*Assert *******************************************************************/

    expect(mockSetIngredients).toHaveBeenCalledWith(ingredients);
    expect(deleteStatus).toBe("failed");
})