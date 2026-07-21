//2026-07-21 : Test recipe rating for iconised display
//2026-07-21 : Recipe_Difficulty changed to Recipe_Rating
//2026-07-20 : minor fix
//2026-07-20 : Updating to match validation and icon changes
//2026-06-10 : Test now works with FadeComponent
//2025-11-20 : Shifting test files into their own folder in the hierarchy
//2025-11-19 : Ingredient_Name and Ingredient_Quantity now have Recipe_ prefix
//2025-10-24 : Fixing import and mock to use correct context provider

import {render, userEvent } from '@testing-library/react-native';
import RecipeForm from '@/components/Recipes/RecipeForm/RecipeForm';
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

const mockExitForm = jest.fn();

const mockRecipe: Recipe = {
  Recipe_ID: 123,
    Recipe_Name: 'Test Recipe',
    Recipe_Rating: 3,
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

beforeEach(() => {
    mockDataContext.deleteRecipe.mockReset();
    mockDataContext.addRecipe.mockReset();
    mockDataContext.updateRecipe.mockReset();
  (useRecipes as jest.Mock).mockReturnValue(mockDataContext);
});

describe('Recipe Form Renders ', () => {
    it("all input fields correctly when adding (blank recipe input)", () => {
        const {getByLabelText, queryAllByLabelText} = render(
            <RecipeForm exitForm={mockExitForm}/>
        );

        expect(getByLabelText(/recipe-name/i)).toBeTruthy();
        expect(getByLabelText(/recipe-time/i)).toBeTruthy();
        expect(queryAllByLabelText(/recipe-rating-pressable/i)).toHaveLength(5);
        expect(getByLabelText(/recipe-instructions/i)).toBeTruthy();
        expect(getByLabelText(/recipe-name/i)).toHaveDisplayValue("");
        expect(getByLabelText(/recipe-time/i)).toHaveDisplayValue("");
        expect(queryAllByLabelText(/recipe-rating-filled/i)).toHaveLength(0);
        expect(queryAllByLabelText(/recipe-rating-empty/i)).toHaveLength(5);
        expect(getByLabelText(/recipe-instructions/i)).toHaveDisplayValue("");
    })
    it("all input fields correctly when updating/editing", () => {
        const {getByLabelText, queryAllByLabelText} = render(
            <RecipeForm inputRecipe={mockRecipe} exitForm={mockExitForm}/>
        );

        expect(getByLabelText(/recipe-name/i)).toBeTruthy();
        expect(getByLabelText(/recipe-time/i)).toBeTruthy();
        expect(queryAllByLabelText(/recipe-rating-pressable/i)).toHaveLength(5);
        expect(getByLabelText(/recipe-instructions/i)).toBeTruthy();
        expect(getByLabelText(/recipe-name/i)).toHaveDisplayValue("Test Recipe");
        expect(getByLabelText(/recipe-time/i)).toHaveDisplayValue("30");
        expect(queryAllByLabelText(/recipe-rating-filled/i)).toHaveLength(3);
        expect(queryAllByLabelText(/recipe-rating-empty/i)).toHaveLength(2);
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
        const instructionsInput = getByLabelText(/recipe-instructions/i);
        
        await user.type(nameInput, 'New Recipe');
        await user.type(timeInput, '45');
        const ratingButton1 = getByLabelText(/recipe-rating-pressable-1/i);
        await user.press(ratingButton1);
        await user.type(instructionsInput, 'New Instructions');

        const submitButton = getByLabelText(/submit-button/i);
        await user.press(submitButton);

        expect(mockDataContext.addRecipe).toHaveBeenCalledWith({
            Recipe_Name: 'New Recipe',
            Recipe_Time: 45,
            Recipe_Rating: 1,
            Recipe_Instructions: 'New Instructions',
            Recipe_Ingredients: [],
        });
    });

    it("calls updateRecipe when updating an existing recipe", async () => {
        const user = userEvent.setup();
        const {getByLabelText} = render(
            <RecipeForm inputRecipe={mockRecipe} exitForm={mockExitForm}/>
        );

        const nameInput = getByLabelText(/recipe-name/i);
        const timeInput = getByLabelText(/recipe-time/i);
        const instructionsInput = getByLabelText(/recipe-instructions/i);
        
        await user.type(nameInput, 'Updated Recipe');
        await user.type(timeInput, '0');
        const ratingButton3 = getByLabelText(/recipe-rating-pressable-3/i);
        await user.press(ratingButton3);
        await user.type(instructionsInput, 'Updated Instructions');

        const submitButton = getByLabelText(/submit-button/i);
        await user.press(submitButton);

        expect(mockDataContext.updateRecipe).toHaveBeenCalledWith({
            ...mockRecipe,
            Recipe_Name: 'Test RecipeUpdated Recipe',
            Recipe_Time: 300,
            Recipe_Rating: 3,
            Recipe_Instructions: 'Test InstructionsUpdated Instructions',
        });
    });
});   

describe("Recipe form exits after animation", () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });
    afterEach(() => {
        jest.useRealTimers();
    });
    it("Does not call exitForm when submit button is pressed if validation fails", async () => {
        const user = userEvent.setup();
        mockExitForm.mockReset();
        const {getByLabelText} = render(
            <RecipeForm exitForm={mockExitForm}/>
        );

        const submitButton = getByLabelText(/submit-button/i);
        await user.press(submitButton);

        expect(mockExitForm).not.toHaveBeenCalled();
        jest.advanceTimersByTime(300); //advance timers to trigger the end of the animation
        expect(mockExitForm).not.toHaveBeenCalled();
    });
    it("calls exitForm when submit button is pressed and validation passes", async () => {
        const user = userEvent.setup();
        mockExitForm.mockReset();
        const {getByLabelText} = render(
            <RecipeForm exitForm={mockExitForm}/>
        );

        const nameInput = getByLabelText(/recipe-name/i);
        await user.type(nameInput, 'New Recipe');
        const timeInput = getByLabelText(/recipe-time/i);
        await user.type(timeInput, '45');
        const ratingButton2 = getByLabelText(/recipe-rating-pressable-2/i);
        await user.press(ratingButton2);
        const instructionsInput = getByLabelText(/recipe-instructions/i);
        await user.type(instructionsInput, 'New Instructions');

        const submitButton = getByLabelText(/submit-button/i);
        await user.press(submitButton);

        expect(mockExitForm).not.toHaveBeenCalled();
        jest.advanceTimersByTime(300); //advance timers to trigger the end of the animation
        expect(mockExitForm).toHaveBeenCalled();
    });
    it("calls exitForm when cancel button is pressed", async () => {
        const user = userEvent.setup();
        mockExitForm.mockReset();
        const {getByLabelText} = render(
            <RecipeForm exitForm={mockExitForm}/>
        );

        const cancelButton = getByLabelText(/cancel-button/i);
        await user.press(cancelButton);

        expect(mockExitForm).not.toHaveBeenCalled();
        jest.advanceTimersByTime(300); //advance timers to trigger the end of the animation
        expect(mockExitForm).toHaveBeenCalled();
    });
})

describe("Recipe Ingredients", () => {
    describe("When blank input", () => {
        it("renders no ingredients", () => {
            const {queryByLabelText} = render(
                <RecipeForm exitForm={mockExitForm}/>
            );
            expect(queryByLabelText(/recipe-ingredient-delete/i)).toBeFalsy();//there should be no button to delete an ingredient if there are no ingredients
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
            const {getByText, getAllByLabelText, queryByLabelText} = render(
                <RecipeForm exitForm={mockExitForm}/>
            );

            const addIngredientButton = getByText(/add ingredient/i);
            
            await user.press(addIngredientButton);

            expect(getAllByLabelText(/recipe-ingredient-delete/i).length).toBe(1);

            const deleteIngredientButton = getAllByLabelText(/recipe-ingredient-delete/i)[0];
            await user.press(deleteIngredientButton);

            expect(queryByLabelText(/recipe-ingredient-delete/i)).toBeFalsy();
        })
    })
    describe("When editing an existing recipe", () => {
        it("renders the ingredients correctly", () => {
            const {getByLabelText, getAllByLabelText} = render(
                <RecipeForm inputRecipe={mockRecipe} exitForm={mockExitForm}/>
            );

            expect(getByLabelText(/recipe-ingredient-name-0/i)).toHaveDisplayValue("Test Ingredient 1");
            expect(getByLabelText(/recipe-ingredient-name-1/i)).toHaveDisplayValue("Test Ingredient 2");
            expect(getByLabelText(/recipe-ingredient-quantity-0/i)).toHaveDisplayValue("2");
            expect(getByLabelText(/recipe-ingredient-quantity-1/i)).toHaveDisplayValue("1");
            expect(getAllByLabelText(/recipe-ingredient-delete/i).length).toBe(2);
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

describe("Recipe Rating buttons", () => {
    it("can set the rating to 1", async () => {
        const user = userEvent.setup();
        const {getByLabelText} = render(
            <RecipeForm inputRecipe={mockRecipe} exitForm={mockExitForm}/>
        );
        const ratingButton1 = getByLabelText(/recipe-rating-pressable-1/i);
        await user.press(ratingButton1);

        const submitButton = getByLabelText(/submit-button/i);
        await user.press(submitButton);

        expect(mockDataContext.updateRecipe).toHaveBeenCalledWith(expect.objectContaining({
            Recipe_Rating: 1,
        }));
    })
})