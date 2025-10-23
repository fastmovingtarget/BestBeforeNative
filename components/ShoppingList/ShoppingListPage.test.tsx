//2025-10-23 : Converted to use Shopping List Context

//2025-05-27 : Initial implementation of shopping list page

import { Text } from "react-native";
import { userEvent, render } from '@testing-library/react-native';
import React from "react";

import ShoppingListPage from "./ShoppingListPage";
import ShoppingListSearch from "./ShoppingListSearch/ShoppingListSearch";
import ShoppingListList from "./ShoppingList/ShoppingList";
import ShoppingListForm from "./ShoppingListForm/ShoppingListForm";

jest.mock("./ShoppingListSearch/ShoppingListSearch", () => {
    return {
        __esModule: true,
        default: jest.fn(),
    };
});
jest.mock("./ShoppingListForm/ShoppingListForm", () => {
    return {
        __esModule: true,
        default: jest.fn(),
    };
});
jest.mock("./ShoppingList/ShoppingList", () => {
    return {
        __esModule: true,
        default: jest.fn(),
    };
});

beforeEach(() => {
    jest.resetAllMocks();
});

describe("ShoppingList Page renders", () => {
    test("The Search component", () => {
        (ShoppingListSearch as jest.Mock).mockReturnValue(<Text>Search:</Text>);
        const {getByText} = render(<ShoppingListPage />);
        expect(getByText(/Search/i)).toBeTruthy();
    })
    test("The Form component", () => {
        (ShoppingListForm as jest.Mock).mockReturnValue(<Text>Form:</Text>);
        const {queryByText} = render(<ShoppingListPage />);
        expect(queryByText(/Form:/i)).toBeFalsy();
    })
    test("The Add Shopping List Item component", () => {
        const {getByText} = render(<ShoppingListPage />);
        expect(getByText(/Add Item/i)).toBeTruthy();
    })
    test("The List component", () => {
        (ShoppingListList as jest.Mock).mockReturnValue(<Text>List:</Text>);
        const {getByText} = render(<ShoppingListPage />);
        expect(getByText(/List:/i)).toBeTruthy();
    })
})
test("When The Add Shopping List Item button is pressed, change the visibility of Add Shopping List Item button", async () => {
    const user = userEvent.setup();

    (ShoppingListForm as jest.Mock).mockImplementation(({style}) => <Text style={style}>Form:</Text>);

    const {queryByText, getByText} = render(<ShoppingListPage />);
    const addButton = getByText(/Add Item/i);

    await user.press(addButton);

    expect(queryByText(/Add Item/i)).toBeFalsy();
    expect(getByText(/Form:/i)).toBeTruthy();

})
test("When The Form Cancel button is pressed, change the form to", async () => {
    const user = userEvent.setup();

    (ShoppingListForm as jest.Mock).mockImplementation(({onCancel}) => <Text onPress={onCancel}>Form:</Text>);

    const {queryByText, getByText} = render(<ShoppingListPage />);
    const addButton = getByText(/Add Item/i);

    await user.press(addButton);

    await user.press(getByText(/Form:/i))

    expect(getByText(/Add Item/i)).toBeTruthy();
    expect(queryByText(/Form:/i)).toBeFalsy();
})