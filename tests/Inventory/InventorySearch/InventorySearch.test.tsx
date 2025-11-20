//2025-11-20 : Shifting test files into their own folder in the hierarchy

//2025-11-19 : Renamed "Ingredient(s)" to "Inventory(_Items)"

//2025-10-24 : Fixing import and mock to use correct context provider

import {render, userEvent} from '@testing-library/react-native';
import {useInventory} from '@/Contexts/Inventory/InventoryDataProvider';
import IngredientSearch from '../../../components/Inventory/InventorySearch/InventorySearch';



const mockDataContext = {
    setInventorySearchOptions: jest.fn(),
  };

jest.mock('@/Contexts/Inventory/InventoryDataProvider', () => ({
  useInventory: jest.fn(),
}));

beforeEach(() => {
  jest.resetAllMocks();
  const mockUseInventory = useInventory as jest.Mock;
  mockUseInventory.mockReturnValue(mockDataContext);
});

describe("Inventory Search Renders", () => {
    test("The Search box", () => {
        const {getByLabelText} = render(<IngredientSearch />);
        expect(getByLabelText(/search-input/i)).toBeTruthy();
    })
})
describe("The Search box", () => {
    test("starts empty", () => {
        const {getByLabelText} = render(<IngredientSearch />);
        expect(getByLabelText(/search-input/i)).toHaveDisplayValue("");
    })
    test("can be typed into", async () => {
        const user = userEvent.setup();

        const {getByLabelText} = render(<IngredientSearch />);
        const searchInput = getByLabelText(/search-input/i);
        await user.type(searchInput, "Test Ingredient 1");
        expect(searchInput).toHaveDisplayValue("Test Ingredient 1");
    })
    test("changes the search options when submitted", async () => {
        const user = userEvent.setup();

        const {getByLabelText} = render(<IngredientSearch />);

        const searchInput = getByLabelText(/search-input/i);

        await user.type(searchInput, "Test Ingredient 1", {submitEditing: true})
        expect(searchInput).toHaveDisplayValue("Test Ingredient 1");

        expect(mockDataContext.setInventorySearchOptions).toHaveBeenCalledWith({
            searchText: "Test Ingredient 1",
        });
    })
})