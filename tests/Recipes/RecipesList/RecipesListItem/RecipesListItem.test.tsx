//2026-07-21 : Test recipe rating for iconised display
//2026-07-21 : Recipe_Difficulty changed to Recipe_Rating
//2025-11-20 : Shifting test files into their own folder in the hierarchy

//2025-10-24 : Fixing import and mock to use correct context provider

import {render, userEvent} from '@testing-library/react-native';
import RecipesListItem from '@/components/Recipes/RecipesList/RecipesListItem/RecipesListItem';
import Recipe from '@/Types/Recipe';

const mockRecipe: Recipe = {
  Recipe_ID: 123,
    Recipe_Name: 'Test Recipe',
    Recipe_Rating: 3,
    Recipe_Time: 30,
    Recipe_Ingredients: [],
    Recipe_Instructions: 'Test Instructions',
}

beforeEach(() => {
  jest.resetAllMocks();
});

describe('Recipe List Item renders correctly', () => {
  it('when given all basic recipe data', () => {
    const {getByText, queryAllByLabelText} = render(
      <RecipesListItem
        key={(mockRecipe.Recipe_ID || 0).toString()}
        recipe={mockRecipe}
        setSelectedRecipe={jest.fn()}/>,
    );

    expect(getByText(/Test Recipe/i)).toBeTruthy();
    expect(getByText(/30 min/i)).toBeTruthy();
    expect(queryAllByLabelText(/recipe-rating-empty/i)).toHaveLength(2);
    expect(queryAllByLabelText(/recipe-rating-filled/i)).toHaveLength(3);
  });
});
it("Calls to set the selected recipe when the recipe component is pressed", async () => {
const user = userEvent.setup();

    const mockSetSelectedRecipe = jest.fn();
    const {getByLabelText} = render(
        <RecipesListItem
        key={(mockRecipe.Recipe_ID || 0).toString()}
        recipe={mockRecipe}
        setSelectedRecipe={mockSetSelectedRecipe}/>,
    );

    const recipeItemContainer = getByLabelText("recipe item summary");

    await user.press(recipeItemContainer);

    expect(mockSetSelectedRecipe).toHaveBeenCalledTimes(1);
})
it("Calls to set the selected recipe when a sub-component of the recipe component is pressed", async () => {
const user = userEvent.setup();

    const mockSetSelectedRecipe = jest.fn();
    const {getByText} = render(
        <RecipesListItem
        key={(mockRecipe.Recipe_ID || 0).toString()}
        recipe={mockRecipe}
        setSelectedRecipe={mockSetSelectedRecipe}/>,
    );

    const recipeNameComponent = getByText(/Test Recipe/i);

    await user.press(recipeNameComponent);

    expect(mockSetSelectedRecipe).toHaveBeenCalledTimes(1);
})
