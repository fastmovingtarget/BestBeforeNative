//2025-10-24 : Fixing import and mock to use correct context provider

import {render} from '@testing-library/react-native';
import RecipeSelected from './RecipeSelected';
import Recipe from '@/Types/Recipe';

const mockRecipe: Recipe = {
  Recipe_ID: 123,
    Recipe_Name: 'Test Recipe',
    Recipe_Difficulty: 3,
    Recipe_Time: 30,
    Recipe_Ingredients: 
    [{
        Recipe_Ingredient_ID: 1,
        Ingredient_Name: 'Test Ingredient 1',
        Ingredient_Quantity: 2,
    }, {
        Recipe_Ingredient_ID: 2,
        Ingredient_Name: 'Test Ingredient 2',
        Ingredient_Quantity: 1,
        
    }],
    Recipe_Instructions: 'Test Instructions',
}

beforeEach(() => {
  jest.resetAllMocks();
});

describe('Selected Recipe List Item renders correctly', () => {
  it('when given all basic recipe data', () => {
    const {getByText} = render(
      <RecipeSelected
        recipe={mockRecipe}/>,
    );

    expect(getByText(/Test Recipe/i)).toBeTruthy();
    expect(getByText(/Time: 30 min/i)).toBeTruthy();
    expect(getByText(/Difficulty: 3/i)).toBeTruthy();
    expect(getByText(/Test Ingredient 1/i)).toBeTruthy();
    expect(getByText(/Test Ingredient 2/i)).toBeTruthy();
    expect(getByText(/Test Instructions/i)).toBeTruthy();
  });
});