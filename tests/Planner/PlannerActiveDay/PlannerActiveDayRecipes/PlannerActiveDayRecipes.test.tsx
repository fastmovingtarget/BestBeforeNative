//2025-11-20 : Shifting test files into their own folder in the hierarchy

//2025-11-19 : Renamed RecipePlan/nner to just Planner, Recipe_Plan to just Plan

//2025-11-17 : Added recipe search, toggle button

//2025-10-31 : SetSelectedRecipe now links correctly

//2025-10-29 : Tests allow for devolved context, passing in setSelectedRecipe

//2025-10-14 : Initial Implementation of Recipe Plan Page

import {render, userEvent, screen} from '@testing-library/react-native';
import {usePlans} from '@/Contexts/Plans/PlansDataProvider';

import PlannerActiveDayRecipes from '@/components/Planner/PlannerActiveDay/PlannerActiveDayRecipes/PlannerActiveDayRecipes';
import Recipe from '@/Types/Recipe';
import Plan from '@/Types/Plan';
import RecipesListItem from '@/components/Recipes/RecipesList/RecipesListItem/RecipesListItem';
import PressableComponent from '@/components/CustomComponents/PressableComponent';
import LabelText from '@/components/CustomComponents/LabelText';
import { useRecipes } from '@/Contexts/Recipes/RecipesDataProvider';

const mockDataContext = {
    plans: [
        { Plan_ID: 1, Plan_Date: new Date('2023-10-01'), Recipe_ID: 1, Recipe_Name: 'Planned Recipe 1' },
        { Plan_ID: 2, Plan_Date: new Date('2023-10-01'), Recipe_ID: 2, Recipe_Name: 'Planned Recipe 2' },
        { Plan_ID: 3, Plan_Date: new Date('2023-10-02'), Recipe_ID: 1, Recipe_Name: 'Planned Recipe 1' },
        { Plan_ID: 4, Plan_Date: new Date('2023-10-02'), Recipe_ID: 2, Recipe_Name: 'Planned Recipe 2' },
    ] as Plan[],
    recipes : [
            { Recipe_ID: 1, Recipe_Name: 'Test Recipe 1'},
            { Recipe_ID: 2, Recipe_Name: 'Test Recipe 2'},
    ] as Recipe[],
    addPlan: jest.fn(),
    deletePlan: jest.fn(),
};

jest.mock('@/Contexts/Plans/PlansDataProvider', () => ({
  usePlans: jest.fn(),
}));
jest.mock('@/Contexts/Recipes/RecipesDataProvider', () => ({
  useRecipes: jest.fn(),
}));

jest.mock('@/components/Recipes/RecipesList/RecipesListItem/RecipesListItem', () => {
    return {
        __esModule: true,
        default: jest.fn(),
    };
});

beforeEach(() => {
  jest.resetAllMocks();
  (usePlans as jest.Mock).mockReturnValue(mockDataContext);
  (useRecipes as jest.Mock).mockReturnValue(mockDataContext);
  (RecipesListItem as jest.Mock).mockImplementation(({recipe, setSelectedRecipe}) => 
        <PressableComponent onPress={setSelectedRecipe}>
            <LabelText >{recipe.Recipe_Name}</LabelText>
        </PressableComponent>
    );
});

describe("Planner Active Day Recipes Renders", () => {
    test("The plans", () => {

        const {getByText} = render(
            <PlannerActiveDayRecipes date={new Date("2023-10-01")} setSelectedPlan={jest.fn()} />
        );

        expect(getByText(/Planned Recipe 1/i)).toBeTruthy();
        expect(getByText(/Planned Recipe 2/i)).toBeTruthy();
    });    test("The View Ingredients button", () => {

        const {getAllByText} = render(
            <PlannerActiveDayRecipes date={new Date("2023-10-01")} setSelectedPlan={jest.fn()} />
        );

        expect(getAllByText(/View Ingredients/i).length).toEqual(2);
    });
    test("The Remove button", () => {

        const {getAllByText} = render(
            <PlannerActiveDayRecipes date={new Date("2023-10-01")} setSelectedPlan={jest.fn()} />
        );

        expect(getAllByText(/Remove/i).length).toEqual(2);
    });
});
describe("Planner Active Day Recipes Interactions", () => {
    test("Clicking Remove calls to delete planned recipes", async () => {
        const user = userEvent.setup();

        const {getAllByText} = render(<PlannerActiveDayRecipes date={new Date("2023-10-01")} setSelectedPlan={jest.fn()} />);

        const removeButton = getAllByText(/Remove/i)[1];
        await user.press(removeButton);

        expect(mockDataContext.deletePlan).toHaveBeenCalledTimes(1);

        expect(mockDataContext.deletePlan).toHaveBeenCalledWith(2);
    });
    test("Clicking View Ingredients calls to set selected recipe plan", async () => {
        const user = userEvent.setup();
        const mockSetSelectedPlan = jest.fn();
        const {getAllByText} = render(<PlannerActiveDayRecipes date={new Date("2023-10-01")} setSelectedPlan={mockSetSelectedPlan} />);

        const viewIngredientsButton = getAllByText(/View Ingredients/i)[0];
        await user.press(viewIngredientsButton);
        expect(mockSetSelectedPlan).toHaveBeenCalledTimes(1);
        expect(mockSetSelectedPlan).toHaveBeenCalledWith({
            Plan_ID: 1,
            Plan_Date: new Date('2023-10-01'),
            Recipe_ID: 1,
            Recipe_Name: 'Planned Recipe 1'
        });
    });
    test("Plan a Recipe button shows recipe list", async () => {
        const user = userEvent.setup();
        const {getByText} = render(<PlannerActiveDayRecipes date={new Date("2023-10-01")} setSelectedPlan={jest.fn()} />);

        const planRecipeButton = getByText(/Plan a Recipe/i);
        await user.press(planRecipeButton);
        expect(getByText(/Test Recipe 1/i)).toBeTruthy();
        expect(getByText(/Test Recipe 2/i)).toBeTruthy();
    });
    test("Clicking on a recipe item calls to add planned recipes", async () => {
        const user = userEvent.setup();
        const expectedAddedRecipePlan = {
            Plan_Date: new Date("2023-10-01"),
            Recipe_ID: 1,
            Recipe_Name: 'Test Recipe 1',
        }

        const {getByText} = render(<PlannerActiveDayRecipes date={new Date("2023-10-01")} setSelectedPlan={jest.fn()} />);
        
        const planRecipeButton = getByText(/Plan a Recipe/i);
        await user.press(planRecipeButton);

        const recipeItem = screen.getByText(/Test Recipe 1/i);
        await user.press(recipeItem);

        expect(mockDataContext.addPlan).toHaveBeenCalledTimes(1);

        expect(mockDataContext.addPlan).toHaveBeenCalledWith(expectedAddedRecipePlan);
    });   
});