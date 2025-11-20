//2025-11-20 : Shifting test files into their own folder in the hierarchy

//2025-11-19 : Renamed RecipePlan/nner to just Planner, Recipe_Plan to just Plan

//2025-11-17 : Addeed a help/navigation button for the calendar

//2025-10-28 : Filling out some initial implementation and tests


import {render, userEvent, waitFor} from '@testing-library/react-native';
import { Pressable, Text } from 'react-native';
import PlannerPage from '@/components/Planner/PlannerPage';
import PlannerCalendar from '@/components/Planner/PlannerCalendar/PlannerCalendar';
import PlannerActiveDay from '@/components/Planner/PlannerActiveDay/PlannerActiveDay';

jest.mock("@/components/Planner/PlannerCalendar/PlannerCalendar", () => {
  return {
    __esModule: true,
    default: jest.fn()
  }
});
jest.mock("@/components/Planner/PlannerActiveDay/PlannerActiveDay", () => {
  return {
    __esModule: true,
    default: jest.fn()
  };
});


beforeEach(() => {
    jest.resetAllMocks();
    (PlannerCalendar as jest.Mock).mockImplementation(({setSelectedDate}) => <Pressable onPress={() => setSelectedDate(new Date(2023, 9, 20))}><Text>Planner Calendar</Text></Pressable>);
    (PlannerActiveDay as jest.Mock).mockImplementation(({selectedDate}) => <Text>Planner Active Day : {selectedDate?.toDateString()}</Text>);
});

describe("Planner Renders", () => {
    test("Planner Calendar component", () => {
        const {getByText} = render(
            <PlannerPage />
        );
        expect(getByText(/Planner Calendar/i)).toBeTruthy();
    });
    test("No Planner Active Day component", () => {
        const {queryByText} = render(
            <PlannerPage />
        );
        expect(queryByText(/Planner Active Day/i)).toBeFalsy();
    });
});
describe("Planner Interaction", () => {
    test("Selecting a date updates state", async () => {
        const user = userEvent.setup();
        (PlannerCalendar as jest.Mock).mockImplementation(({setSelectedDate}) => (
            <Text
                onPress={() => setSelectedDate(new Date(2023, 9, 15))}
            >
                Select Date
            </Text>
        ));

        const {getByText} = render(
            <PlannerPage />
        );

        user.press(getByText(/Select Date/i));

        await waitFor(() => expect(getByText(/Planner Active Day : Sun Oct 15 2023/i)).toBeTruthy());
    });
    test("Returning to calendar updates state", async () => {
        const user = userEvent.setup();
        const {getByText} = render(
            <PlannerPage />
        );
        //First select a date to show the active day view
        await user.press(getByText(/Planner Calendar/i));

        expect(getByText(/Planner Active Day : Fri Oct 20 2023/i)).toBeTruthy();
        //Then return to calendar view
        await user.press(getByText(/Back to Calendar/i));
        expect(getByText(/Planner Calendar/i)).toBeTruthy();
    });
});