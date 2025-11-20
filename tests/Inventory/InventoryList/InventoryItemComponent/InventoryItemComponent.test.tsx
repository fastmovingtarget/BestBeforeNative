//2025-11-20 : Shifting test files into their own folder in the hierarchy

//2025-11-19 : Renamed "Ingredient(s)" to "Inventory(_Items)"

//2025-10-24 : Fixing import and mock to use correct context provider

import {render, userEvent} from '@testing-library/react-native';
import InventoryItemComponent from '../../../../components/Inventory/InventoryList/InventoryItemComponent/InventoryItemComponent';
import {useInventory} from '@/Contexts/Inventory/InventoryDataProvider';

const mockdataContext = {
  deleteInventoryItem: jest.fn(),
};

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
  useInventoryMock.mockReturnValue(mockdataContext);
});

describe('Ingredient renders correctly', () => {
  it('when given all basic ingredient data', () => {
    const {getByText} = render(
      <InventoryItemComponent
        inventoryItem={{
          Inventory_Item_ID: 1,
          Inventory_Item_Name: 'Test Ingredient',
          Inventory_Item_Quantity: 1,
          Inventory_Item_Date: new Date('2023-10-01'),
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
      <InventoryItemComponent
        inventoryItem={{
          Inventory_Item_ID: 1,
          Inventory_Item_Name: 'Test Ingredient',
          Inventory_Item_Quantity: 1,
          Inventory_Item_Date: new Date('2023-10-01'),
          Plan_ID: 1,
          Plan_Date: new Date('2023-10-01'),
          Plan_Recipe_Name: 'Test Recipe',
          Plan_Ingredient_ID: 1,
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
      <InventoryItemComponent
        inventoryItem={{
          Inventory_Item_ID: 1,
          Inventory_Item_Name: 'Test Ingredient',
          Inventory_Item_Quantity: 1,
          Inventory_Item_Date: new Date('2023-10-01'),
          Inventory_Item_Frozen: new Date('2024-10-01'),
          Plan_ID: 1,
          Plan_Date: new Date('2023-10-01'),
          Plan_Recipe_Name: 'Test Recipe',
          Plan_Ingredient_ID: 1,
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
      <InventoryItemComponent
        inventoryItem={{
          Inventory_Item_Name: 'Test Ingredient',
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
      <InventoryItemComponent
        inventoryItem={{
          Inventory_Item_ID: 123,
          Inventory_Item_Name: 'Test Ingredient',
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
      <InventoryItemComponent
        inventoryItem={{
          Inventory_Item_ID: 123,
          Inventory_Item_Name: 'Test Ingredient',
        }}
        onEdit={onEditMock}
      />,
    );

    const deleteButton = getByText(/Delete/i);
    expect(deleteButton).toBeTruthy();

    await user.press(deleteButton);

    expect(mockdataContext.deleteInventoryItem).toHaveBeenCalledTimes(1);
    expect(mockdataContext.deleteInventoryItem).toHaveBeenCalledWith(123)
  })
  it("when delete button is pressed but no Inventory_Item_ID exists (impossible in normal program flow)", async () => {
    const user = userEvent.setup();

    const {getByText} = render(
      <InventoryItemComponent
        inventoryItem={{
          Inventory_Item_Name: 'Test Ingredient',
        }}
        onEdit={onEditMock}
      />,
    );

    const deleteButton = getByText(/Delete/i);
    expect(deleteButton).toBeTruthy();

    await user.press(deleteButton);

    expect(mockdataContext.deleteInventoryItem).toHaveBeenCalledTimes(1);
    expect(mockdataContext.deleteInventoryItem).toHaveBeenCalledWith(-1)
  })
})