//2025-10-27 : Updated to get server props inside functions

//2025-10-14 : Initial Implementation of Recipe Plan Page

import { deleteRecipePlanData } from './DeleteRecipePlan';
import Recipe_Plan from '../../Types/Recipe_Plan'; // Adjust the import path as necessary
import fetchMock from 'jest-fetch-mock';
import { UpdateState } from '@/Types/DataLoadingState';
fetchMock.enableMocks();

// Mocking the fetch function
beforeEach(() => {
    fetchMock.resetMocks();
})


test('should fetch ingredients data and update state', async () => {

    /*Arrange *******************************************************************/
    const mockSetRecipePlans = jest.fn();
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

    fetchMock.mockResponseOnce(
        "",
        {status: 204, statusText: "Recipe Deleted"}
    );

    /*Act **********************************************************************/
    await deleteRecipePlanData(
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

    fetchMock.mockResponseOnce(
        "",
        {status: 500, statusText: "Internal Server Error"}
    );

    /*Act **********************************************************************/
    const returnValue = await deleteRecipePlanData(
        recipePlans,
        mockSetRecipePlans,
        1
    );

    /*Assert *******************************************************************/

    expect(returnValue).toEqual(UpdateState.Failed);
})