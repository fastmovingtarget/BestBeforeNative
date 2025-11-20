//2025-11-20 : Shifting test files into their own folder in the hierarchy

//2025-11-19 : Ingredient_Name and Ingredient_Quantity now have Recipe_ prefix

import {render, userEvent,} from '@testing-library/react-native';
import RecipeForm from '@/components/Recipes/RecipeForm/RecipeForm';
import RecipesPage from '@/components/Recipes/RecipesPage';
import RecipesSearch from '@/components/Recipes/RecipesSearch/RecipesSearch';
import RecipesList from '@/components/Recipes/RecipesList/RecipesList';
import RecipeSelected from '@/components/Recipes/RecipeSelected/RecipeSelected';
import Recipe from '@/Types/Recipe';
import { View, Text, Pressable } from 'react-native';

beforeEach(() => {
  jest.resetAllMocks();
});

const mockRecipe: Recipe = {
  Recipe_ID: 1,
    Recipe_Name: "Test Recipe",
    Recipe_Difficulty: 1,
    Recipe_Time: 30,
    Recipe_Ingredients: [],
    Recipe_Instructions: "Test Instructions",
}

jest.mock("@/components/Recipes/RecipesSearch/RecipesSearch", () => {
  return {
    __esModule: true,
    default: jest.fn()
  }
});

jest.mock("@/components/Recipes/RecipesList/RecipesList", () => {
  return {
    __esModule: true,
    default: jest.fn()
  }
});

jest.mock("@/components/Recipes/RecipeForm/RecipeForm", () => {
  return {
    __esModule: true,
    default: jest.fn()
  }
});

jest.mock("@/components/Recipes/RecipeSelected/RecipeSelected", () => {
  return {
    __esModule: true,
    default: jest.fn()
  }
});


beforeEach(() => {
    jest.resetAllMocks();
    (RecipesSearch as jest.Mock).mockReturnValue( 
        <View>
          <Text>Mocked RecipesSearch</Text>
        </View>
    );
    (RecipesList as jest.Mock).mockImplementation(({setSelectedRecipe}) => 
        <Pressable onPress={() => setSelectedRecipe(mockRecipe)}>
          <Text>Mocked RecipesList</Text>
        </Pressable>
    ); 
    (RecipeForm as jest.Mock).mockReturnValue(
        <View>
          <Text>Mocked RecipeForm</Text>
        </View>
    );
    (RecipeSelected as jest.Mock).mockReturnValue(
        <View>
          <Text>Mocked RecipeSelected</Text>
        </View>
    );
})

describe('RecipePage', () => {
    it('renders RecipesSearch and RecipesList components in its default state', () => {
        const {getByText, queryByText} = render(<RecipesPage />);
        expect(getByText('Mocked RecipesSearch')).toBeTruthy();
        expect(getByText('Mocked RecipesList')).toBeTruthy();
        expect(queryByText('Mocked RecipeForm')).toBeFalsy();
    })
    it("renders RecipeSelected when a recipe is selected", async () => {
        const user = userEvent.setup();
        const {getByText, queryByText} = render(<RecipesPage />);
        expect(getByText('Mocked RecipesSearch')).toBeTruthy();
        expect(getByText('Mocked RecipesList')).toBeTruthy();
        expect(queryByText('Mocked RecipeForm')).toBeFalsy();
        expect(queryByText('Mocked RecipeSelected')).toBeFalsy();

        const recipePressable = getByText('Mocked RecipesList');
        await user.press(recipePressable);

        expect(queryByText('Mocked RecipesSearch')).toBeFalsy();
        expect(queryByText('Mocked RecipesList')).toBeFalsy();
        expect(queryByText('Mocked RecipeForm')).toBeFalsy();
        expect(getByText('Mocked RecipeSelected')).toBeTruthy();
        expect(getByText('Edit Recipe')).toBeTruthy();
        expect(getByText('Delete Recipe')).toBeTruthy();
    })
    it("renders RecipeForm when add new recipe is selected", async () => {
        const user = userEvent.setup();

        const {getByText, queryByText} = render(<RecipesPage />);
        
        const addPressable = getByText('Add New Recipe');
        await user.press(addPressable);

        expect(queryByText('Mocked RecipesSearch')).toBeFalsy();
        expect(queryByText('Mocked RecipesList')).toBeFalsy();
        expect(getByText('Mocked RecipeForm')).toBeTruthy();
        expect(queryByText('Mocked RecipeSelected')).toBeFalsy();
    })
    it("renders RecipeForm when edit a selected recipe is pressed", async () => {
        const user = userEvent.setup();

        const {getByText, queryByText} = render(<RecipesPage />);

        const recipePressable = getByText('Mocked RecipesList');
        await user.press(recipePressable);
        
        const editPressable = getByText('Edit Recipe');
        await user.press(editPressable);

        expect(queryByText('Mocked RecipesSearch')).toBeFalsy();
        expect(queryByText('Mocked RecipesList')).toBeFalsy();
        expect(getByText('Mocked RecipeForm')).toBeTruthy();
        expect(queryByText('Mocked RecipeSelected')).toBeFalsy();
    })
})