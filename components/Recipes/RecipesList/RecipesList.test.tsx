//2025-10-24 : Fixing import and mock to use correct context provider

import {render, userEvent} from '@testing-library/react-native';
import { Text, Pressable } from 'react-native';
import Recipe from '@/Types/Recipe';
import RecipesListItem from './RecipesListItem/RecipesListItem';
import RecipesList from './RecipesList';
import {useRecipes} from '@/Contexts/Recipes/RecipesDataProvider';

// No need to test things we've already tested in the IngredientComponent test, just a basic array of ingredients to test the list rendering
const mockRecipes : Recipe[] = [
    {
        Recipe_ID: 1,
        Recipe_Name: "Test Recipe 1",
        Recipe_Difficulty: 1,
        Recipe_Time: 30,
        Recipe_Ingredients: [],
        Recipe_Instructions: "Test Instructions 1",
    },
    {
        Recipe_ID: 2,
        Recipe_Name: "Test Recipe 2",
        Recipe_Difficulty: 2,
        Recipe_Time: 60,
        Recipe_Ingredients: [],
        Recipe_Instructions: "Test Instructions 2",
    },
    {
        Recipe_ID: 3,
        Recipe_Name: "Test Recipe 3",
        Recipe_Difficulty: 3,
        Recipe_Time: 90,
        Recipe_Ingredients: [],
        Recipe_Instructions: "Test Instructions 3",
    }
]

const mockdataContext = {
  recipes : mockRecipes
};

// Not exactly a unit test if it's using IngredientComponent, so I'm adding in a basic mock of it here
const mockRecipeListItem = ({recipe, setSelectedRecipe} : {recipe : Recipe, setSelectedRecipe : (recipeId : number) => void} ) =>
  <>
    <Pressable
      aria-label="recipe item summary"
      onPress={() => setSelectedRecipe(recipe.Recipe_ID || 0)}
    >
      <Text>{recipe.Recipe_Name}</Text>
      <Text>Time: {recipe.Recipe_Time} min</Text>
      <Text>Difficulty: {recipe.Recipe_Difficulty}</Text>
    </Pressable>
  </>


jest.mock("./RecipesListItem/RecipesListItem", () => {
  return {
    __esModule: true,
    default: jest.fn()
  }
});

jest.mock("@/Contexts/Recipes/RecipesDataProvider", () => {
  return {
    __esModule: true,
    useRecipes: jest.fn(),
  };
});

beforeEach(() => {
  jest.resetAllMocks();
  const useRecipesMock = useRecipes as jest.Mock;
  useRecipesMock.mockReturnValue(mockdataContext);

  const RecipeListItemMock = RecipesListItem as jest.Mock;
  RecipeListItemMock.mockImplementation(mockRecipeListItem);

});

test('Renders correctly when given all basic recipes data', () => {
    const mockSetSelectedRecipe = jest.fn();
    const {getByText} = render(
        <RecipesList setSelectedRecipe={mockSetSelectedRecipe}/>
    );

    expect(getByText(/Test Recipe 1/i)).toBeTruthy();
    expect(getByText(/30/i)).toBeTruthy();
    expect(getByText(/Difficulty: 3/i)).toBeTruthy();
    expect(getByText(/Test Recipe 2/i)).toBeTruthy();
    expect(getByText(/60/i)).toBeTruthy();
    expect(getByText(/Difficulty: 3/i)).toBeTruthy();
    expect(getByText(/Test Recipe 3/i)).toBeTruthy();
    expect(getByText(/90/i)).toBeTruthy();
    expect(getByText(/Difficulty: 3/i)).toBeTruthy();
})


test('Set Selected Recipe is called when a test recipe is clicked', async () => {
  const user = userEvent.setup();
    const mockSetSelectedRecipe = jest.fn();

    const {getByText} = render(
            <RecipesList setSelectedRecipe={mockSetSelectedRecipe}/>
        );

    const recipeListItemText = getByText(/Test Recipe 1/i); // Get the second edit button (for Test Ingredient 2)

    await user.press(recipeListItemText); // Simulate the press event

    expect(mockSetSelectedRecipe).toHaveBeenCalledWith(1); // Check if the onEdit function was called
})
