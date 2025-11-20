//2025-11-20 : Shifting test files into their own folder in the hierarchy

//2025-11-19 : Renamed RecipePlan/nner to just Planner, Recipe_Plan to just Plan

//2025-11-17 : Correctly shows Recipe Plans for date

//2025-10-28 : Improved styling

//2025-10-14 : Initial Implementation of Recipe Plan Page

import {render, userEvent } from '@testing-library/react-native';
import { usePlans } from '@/Contexts/Plans/PlansDataProvider';
import PlannerCalendarDay from '@/components/Planner/PlannerCalendar/PlannerCalendarDay/PlannerCalendarDay';

    
jest.mock('@/Contexts/Plans/PlansDataProvider', () => {
    return {
        __esModule: true,
        usePlans: jest.fn()
    };
});

const mockPlans = [
    {
        Plan_ID: 1,
        Plan_Date: new Date(2023, 9, 1), // October 1, 2023
        Recipe_ID: 1,
        Recipe_Name: "Test Recipe 1",
    },
    {
        Plan_ID: 2,
        Plan_Date: new Date(2023, 9, 1), // October 1, 2023
        Recipe_ID: 2,
        Recipe_Name: "Test Recipe 2",
    }];

beforeEach(() => {
    (usePlans as jest.Mock).mockReturnValue({
        plans: mockPlans
    });
});



describe("PlannerCalendarDay Component Renders", () => {
    test("The Correct Date", () => {
        const mockDate = new Date(2023, 9, 1); // October 1, 2023
        const {getByText} = render(
            <PlannerCalendarDay
                date={mockDate}
                onPress={() => {}}
            />
        );

        expect(getByText("1")).toBeTruthy();
    })
    test("No Recipes when there are no recipes for that date", () => {
        const mockDate = new Date(2023, 9, 2); // October 1, 2023
        const {queryByLabelText} = render(
            <PlannerCalendarDay
                date={mockDate}
                onPress={() => {}}
            />
        );

        expect(queryByLabelText(/recipe-plan-/i)).toBeFalsy();
    })
    test("The correct recipes when there are recipes for that date", () => {
        const mockDate = new Date(2023, 9, 1); // October 1, 2023
        const {getByText} = render(
            <PlannerCalendarDay
                date={mockDate}
                onPress={() => {}}
            />
        );
        expect(getByText("Test Recipe 1")).toBeTruthy();
        expect(getByText("Test Recipe 2")).toBeTruthy();
    })
})
test("When clicked, the recipe plan day should call the onPress function", async () => {

    const user = userEvent.setup();

    const mockOnPress = jest.fn();

    const mockDate = new Date(2023, 9, 1); // October 1, 2023
    const {getByText} = render(
        <PlannerCalendarDay
            date={mockDate}
            onPress={mockOnPress}
        />
    );

    const calendarElement = getByText("1");
    await user.press(calendarElement);

    expect(mockOnPress).toHaveBeenCalledWith(1);
})