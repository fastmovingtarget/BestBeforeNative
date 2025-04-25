import { render, screen, act } from '@testing-library/react';
import { updateRecipePlanData } from './UpdateRecipePlan';
import Recipe_Plan from '../../Types/Recipe_Plan'; // Adjust the import path as necessary
import fetchMock from 'jest-fetch-mock';
fetchMock.enableMocks();

// Mocking the fetch function
beforeEach(() => {
    fetch.resetMocks();
})

test('should fetch recipes data and update state', async () => {

    /*Arrange *******************************************************************/
    const mockSetRecipes = jest.fn();
    const mockServerProps = { DatabaseServer: 'localhost', DatabasePort: '3000' };
    
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

    const updateRecipePlan: Recipe_Plan = {
        Plan_ID: 1,
        Recipe_ID: 3,
        Recipe_Name: 'Test Recipe',
        Plan_Date: new Date()
    }

    fetch.mockResponseOnce(JSON.stringify(
            {
                ...updateRecipePlan,
                Recipe_ID: 1,
            },
        ), {status: 200}
    );

    /*Act **********************************************************************/
    await updateRecipePlanData(
        mockServerProps,
        recipePlans,
        mockSetRecipes,
        updateRecipePlan
    );

    /*Assert *******************************************************************/

    expect(mockSetRecipes).toHaveBeenCalledWith([
        updateRecipePlan,
        recipePlans[1]
    ]);
})

test("should not update state if fetch fails", async () => {
    /*Arrange *******************************************************************/
    const mockSetRecipes = jest.fn();
    const mockServerProps = { DatabaseServer: 'localhost', DatabasePort: '3000' };
    
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

    const newRecipePlan: Recipe_Plan = {
        Plan_ID: 1,
        Recipe_ID: 3,
        Recipe_Name: 'Test Recipe',
        Plan_Date: new Date()
    }

    fetch.mockResponseOnce(
        "",
        {status: 500, statusText: "Internal Server Error"}
    );

    /*Act **********************************************************************/
    await updateRecipePlanData(
        mockServerProps,
        recipePlans,
        mockSetRecipes,
        newRecipePlan
    );

    /*Assert *******************************************************************/

    expect(mockSetRecipes).not.toHaveBeenCalled();
})