//2025-10-28 : Filling out some initial implementation and tests


import {render, userEvent, waitFor} from '@testing-library/react-native';
import { Text } from 'react-native';
import RecipePlanner from './RecipePlanner';
import RecipePlanCalendar from './RecipePlanCalendar/RecipePlanCalendar';
import RecipePlanActiveDay from './RecipePlanActiveDay/RecipePlanActiveDay';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

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

(RecipePlanCalendar as jest.Mock).mockImplementation(() => <Text>Recipe Plan Calendar</Text>);
(RecipePlanActiveDay as jest.Mock).mockImplementation(({selectedDate}) => <Text>Recipe Plan Active Day : {selectedDate?.toDateString()}</Text>);


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
});