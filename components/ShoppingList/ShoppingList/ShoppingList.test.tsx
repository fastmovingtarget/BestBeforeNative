//2025-11-19 : Item_... fields now have Shopping_ as a prefix

//2025-10-23 : Converted to use Shopping List Context

//2025-05-27 : Text and comment edits for accuracy

//2025-05-22 : Initial implementation and basic tests

import {render, userEvent} from '@testing-library/react-native';
import { Text, Pressable } from 'react-native';
import ShoppingList from './ShoppingList';
import Shopping_List_Item from '@/Types/Shopping_List_Item';
import ShoppingListItem from './ShoppingListItem/ShoppingListItem';
import ShoppingListForm from '../ShoppingListForm/ShoppingListForm';
import { useShoppingList } from '@/Contexts/ShoppingList/ShoppingListDataProvider';

// No need to test things we've already tested in the ShoppingListItem test, just a basic array of items to test the list rendering
const mockShoppingList : Shopping_List_Item[] = [
    {
        Shopping_Item_ID: 1,
        Shopping_Item_Name: "Test Item 1",
        Shopping_Item_Quantity: 1,
    },
    {
        Shopping_Item_ID: 2,
        Shopping_Item_Name: "Test Item 2",
        Shopping_Item_Quantity: 2,
    },
    {
        Shopping_Item_ID: 3,
        Shopping_Item_Name: "Test Item 3",
        Shopping_Item_Quantity: 3,
    }
]

const mockdataContext = {
  shoppingList : mockShoppingList
};

// Not exactly a unit test if it's using ShoppingListItem, so I'm adding in a basic mock of it here
const mockShoppingListItem = ({item, onEdit} : {item : Shopping_List_Item, onEdit : (id : number | undefined) => void}) =>
  <>
    <Text>{item.Shopping_Item_Name}</Text>
    <Text>{item.Shopping_Item_Quantity ? item.Shopping_Item_Quantity + "g" : "??g"}</Text>
    <Pressable onPress={() => onEdit(item.Shopping_Item_ID)}>
      <Text>Edit</Text>
    </Pressable>
  </>

const mockShoppingListForm = ({item, onCancel} : {item : Shopping_List_Item, onCancel : () => void}) => {
  return (
    <>  
      <Text>{`Form for : ${item.Shopping_Item_Name}`}</Text>    
      <Pressable onPress={() => onCancel()}>
        <Text>Cancel</Text>
      </Pressable>
    </>
  )
}

jest.mock("./ShoppingListItem/ShoppingListItem", () => {
  return {
    __esModule: true,
    default: jest.fn()
  }
});

jest.mock("../ShoppingListForm/ShoppingListForm", () => {
  return {
    __esModule: true,
    default: jest.fn()
  }
});

jest.mock("@/Contexts/ShoppingList/ShoppingListDataProvider", () => {
  return {
    __esModule: true,
    useShoppingList: jest.fn(),
  };
});

beforeEach(() => {
  jest.resetAllMocks();
  const useShoppingListMock = useShoppingList as jest.Mock;
  useShoppingListMock.mockReturnValue(mockdataContext);

  (ShoppingListItem as jest.Mock).mockImplementation(mockShoppingListItem);

  (ShoppingListForm as jest.Mock).mockImplementation(mockShoppingListForm);
});

describe('ShoppingList renders correctly', () => {
    test('when given all basic item data', () => {
        const {getByText} = render(
            <ShoppingList onEdit={() => {}} />
        );

        expect(getByText(/Test Item 1/i)).toBeTruthy();
        expect(getByText(/Test Item 2/i)).toBeTruthy(); 
        expect(getByText(/Test Item 3/i)).toBeTruthy();
        expect(getByText(/1g/i)).toBeTruthy();
        expect(getByText(/2g/i)).toBeTruthy();
        expect(getByText(/3g/i)).toBeTruthy();
    })
})

test('ShoppingListItem is replaced by FormComponent when Edit is clicked', async () => {
  const user = userEvent.setup();

  const {getAllByText, getByText} = render(
    <ShoppingList onEdit={() => {}} />
  );

  const editButton = getAllByText(/Edit/i)[1]; // Get the second edit button (for Test Ingredient 2)

  await user.press(editButton); // Simulate the press event

  expect(getByText(/Form For : Test Item 2/i)).toBeTruthy(); // Check if the ingredient name is still there
})

test('onEdit is called when edit button is clicked', async () => {
  const user = userEvent.setup();
  const mockOnEdit = jest.fn(); // Mock function to track calls

  const {getAllByText} = render(
    <ShoppingList onEdit={mockOnEdit} />
  );

  const editButton = getAllByText(/Edit/i)[1]; // Get the second edit button (for Test Ingredient 2)

  await user.press(editButton); // Simulate the press event

  expect(mockOnEdit).toHaveBeenCalled(); // Check if the onEdit function was called
})

test('ItemComponent is replaced by FormComponent when Edit is clicked and then goes back to ItemComponent when cancelled', async () => {
  const user = userEvent.setup();

  const {getAllByText, getByText} = render(
    <ShoppingList onEdit={() => {}} />
  );

  expect(getAllByText(/Edit/i)).toHaveLength(3);
  const editButton = getAllByText(/Edit/i)[1]; // Get the second edit button (for Test Item 2)

  await user.press(editButton); // Simulate the press event

  const cancelButton = getByText(/Cancel/i); // Get the cancel button
  await user.press(cancelButton); // Simulate the press event

  expect(getAllByText(/Edit/i)).toHaveLength(3);
})

