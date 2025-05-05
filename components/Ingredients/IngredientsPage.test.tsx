import { View, Text, TextInput } from "react-native";
import {userEvent} from '@testing-library/react-native';
import React, { useState } from "react";
import { render } from "@testing-library/react-native";
import Ingredient from "@/Types/Ingredient";

import IngredientsPage from "./IngredientsPage";
import IngredientSearch from "./IngredientSearch/IngredientSearch";
import IngredientsList from "./IngredientsList/IngredientsList";
import IngredientForm from "./IngredientForm/IngredientForm";

jest.mock("./IngredientSearch/IngredientSearch", () => {
    return {
        __esModule: true,
        default: jest.fn(),
    };
});
jest.mock("./IngredientForm/IngredientForm", () => {
    return {
        __esModule: true,
        default: jest.fn(),
    };
});
jest.mock("./IngredientsList/IngredientsList", () => {
    return {
        __esModule: true,
        default: jest.fn(),
    };
});

beforeEach(() => {
    jest.resetAllMocks();
});

describe("Ingredients Page renders", () => {
    test("The Search component", () => {
        const mockIngredientSearch = IngredientSearch as jest.Mock;
        mockIngredientSearch.mockReturnValue(<Text>Search:</Text>);
        const {getByText} = render(<IngredientsPage />);
        expect(getByText(/Search:/i)).toBeTruthy();
    })
    test("The Form component", () => {
        const mockIngredientForm = IngredientForm as jest.Mock;
        mockIngredientForm.mockReturnValue(<Text>Form:</Text>);
        const {getByText} = render(<IngredientsPage />);
        expect(getByText(/Form:/i)).toBeTruthy();
    })
    test("The Add Ingredient component", () => {
        const {getByText} = render(<IngredientsPage />);
        expect(getByText(/Add Ingredient/i)).toBeTruthy();
    })
    test("The List component", () => {
        const mockIngredientsList = IngredientsList as jest.Mock;
        mockIngredientsList.mockReturnValue(<Text>List:</Text>);
        const {getByText} = render(<IngredientsPage />);
        expect(getByText(/List:/i)).toBeTruthy();
    })
})
test("When The Add Ingredient button is pressed, change the visibility of Add Ingredient button", async () => {
    const user = userEvent.setup();
    
    const mockIngredientForm = IngredientForm as jest.Mock;
    mockIngredientForm.mockImplementation(({style}) => <Text style={style}>Form:</Text>);

    const {getByText, getByRole} = render(<IngredientsPage />);
    
    const addIngredientButton = getByRole("button", {name: /Add Ingredient/i});
    expect(addIngredientButton).toHaveProperty("props.style", {backgroundColor: "blue", padding: 10, borderRadius: 5});

    await user.press(addIngredientButton);

    expect(addIngredientButton).toHaveProperty("props.style", {display: "none"});
})

test("When The Add Ingredient button is pressed", async () => {
    const user = userEvent.setup();
    
    const mockIngredientForm = IngredientForm as jest.Mock;
    mockIngredientForm.mockImplementation(({style}) => <Text style={style}>Form:</Text>);

    const {getByText, getByRole} = render(<IngredientsPage />);
    
    const addIngredientButton = getByRole("button", {name: /Add Ingredient/i});
    expect(mockIngredientForm).toHaveBeenCalledWith({isFormVisible: false, onCancel: expect.any(Function)}, {});
    expect(mockIngredientForm).not.toHaveBeenCalledWith({isFormVisible: true, onCancel: expect.any(Function)}, {});

    await user.press(addIngredientButton);
    
    expect(mockIngredientForm).toHaveBeenCalledWith({isFormVisible: true, onCancel: expect.any(Function)}, {});
})