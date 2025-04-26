import {render, userEvent} from '@testing-library/react-native';
import IngredientComponent from './IngredientComponent';
import {useData} from '@/Contexts/DataProvider';

const mockdataContext = {
  deleteIngredient: jest.fn(),
};

jest.mock("@/Contexts/DataProvider", () => {
  return {
    __esModule: true,
    useData: jest.fn(),
  };
});

const onEditMock = jest.fn();

beforeEach(() => {
  jest.resetAllMocks();
  const useDataMock = useData as jest.Mock;
  useDataMock.mockReturnValue(mockdataContext);
});

describe('Ingredient renders correctly', () => {
  it('when given all basic ingredient data', () => {
    const {getByText} = render(
      <IngredientComponent
        ingredient={{
          Ingredient_ID: 1,
          Ingredient_Name: 'Test Ingredient',
          Ingredient_Quantity: 1,
          Ingredient_Date: new Date('2023-10-01'),
        }}
        onEdit={onEditMock}
      />,
    );

    expect(getByText(/Test Ingredient/i)).toBeTruthy();
    expect(getByText(/1g/i)).toBeTruthy();
    expect(getByText(/Eat By 01\/10\/2023/i)).toBeTruthy();
  });
  it('when given all basic ingredient data and plan data', () => {
    const {getByText} = render(
      <IngredientComponent
        ingredient={{
          Ingredient_ID: 1,
          Ingredient_Name: 'Test Ingredient',
          Ingredient_Quantity: 1,
          Ingredient_Date: new Date('2023-10-01'),
          Plan_ID: 1,
          Plan_Date: new Date('2023-10-01'),
          Recipe_Name: 'Test Recipe',
          Recipe_Ingredient_ID: 1,
        }}
        onEdit={onEditMock}
      />,
    );

    expect(getByText(/Test Ingredient/i)).toBeTruthy();
    expect(getByText(/1g/i)).toBeTruthy();
    expect(getByText(/Eat By 01\/10\/2023/i)).toBeTruthy();
    expect(getByText(/Reserved for /i)).toBeTruthy();
    expect(getByText(/Test Recipe/i)).toBeTruthy();
    expect(getByText(/on 01\/10\/2023/i)).toBeTruthy();
  });
  it('when given all basic ingredient data, date frozen and plan data', () => {
    const {getByText, queryByText} = render(
      <IngredientComponent
        ingredient={{
          Ingredient_ID: 1,
          Ingredient_Name: 'Test Ingredient',
          Ingredient_Quantity: 1,
          Ingredient_Date: new Date('2023-10-01'),
          Ingredient_Frozen: new Date('2024-10-01'),
          Plan_ID: 1,
          Plan_Date: new Date('2023-10-01'),
          Recipe_Name: 'Test Recipe',
          Recipe_Ingredient_ID: 1,
        }}
        onEdit={onEditMock}
      />,
    );

    expect(getByText(/Test Ingredient/i)).toBeTruthy();
    expect(getByText(/1g/i)).toBeTruthy();
    expect(queryByText(/Eat By 01\/10\/2023/i)).not.toBeTruthy();
    expect(getByText(/Frozen on 01\/10\/2024/i)).toBeTruthy();
    expect(getByText(/Reserved for /i)).toBeTruthy();
    expect(getByText(/Test Recipe/i)).toBeTruthy();
    expect(getByText(/on 01\/10\/2023/i)).toBeTruthy();
  });
  it('when given only name data', () => {
    const {getByText} = render(
      <IngredientComponent
        ingredient={{
          Ingredient_Name: 'Test Ingredient',
        }}
        onEdit={onEditMock}
      />,
    );

    expect(getByText(/Test Ingredient/i)).toBeTruthy();
    expect(getByText(/\?\?g/i)).toBeTruthy();
    expect(getByText(/Eat By \?\?\/\?\?\/\?\?\?\?/i)).toBeTruthy();
  });
});
describe('Ingredient calls correctly', () => {
  it("when edit button is pressed", async () => {
    const user = userEvent.setup();

    const {getByText} = render(
      <IngredientComponent
        ingredient={{
          Ingredient_ID: 123,
          Ingredient_Name: 'Test Ingredient',
        }}
        onEdit={onEditMock}
      />,
    );

    const editButton = getByText(/Edit/i);
    expect(editButton).toBeTruthy();

    await user.press(editButton);
    
    expect(onEditMock).toHaveBeenCalledTimes(1);    
    expect(onEditMock).toHaveBeenCalledWith(123);
  })
  it("when delete button is pressed", async () => {
    const user = userEvent.setup();

    const {getByText} = render(
      <IngredientComponent
        ingredient={{
          Ingredient_ID: 123,
          Ingredient_Name: 'Test Ingredient',
        }}
        onEdit={onEditMock}
      />,
    );

    const deleteButton = getByText(/Delete/i);
    expect(deleteButton).toBeTruthy();

    await user.press(deleteButton);

    expect(mockdataContext.deleteIngredient).toHaveBeenCalledTimes(1);
    expect(mockdataContext.deleteIngredient).toHaveBeenCalledWith(123)
  })
  it("when delete button is pressed but no Ingredient_ID exists (impossible in normal program flow)", async () => {
    const user = userEvent.setup();

    const {getByText} = render(
      <IngredientComponent
        ingredient={{
          Ingredient_Name: 'Test Ingredient',
        }}
        onEdit={onEditMock}
      />,
    );

    const deleteButton = getByText(/Delete/i);
    expect(deleteButton).toBeTruthy();

    await user.press(deleteButton);

    expect(mockdataContext.deleteIngredient).toHaveBeenCalledTimes(1);
    expect(mockdataContext.deleteIngredient).toHaveBeenCalledWith(-1)
  })
})