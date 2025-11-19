//2025-11-19 : Renamed RecipePlan/nner to just Planner, Recipe_Plan to just Plan

//2025-11-17 : Added Docs, corrected styles and naming

//2025-10-31 : Implementation for the switcher between recipes list and recipe breakdown

//2025-10-28 : Simple initial implementation


import {render, userEvent } from '@testing-library/react-native';
import { Pressable, Text } from 'react-native';
import PlannerActiveDay from './PlannerActiveDay';

import { usePlans } from '@/Contexts/Plans/PlansDataProvider';
import { useRecipes } from '@/Contexts/Recipes/RecipesDataProvider';
import PlannerIngredients from './PlannerIngredients/PlannerIngredients';
import PlannerActiveDayRecipes from './PlannerActiveDayRecipes/PlannerActiveDayRecipes';

jest.mock('@/Contexts/Plans/PlansDataProvider', () => {
    return {
        __esModule: true,
        usePlans: jest.fn()
    };
});
jest.mock('@/Contexts/Recipes/RecipesDataProvider', () => {
    return {
        __esModule: true,
        useRecipes: jest.fn()
    };
});
jest.mock('./PlannerActiveDayRecipes/PlannerActiveDayRecipes', () => {
    return {
        __esModule: true,
        default: jest.fn()
    };
});
jest.mock('./PlannerIngredients/PlannerIngredients', () => {
    return {
        __esModule: true,
        default: jest.fn()
    };
});

const mockRecipePlans = [
    {
        Plan_ID: 1,
        Recipe_ID: 101,
        Recipe_Name: "Test Recipe 1",
        Plan_Date: "2023-10-01",
        Plan_Ingredients: []
    },
    {
        Plan_ID: 2,
        Recipe_Name: "Test Recipe 2",
        Plan_Date: "2023-10-02",
        Plan_Ingredients: []
    }
];

beforeEach(() => {
    jest.resetAllMocks();
    (usePlans as jest.Mock).mockReturnValue({
        plans: mockRecipePlans
    });
    (useRecipes as jest.Mock).mockReturnValue({
        recipes: []
    });
    (PlannerActiveDayRecipes as jest.Mock).mockImplementation(({setSelectedPlan}) => {
        return (<>
            <Text>Active Day Recipes Component</Text>
            <Pressable onPress={() => setSelectedPlan(mockRecipePlans[0])}><Text>Select Recipe</Text></Pressable>
            </>);
    });
    (PlannerIngredients as jest.Mock).mockImplementation(() => {
        return <Text>Active Day Recipe Ingredients Component</Text>;
    });
});

describe("PlannerActiveDay Component Renders", () => {
    test("The Correct Date", () => {
        const mockSelectedDate = new Date(2023, 9, 1); // October 1, 2023
        (usePlans as jest.Mock).mockReturnValue({
            plans: []
        });
        (useRecipes as jest.Mock).mockReturnValue({
            recipes: []
        });
        const {getByText} = render(
            <PlannerActiveDay
                selectedDate={mockSelectedDate}
            />
        );
        expect(getByText("Sun Oct 01 2023")).toBeTruthy();
    })
    test("Active Day Recipes when no recipe is selected", () => {
        const mockSelectedDate = new Date(2023, 9, 1); // October 1, 2023
        (usePlans as jest.Mock).mockReturnValue({
            plans: []
        });
        (useRecipes as jest.Mock).mockReturnValue({
            recipes: []
        });
        const {getByText} = render(
            <PlannerActiveDay
                selectedDate={mockSelectedDate}
            />
        );
        expect(getByText("Active Day Recipes Component")).toBeTruthy();
    })
    test("Active Day Recipe Ingredients only when a recipe is selected", async () => {
        const user = userEvent.setup();
        const mockSelectedDate = new Date(2023, 9, 1); // October 1, 2023
        (usePlans as jest.Mock).mockReturnValue({
            plans: []
        });
        (useRecipes as jest.Mock).mockReturnValue({
            recipes: []
        });
        const {queryByText} = render(
            <PlannerActiveDay
                selectedDate={mockSelectedDate}
            />
        );
        expect(queryByText("Active Day Recipe Ingredients Component")).toBeFalsy();

        await user.press(queryByText("Select Recipe")!);

        expect(queryByText("Active Day Recipe Ingredients Component")).toBeTruthy();
        expect(queryByText("Active Day Recipes Component")).toBeFalsy();
    })
});