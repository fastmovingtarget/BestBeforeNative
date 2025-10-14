//2025-10-14 : Initial Implementation of Recipe Plan Page

import {render, userEvent, screen} from '@testing-library/react-native';
import {useData} from '@/Contexts/DataProvider';
import { Pressable, Text } from 'react-native';

import RecipePlanActiveDayRecipes from './RecipePlanActiveDayRecipes';
import Recipe from '@/Types/Recipe';
import Recipe_Plan from '@/Types/Recipe_Plan';
import RecipesListItem from '@/components/Recipes/RecipesList/RecipesListItem/RecipesListItem';
import PressableComponent from '@/components/CustomComponents/PressableComponent';
import LabelText from '@/components/CustomComponents/LabelText';

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

jest.mock('@/Contexts/DataProvider', () => ({
  useData: jest.fn(),
}));

jest.mock('@/components/Recipes/RecipesList/RecipesListItem/RecipesListItem', () => {
    return {
        __esModule: true,
        default: jest.fn(),
    };
});

beforeEach(() => {
  jest.resetAllMocks();
  (useData as jest.Mock).mockReturnValue(mockDataContext);
  (RecipesListItem as jest.Mock).mockImplementation(({recipe, setSelectedRecipe}) => 
        <PressableComponent onPress={setSelectedRecipe}>
            <LabelText >{recipe.Recipe_Name}</LabelText>
        </PressableComponent>
    );
});

describe("Recipe Plan Active Day Recipes Renders", () => {
    test("The recipe plans", () => {

        const {getByText} = render(
            <RecipePlanActiveDayRecipes date={new Date("2023-10-01")} />
        );

        expect(getByText(/Planned Recipe 1/i)).toBeTruthy();
        expect(getByText(/Planned Recipe 2/i)).toBeTruthy();
    });
    test("The recipe list", () => {

        const {getByText} = render(
            <RecipePlanActiveDayRecipes date={new Date("2023-10-01")} />
        );

        expect(getByText(/Test Recipe 1/i)).toBeTruthy();
        expect(getByText(/Test Recipe 2/i)).toBeTruthy();
    });
    test("The View Ingredients button", () => {

        const {getAllByText} = render(
            <RecipePlanActiveDayRecipes date={new Date("2023-10-01")} />
        );

        expect(getAllByText(/View Ingredients/i).length).toEqual(2);
    });
    test("The Remove button", () => {

        const {getAllByText} = render(
            <RecipePlanActiveDayRecipes date={new Date("2023-10-01")} />
        );

        expect(getAllByText(/Remove/i).length).toEqual(2);
    });
});
describe("Recipe Plan Active Day Recipes Interactions", () => {
    test("Clicking on a recipe item calls to add planned recipes", async () => {
        const user = userEvent.setup();
        const expectedAddedRecipePlan = {
            Plan_Date: new Date("2023-10-01"),
            Recipe_ID: 1,
            Recipe_Name: 'Test Recipe 1',
        }

        render(<RecipePlanActiveDayRecipes date={new Date("2023-10-01")} />);

        const recipeItem = screen.getByText(/Test Recipe 1/i);
        await user.press(recipeItem);

        expect(mockDataContext.addRecipePlan).toHaveBeenCalledTimes(1);

        expect(mockDataContext.addRecipePlan).toHaveBeenCalledWith(expectedAddedRecipePlan);
    });   
    test("Clicking Remove calls to delete planned recipes", async () => {
        const user = userEvent.setup();

        const {getAllByText} = render(<RecipePlanActiveDayRecipes date={new Date("2023-10-01")} />);

        const removeButton = getAllByText(/Remove/i)[1];
        await user.press(removeButton);

        expect(mockDataContext.deleteRecipePlan).toHaveBeenCalledTimes(1);

        expect(mockDataContext.deleteRecipePlan).toHaveBeenCalledWith(2);
    });
});