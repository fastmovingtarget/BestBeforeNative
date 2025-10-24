//2025-10-24 : Fixing import and mock to use correct context provider

import {render, userEvent} from '@testing-library/react-native';
import {useIngredients} from '@/Contexts/Ingredients/IngredientsDataProvider';
import IngredientSearch from './IngredientSearch';



const mockDataContext = {
    setIngredientsSearchOptions: jest.fn(),
  };

jest.mock('@/Contexts/Ingredients/IngredientsDataProvider', () => ({
  useIngredients: jest.fn(),
}));

beforeEach(() => {
  jest.resetAllMocks();
  const mockUseIngredients = useIngredients as jest.Mock;
  mockUseIngredients.mockReturnValue(mockDataContext);
});

describe("Ingredient Search Renders", () => {
    test("The Search box", () => {
        const {getByLabelText} = render(<IngredientSearch />);
        expect(getByLabelText(/search-input/i)).toBeTruthy();
    })
})
describe("The Search box", () => {
    test("The Search box starts empty", () => {
        const {getByLabelText} = render(<IngredientSearch />);
        expect(getByLabelText(/search-input/i)).toHaveDisplayValue("");
    })
    test("The Search box can be typed into", async () => {
        const user = userEvent.setup();

        const {getByLabelText} = render(<IngredientSearch />);
        const searchInput = getByLabelText(/search-input/i);
        await user.type(searchInput, "Test Ingredient 1");
        expect(searchInput).toHaveDisplayValue("Test Ingredient 1");
    })
    test("The Search box changes the search options when submitted", async () => {
        const user = userEvent.setup();

        const {getByLabelText} = render(<IngredientSearch />);

        const searchInput = getByLabelText(/search-input/i);

        await user.type(searchInput, "Test Ingredient 1", {submitEditing: true})
        expect(searchInput).toHaveDisplayValue("Test Ingredient 1");

        expect(mockDataContext.setIngredientsSearchOptions).toHaveBeenCalledWith({
            searchText: "Test Ingredient 1",
        });
    })
})