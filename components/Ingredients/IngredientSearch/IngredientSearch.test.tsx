import {render, userEvent, screen} from '@testing-library/react-native';
import {useData} from '@/Contexts/DataProvider';
import { TextInput } from 'react-native';
import Ingredient, {IngredientSearchOptions} from '@/Types/Ingredient';
import IngredientSearch from './IngredientSearch';

const mockIngredients : Ingredient[] = [
    {
        Ingredient_ID: 1,
        Ingredient_Name: 'Test Ingredient 1',
        Ingredient_Quantity: 1,
        Ingredient_Date: new Date('2023-10-01')
    },
    {
        Ingredient_ID: 2,
        Ingredient_Name: 'Test Ingredient 2',
        Ingredient_Quantity: 2,
        Ingredient_Date: new Date('2023-10-02')
    },
    {
        Ingredient_ID: 3,
        Ingredient_Name: 'Test Ingredient 3',
        Ingredient_Quantity: 3,
        Ingredient_Date: new Date('2023-10-03')
    }
]

const mockDataContext = {
    ingredients: mockIngredients,
    deleteIngredient: jest.fn(),
    addIngredient : jest.fn(),
    updateIngredient: jest.fn(),
    getIngredients: jest.fn(),
    setIngredientsSearchOptions: jest.fn(),
  };

jest.mock('@/Contexts/DataProvider', () => ({
  useData: jest.fn(),
}));

beforeEach(() => {
  jest.resetAllMocks();
  const mockUseData = useData as jest.Mock;
  mockUseData.mockReturnValue(mockDataContext);
});

describe("Ingredient Search Renders", () => {
    test("The Search label", () => {
        const {getByText} = render(<IngredientSearch />);
        expect(getByText(/search/i)).toBeTruthy();
    })
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