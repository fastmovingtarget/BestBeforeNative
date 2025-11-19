//2025-11-19 : Ingredient_Name and Ingredient_Quantity now have Recipe_ prefix

//2025-10-24 : Fixing import and mock to use correct context provider

import {render, userEvent, screen} from '@testing-library/react-native';
import RecipeForm from './RecipeForm';
import {useRecipes} from '@/Contexts/Recipes/RecipesDataProvider';
import Recipe from '@/Types/Recipe';

const mockDataContext = {
  deleteRecipe: jest.fn(),
  addRecipe : jest.fn(),
  updateRecipe: jest.fn(),
};

jest.mock('@/Contexts/Recipes/RecipesDataProvider', () => ({
  useRecipes: jest.fn(),
}));

beforeEach(() => {
  jest.resetAllMocks();
  (useRecipes as jest.Mock).mockReturnValue(mockDataContext);
});

const mockExitForm = jest.fn();

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

describe('Recipe Form Renders ', () => {
    it("all field labels correctly", () => {
        const {getByText} = render(
            <RecipeForm exitForm={mockExitForm}/>
        );
        expect(getByText(/Recipe Name/i)).toBeTruthy();
        expect(getByText(/Recipe Time/i)).toBeTruthy();
        expect(getByText(/Recipe Difficulty/i)).toBeTruthy();
        expect(getByText(/Recipe Instructions/i)).toBeTruthy();
    })
    it("all input fields correctly when adding (blank recipe input)", () => {
        const {getByLabelText} = render(
            <RecipeForm exitForm={mockExitForm}/>
        );

        expect(getByLabelText(/recipe-name/i)).toBeTruthy();
        expect(getByLabelText(/recipe-time/i)).toBeTruthy();
        expect(getByLabelText(/recipe-difficulty/i)).toBeTruthy();
        expect(getByLabelText(/recipe-instructions/i)).toBeTruthy();
        expect(getByLabelText(/recipe-name/i)).toHaveDisplayValue("");
        expect(getByLabelText(/recipe-time/i)).toHaveDisplayValue("0");
        expect(getByLabelText(/recipe-difficulty/i)).toHaveDisplayValue("0");
        expect(getByLabelText(/recipe-instructions/i)).toHaveDisplayValue("");
    })
    it("all input fields correctly when updating/editing", () => {
        const {getByLabelText} = render(
            <RecipeForm inputRecipe={mockRecipe} exitForm={mockExitForm}/>
        );

        expect(getByLabelText(/recipe-name/i)).toBeTruthy();
        expect(getByLabelText(/recipe-time/i)).toBeTruthy();
        expect(getByLabelText(/recipe-difficulty/i)).toBeTruthy();
        expect(getByLabelText(/recipe-instructions/i)).toBeTruthy();
        expect(getByLabelText(/recipe-name/i)).toHaveDisplayValue("Test Recipe");
        expect(getByLabelText(/recipe-time/i)).toHaveDisplayValue("30");
        expect(getByLabelText(/recipe-difficulty/i)).toHaveDisplayValue("3");
        expect(getByLabelText(/recipe-instructions/i)).toHaveDisplayValue("Test Instructions");
    })
})
describe('Recipe Form Submit Button Functionality', () => {
    it("calls addRecipe when adding a new recipe", async () => {
        const user = userEvent.setup();

        const {getByLabelText} = render(
            <RecipeForm exitForm={mockExitForm}/>
        );

        const nameInput = getByLabelText(/recipe-name/i);
        const timeInput = getByLabelText(/recipe-time/i);
        const difficultyInput = getByLabelText(/recipe-difficulty/i);
        const instructionsInput = getByLabelText(/recipe-instructions/i);
        
        await user.type(nameInput, 'New Recipe');
        await user.type(timeInput, '45');
        await user.type(difficultyInput, '2');
        await user.type(instructionsInput, 'New Instructions');

        const submitButton = screen.getByText(/submit/i);
        await user.press(submitButton);

        expect(mockDataContext.addRecipe).toHaveBeenCalledWith({
            Recipe_Name: 'New Recipe',
            Recipe_Time: 45,
            Recipe_Difficulty: 2,
            Recipe_Instructions: 'New Instructions',
            Recipe_Ingredients: [],
        });
        expect(mockExitForm).toHaveBeenCalled();
    });

    it("calls updateRecipe when updating an existing recipe", async () => {
        const user = userEvent.setup();
        const {getByLabelText} = render(
            <RecipeForm inputRecipe={mockRecipe} exitForm={mockExitForm}/>
        );

        const nameInput = getByLabelText(/recipe-name/i);
        const timeInput = getByLabelText(/recipe-time/i);
        const difficultyInput = getByLabelText(/recipe-difficulty/i);
        const instructionsInput = getByLabelText(/recipe-instructions/i);
        
        await user.type(nameInput, ' Updated Recipe');
        await user.type(timeInput, '0');
        await user.type(difficultyInput, '3');
        await user.type(instructionsInput, ' Updated Instructions');

        const submitButton = screen.getByText(/submit/i);
        await user.press(submitButton);

        expect(mockDataContext.updateRecipe).toHaveBeenCalledWith({
            ...mockRecipe,
            Recipe_Name: 'Test Recipe Updated Recipe',
            Recipe_Time: 300,
            Recipe_Difficulty: 33,
            Recipe_Instructions: 'Test Instructions Updated Instructions',
        });
        expect(mockExitForm).toHaveBeenCalled();
    });
});   
describe('Recipe Form Cancel Button Functionality', () => {
    it("calls exitForm when cancel button is pressed", async () => {
        const user = userEvent.setup();
        const {getByText} = render(
            <RecipeForm exitForm={mockExitForm}/>
        );

        const cancelButton = getByText(/cancel/i);
        await user.press(cancelButton);

        expect(mockExitForm).toHaveBeenCalled();
    });
});

describe("Recipe Ingredients", () => {
    describe("When blank input", () => {
        it("renders no ingredients", () => {
            const {queryByText, queryByLabelText} = render(
                <RecipeForm exitForm={mockExitForm}/>
            );
            expect(queryByText("X")).toBeFalsy();//there should be no button to delete an ingredient if there are no ingredients
            expect(queryByLabelText(/recipe-ingredient-name/i)).toBeFalsy();
            expect(queryByLabelText(/recipe-ingredient-quantity/i)).toBeFalsy();
        })
        it("can add an ingredient", async () => {
            const user = userEvent.setup();
            const {getByText, getByLabelText} = render(
                <RecipeForm  exitForm={mockExitForm}/>
            );
            
            const addIngredientButton = getByText(/add ingredient/i);
            
            await user.press(addIngredientButton);
            expect(getByLabelText(/recipe-ingredient-name/i)).toBeTruthy();
            expect(getByLabelText(/recipe-ingredient-quantity/i)).toBeTruthy();
        })
        it("can delete an ingredient", async () => {
            const user = userEvent.setup();
            const {getByText, getAllByText, queryByText} = render(
                <RecipeForm exitForm={mockExitForm}/>
            );

            const addIngredientButton = getByText(/add ingredient/i);
            
            await user.press(addIngredientButton);

            expect(getAllByText("X").length).toBe(1);

            const deleteIngredientButton = getAllByText("X")[0];
            await user.press(deleteIngredientButton);

            expect(queryByText("X")).toBeFalsy();
        })
    })
    describe("When editing an existing recipe", () => {
        it("renders the ingredients correctly", () => {
            const {getByLabelText, getAllByText} = render(
                <RecipeForm inputRecipe={mockRecipe} exitForm={mockExitForm}/>
            );

            expect(getByLabelText(/recipe-ingredient-name-0/i)).toHaveDisplayValue("Test Ingredient 1");
            expect(getByLabelText(/recipe-ingredient-name-1/i)).toHaveDisplayValue("Test Ingredient 2");
            expect(getByLabelText(/recipe-ingredient-quantity-0/i)).toHaveDisplayValue("2");
            expect(getByLabelText(/recipe-ingredient-quantity-1/i)).toHaveDisplayValue("1");
            expect(getAllByText("X").length).toBe(2);
        })
        it("can add an ingredient", async () => {
            const user = userEvent.setup();
            const {getByText, getAllByLabelText} = render(
                <RecipeForm inputRecipe={mockRecipe} exitForm={mockExitForm}/>
            );

            expect(getAllByLabelText(/recipe-ingredient-name/i)).toHaveLength(2);
            expect(getAllByLabelText(/recipe-ingredient-quantity/i)).toHaveLength(2);
            
            const addIngredientButton = getByText(/add ingredient/i);
            
            await user.press(addIngredientButton);

            expect(getAllByLabelText(/recipe-ingredient-name/i)).toHaveLength(3);
            expect(getAllByLabelText(/recipe-ingredient-quantity/i)).toHaveLength(3);
        })
        it("can delete an ingredient", async () => {
            const user = userEvent.setup();
            const {getByLabelText, getAllByLabelText} = render(
                <RecipeForm inputRecipe={mockRecipe} exitForm={mockExitForm}/>
            );

            const deleteIngredientButton = getAllByLabelText(/recipe-ingredient-delete/i)[0];
            await user.press(deleteIngredientButton);

            expect(getAllByLabelText(/recipe-ingredient-delete/i).length).toBe(1);
            expect(getByLabelText(/recipe-ingredient-name-0/i)).toHaveDisplayValue("Test Ingredient 2");
            expect(getByLabelText(/recipe-ingredient-quantity-0/i)).toHaveDisplayValue("1");
        })
        it("can edit an ingredient", async () => {
            const user = userEvent.setup();
            const {getAllByLabelText} = render(
                <RecipeForm inputRecipe={mockRecipe} exitForm={mockExitForm}/>
            );

            const nameInput = getAllByLabelText(/recipe-ingredient-name/i)[0];
            const quantityInput = getAllByLabelText(/recipe-ingredient-quantity/i)[0];

            await user.type(nameInput, ' Updated');
            await user.type(quantityInput, '0');

            expect(getAllByLabelText(/recipe-ingredient-name/i)[0]).toHaveDisplayValue(/Test Ingredient 1 Updated/i);
            expect(getAllByLabelText(/recipe-ingredient-quantity/i)[0]).toHaveDisplayValue(/20/i);
        })
    })
})