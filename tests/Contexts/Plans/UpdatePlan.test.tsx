//2025-11-20 : Shifting test files into their own folder in the hierarchy

//2025-11-19 : Renamed RecipePlan(s) to just Plan(s)

//2025-10-28 : Added promise wrapper, getting server props internally

import { updatePlanData } from '../../../Contexts/Plans/UpdatePlan';
import Plan from '../../../Types/Plan'; // Adjust the import path as necessary
import fetchMock from 'jest-fetch-mock';
fetchMock.enableMocks();

// Mocking the fetch function
beforeEach(() => {
    fetchMock.resetMocks();
})

test('should fetch recipes data and update state', async () => {

    /*Arrange *******************************************************************/
    const mockSetRecipes = jest.fn();
    
    const recipePlans: Plan[] = [
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

    const updateRecipePlan: Plan = {
        Plan_ID: 1,
        Recipe_ID: 3,
        Recipe_Name: 'Test Recipe',
        Plan_Date: new Date()
    }
    
    /*Act **********************************************************************/
    await updatePlanData(
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