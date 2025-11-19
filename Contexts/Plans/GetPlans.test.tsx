//2025-11-19 : Renamed RecipePlan(s) to just Plan(s)

//2025-10-27 : Updated server prop location, no longer takes cache to update

//2025-10-14 : Initial Implementation of Recipe Plan Page

import { getPlansData } from './GetPlans';
import Plan from '../../Types/Plan'; // Adjust the import path as necessary
import fetchMock from 'jest-fetch-mock';
fetchMock.enableMocks();

// Mocking the fetch function
beforeEach(() => {
    fetchMock.resetMocks();
})

test('should fetch plans', async () => {
    const mockSetPlans = jest.fn();
    const userID = 1;
    

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

    //if I instance the dates seperately in the call and response, I get different timestamps 'cos the test takes time, so I'll just make 'em here
    fetchMock.mockResponseOnce(JSON.stringify(recipePlans));

    await getPlansData(
        userID,
        mockSetPlans,
    );

    expect(mockSetPlans).toHaveBeenCalledWith(recipePlans);
})
test('should handle fetch error', async () => {
    const mockSetPlans = jest.fn();
    const userID = 1;
    fetchMock.mockResponseOnce(JSON.stringify({}), { status: 500 });

    await getPlansData(
        userID,
        mockSetPlans,
    );

    expect(mockSetPlans).not.toHaveBeenCalled(); // Check if setPlans was not called
});