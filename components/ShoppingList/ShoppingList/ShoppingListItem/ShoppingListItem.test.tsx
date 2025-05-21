//2025-05-21 : Basic Implementation of list item

//2025-05-21 : Basic Implementation of list item

//2025-05-21 : Basic Implementation of list item

//2025-05-21 : Basic Implementation of list item

//2025-05-21 : Basic Implementation of list item

//2025-05-21 : Basic Implementation of list item

//2025-05-21 : Basic Implementation of list item

//2025-05-21 : Basic Implementation of list item

//2025-05-21 : Basic Implementation of list item

//2025-05-21 : Basic Implementation of list item

//2025-05-21 : Basic Implementation of list item

//2025-05-21 : Basic Implementation of list item

//2025-05-21 : Basic Implementation of list item

//2025-05-21 : Basic Implementation of list item

//2025-05-21 : Basic Implementation of list item

//2025-05-21 : Basic Implementation of list item

//2025-05-21 : Basic Implementation of list item

//2025-05-21 : Basic Implementation of list item

//2025-05-21 : Basic Implementation of list item

//2025-05-21 : Basic Implementation of list item

//2025-05-21 : Basic Implementation of list item

//2025-05-21 : Basic Implementation of list item

//2025-05-21 : Basic Implementation of list item

//2025-05-21 : Basic Implementation of list item

//2025-05-21 : Basic Implementation of list item

//2025-05-21 : Basic Implementation of list item

//2025-05-21 : Basic Implementation of list item

//2025-05-21 : Basic Implementation of list item

//2025-05-21 : Basic Implementation of list item

//2025-05-21 : Basic Implementation of list item

//2025-05-21 : 

//2025-05-21 : Basic Implementation of list item

//2025-05-21 : Basic Implementation of list item

//2025-05-21 : Basic Implementation of list item

//2025-05-21 : Basic Implementation of list item

//2025-05-21 : Basic Implementation of list item

//2025-05-21 : Basic Implementation of list item

//2025-05-21 : Basic Implementation of list item

//2025-05-21 : Basic Implementation of list item

//2025-05-21 : Basic Implementation of list item

//2025-05-21 : Basic Implementation of list item

//2025-05-21 : Basic Implementation of list item

//2025-05-21 : Basic Implementation of list item

//2025-05-21 : Basic Implementation of list item

//2025-05-21 : Basic Implementation of list item

//2025-05-21 : Basic Implementation of list item

//2025-05-21 : Basic Implementation of list item

//2025-05-21 : Basic Implementation of list item

//2025-05-21 : Basic Implementation of list item

//2025-05-21 : Basic Implementation of list item

//2025-05-21 : Basic Implementation of list item

//2025-05-21 : Basic Implementation of list item

//2025-05-21 : Basic Implementation of list item

//2025-05-21 : Basic Implementation of list item

//2025-05-21 : Basic Implementation of list item

//2025-05-21 : Basic Implementation of list item

//2025-05-21 : Basic Implementation of list item

//2025-05-21 : Basic Implementation of list item

//2025-05-21 : Basic Implementation of list item


import {render, userEvent} from '@testing-library/react-native';
import ShoppingListItem from './ShoppingListItem';
import type Shopping_List_Item from '@/Types/Shopping_List_Item';
import {useData} from '@/Contexts/DataProvider';

const mockdataContext = {
  deleteShoppingListItem: jest.fn(),
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

describe('Shopping List Item renders correctly', () => {
  it('when given all basic item data', () => {
    const testItemData : Shopping_List_Item = {
          Item_ID: 1,
          Item_Name: 'Test Item',
          Item_Quantity: 1
    };


    const {getByText, queryByText} = render(
      <ShoppingListItem
        item={testItemData}
        onEdit={onEditMock}
      />,
    );

    expect(getByText(/Test Item/i)).toBeTruthy();
    expect(getByText(/1g/i)).toBeTruthy();
    expect(queryByText(/Buy By/i)).toBeFalsy();

  });
  it('when given all basic item data and plan data', () => {
    const testItemData : Shopping_List_Item = {
          Item_ID: 1,
          Item_Name: 'Test Item',
          Item_Quantity: 1,
          Plan_Date: new Date('2023-10-01'),
          Item_Recipe_Plan: 1,
          Recipe_Name: 'Test Recipe',
          Item_Recipe_Plan_Ingredient: 1,
    };

    const {getByText} = render(
      <ShoppingListItem
        item={testItemData}
        onEdit={onEditMock}
      />,
    );

    expect(getByText(/Test Item/i)).toBeTruthy();
    expect(getByText(/1g/i)).toBeTruthy();
    expect(getByText(/01\/10\/2023/i)).toBeTruthy();
    expect(getByText(/Test Recipe/i)).toBeTruthy();
  });
});
describe('Shopping List Item calls correctly', () => {
  it("when edit button is pressed", async () => {
    const user = userEvent.setup();
    const testItemData : Shopping_List_Item = {
          Item_ID: 1,
          Item_Name: 'Test Item',
          Item_Quantity: 1
    };

    const {getByText} = render(
      <ShoppingListItem
        item={testItemData}
        onEdit={onEditMock}
      />,
    );

    const editButton = getByText(/Edit/i);

    await user.press(editButton);

    expect(onEditMock).toHaveBeenCalledTimes(1);
    expect(onEditMock).toHaveBeenCalledWith(1);
  })
  it("when delete button is pressed", async () => {

    const user = userEvent.setup();
    const testItemData : Shopping_List_Item = {
          Item_ID: 1,
          Item_Name: 'Test Item',
          Item_Quantity: 1
    };

    const {getByText} = render(
      <ShoppingListItem
        item={testItemData}
        onEdit={onEditMock}
      />,
    );

    const deleteButton = getByText(/Delete/i);

    await user.press(deleteButton);

    expect(mockdataContext.deleteShoppingListItem).toHaveBeenCalledTimes(1);
    expect(mockdataContext.deleteShoppingListItem).toHaveBeenCalledWith(1);
  })
})