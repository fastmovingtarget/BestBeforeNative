//2025-11-20 : Shifting test files into their own folder in the hierarchy

//2025-11-19 : Renamed RecipePlan/nner to just Planner, Recipe_Plan to just Plan

//2025-11-17 : Full initial implementation and documentation

//2025-10-29 : Placeholder implementation

import {render, userEvent } from "@testing-library/react-native";
import React from "react";
import Plan, {Plan_Ingredient} from "@/Types/Plan";
import PlannerIngredients from "@/components/Planner/PlannerActiveDay/PlannerIngredients/PlannerIngredients";
import Shopping_List_Item from "@/Types/Shopping_List_Item";
import Inventory_Item from "@/Types/Inventory_Item";
import { useInventory } from "@/Contexts/Inventory/InventoryDataProvider";
import { useShoppingList } from "@/Contexts/ShoppingList/ShoppingListDataProvider";

const mockIngredients : Inventory_Item[] = [
    {
        Inventory_Item_ID: 1,
        Inventory_Item_Name: "Inventory Item 1",
        Inventory_Item_Quantity: 5,
    },  
    {
        Inventory_Item_ID: 2,
        Inventory_Item_Name: "Inventory Item 2",
        Inventory_Item_Quantity: 10,
    }
];

const mockRecipePlanIngredients : Plan_Ingredient[] = [
    {
        Recipe_Ingredient_Name: "Plan Ingredient 1",
        Recipe_Ingredient_Quantity: 2,
        Recipe_Ingredient_ID: 1,
    },
    {
        Recipe_Ingredient_Name: "Plan Ingredient 2",
        Recipe_Ingredient_Quantity: 1,
        Recipe_Ingredient_ID: 2,
    }
];

const mockPlan: Plan = {
    Plan_ID: 1,
    Recipe_ID: 101,
    Recipe_Name: "Test Recipe",
    Plan_Date: new Date("2023-10-01"),
    Plan_Ingredients: mockRecipePlanIngredients
};

const mockAddShoppingItem = jest.fn();
const mockMatchIngredient = jest.fn();

jest.mock('@/Contexts/Inventory/InventoryDataProvider', () => ({
    __esModule: true,
    useInventory: jest.fn(),
}));

jest.mock('@/Contexts/ShoppingList/ShoppingListDataProvider', () => ({
    __esModule: true,
    useShoppingList: jest.fn(),
}));

beforeEach(() => {
    jest.resetAllMocks();
    (useInventory as jest.Mock).mockReturnValue({
        inventory: mockIngredients,
        matchInventoryItem: mockMatchIngredient,
    });
    (useShoppingList as jest.Mock).mockReturnValue({
        addShoppingItem: mockAddShoppingItem,
    });
});

describe("PlannerIngredients Renders", () => {
    test("Plan correctly", () => {
        const { getByText } = render(<PlannerIngredients recipePlan={mockPlan} />);

        expect(getByText("Ingredients for Test Recipe")).toBeTruthy();
        expect(getByText(/Plan Ingredient 1/i)).toBeTruthy();
        expect(getByText(/Plan Ingredient 2/i)).toBeTruthy();
        expect(getByText(/Test Recipe/i)).toBeTruthy();
    });
    test("Add To Shopping List Button Render", () => {
        const { getAllByLabelText } = render(<PlannerIngredients recipePlan={mockPlan} />);
        expect(getAllByLabelText("add-to-shopping-list")).toHaveLength(2);
    });
    test("Attach Inventory Item Button Render", () => {
        const { getAllByLabelText } = render(<PlannerIngredients recipePlan={mockPlan} />);
        expect(getAllByLabelText("attach-inventory-item")).toHaveLength(2);
    });
    test("No Attach or Add To Shopping List Button if Item_ID exists", () => {
        const mockPlanWithItemID: Plan = {
            Plan_ID: 1,
            Recipe_ID: 101,
            Recipe_Name: "Test Recipe",
            Plan_Date: new Date("2023-10-01"),
            Plan_Ingredients: [
                {
                    Recipe_Ingredient_Name: "Plan Ingredient 1",
                    Recipe_Ingredient_Quantity: 2,
                    Recipe_Ingredient_ID: 1,
                    Shopping_Item_ID: 5
                },
                {
                    Recipe_Ingredient_Name: "Plan Ingredient 2",
                    Recipe_Ingredient_Quantity: 1,
                    Recipe_Ingredient_ID: 2,
                }
            ]
        };
        const { getAllByLabelText } = render(<PlannerIngredients recipePlan={mockPlanWithItemID} />);
        expect(getAllByLabelText("attach-inventory-item")).toHaveLength(1);
        expect(getAllByLabelText("add-to-shopping-list")).toHaveLength(1);
    });
    test("No Attach or Add To Shopping List Button if Inventory_Item_ID exists", () => {
        const mockPlanWithIngredientID: Plan = {
            Plan_ID: 1,
            Recipe_ID: 101,
            Recipe_Name: "Test Recipe",
            Plan_Date: new Date("2023-10-01"),
            Plan_Ingredients: [
                {
                    Recipe_Ingredient_Name: "Plan Ingredient 1",
                    Recipe_Ingredient_Quantity: 2,
                    Recipe_Ingredient_ID: 1,
                    Inventory_Item_ID: 3
                },
                {
                    Recipe_Ingredient_Name: "Plan Ingredient 2",
                    Recipe_Ingredient_Quantity: 1,
                    Recipe_Ingredient_ID: 2,
                }
            ]
        };
        const { getAllByLabelText } = render(<PlannerIngredients recipePlan={mockPlanWithIngredientID} />);
        expect(getAllByLabelText("attach-inventory-item")).toHaveLength(1);
        expect(getAllByLabelText("add-to-shopping-list")).toHaveLength(1);
    });
    test("Plan with no ingredients", () => {
        const mockPlanNoIngredients: Plan = {
            Plan_ID: 2,
            Recipe_ID: 102,
            Recipe_Name: "Test Recipe No Ingredients",
            Plan_Date: new Date("2023-10-02"),
            Plan_Ingredients: []
        };  
        const { getByText } = render(<PlannerIngredients recipePlan={mockPlanNoIngredients} />);
        expect(getByText("Ingredients for Test Recipe No Ingredients")).toBeTruthy();
        expect(() => getByText("Plan Ingredient 1")).toThrow();
        expect(() => getByText("Plan Ingredient 2")).toThrow();
    });
    test("Plan with undefined ingredients", () => {
        const mockPlanNullIngredients: Plan = {
            Plan_ID: 3,
            Recipe_ID: 103,
            Recipe_Name: "Test Recipe Null Ingredients",
            Plan_Date: new Date("2023-10-03"),
            Plan_Ingredients: undefined
        };  
        const { getByText } = render(<PlannerIngredients recipePlan={mockPlanNullIngredients} />);
        expect(getByText("Ingredients for Test Recipe Null Ingredients")).toBeTruthy();
        expect(() => getByText("Plan Ingredient 1")).toThrow();
        expect(() => getByText("Plan Ingredient 2")).toThrow();
    });
});
describe("RecipePlanIngredients Functions", () => {
    test("Pressing Add To Shopping List Button", async () => {
        const { getAllByLabelText } = render(<PlannerIngredients recipePlan={mockPlan} />);
        const addToShoppingListButtons = getAllByLabelText("add-to-shopping-list");
        expect(addToShoppingListButtons).toHaveLength(2);

        await userEvent.press(addToShoppingListButtons[0]);
        expect(mockAddShoppingItem).toHaveBeenCalledTimes(1);
        expect(mockAddShoppingItem).toHaveBeenCalledWith(expect.objectContaining({
            Shopping_Item_Name: "Plan Ingredient 1",
            Shopping_Item_Quantity: 2,
            Plan_ID : 1,
            Plan_Date: mockPlan.Plan_Date,
            Plan_Recipe_Name: mockPlan.Recipe_Name,
            Plan_Ingredient_ID: 1
        } as Shopping_List_Item));
    });
    test("Pressing Attach Inventory Item Button", async () => {
        const { getAllByText, getAllByLabelText } = render(<PlannerIngredients recipePlan={mockPlan} />);
        const attachInventoryItemButtons = getAllByLabelText("attach-inventory-item");
        expect(attachInventoryItemButtons).toHaveLength(2);
        await userEvent.press(attachInventoryItemButtons[0]);
        
        expect(getAllByText("Inventory Item 1")[0]).toBeTruthy();

        const button = getAllByText("Inventory Item 1")[0];

        await userEvent.press(button);
        expect(mockMatchIngredient).toHaveBeenCalledTimes(1);
        expect(mockMatchIngredient).toHaveBeenCalledWith(
            expect.objectContaining({
                Inventory_Item_ID: 1,
                Inventory_Item_Name: "Inventory Item 1",
                Inventory_Item_Quantity: 5,
            } as Inventory_Item), 
            expect.objectContaining({
                Recipe_Ingredient_Name: "Plan Ingredient 1",
                Recipe_Ingredient_Quantity: 2,
                Recipe_Ingredient_ID: 1,
            } as Plan_Ingredient),
            mockPlan
        );
        expect(() => getAllByText("Ingredient 1")[0]).toThrow();
        expect(() => getAllByText("Ingredient 2")[0]).toThrow();
    });
});