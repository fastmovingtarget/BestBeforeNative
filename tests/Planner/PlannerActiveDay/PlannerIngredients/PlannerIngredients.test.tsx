//2026-10-07 : Mocking Resizing component with placeholder
//2026-06-11 : Accounting for text changes

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
import {usePlans} from '@/Contexts/Plans/PlansDataProvider';
import  ResizeComponent  from '@/ui/ResizeComponent';
import { View } from "react-native";

const today = new Date();
const dayAfterTomorrow = new Date();
dayAfterTomorrow.setDate(today.getDate() + 2);

const mockIngredients : Inventory_Item[] = [
    {
        Inventory_Item_ID: 1,
        Inventory_Item_Name: "Inventory Item 1",
        Inventory_Item_Quantity: 5,
        Inventory_Item_Date: dayAfterTomorrow,
    },  
    {
        Inventory_Item_ID: 2,
        Inventory_Item_Name: "Inventory Item 2",
        Inventory_Item_Quantity: 10,
        Inventory_Item_Date: dayAfterTomorrow,
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
    Plan_Date: dayAfterTomorrow,
    Plan_Ingredients: mockRecipePlanIngredients
};
const mockPlans = [{
            Plan_ID: 0,
            Recipe_ID: 101,
            Recipe_Name: "Test Recipe",
            Plan_Date: dayAfterTomorrow,
            Plan_Ingredients: mockRecipePlanIngredients
        },{
        Plan_ID: 1,
        Recipe_ID: 101,
        Recipe_Name: "Test Recipe",
        Plan_Date: dayAfterTomorrow,
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
    },{
        Plan_ID: 2,
        Recipe_ID: 101,
        Recipe_Name: "Test Recipe",
        Plan_Date: dayAfterTomorrow,
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
    },{
        Plan_ID: 3,
        Recipe_ID: 102,
        Recipe_Name: "Test Recipe No Ingredients",
        Plan_Date: dayAfterTomorrow,
        Plan_Ingredients: []
    },{
        Plan_ID: 4,
        Recipe_ID: 103,
        Recipe_Name: "Test Recipe Null Ingredients",
        Plan_Date: dayAfterTomorrow,
        Plan_Ingredients: undefined
    }
];

const mockAddShoppingItemAsync = jest.fn();
const mockMatchIngredient = jest.fn();

jest.mock('@/Contexts/Inventory/InventoryDataProvider', () => ({
    __esModule: true,
    useInventory: jest.fn(),
}));

jest.mock('@/Contexts/ShoppingList/ShoppingListDataProvider', () => ({
    __esModule: true,
    useShoppingList: jest.fn(),
}));
jest.mock('@/Contexts/Plans/PlansDataProvider', () => ({
    __esModule: true,
    usePlans: jest.fn(),
}));
jest.mock('@/ui/ResizeComponent', () => ({
    __esModule: true,
    default: jest.fn(),
}));

beforeEach(() => {
    jest.resetAllMocks();
    (useInventory as jest.Mock).mockImplementation(() => {
        return {
            inventory: mockIngredients,
            matchInventoryItem: mockMatchIngredient,
        }
    });
    (useShoppingList as jest.Mock).mockReturnValue({
        addShoppingItemAsync: mockAddShoppingItemAsync,
    });
    (usePlans as jest.Mock).mockReturnValue({
        plans: mockPlans,
        updatePlan: jest.fn(),
        setPlansDataState: jest.fn(),
    });
    (ResizeComponent as jest.Mock).mockImplementation(({children}) => <View>{children}</View>);
});

describe("PlannerIngredients Renders", () => {
    test("Plan correctly", () => {
        const { getByText } = render(<PlannerIngredients recipePlanID={0} />);

        expect(getByText("Ingredients to make Test Recipe")).toBeTruthy();
        expect(getByText(/Plan Ingredient 1/i)).toBeTruthy();
        expect(getByText(/Plan Ingredient 2/i)).toBeTruthy();
        expect(getByText(/Test Recipe/i)).toBeTruthy();
    });
    test("Add To Shopping List Button Render", () => {
        const { getAllByLabelText } = render(<PlannerIngredients recipePlanID={0} />);
        expect(getAllByLabelText("add-to-shopping-list")).toHaveLength(2);
    });
    test("Attach Inventory Item Button Render", () => {
        const { getAllByLabelText } = render(<PlannerIngredients recipePlanID={0} />);
        expect(getAllByLabelText("attach-inventory-item")).toHaveLength(2);
    });
    test("No Attach or Add To Shopping List Button if Item_ID exists", () => {
        const { getAllByLabelText } = render(<PlannerIngredients recipePlanID={1} />);
        expect(getAllByLabelText("attach-inventory-item")).toHaveLength(1);
        expect(getAllByLabelText("add-to-shopping-list")).toHaveLength(1);
    });
    test("No Attach or Add To Shopping List Button if Inventory_Item_ID exists", () => {
        const { getAllByLabelText } = render(<PlannerIngredients recipePlanID={2} />);
        expect(getAllByLabelText("attach-inventory-item")).toHaveLength(1);
        expect(getAllByLabelText("add-to-shopping-list")).toHaveLength(1);
    });
    test("Plan with no ingredients", () => {
        const { getByText } = render(<PlannerIngredients recipePlanID={3} />);
        expect(getByText(/Ingredients to make Test Recipe No Ingredients/)).toBeTruthy();
        expect(() => getByText("Plan Ingredient 1")).toThrow();
        expect(() => getByText("Plan Ingredient 2")).toThrow();
    });
    test("Plan with undefined ingredients", () => {
        const { getByText } = render(<PlannerIngredients recipePlanID={4} />);
        expect(getByText(/Ingredients to make Test Recipe Null Ingredients/)).toBeTruthy();
        expect(() => getByText("Plan Ingredient 1")).toThrow();
        expect(() => getByText("Plan Ingredient 2")).toThrow();
    });
});
describe("RecipePlanIngredients Functions", () => {
    test("Pressing Add To Shopping List Button", async () => {
        mockAddShoppingItemAsync.mockClear();
        mockAddShoppingItemAsync.mockReturnValue(Promise.resolve());
        const { getAllByLabelText } = render(<PlannerIngredients recipePlanID={0} />);
        const addToShoppingListButtons = getAllByLabelText("add-to-shopping-list");
        expect(addToShoppingListButtons).toHaveLength(2);

        await userEvent.press(addToShoppingListButtons[0]);
        expect(mockAddShoppingItemAsync).toHaveBeenCalledTimes(1);
        expect(mockAddShoppingItemAsync).toHaveBeenCalledWith(expect.objectContaining({
            Shopping_Item_Name: "Plan Ingredient 1",
            Shopping_Item_Quantity: 2,
            Plan_ID : 0,
            Plan_Date: mockPlan.Plan_Date,
            Plan_Recipe_Name: mockPlan.Recipe_Name,
            Plan_Ingredient_ID: 1
        } as Shopping_List_Item));
    });
    test("Pressing Attach Inventory Item Button", async () => {
        const { getAllByText, getAllByLabelText } = render(<PlannerIngredients recipePlanID={0} />);
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
            mockPlans[0]
        );
        expect(() => getAllByText("Ingredient 1")[0]).toThrow();
        expect(() => getAllByText("Ingredient 2")[0]).toThrow();
    });
});