//2025-10-24 : Fixing import and mock to use correct context provider

//2025-10-20 : Using Recipes context rather than Data context

import {render, userEvent} from '@testing-library/react-native';
import {useRecipes} from '@/Contexts/Recipes/RecipesDataProvider';
import RecipesSearch from './RecipesSearch';



const mockDataContext = {
    setRecipesSearchOptions: jest.fn(),
  };

jest.mock('@/Contexts/Recipes/RecipesDataProvider', () => ({
  useRecipes: jest.fn(),
}));

beforeEach(() => {
  jest.resetAllMocks();
  const mockUseRecipes = useRecipes as jest.Mock;
  mockUseRecipes.mockReturnValue(mockDataContext);
});

describe("Recipe Search Renders", () => {
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