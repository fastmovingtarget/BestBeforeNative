//2025-11-20 : Shifting test files into their own folder in the hierarchy

//2025-11-19 : Renamed RecipePlan(s) to just Plan(s)

//2025-10-27 : Updated to get server props inside functions

//2025-10-14 : Initial Implementation of Recipe Plan Page

import { addPlanData } from '../../../Contexts/Plans/AddPlan';
import fetchMock from 'jest-fetch-mock';
import Plan from '../../../Types/Plan';
fetchMock.enableMocks();

// Mocking the fetch function
beforeEach(() => {
    fetchMock.resetMocks();
})

test('should fetch Recipe Plan data and update state', async () => {

    /*Arrange *******************************************************************/
    const mockSetPlans = jest.fn();

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

    const newPlan: Plan = {
        Recipe_ID: 3,
        Recipe_Name: 'Test Recipe',
        Plan_Date: new Date()
    }

    fetchMock.mockResponseOnce(JSON.stringify(
                {
                    ...newPlan,
                    Plan_ID: 3,
                },
            )
        );
    
        /*Act **********************************************************************/
        await addPlanData(
            1,
            Plans,
            mockSetPlans,
            newPlan
        );
    
        /*Assert *******************************************************************/
    
        expect(mockSetPlans).toHaveBeenCalledWith([
            ...Plans,
            {
                ...newPlan,
                Plan_ID: 3,
            },
        ]);
});
test("should not update state if fetch fails", async () => {
    
    /*Arrange *******************************************************************/
    const mockSetPlans = jest.fn();

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

    const newPlan: Plan = {
        Recipe_ID: 3,
        Recipe_Name: 'Test Recipe',
        Plan_Date: new Date()
    }

    fetchMock.mockResponseOnce(
        "",
        {status: 500, statusText: "Internal Server Error"}
    );
    
    /*Act **********************************************************************/
    await addPlanData(
        1,
        Plans,
        mockSetPlans,
        newPlan
    );

    
    /*Assert *******************************************************************/

    expect(mockSetPlans).not.toHaveBeenCalled();

})