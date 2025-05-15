import {render, userEvent, screen} from '@testing-library/react-native';
import {useData} from '@/Contexts/DataProvider';
import { TextInput } from 'react-native';
import Recipe, {RecipesSearchOptions} from '@/Types/Recipe';
import RecipesSearch from './RecipesSearch';



const mockDataContext = {
    setRecipesSearchOptions: jest.fn(),
  };

jest.mock('@/Contexts/DataProvider', () => ({
  useData: jest.fn(),
}));

beforeEach(() => {
  jest.resetAllMocks();
  const mockUseData = useData as jest.Mock;
  mockUseData.mockReturnValue(mockDataContext);
});

describe("Recipe Search Renders", () => {
    test("The Search label", () => {
        const {getByText} = render(<RecipesSearch />);
        expect(getByText(/search/i)).toBeTruthy();
    })
    test("The Search box", () => {
        const {getByLabelText} = render(<RecipesSearch />);
        expect(getByLabelText(/search-input/i)).toBeTruthy();
    })
})
describe("The Search box", () => {
    test("The Search box starts empty", () => {
        const {getByLabelText} = render(<RecipesSearch />);
        expect(getByLabelText(/search-input/i)).toHaveDisplayValue("");
    })
    test("The Search box can be typed into", async () => {
        const user = userEvent.setup();

        const {getByLabelText} = render(<RecipesSearch />);
        const searchInput = getByLabelText(/search-input/i);
        await user.type(searchInput, "Test Recipe 1");
        expect(searchInput).toHaveDisplayValue("Test Recipe 1");
    })
    test("The Search box changes the search options when submitted", async () => {
        const user = userEvent.setup();

        const {getByLabelText} = render(<RecipesSearch />);

        const searchInput = getByLabelText(/search-input/i);

        await user.type(searchInput, "Test Recipe 1", {submitEditing: true})
        expect(searchInput).toHaveDisplayValue("Test Recipe 1");

        expect(mockDataContext.setRecipesSearchOptions).toHaveBeenCalledWith({
            searchText: "Test Recipe 1",
        });
    })
})