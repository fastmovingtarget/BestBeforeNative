//2025-11-17 : Added Docs, corrected styles and naming

//2025-10-31 : Implementation for the switcher between recipes list and recipe breakdown

//2025-10-28 : Simple initial implementation


import {render, userEvent } from '@testing-library/react-native';
import { Pressable, Text } from 'react-native';
import RecipePlanActiveDay from './RecipePlanActiveDay';

import { useRecipePlans } from '@/Contexts/RecipePlans/RecipePlansDataProvider';
import { useRecipes } from '@/Contexts/Recipes/RecipesDataProvider';
import RecipePlanActiveDayRecipes from './RecipePlanActiveDayRecipes/RecipePlanActiveDayRecipes';
import RecipePlanIngredients from './RecipePlanIngredients/RecipePlanIngredients';

jest.mock('@/Contexts/RecipePlans/RecipePlansDataProvider', () => {
    return {
        __esModule: true,
        useRecipePlans: jest.fn()
    };
});
jest.mock('@/Contexts/Recipes/RecipesDataProvider', () => {
    return {
        __esModule: true,
        useRecipes: jest.fn()
    };
});
jest.mock('./RecipePlanActiveDayRecipes/RecipePlanActiveDayRecipes', () => {
    return {
        __esModule: true,
        default: jest.fn()
    };
});
jest.mock('./RecipePlanIngredients/RecipePlanIngredients', () => {
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
    (useRecipePlans as jest.Mock).mockReturnValue({
        recipePlans: mockRecipePlans
    });
    (useRecipes as jest.Mock).mockReturnValue({
        recipes: []
    });
    (RecipePlanActiveDayRecipes as jest.Mock).mockImplementation(({setSelectedRecipePlan}) => {
        return (<>
            <Text>Active Day Recipes Component</Text>
            <Pressable onPress={() => setSelectedRecipePlan(mockRecipePlans[0])}><Text>Select Recipe</Text></Pressable>
            </>);
    });
    (RecipePlanIngredients as jest.Mock).mockImplementation(() => {
        return <Text>Active Day Recipe Ingredients Component</Text>;
    });
});

describe("RecipePlanActiveDay Component Renders", () => {
    test("The Correct Date", () => {
        const mockSelectedDate = new Date(2023, 9, 1); // October 1, 2023
        (useRecipePlans as jest.Mock).mockReturnValue({
            recipePlans: []
        });
        (useRecipes as jest.Mock).mockReturnValue({
            recipes: []
        });
        const {getByText} = render(
            <RecipePlanActiveDay
                selectedDate={mockSelectedDate}
            />
        );
        expect(getByText("Sun Oct 01 2023")).toBeTruthy();
    })
    test("Active Day Recipes when no recipe is selected", () => {
        const mockSelectedDate = new Date(2023, 9, 1); // October 1, 2023
        (useRecipePlans as jest.Mock).mockReturnValue({
            recipePlans: []
        });
        (useRecipes as jest.Mock).mockReturnValue({
            recipes: []
        });
        const {getByText} = render(
            <RecipePlanActiveDay
                selectedDate={mockSelectedDate}
            />
        );
        expect(getByText("Active Day Recipes Component")).toBeTruthy();
    })
    test("Active Day Recipe Ingredients only when a recipe is selected", async () => {
        const user = userEvent.setup();
        const mockSelectedDate = new Date(2023, 9, 1); // October 1, 2023
        (useRecipePlans as jest.Mock).mockReturnValue({
            recipePlans: []
        });
        (useRecipes as jest.Mock).mockReturnValue({
            recipes: []
        });
        const {queryByText} = render(
            <RecipePlanActiveDay
                selectedDate={mockSelectedDate}
            />
        );
        expect(queryByText("Active Day Recipe Ingredients Component")).toBeFalsy();

        await user.press(queryByText("Select Recipe")!);

        expect(queryByText("Active Day Recipe Ingredients Component")).toBeTruthy();
        expect(queryByText("Active Day Recipes Component")).toBeFalsy();
    })
});