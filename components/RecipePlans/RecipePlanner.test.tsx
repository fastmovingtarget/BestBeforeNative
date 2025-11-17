//2025-11-17 : Addeed a help/navigation button for the calendar

//2025-10-28 : Filling out some initial implementation and tests


import {render, userEvent, waitFor} from '@testing-library/react-native';
import { Pressable, Text } from 'react-native';
import RecipePlanner from './RecipePlanner';
import RecipePlanCalendar from './RecipePlanCalendar/RecipePlanCalendar';
import RecipePlanActiveDay from './RecipePlanActiveDay/RecipePlanActiveDay';

jest.mock("./RecipePlanCalendar/RecipePlanCalendar", () => {
  return {
    __esModule: true,
    default: jest.fn()
  }
});
jest.mock("./RecipePlanActiveDay/RecipePlanActiveDay", () => {
  return {
    __esModule: true,
    default: jest.fn()
  };
});


beforeEach(() => {
    jest.resetAllMocks();
    (RecipePlanCalendar as jest.Mock).mockImplementation(({setSelectedDate}) => <Pressable onPress={() => setSelectedDate(new Date(2023, 9, 20))}><Text>Recipe Plan Calendar</Text></Pressable>);
    (RecipePlanActiveDay as jest.Mock).mockImplementation(({selectedDate}) => <Text>Recipe Plan Active Day : {selectedDate?.toDateString()}</Text>);
});

describe("Recipe Planner Renders", () => {
    test("Recipe Plan Calendar component", () => {
        const {getByText} = render(
            <RecipePlanner />
        );
        expect(getByText(/Recipe Plan Calendar/i)).toBeTruthy();
    });
    test("No Recipe Plan Active Day component", () => {
        const {queryByText} = render(
            <RecipePlanner />
        );
        expect(queryByText(/Recipe Plan Active Day/i)).toBeFalsy();
    });
});
describe("Recipe Planner Interaction", () => {
    test("Selecting a date updates state", async () => {
        const user = userEvent.setup();
        (RecipePlanCalendar as jest.Mock).mockImplementation(({setSelectedDate}) => (
            <Text
                onPress={() => setSelectedDate(new Date(2023, 9, 15))}
            >
                Select Date
            </Text>
        ));

        const {getByText} = render(
            <RecipePlanner />
        );

        user.press(getByText(/Select Date/i));

        await waitFor(() => expect(getByText(/Recipe Plan Active Day : Sun Oct 15 2023/i)).toBeTruthy());
    });
    test("Returning to calendar updates state", async () => {
        const user = userEvent.setup();
        const {getByText} = render(
            <RecipePlanner />
        );
        //First select a date to show the active day view
        await user.press(getByText(/Recipe Plan Calendar/i));

        expect(getByText(/Recipe Plan Active Day : Fri Oct 20 2023/i)).toBeTruthy();
        //Then return to calendar view
        await user.press(getByText(/Back to Calendar/i));
        expect(getByText(/Recipe Plan Calendar/i)).toBeTruthy();
    });
});