//2025-11-20 : Shifting test files into their own folder in the hierarchy

//2025-11-19 : Item_... fields now have Shopping_ as a prefix

//2025-10-23 : Converted to use Shopping List and Ingredients contexts

//2025-05-27 : Adding purchase button to the list item

//2025-05-21 : Basic Implementation of list item


import {render, userEvent} from '@testing-library/react-native';
import ShoppingListItem from '@/components/ShoppingList/ShoppingList/ShoppingListItem/ShoppingListItem';
import type Shopping_List_Item from '@/Types/Shopping_List_Item';
import {useShoppingList} from '@/Contexts/ShoppingList/ShoppingListDataProvider';
import { useInventory } from '@/Contexts/Inventory/InventoryDataProvider';

const mockShoppingContext = {
  deleteShoppingItem: jest.fn(),
};
const mockInventoryContext = {
  addInventoryItem: jest.fn(),
};

jest.mock("@/Contexts/ShoppingList/ShoppingListDataProvider", () => {
  return {
    __esModule: true,
    useShoppingList: jest.fn(),
  };
});
jest.mock("@/Contexts/Inventory/InventoryDataProvider", () => {
  return {
    __esModule: true,
    useInventory: jest.fn(),
  };
});

const onEditMock = jest.fn();

beforeEach(() => {
  jest.resetAllMocks();
  const useInventoryMock = useInventory as jest.Mock;
  useInventoryMock.mockReturnValue(mockInventoryContext);
  const useShoppingListMock = useShoppingList as jest.Mock;
  useShoppingListMock.mockReturnValue(mockShoppingContext);
});

describe('Shopping List Item renders correctly', () => {
  it('when given all basic item data', () => {
    const testItemData : Shopping_List_Item = {
          Shopping_Item_ID: 1,
          Shopping_Item_Name: 'Test Item',
          Shopping_Item_Quantity: 1
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
          Shopping_Item_ID: 1,
          Shopping_Item_Name: 'Test Item',
          Shopping_Item_Quantity: 1,
          Plan_Date: new Date('2023-10-01'),
          Plan_ID: 1,
          Plan_Recipe_Name: 'Test Recipe',
          Plan_Ingredient_ID: 1,
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
          Shopping_Item_ID: 1,
          Shopping_Item_Name: 'Test Item',
          Shopping_Item_Quantity: 1
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
          Shopping_Item_ID: 1,
          Shopping_Item_Name: 'Test Item',
          Shopping_Item_Quantity: 1
    };

    const {getByText} = render(
      <ShoppingListItem
        item={testItemData}
        onEdit={onEditMock}
      />,
    );

    const deleteButton = getByText(/Delete/i);

    await user.press(deleteButton);

    expect(mockShoppingContext.deleteShoppingItem).toHaveBeenCalledTimes(1);
    expect(mockShoppingContext.deleteShoppingItem).toHaveBeenCalledWith(1);
  })
  it("when purchase button is pressed (no plan)", async () => {

    const user = userEvent.setup();
    const testItemData : Shopping_List_Item = {
          Shopping_Item_ID: 1,
          Shopping_Item_Name: 'Test Item',
          Shopping_Item_Quantity: 1
    };

    const {getByText} = render(
      <ShoppingListItem
        item={testItemData}
        onEdit={onEditMock}
      />,
    );

    const purchaseButton = getByText(/Purchase/i);

    await user.press(purchaseButton);

    expect(mockInventoryContext.addInventoryItem).toHaveBeenCalledTimes(1);
    expect(mockInventoryContext.addInventoryItem).toHaveBeenCalledWith({
      Inventory_Item_Name: "Test Item",
      Inventory_Item_Quantity: 1,
    });

    expect(mockShoppingContext.deleteShoppingItem).toHaveBeenCalledTimes(1);
    expect(mockShoppingContext.deleteShoppingItem).toHaveBeenCalledWith(1);

  })
  it("when purchase button is pressed (with plan)", async () => {

    const user = userEvent.setup();
    const testItemData : Shopping_List_Item = {
          Shopping_Item_ID: 1,
          Shopping_Item_Name: 'Test Item',
          Shopping_Item_Quantity: 1,
          Plan_ID: 2,
          Plan_Ingredient_ID: 3,
    };

    const {getByText} = render(
      <ShoppingListItem
        item={testItemData}
        onEdit={onEditMock}
      />,
    );

    const purchaseButton = getByText(/Purchase/i);

    await user.press(purchaseButton);

    expect(mockInventoryContext.addInventoryItem).toHaveBeenCalledTimes(1);
    expect(mockInventoryContext.addInventoryItem).toHaveBeenCalledWith({
      Inventory_Item_Name: "Test Item",
      Inventory_Item_Quantity: 1,
      Plan_ID: 2,
      Plan_Ingredient_ID: 3,
    });

    expect(mockShoppingContext.deleteShoppingItem).toHaveBeenCalledTimes(1);
    expect(mockShoppingContext.deleteShoppingItem).toHaveBeenCalledWith(1);

  })
})