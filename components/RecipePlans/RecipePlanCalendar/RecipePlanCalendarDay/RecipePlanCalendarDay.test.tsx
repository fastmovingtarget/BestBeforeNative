//2025-10-28 : Improved styling

//2025-10-14 : Initial Implementation of Recipe Plan Page

import {render, userEvent } from '@testing-library/react-native';
import RecipePlanCalendarDay from './RecipePlanCalendarDay';

describe("RecipePlanCalendarDay Component Renders", () => {
    test("The Correct Date", () => {
        const mockDate = new Date(2023, 9, 1); // October 1, 2023
        const {getByText} = render(
            <RecipePlanCalendarDay
                date={mockDate}
                recipePlans={[]}
                onPress={() => {}}
            />
        );

        expect(getByText("1")).toBeTruthy();
    })
    test("No Recipes when there are no recipes for that date", () => {
        const mockDate = new Date(2023, 9, 1); // October 1, 2023
        const {queryByLabelText} = render(
            <RecipePlanCalendarDay
                date={mockDate}
                recipePlans={[]}
                onPress={() => {}}
            />
        );

        expect(queryByLabelText(/recipe-plan-/i)).toBeFalsy();
    })
    test("The correct recipes when there are recipes for that date", () => {
        const mockDate = new Date(2023, 9, 1); // October 1, 2023
        const {getByText} = render(
            <RecipePlanCalendarDay
                date={mockDate}
                recipePlans={[
                    "Test Recipe 1",
                    "Test Recipe 2",
                    "Test Recipe 3"
                ]}
                onPress={() => {}}
            />
        );
        expect(getByText("Test Recipe 1")).toBeTruthy();
        expect(getByText("Test Recipe 2")).toBeTruthy();
        expect(getByText("Test Recipe 3")).toBeTruthy();
    })
})
test("When clicked, the recipe plan day should call the onPress function", async () => {

    const user = userEvent.setup();

    const mockOnPress = jest.fn();

    const mockDate = new Date(2023, 9, 1); // October 1, 2023
    const {getByText} = render(
        <RecipePlanCalendarDay
            date={mockDate}
            recipePlans={[
                "Test Recipe 1",
                "Test Recipe 2",
                "Test Recipe 3"
            ]}
            onPress={mockOnPress}
        />
    );

    const calendarElement = getByText("1");
    await user.press(calendarElement);

    expect(mockOnPress).toHaveBeenCalledWith(1);
})