//2026-07-20 : update for add button moved
//2026-06-11 : Text changes

//2025-11-20 : Shifting test files into their own folder in the hierarchy

//2025-10-23 : Converted to use Shopping List Context

//2025-05-27 : Initial implementation of shopping list search function

import {render, userEvent} from '@testing-library/react-native';
import { useShoppingList } from '@/Contexts/ShoppingList/ShoppingListDataProvider';
import ShoppingListSearch from '@/components/ShoppingList/ShoppingListSearch/ShoppingListSearch';



const mockDataContext = {
    setShoppingListSearchOptions: jest.fn(),
  };

jest.mock('@/Contexts/ShoppingList/ShoppingListDataProvider', () => ({
  useShoppingList: jest.fn(),
}));

beforeEach(() => {
  jest.resetAllMocks();
  const mockUseData = useShoppingList as jest.Mock;
  mockUseData.mockReturnValue(mockDataContext);
});

describe("Shopping List Search Renders", () => {
    test("The Search box", () => {
        const {getByLabelText} = render(
            <ShoppingListSearch setIsFormVisible={jest.fn()} />
        );
        expect(getByLabelText(/shopping-list-search-input/i)).toBeTruthy();
    })
})
describe("The Search box", () => {
    test("The Search box starts empty", () => {
        const {getByLabelText} = render(
            <ShoppingListSearch setIsFormVisible={jest.fn()} />
        );
        expect(getByLabelText(/shopping-list-search-input/i)).toHaveDisplayValue('');
    })
    test("The Search box can be typed into", async () => {
        const user = userEvent.setup();
        const {getByLabelText} = render(
            <ShoppingListSearch setIsFormVisible={jest.fn()} />
        );
        const searchInput = getByLabelText(/shopping-list-search-input/i);
        await user.type(searchInput, "Test");
        expect(searchInput).toHaveDisplayValue('Test');
    })
    test("The Search box changes the search options when submitted", async () => {
        const user = userEvent.setup();
        const {getByLabelText} = render(
            <ShoppingListSearch setIsFormVisible={jest.fn()} />
        );
        const searchInput = getByLabelText(/shopping-list-search-input/i);
        await user.type(searchInput, "Test");
        expect(mockDataContext.setShoppingListSearchOptions).toHaveBeenLastCalledWith({
            searchText: "Test",
        });
    })
})
describe("The add item button", () => {
    test("The add item button is present", () => {
        const {getByLabelText} = render(
            <ShoppingListSearch setIsFormVisible={jest.fn()} />
        );
        expect(getByLabelText(/add-shopping-list-item-button/i)).toBeTruthy();
    })
    test("The add item button calls setIsFormVisible when pressed", async () => {
        const user = userEvent.setup();
        const mockSetIsFormVisible = jest.fn();
        const {getByLabelText} = render(
            <ShoppingListSearch setIsFormVisible={mockSetIsFormVisible} />
        );
        const addButton = getByLabelText(/add-shopping-list-item-button/i);
        await user.press(addButton);
        expect(mockSetIsFormVisible).toHaveBeenCalledTimes(1);
        expect(mockSetIsFormVisible).toHaveBeenCalledWith(true);
    })
});