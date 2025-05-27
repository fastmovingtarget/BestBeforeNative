//2025-05-27 : Initial implementation of shopping list search function

import {render, userEvent, screen} from '@testing-library/react-native';
import {useData} from '@/Contexts/DataProvider';
import { TextInput } from 'react-native';
import Shopping_List_Item, {ShoppingListSearchOptions} from '@/Types/Shopping_List_Item';
import ShoppingListSearch from './ShoppingListSearch';



const mockDataContext = {
    setShoppingListSearchOptions: jest.fn(),
  };

jest.mock('@/Contexts/DataProvider', () => ({
  useData: jest.fn(),
}));

beforeEach(() => {
  jest.resetAllMocks();
  const mockUseData = useData as jest.Mock;
  mockUseData.mockReturnValue(mockDataContext);
});

describe("Shopping List Search Renders", () => {
    test("The Search box", () => {
        const {getByLabelText} = render(
            <ShoppingListSearch />
        );
        expect(getByLabelText(/shopping-list-search-input/i)).toBeTruthy();
    })
})
describe("The Search box", () => {
    test("The Search box starts empty", () => {
        const {getByLabelText} = render(
            <ShoppingListSearch />
        );
        expect(getByLabelText(/shopping-list-search-input/i)).toHaveDisplayValue('');
    })
    test("The Search box can be typed into", async () => {
        const user = userEvent.setup();
        const {getByLabelText} = render(
            <ShoppingListSearch />
        );
        const searchInput = getByLabelText(/shopping-list-search-input/i);
        await user.type(searchInput, "Test");
        expect(searchInput).toHaveDisplayValue('Test');
    })
    test("The Search box changes the search options when submitted", async () => {
        const user = userEvent.setup();
        const {getByLabelText} = render(
            <ShoppingListSearch />
        );
        const searchInput = getByLabelText(/shopping-list-search-input/i);
        await user.type(searchInput, "Test");
        expect(mockDataContext.setShoppingListSearchOptions).toHaveBeenLastCalledWith({
            searchString: "Test",
        });
    })
})