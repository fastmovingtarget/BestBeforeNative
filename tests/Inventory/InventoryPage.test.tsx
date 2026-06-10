//2026-06-10 : Test now works with FadeComponent

//2025-11-20 : Shifting test files into their own folder in the hierarchy

//2025-11-19 : Renamed "Ingredient(s)" to "Inventory(_Items)"

//2025-10-24 : Fixing import and mock to use correct context provider

//2025-10-14 : Removed improperly described test

import { Text } from "react-native";
import {userEvent, render, waitFor} from '@testing-library/react-native';
import React from "react";

import InventoryPage from "../../components/Inventory/InventoryPage";
import InventorySearch from "../../components/Inventory/InventorySearch/InventorySearch";
import InventoryList from "../../components/Inventory/InventoryList/InventoryList";
import InventoryItemForm from "../../components/Inventory/InventoryItemForm/InventoryItemForm";

jest.mock("../../components/Inventory/InventorySearch/InventorySearch", () => {
    return {
        __esModule: true,
        default: jest.fn(),
    };
});
jest.mock("../../components/Inventory/InventoryItemForm/InventoryItemForm", () => {
    return {
        __esModule: true,
        default: jest.fn(),
    };
});
jest.mock("../../components/Inventory/InventoryList/InventoryList", () => {
    return {
        __esModule: true,
        default: jest.fn(),
    };
});

describe("Inventory Page renders", () => {
    test("The Search component", () => {
        const mockInventorySearch = InventorySearch as jest.Mock;
        mockInventorySearch.mockReturnValue(<Text>Search:</Text>);
        const {getByText} = render(<InventoryPage />);
        expect(getByText(/Search:/i)).toBeTruthy();
    })
    test("The Add Inventory Item component", () => {
        const {getByText} = render(<InventoryPage />);
        expect(getByText(/Add Inventory Item/i)).toBeTruthy();
    })
    test("The List component", () => {
        const mockInventoryList = InventoryList as jest.Mock;
        mockInventoryList.mockReturnValue(<Text>List:</Text>);
        const {getByText} = render(<InventoryPage />);
        expect(getByText(/List:/i)).toBeTruthy();
    })
})
test("When The Add Inventory Item button is pressed, the Add button disappears", async () => {
    jest.useFakeTimers(); // Use fake timers to control the timing of the test
    const user = userEvent.setup();
    
    const mockInventoryItemForm = InventoryItemForm as jest.Mock;
    mockInventoryItemForm.mockImplementation(({style}) => <Text style={style}>Form:</Text>);
    const {getByRole, queryByRole} = render(<InventoryPage />);
    
    const addInventoryItemButton = getByRole("button", {name: /Add Inventory Item/i});

    await user.press(addInventoryItemButton);

    jest.runAllTimers(); // Fast-forward all timers to ensure any delayed actions are executed

    await waitFor(() => {
        expect(queryByRole("button", {name: /Add Inventory Item/i})).toBeNull();
    });

    jest.useRealTimers(); // Restore real timers after the test
})

test("When The Add Inventory Item button is pressed, the Form component appears", async () => {
    jest.useFakeTimers(); // Use fake timers to control the timing of the test
    const user = userEvent.setup();
    
    const mockInventoryItemForm = InventoryItemForm as jest.Mock;  
    mockInventoryItemForm.mockImplementation(({style}) => <Text style={style}>Form:</Text>);
    const {getByRole, queryByRole} = render(<InventoryPage />);
    
    const addInventoryItemButton = getByRole("button", {name: /Add Inventory Item/i});

    await user.press(addInventoryItemButton);

    jest.runAllTimers(); // Fast-forward all timers to ensure any delayed actions are executed

    await waitFor(() => {
        expect(queryByRole("text", {name: /Form:/i})).toBeTruthy();
    });

    jest.useRealTimers(); // Restore real timers after the test
})