//2025-11-10 : Update now handles null date correctly

//2025-10-23 : Minor improvements to test formatting

//2025-10-22 : Removing server props from test criteria


import { updateIngredientData } from './UpdateIngredient';
import Ingredient from '../../Types/Ingredient'; // Adjust the import path as necessary
import fetchMock from 'jest-fetch-mock';
import { UpdateState } from '@/Types/DataLoadingState';
fetchMock.enableMocks();

// Mocking the fetch function
beforeEach(() => {
    fetchMock.resetMocks();
})

test('should fetch ingredients data and update state', async () => {

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

    const ingredient_changed : Ingredient = {
        Ingredient_Name: 'Updated Ingredient 1',
        Ingredient_Date: new Date(),
        Ingredient_Quantity: 1,
        Ingredient_ID: 1,
    };

    fetchMock.mockResponseOnce(JSON.stringify(
            {
                ...ingredient_changed,
                Ingredient_ID: 1,
            },
        ), {status: 200}
    );

    /*Act **********************************************************************/
    const updateIngredientsState = await updateIngredientData(
        ingredients,
        mockSetIngredients,
        ingredient_changed
    );

    /*Assert *******************************************************************/

    expect(mockSetIngredients).toHaveBeenCalledWith([
        ingredient_changed,
        ingredients[1]
    ]);
    expect(updateIngredientsState).toEqual(UpdateState.Successful);
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

    const ingredient_changed : Ingredient = {
        Ingredient_Name: 'Updated Ingredient 1',
        Ingredient_Date: new Date(),
        Ingredient_Quantity: 1,
        Ingredient_ID: 1,
    };

    fetchMock.mockResponseOnce(
        "",
        {status: 500, statusText: "Internal Server Error"}
    );

    /*Act **********************************************************************/
    const ingredientsState = await updateIngredientData(
        ingredients,
        mockSetIngredients,
        ingredient_changed
    );

    /*Assert *******************************************************************/

    expect(ingredientsState).toEqual(UpdateState.Failed);
    expect(mockSetIngredients).not.toHaveBeenCalled();
})
test("updates correctly when there is no date provided", async () => {
    /*Arrange *******************************************************************/
    const mockSetIngredients = jest.fn();
    const ingredients : Ingredient[] = [
        {
            Ingredient_ID: 1,
            Ingredient_Name: 'Ingredient 1',
            Ingredient_Date: new Date('2025-11-01'),
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
        Ingredient_Date: undefined,
        Ingredient_Quantity: 1,
        Ingredient_ID: 1,
    };
    fetchMock.mockResponseOnce(JSON.stringify(
            {
                ...ingredient_changed,
                Ingredient_ID: 1,
            },
        ), {status: 200}
    );
    /*Act **********************************************************************/
    const updateIngredientsState = await updateIngredientData(
        ingredients,
        mockSetIngredients,
        ingredient_changed
    );
    /*Assert *******************************************************************/ 
    expect(mockSetIngredients).toHaveBeenCalledWith([
        ingredient_changed,
        ingredients[1]
    ]);
    expect(updateIngredientsState).toEqual(UpdateState.Successful);
    expect(fetchMock.mock.calls[0][1]?.body).toContain('"Ingredient_Date":null');//check that the date was set to today in the body
});