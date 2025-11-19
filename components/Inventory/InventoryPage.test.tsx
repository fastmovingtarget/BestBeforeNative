//2025-11-19 : Renamed "Ingredient(s)" to "Inventory(_Items)"

//2025-10-24 : Fixing import and mock to use correct context provider

//2025-10-14 : Removed improperly described test

import { Text } from "react-native";
import {userEvent, render} from '@testing-library/react-native';
import React from "react";

import InventoryPage from "./InventoryPage";
import InventorySearch from "./InventorySearch/InventorySearch";
import InventoryList from "./InventoryList/InventoryList";
import InventoryItemForm from "./InventoryItemForm/InventoryItemForm";

jest.mock("./InventorySearch/InventorySearch", () => {
    return {
        __esModule: true,
        default: jest.fn(),
    };
});
jest.mock("./InventoryItemForm/InventoryItemForm", () => {
    return {
        __esModule: true,
        default: jest.fn(),
    };
});
jest.mock("./InventoryList/InventoryList", () => {
    return {
        __esModule: true,
        default: jest.fn(),
    };
});

beforeEach(() => {
    jest.resetAllMocks();
});

describe("Inventory Page renders", () => {
    test("The Search component", () => {
        const mockInventorySearch = InventorySearch as jest.Mock;
        mockInventorySearch.mockReturnValue(<Text>Search:</Text>);
        const {getByText} = render(<InventoryPage />);
        expect(getByText(/Search:/i)).toBeTruthy();
    })
    test("The Form component", () => {
        const mockInventoryItemForm = InventoryItemForm as jest.Mock;
        mockInventoryItemForm.mockReturnValue(<Text>Form:</Text>);
        const {getByText} = render(<InventoryPage />);
        expect(getByText(/Form:/i)).toBeTruthy();
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
test("When The Add Inventory Item button is pressed, change the visibility of Add Inventory Item button", async () => {
    const user = userEvent.setup();
    
    const mockInventoryItemForm = InventoryItemForm as jest.Mock;
    mockInventoryItemForm.mockImplementation(({style}) => <Text style={style}>Form:</Text>);
    const {getByRole} = render(<InventoryPage />);
    
    const addInventoryItemButton = getByRole("button", {name: /Add Inventory Item/i});
    expect(addInventoryItemButton).toHaveProperty("props.style.backgroundColor", "#272727");

    await user.press(addInventoryItemButton);

    expect(addInventoryItemButton).toHaveProperty("props.style.display", "none");
})