//2025-10-27 : Updated to get server props inside functions

//2025-10-14 : Initial Implementation of Recipe Plan Page

import { addRecipePlanData } from './AddRecipePlan';
import Recipe_Plan from '../../Types/Recipe_Plan'; // Adjust the import path as necessary
import fetchMock from 'jest-fetch-mock';
fetchMock.enableMocks();

// Mocking the fetch function
beforeEach(() => {
    fetchMock.resetMocks();
})

test('should fetch Recipe Plan data and update state', async () => {

    /*Arrange *******************************************************************/
    const mockSetRecipePlans = jest.fn();

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
        Recipe_ID: 3,
        Recipe_Name: 'Test Recipe',
        Plan_Date: new Date()
    }

    fetchMock.mockResponseOnce(JSON.stringify(
                {
                    ...newRecipePlan,
                    Recipe_Plan_ID: 3,
                },
            )
        );
    
        /*Act **********************************************************************/
        await addRecipePlanData(
            1,
            recipePlans,
            mockSetRecipePlans,
            newRecipePlan
        );
    
        /*Assert *******************************************************************/
    
        expect(mockSetRecipePlans).toHaveBeenCalledWith([
            ...recipePlans,
            {
                ...newRecipePlan,
                Recipe_Plan_ID: 3,
            },
        ]);
});
test("should not update state if fetch fails", async () => {
    
    /*Arrange *******************************************************************/
    const mockSetRecipePlans = jest.fn();

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
        Recipe_ID: 3,
        Recipe_Name: 'Test Recipe',
        Plan_Date: new Date()
    }

    fetchMock.mockResponseOnce(
        "",
        {status: 500, statusText: "Internal Server Error"}
    );
    
    /*Act **********************************************************************/
    await addRecipePlanData(
        1,
        recipePlans,
        mockSetRecipePlans,
        newRecipePlan
    );

    
    /*Assert *******************************************************************/

    expect(mockSetRecipePlans).not.toHaveBeenCalled();

})