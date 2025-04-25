import { render, screen, act } from '@testing-library/react';
import { deleteRecipePlanData } from './DeleteRecipePlan';
import Recipe_Plan from '../../Types/Recipe_Plan'; // Adjust the import path as necessary
import fetchMock from 'jest-fetch-mock';
fetchMock.enableMocks();

// Mocking the fetch function
beforeEach(() => {
    fetch.resetMocks();
})


test('should fetch ingredients data and update state', async () => {

    /*Arrange *******************************************************************/
    const mockSetRecipePlans = jest.fn();
    const mockServerProps = { DatabaseServer: 'localhost', DatabasePort: '3000' };
    //input recipes
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

    //output recipe plans
    const recipePlansOut: Recipe_Plan[] = [
        {
            Plan_ID: 2,
            Recipe_ID: 2,
            Recipe_Name: 'Existing Recipe 2',
            Plan_Date: new Date()
        },
    ];

    fetch.mockResponseOnce(
        "",
        {status: 204, statusText: "Recipe Deleted"}
    );

    /*Act **********************************************************************/
    await deleteRecipePlanData(
        mockServerProps,
        recipePlans,
        mockSetRecipePlans,
        1
    );

    /*Assert *******************************************************************/

    expect(mockSetRecipePlans).toHaveBeenCalledWith(recipePlansOut);
})

test("should not update state if fetch fails", async () => {

    /*Arrange *******************************************************************/
    const mockSetRecipePlans = jest.fn();
    const mockServerProps = { DatabaseServer: 'localhost', DatabasePort: '3000' };
    //input recipes
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

    //output recipe plans
    const recipePlansOut: Recipe_Plan[] = [
        {
            Plan_ID: 2,
            Recipe_ID: 2,
            Recipe_Name: 'Existing Recipe 2',
            Plan_Date: new Date()
        },
    ];

    fetch.mockResponseOnce(
        "",
        {status: 500, statusText: "Internal Server Error"}
    );

    /*Act **********************************************************************/
    await deleteRecipePlanData(
        mockServerProps,
        recipePlans,
        mockSetRecipePlans,
        1
    );

    /*Assert *******************************************************************/

    expect(mockSetRecipePlans).not.toHaveBeenCalled();
})