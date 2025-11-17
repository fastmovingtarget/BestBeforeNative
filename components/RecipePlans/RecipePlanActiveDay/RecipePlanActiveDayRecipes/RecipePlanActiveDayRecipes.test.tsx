//2025-11-17 : Added recipe search, toggle button

//2025-10-31 : SetSelectedRecipe now links correctly

//2025-10-29 : Tests allow for devolved context, passing in setSelectedRecipe

//2025-10-14 : Initial Implementation of Recipe Plan Page

import {render, userEvent, screen} from '@testing-library/react-native';
import {useRecipePlans} from '@/Contexts/RecipePlans/RecipePlansDataProvider';

import RecipePlanActiveDayRecipes from './RecipePlanActiveDayRecipes';
import Recipe from '@/Types/Recipe';
import Recipe_Plan from '@/Types/Recipe_Plan';
import RecipesListItem from '@/components/Recipes/RecipesList/RecipesListItem/RecipesListItem';
import PressableComponent from '@/components/CustomComponents/PressableComponent';
import LabelText from '@/components/CustomComponents/LabelText';
import { useRecipes } from '@/Contexts/Recipes/RecipesDataProvider';

const mockDataContext = {
    recipePlans: [
        { Plan_ID: 1, Plan_Date: new Date('2023-10-01'), Recipe_ID: 1, Recipe_Name: 'Planned Recipe 1' },
        { Plan_ID: 2, Plan_Date: new Date('2023-10-01'), Recipe_ID: 2, Recipe_Name: 'Planned Recipe 2' },
        { Plan_ID: 3, Plan_Date: new Date('2023-10-02'), Recipe_ID: 1, Recipe_Name: 'Planned Recipe 1' },
        { Plan_ID: 4, Plan_Date: new Date('2023-10-02'), Recipe_ID: 2, Recipe_Name: 'Planned Recipe 2' },
    ] as Recipe_Plan[],
    recipes : [
            { Recipe_ID: 1, Recipe_Name: 'Test Recipe 1'},
            { Recipe_ID: 2, Recipe_Name: 'Test Recipe 2'},
    ] as Recipe[],
    addRecipePlan: jest.fn(),
    deleteRecipePlan: jest.fn(),
};

jest.mock('@/Contexts/RecipePlans/RecipePlansDataProvider', () => ({
  useRecipePlans: jest.fn(),
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
  (useRecipePlans as jest.Mock).mockReturnValue(mockDataContext);
  (useRecipes as jest.Mock).mockReturnValue(mockDataContext);
  (RecipesListItem as jest.Mock).mockImplementation(({recipe, setSelectedRecipe}) => 
        <PressableComponent onPress={setSelectedRecipe}>
            <LabelText >{recipe.Recipe_Name}</LabelText>
        </PressableComponent>
    );
});

describe("Recipe Plan Active Day Recipes Renders", () => {
    test("The recipe plans", () => {

        const {getByText} = render(
            <RecipePlanActiveDayRecipes date={new Date("2023-10-01")} setSelectedRecipePlan={jest.fn()} />
        );

        expect(getByText(/Planned Recipe 1/i)).toBeTruthy();
        expect(getByText(/Planned Recipe 2/i)).toBeTruthy();
    });    test("The View Ingredients button", () => {

        const {getAllByText} = render(
            <RecipePlanActiveDayRecipes date={new Date("2023-10-01")} setSelectedRecipePlan={jest.fn()} />
        );

        expect(getAllByText(/View Ingredients/i).length).toEqual(2);
    });
    test("The Remove button", () => {

        const {getAllByText} = render(
            <RecipePlanActiveDayRecipes date={new Date("2023-10-01")} setSelectedRecipePlan={jest.fn()} />
        );

        expect(getAllByText(/Remove/i).length).toEqual(2);
    });
});
describe("Recipe Plan Active Day Recipes Interactions", () => {
    test("Clicking Remove calls to delete planned recipes", async () => {
        const user = userEvent.setup();

        const {getAllByText} = render(<RecipePlanActiveDayRecipes date={new Date("2023-10-01")} setSelectedRecipePlan={jest.fn()} />);

        const removeButton = getAllByText(/Remove/i)[1];
        await user.press(removeButton);

        expect(mockDataContext.deleteRecipePlan).toHaveBeenCalledTimes(1);

        expect(mockDataContext.deleteRecipePlan).toHaveBeenCalledWith(2);
    });
    test("Clicking View Ingredients calls to set selected recipe plan", async () => {
        const user = userEvent.setup();
        const mockSetSelectedRecipePlan = jest.fn();
        const {getAllByText} = render(<RecipePlanActiveDayRecipes date={new Date("2023-10-01")} setSelectedRecipePlan={mockSetSelectedRecipePlan} />);

        const viewIngredientsButton = getAllByText(/View Ingredients/i)[0];
        await user.press(viewIngredientsButton);
        expect(mockSetSelectedRecipePlan).toHaveBeenCalledTimes(1);
        expect(mockSetSelectedRecipePlan).toHaveBeenCalledWith({
            Plan_ID: 1,
            Plan_Date: new Date('2023-10-01'),
            Recipe_ID: 1,
            Recipe_Name: 'Planned Recipe 1'
        });
    });
    test("Plan a Recipe button shows recipe list", async () => {
        const user = userEvent.setup();
        const {getByText} = render(<RecipePlanActiveDayRecipes date={new Date("2023-10-01")} setSelectedRecipePlan={jest.fn()} />);

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

        const {getByText} = render(<RecipePlanActiveDayRecipes date={new Date("2023-10-01")} setSelectedRecipePlan={jest.fn()} />);
        
        const planRecipeButton = getByText(/Plan a Recipe/i);
        await user.press(planRecipeButton);

        const recipeItem = screen.getByText(/Test Recipe 1/i);
        await user.press(recipeItem);

        expect(mockDataContext.addRecipePlan).toHaveBeenCalledTimes(1);

        expect(mockDataContext.addRecipePlan).toHaveBeenCalledWith(expectedAddedRecipePlan);
    });   
});