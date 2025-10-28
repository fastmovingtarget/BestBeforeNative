//2025-10-28 : Simple initial implementation


import {render, userEvent } from '@testing-library/react-native';
import RecipePlanActiveDay from './RecipePlanActiveDay';

import { useRecipePlans } from '@/Contexts/RecipePlans/RecipePlanDataProvider';
import { useRecipes } from '@/Contexts/Recipes/RecipesDataProvider';

jest.mock('@/Contexts/RecipePlans/RecipePlanDataProvider');
jest.mock('@/Contexts/Recipes/RecipesDataProvider');

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
})