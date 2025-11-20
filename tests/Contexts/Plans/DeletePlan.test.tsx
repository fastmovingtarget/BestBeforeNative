//2025-11-20 : Shifting test files into their own folder in the hierarchy

//2025-11-19 : Renamed RecipePlan(s) to just Plan(s)

//2025-10-27 : Updated to get server props inside functions

//2025-10-14 : Initial Implementation of Recipe Plan Page

import { deletePlanData } from '../../../Contexts/Plans/DeletePlan';
import fetchMock from 'jest-fetch-mock';
import { UpdateState } from '@/Types/DataLoadingState';
import Plan from '../../../Types/Plan';
fetchMock.enableMocks();

// Mocking the fetch function
beforeEach(() => {
    fetchMock.resetMocks();
})


test('should fetch plan data and update state', async () => {

    /*Arrange *******************************************************************/
    const mockSetPlans = jest.fn();
    //input plans
    const Plans: Plan[] = [
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
    const plansOut: Plan[] = [
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
    await deletePlanData(
        Plans,
        mockSetPlans,
        1
    );

    /*Assert *******************************************************************/

    expect(mockSetPlans).toHaveBeenCalledWith(plansOut);
})

test("should not update state if fetch fails", async () => {

    /*Arrange *******************************************************************/
    const mockSetPlans = jest.fn();
    //input plans
    const Plans: Plan[] = [
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
    const returnValue = await deletePlanData(
        Plans,
        mockSetPlans,
        1
    );

    /*Assert *******************************************************************/

    expect(returnValue).toEqual(UpdateState.Failed);
})