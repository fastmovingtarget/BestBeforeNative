//2025-11-20 : Shifting test files into their own folder in the hierarchy

//2025-11-19 : Renamed "Ingredient(s)" to "Inventory(_Items)"

//2025-10-24 : Fixing import and mock to use correct context provider

import {render, userEvent} from '@testing-library/react-native';
import { Text, Pressable } from 'react-native';
import InventoryList from '../../../components/Inventory/InventoryList/InventoryList';
import Inventory_Item from '@/Types/Inventory_Item';
import InventoryItemComponent from '../../../components/Inventory/InventoryList/InventoryItemComponent/InventoryItemComponent';
import InventoryItemForm from '../../../components/Inventory/InventoryItemForm/InventoryItemForm';
import {useInventory} from '@/Contexts/Inventory/InventoryDataProvider';

// No need to test things we've already tested in the IngredientComponent test, just a basic array of ingredients to test the list rendering
const mockInventory : Inventory_Item[] = [
    {
        Inventory_Item_ID: 1,
        Inventory_Item_Name: 'Test Inventory Item 1',
        Inventory_Item_Quantity: 1,
        Inventory_Item_Date: new Date('2023-10-01')
    },
    {
        Inventory_Item_ID: 2,
        Inventory_Item_Name: 'Test Inventory Item 2',
        Inventory_Item_Quantity: 2,
        Inventory_Item_Date: new Date('2023-10-02')
    },
    {
        Inventory_Item_ID: 3,
        Inventory_Item_Name: 'Test Inventory Item 3',
        Inventory_Item_Quantity: 3,
        Inventory_Item_Date: new Date('2023-10-03')
    }
]

const mockdataContext = {
  inventory : mockInventory
};

// Not exactly a unit test if it's using IngredientComponent, so I'm adding in a basic mock of it here
const mockIngredientComponent = ({inventoryItem, onEdit} : {inventoryItem : Inventory_Item, onEdit : (id : number | undefined) => void}) =>
  <>
    <Text>{inventoryItem.Inventory_Item_Name}</Text>
    <Text>{inventoryItem.Inventory_Item_Quantity ? inventoryItem.Inventory_Item_Quantity + "g" : "??g"}</Text>
    <Text>{`Eat By ${inventoryItem.Inventory_Item_Date?.toLocaleDateString("en-UK", { year: "numeric", month: "2-digit", day: "2-digit" }) || "??/??/????"}`}</Text>
    <Pressable onPress={() => onEdit(inventoryItem.Inventory_Item_ID)}>
      <Text>Edit</Text>
    </Pressable>
  </>

const mockIngredientForm = ({inventoryItem, onCancel} : {inventoryItem : Inventory_Item, onCancel : () => void}) => {
  return (
    <>  
      <Text>{`Form for : ${inventoryItem.Inventory_Item_Name}`}</Text>    
      <Pressable onPress={() => onCancel()}>
        <Text>Cancel</Text>
      </Pressable>
    </>
  )
}

jest.mock("@/components/Inventory/InventoryList/InventoryItemComponent/InventoryItemComponent", () => {
  return {
    __esModule: true,
    default: jest.fn()
  }
});

jest.mock("@/components/Inventory/InventoryItemForm/InventoryItemForm", () => {
  return {
    __esModule: true,
    default: jest.fn()
  }
});

jest.mock("@/Contexts/Inventory/InventoryDataProvider", () => {
  return {
    __esModule: true,
    useInventory: jest.fn(),  
  };
});

beforeEach(() => {
  jest.resetAllMocks();
  const useInventoryMock = useInventory as jest.Mock;
  useInventoryMock.mockReturnValue(mockdataContext);

  const InventoryItemComponentMock = InventoryItemComponent as jest.Mock;
  InventoryItemComponentMock.mockImplementation(mockIngredientComponent);

  const InventoryItemFormMock = InventoryItemForm as jest.Mock;
  InventoryItemFormMock.mockImplementation(mockIngredientForm);
});

describe('InventoryList renders correctly', () => {
    test('when given all basic ingredient data', () => {
        const {getByText} = render(
            <InventoryList onEdit={() => {}} />
        );

        expect(getByText(/Test Inventory Item 1/i)).toBeTruthy();
        expect(getByText(/1g/i)).toBeTruthy();
        expect(getByText(/Eat By 01\/10\/2023/i)).toBeTruthy();
        expect(getByText(/Test Inventory Item 2/i)).toBeTruthy();
        expect(getByText(/2g/i)).toBeTruthy();
        expect(getByText(/Eat By 02\/10\/2023/i)).toBeTruthy();
        expect(getByText(/Test Inventory Item 3/i)).toBeTruthy();
        expect(getByText(/3g/i)).toBeTruthy();
        expect(getByText(/Eat By 03\/10\/2023/i)).toBeTruthy();
    })
})

test('InventoryItemComponent is replaced by InventoryItemForm when Edit is clicked', async () => {
  const user = userEvent.setup();

  const {getAllByText, getByText} = render(
    <InventoryList onEdit={() => {}} />
  );

  const editButton = getAllByText(/Edit/i)[1]; // Get the second edit button (for Test Inventory Item 2)

  await user.press(editButton); // Simulate the press event

  expect(getByText(/Form For : Test Inventory Item 2/i)).toBeTruthy(); // Check if the ingredient name is still there
})

test('onEdit is called when edit button is clicked', async () => {
  const user = userEvent.setup();
  const mockOnEdit = jest.fn(); // Mock function to track calls

  const {getAllByText} = render(
    <InventoryList onEdit={mockOnEdit} />
  );

  const editButton = getAllByText(/Edit/i)[1]; // Get the second edit button (for Test Inventory Item 2)

  await user.press(editButton); // Simulate the press event

  expect(mockOnEdit).toHaveBeenCalled(); // Check if the onEdit function was called
})

test('InventoryItemComponent is replaced by InventoryItemForm when Edit is clicked and then goes back to InventoryItemComponent when cancelled', async () => {
  const user = userEvent.setup();

  const {getAllByText, getByText} = render(
    <InventoryList onEdit={() => {}} />
  );

  const editButton = getAllByText(/Edit/i)[1]; // Get the second edit button (for Test Inventory Item 2)

  await user.press(editButton); // Simulate the press event

  const cancelButton = getByText(/Cancel/i); // Get the cancel button
  await user.press(cancelButton); // Simulate the press event

  expect(getByText(/Eat By 02\/10\/2023/i)).toBeTruthy(); // Check if the ingredient name is still there
})

