//2025-11-20 : Shifting test files into their own folder in the hierarchy

//2025-11-19 : Renamed RecipePlan/nner to just Planner, Recipe_Plan to just Plan

//2025-10-28 : More cohesive implementation of the calendar grid

//2025-10-14 : Fixed expected month to be full rather than shortened

//2025-10-14 : Initial Implementation of Recipe Plan Page


import {render, userEvent} from '@testing-library/react-native';
import { Text } from 'react-native';

import PlannerCalendar from '@/components/Planner/PlannerCalendar/PlannerCalendar';
import PlannerCalendarDay from '@/components/Planner/PlannerCalendar/PlannerCalendarDay/PlannerCalendarDay';

jest.mock("@/components/Planner/PlannerCalendar/PlannerCalendarDay/PlannerCalendarDay", () => {
    return {
        __esModule: true,
        default: jest.fn(),
    };
});

beforeEach(() => {
  jest.resetAllMocks();
  (PlannerCalendarDay as jest.Mock).mockImplementation(({date}) => <Text>{date.getDate()}</Text>);
});

const mockSetSelectedDate = jest.fn();

const monthsOfYear = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

describe("Recipe Plan Calendar Renders", () => {
    test("The month correctly", () => {
        const currentMonth = monthsOfYear[new Date().getMonth()];// can't hardcode this as it will change over time, but can at least check that it is the current month via a different method

        const {getByText} = render(
            <PlannerCalendar setSelectedDate={mockSetSelectedDate} />
        );

        expect(getByText(`${currentMonth}`)).toBeTruthy();
    });
    test("Month navigation buttons", () => {
        const {getByText} = render(
            <PlannerCalendar setSelectedDate={mockSetSelectedDate} />
        );
        
        expect(getByText(/</i)).toBeTruthy();
        expect(getByText(/>/i)).toBeTruthy();
    });
    test("The calendar day headers", () => {
        const {getByText} = render(
            <PlannerCalendar setSelectedDate={mockSetSelectedDate} />
        );

        expect(getByText(/Mon/i)).toBeTruthy();
        expect(getByText(/Tue/i)).toBeTruthy();
        expect(getByText(/Wed/i)).toBeTruthy();
        expect(getByText(/Thu/i)).toBeTruthy();
        expect(getByText(/Fri/i)).toBeTruthy();
        expect(getByText(/Sat/i)).toBeTruthy();
        expect(getByText(/Sun/i)).toBeTruthy();
        
    });
    test("The actual calendar itself", () => {
        const today = new Date();
        const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

        const mockSetSelectedDate = jest.fn();
        const {getAllByText} = render(
            <PlannerCalendar setSelectedDate={mockSetSelectedDate} />
        );

        for(let i = 1; i <= daysInMonth; i++) {
            expect(getAllByText(`${i}`).length).toBeGreaterThan(0);// Check that each day of the month is rendered at least once
        }        
    });
    test("The recipe names each day", () => {
        
    })
});
describe("Recipe Plan Calendar functionality", () => {
    test("The month changes when the left button is pressed", async () => {
        const user = userEvent.setup();
        const {getByText, getAllByText} = render(
            <PlannerCalendar setSelectedDate={mockSetSelectedDate} />
        );

        const currentMonth = new Date().getMonth();
        const previousMonth = new Date().setMonth(currentMonth - 1);

        await user.press(getByText(/</i));

        expect(getByText(new Date(previousMonth).toLocaleString('default', { month: 'long' }))).toBeTruthy();
        const daysInMonth = new Date(new Date().getFullYear(), currentMonth, 0).getDate();

        for(let i = 1; i <= daysInMonth; i++) {
            expect(getAllByText(`${i}`).length).toBeGreaterThan(0);// Check that each day of the previous month is rendered
        }
    });

    test("The month changes when the right button is pressed", async () => {
        const user = userEvent.setup();
        const {getByText, getAllByText} = render(
            <PlannerCalendar setSelectedDate={mockSetSelectedDate} />
        );

        const currentMonth = new Date().getMonth();
        const nextMonth = new Date().setMonth(currentMonth + 1);

        await user.press(getByText(/>/i));

        expect(getByText(new Date(nextMonth).toLocaleString('default', { month: 'long' }))).toBeTruthy();
        const daysInMonth = new Date(new Date().getFullYear(), currentMonth + 2, 0).getDate();

        for(let i = 1; i <= daysInMonth; i++) {
            expect(getAllByText(`${i}`).length).toBeGreaterThan(0);// Check that each day of the previous month is rendered
        }
    });
})