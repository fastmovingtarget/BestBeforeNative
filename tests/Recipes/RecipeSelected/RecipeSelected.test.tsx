//2026-06-11 : Testing exit functionality

//2025-11-20 : Shifting test files into their own folder in the hierarchy

//2025-11-19 : Ingredient_Name and Ingredient_Quantity now have Recipe_ prefix

//2025-10-24 : Fixing import and mock to use correct context provider

import {render, userEvent} from '@testing-library/react-native';
import RecipeSelected from '@/components/Recipes/RecipeSelected/RecipeSelected';
import Recipe from '@/Types/Recipe';

const mockRecipe: Recipe = {
  Recipe_ID: 123,
    Recipe_Name: 'Test Recipe',
    Recipe_Difficulty: 3,
    Recipe_Time: 30,
    Recipe_Ingredients: 
    [{
        Recipe_Ingredient_ID: 1,
        Recipe_Ingredient_Name: 'Test Ingredient 1',
        Recipe_Ingredient_Quantity: 2,
    }, {
        Recipe_Ingredient_ID: 2,
        Recipe_Ingredient_Name: 'Test Ingredient 2',
        Recipe_Ingredient_Quantity: 1,
        
    }],
    Recipe_Instructions: 'Test Instructions',
}

describe('Selected Recipe List Item renders correctly', () => {
  it('when given all basic recipe data', () => {
    const {getByText} = render(
      <RecipeSelected
        recipe={mockRecipe}
        setSelectedRecipe={jest.fn()}
        setIsEditing={jest.fn()}
        deleteRecipe={jest.fn()}/>,
    );

    expect(getByText(/Test Recipe/i)).toBeTruthy();
    expect(getByText(/Time: 30 min/i)).toBeTruthy();
    expect(getByText(/Difficulty: 3/i)).toBeTruthy();
    expect(getByText(/Test Ingredient 1/i)).toBeTruthy();
    expect(getByText(/Test Ingredient 2/i)).toBeTruthy();
    expect(getByText(/Test Instructions/i)).toBeTruthy();
  });
});

describe("SelectedRecipe exits correctly", () => {
  it("when back is selected", async () => {
    const user = userEvent.setup();
    jest.useFakeTimers(); // Use fake timers for this test to control the timing of the setTimeout

    const setSelectedRecipeMock = jest.fn();
    const setIsEditingMock = jest.fn();
    const deleteRecipeMock = jest.fn();

    const {getByText} = render(
      <RecipeSelected recipe={mockRecipe} setSelectedRecipe={setSelectedRecipeMock} setIsEditing={setIsEditingMock} deleteRecipe={deleteRecipeMock}/>,
    );

    const backButton = getByText(/Back/i);
    expect(backButton).toBeTruthy();    
    await user.press(backButton);

    jest.runAllTimers(); // Fast-forward all timers
    expect(setSelectedRecipeMock).toHaveBeenCalledTimes(1);
    expect(setSelectedRecipeMock).toHaveBeenCalledWith(null); // Check if the onEdit function was called

    jest.useRealTimers(); // Restore real timers after the test
    
  });
  it("when edit is selected", async () => {
    const user = userEvent.setup();
    jest.useFakeTimers(); // Use fake timers for this test to control the timing of the setTimeout

    const setSelectedRecipeMock = jest.fn();
    const setIsEditingMock = jest.fn();
    const deleteRecipeMock = jest.fn();

    const {getByText} = render(
      <RecipeSelected recipe={mockRecipe} setSelectedRecipe={setSelectedRecipeMock} setIsEditing={setIsEditingMock} deleteRecipe={deleteRecipeMock}/>,
    );

    const editButton = getByText(/Edit Recipe/i);
    expect(editButton).toBeTruthy();   
    await user.press(editButton);

    jest.runAllTimers(); // Fast-forward all timers
    expect(setIsEditingMock).toHaveBeenCalledTimes(1);
    expect(setIsEditingMock).toHaveBeenCalledWith(true); // Check if the onEdit function was called

    jest.useRealTimers(); // Restore real timers after the test
  });
  it("when delete is selected", async () => {
    const user = userEvent.setup();
    jest.useFakeTimers(); // Use fake timers for this test to control the timing of the setTimeout

    const setSelectedRecipeMock = jest.fn();
    const setIsEditingMock = jest.fn();
    const deleteRecipeMock = jest.fn();

    const {getByText} = render(
      <RecipeSelected recipe={mockRecipe} setSelectedRecipe={setSelectedRecipeMock} setIsEditing={setIsEditingMock} deleteRecipe={deleteRecipeMock}/>,
    );

    const deleteButton = getByText(/Delete Recipe/i);
    expect(deleteButton).toBeTruthy();   
    await user.press(deleteButton);

    jest.runAllTimers(); // Fast-forward all timers
    expect(deleteRecipeMock).toHaveBeenCalledTimes(1);
    expect(deleteRecipeMock).toHaveBeenCalledWith(mockRecipe.Recipe_ID); // Check if the delete function was called

    jest.useRealTimers(); // Restore real timers after the test 
  });
})