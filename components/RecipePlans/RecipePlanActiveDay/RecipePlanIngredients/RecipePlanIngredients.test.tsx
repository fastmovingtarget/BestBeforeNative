//2025-11-17 : Full initial implementation and documentation

//2025-10-29 : Placeholder implementation

import {render, userEvent } from "@testing-library/react-native";
import React from "react";
import Recipe_Plan, {Plan_Ingredient} from "@/Types/Recipe_Plan";
import RecipePlanIngredients from "./RecipePlanIngredients";
import Shopping_List_Item from "@/Types/Shopping_List_Item";
import Ingredient from "@/Types/Ingredient";
import { useIngredients } from "@/Contexts/Ingredients/IngredientsDataProvider";
import { useShoppingList } from "@/Contexts/ShoppingList/ShoppingListDataProvider";

const mockIngredients : Ingredient[] = [
    {
        Ingredient_ID: 1,
        Ingredient_Name: "Ingredient 1",
        Ingredient_Quantity: 5,
    },  
    {
        Ingredient_ID: 2,
        Ingredient_Name: "Ingredient 2",
        Ingredient_Quantity: 10,
    }
];

const mockRecipePlanIngredients : Plan_Ingredient[] = [
    {
        Ingredient_Name: "Plan Ingredient 1",
        Ingredient_Quantity: 2,
        Recipe_Ingredient_ID: 1,
    },
    {
        Ingredient_Name: "Plan Ingredient 2",
        Ingredient_Quantity: 1,
        Recipe_Ingredient_ID: 2,
    }
];

const mockRecipePlan: Recipe_Plan = {
    Plan_ID: 1,
    Recipe_ID: 101,
    Recipe_Name: "Test Recipe",
    Plan_Date: new Date("2023-10-01"),
    Plan_Ingredients: mockRecipePlanIngredients
};

const mockAddShoppingItem = jest.fn();
const mockMatchIngredient = jest.fn();

jest.mock('@/Contexts/Ingredients/IngredientsDataProvider', () => ({
    __esModule: true,
    useIngredients: jest.fn(),
}));

jest.mock('@/Contexts/ShoppingList/ShoppingListDataProvider', () => ({
    __esModule: true,
    useShoppingList: jest.fn(),
}));

beforeEach(() => {
    jest.resetAllMocks();
    (useIngredients as jest.Mock).mockReturnValue({
        ingredients: mockIngredients,
        matchIngredient: mockMatchIngredient,
    });
    (useShoppingList as jest.Mock).mockReturnValue({
        addShoppingItem: mockAddShoppingItem,
    });
});

describe("RecipePlanIngredients Renders", () => {
    test("Recipe Plan correctly", () => {
        const { getByText } = render(<RecipePlanIngredients recipePlan={mockRecipePlan} />);

        expect(getByText("Ingredients for Test Recipe")).toBeTruthy();
        expect(getByText("Plan Ingredient 1")).toBeTruthy();
        expect(getByText("Plan Ingredient 2")).toBeTruthy();
        expect(getByText(/Test Recipe/i)).toBeTruthy();
    });
    test("Add To Shopping List Button Render", () => {
        const { getAllByText } = render(<RecipePlanIngredients recipePlan={mockRecipePlan} />);
        expect(getAllByText(/Add to Shopping List/i)).toHaveLength(2);
    });
    test("Attach Ingredient Button Render", () => {
        const { getAllByText } = render(<RecipePlanIngredients recipePlan={mockRecipePlan} />);
        expect(getAllByText(/Attach Ingredient/i)).toHaveLength(2);
    });
    test("No Attach or Add To Shopping List Button if Item_ID exists", () => {
        const mockRecipePlanWithItemID: Recipe_Plan = {
            Plan_ID: 1,
            Recipe_ID: 101,
            Recipe_Name: "Test Recipe",
            Plan_Date: new Date("2023-10-01"),
            Plan_Ingredients: [
                {
                    Ingredient_Name: "Plan Ingredient 1",
                    Ingredient_Quantity: 2,
                    Recipe_Ingredient_ID: 1,
                    Item_ID: 5
                },
                {
                    Ingredient_Name: "Plan Ingredient 2",
                    Ingredient_Quantity: 1,
                    Recipe_Ingredient_ID: 2,
                }
            ]
        };
        const { getAllByText } = render(<RecipePlanIngredients recipePlan={mockRecipePlanWithItemID} />);
        expect(getAllByText(/Add to Shopping List/i)).toHaveLength(1);
        expect(getAllByText(/Attach Ingredient/i)).toHaveLength(1);
    });
    test("No Attach or Add To Shopping List Button if Ingredient_ID exists", () => {
        const mockRecipePlanWithIngredientID: Recipe_Plan = {
            Plan_ID: 1,
            Recipe_ID: 101,
            Recipe_Name: "Test Recipe",
            Plan_Date: new Date("2023-10-01"),
            Plan_Ingredients: [
                {
                    Ingredient_Name: "Plan Ingredient 1",
                    Ingredient_Quantity: 2,
                    Recipe_Ingredient_ID: 1,
                    Ingredient_ID: 3
                },
                {
                    Ingredient_Name: "Plan Ingredient 2",
                    Ingredient_Quantity: 1,
                    Recipe_Ingredient_ID: 2,
                }
            ]
        };
        const { getAllByText } = render(<RecipePlanIngredients recipePlan={mockRecipePlanWithIngredientID} />);
        expect(getAllByText(/Attach Ingredient/i)).toHaveLength(1);
        expect(getAllByText(/Add to Shopping List/i)).toHaveLength(1);
    });
    test("Recipe Plan with no ingredients", () => {
        const mockRecipePlanNoIngredients: Recipe_Plan = {
            Plan_ID: 2,
            Recipe_ID: 102,
            Recipe_Name: "Test Recipe No Ingredients",
            Plan_Date: new Date("2023-10-02"),
            Plan_Ingredients: []
        };  
        const { getByText } = render(<RecipePlanIngredients recipePlan={mockRecipePlanNoIngredients} />);
        expect(getByText("Ingredients for Test Recipe No Ingredients")).toBeTruthy();
        expect(() => getByText("Plan Ingredient 1")).toThrow();
        expect(() => getByText("Plan Ingredient 2")).toThrow();
    });
    test("Recipe Plan with undefined ingredients", () => {
        const mockRecipePlanNullIngredients: Recipe_Plan = {
            Plan_ID: 3,
            Recipe_ID: 103,
            Recipe_Name: "Test Recipe Null Ingredients",
            Plan_Date: new Date("2023-10-03"),
            Plan_Ingredients: undefined
        };  
        const { getByText } = render(<RecipePlanIngredients recipePlan={mockRecipePlanNullIngredients} />);
        expect(getByText("Ingredients for Test Recipe Null Ingredients")).toBeTruthy();
        expect(() => getByText("Plan Ingredient 1")).toThrow();
        expect(() => getByText("Plan Ingredient 2")).toThrow();
    });
});
describe("RecipePlanIngredients Functions", () => {
    test("Pressing Add To Shopping List Button", async () => {
        const { getAllByText } = render(<RecipePlanIngredients recipePlan={mockRecipePlan} />);
        const addToShoppingListButtons = getAllByText(/Add to Shopping List/i);
        expect(addToShoppingListButtons).toHaveLength(2);

        await userEvent.press(addToShoppingListButtons[0]);
        expect(mockAddShoppingItem).toHaveBeenCalledTimes(1);
        expect(mockAddShoppingItem).toHaveBeenCalledWith(expect.objectContaining({
            Item_Name: "Plan Ingredient 1",
            Item_Quantity: 2,
            Item_Recipe_Plan_ID : 1,
            Item_Recipe_Plan_Date: mockRecipePlan.Plan_Date,
            Item_Recipe_Name: mockRecipePlan.Recipe_Name,
            Item_Recipe_Plan_Ingredient: 1
        } as Shopping_List_Item));
    });
    test("Pressing Attach Ingredient Button", async () => {
        const { getAllByText } = render(<RecipePlanIngredients recipePlan={mockRecipePlan} />);
        const attachIngredientButtons = getAllByText(/Attach Ingredient/i);
        expect(attachIngredientButtons).toHaveLength(2);
        await userEvent.press(attachIngredientButtons[0]);
        
        expect(getAllByText("Ingredient 1")[0]).toBeTruthy();

        await userEvent.press(getAllByText("Ingredient 1")[0]);
        expect(mockMatchIngredient).toHaveBeenCalledTimes(1);
        expect(mockMatchIngredient).toHaveBeenCalledWith(
            expect.objectContaining({
                Ingredient_ID: 1,
                Ingredient_Name: "Ingredient 1",
                Ingredient_Quantity: 5,
            } as Ingredient), 
            expect.objectContaining({
                Ingredient_Name: "Plan Ingredient 1",
                Ingredient_Quantity: 2,
                Recipe_Ingredient_ID: 1,
            } as Plan_Ingredient),
            mockRecipePlan
        );
        expect(() => getAllByText("Ingredient 1")[0]).toThrow();
        expect(() => getAllByText("Ingredient 2")[0]).toThrow();
    });
});