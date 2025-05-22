//2025-05-22 : Initial implementation and basic tests

import {render, userEvent} from '@testing-library/react-native';
import { Text, Pressable } from 'react-native';
import ShoppingList from './ShoppingList';
import Shopping_List_Item from '@/Types/Shopping_List_Item';
import ShoppingListItem from './ShoppingListItem/ShoppingListItem';
import ShoppingListForm from '../ShoppingListForm/ShoppingListForm';
import {useData} from '@/Contexts/DataProvider';

// No need to test things we've already tested in the IngredientComponent test, just a basic array of ingredients to test the list rendering
const mockShoppingList : Shopping_List_Item[] = [
    {
        Item_ID: 1,
        Item_Name: "Test Item 1",
        Item_Quantity: 1,
    },
    {
        Item_ID: 2,
        Item_Name: "Test Item 2",
        Item_Quantity: 2,
    },
    {
        Item_ID: 3,
        Item_Name: "Test Item 3",
        Item_Quantity: 3,
    }
]

const mockdataContext = {
  shoppingList : mockShoppingList
};

// Not exactly a unit test if it's using IngredientComponent, so I'm adding in a basic mock of it here
const mockShoppingListItem = ({item, onEdit} : {item : Shopping_List_Item, onEdit : (id : number | undefined) => {}}) =>
  <>
    <Text>{item.Item_Name}</Text>
    <Text>{item.Item_Quantity ? item.Item_Quantity + "g" : "??g"}</Text>
    <Pressable onPress={() => onEdit(item.Item_ID)}>
      <Text>Edit</Text>
    </Pressable>
  </>

const mockShoppingListForm = ({item, onCancel} : {item : Shopping_List_Item, onCancel : () => {}}) => {
  return (
    <>  
      <Text>{`Form for : ${item.Item_Name}`}</Text>    
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

jest.mock("@/Contexts/DataProvider", () => {
  return {
    __esModule: true,
    useData: jest.fn(),
  };
});

beforeEach(() => {
  jest.resetAllMocks();
  const useDataMock = useData as jest.Mock;
  useDataMock.mockReturnValue(mockdataContext);

  (ShoppingListItem as jest.Mock).mockImplementation(mockShoppingListItem);

  (ShoppingListForm as jest.Mock).mockImplementation(mockShoppingListForm);
});

describe('IngredientsList renders correctly', () => {
    test('when given all basic ingredient data', () => {
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

test('IngredientComponent is replaced by FormComponent when Edit is clicked', async () => {
  const user = userEvent.setup();

  const {getAllByText, getByText} = render(
    <ShoppingList onEdit={() => {}} />
  );

  const editButton = getAllByText(/Edit/i)[1]; // Get the second edit button (for Test Ingredient 2)

  await user.press(editButton); // Simulate the press event

  expect(getByText(/Form For : Test Ingredient 2/i)).toBeTruthy(); // Check if the ingredient name is still there
})

test('onEdit is called when edit button is clicked', async () => {
  const user = userEvent.setup();
  const mockOnEdit = jest.fn(); // Mock function to track calls

  const {getAllByText, getByText} = render(
    <ShoppingList onEdit={mockOnEdit} />
  );

  const editButton = getAllByText(/Edit/i)[1]; // Get the second edit button (for Test Ingredient 2)

  await user.press(editButton); // Simulate the press event

  expect(mockOnEdit).toHaveBeenCalled(); // Check if the onEdit function was called
})

test('IngredientComponent is replaced by FormComponent when Edit is clicked and then goes back to IngredientComponent when cancelled', async () => {
  const user = userEvent.setup();

  const {getAllByText, getByText} = render(
    <ShoppingList onEdit={() => {}} />
  );

  const editButton = getAllByText(/Edit/i)[1]; // Get the second edit button (for Test Ingredient 2)

  await user.press(editButton); // Simulate the press event

  const cancelButton = getByText(/Cancel/i); // Get the cancel button
  await user.press(cancelButton); // Simulate the press event

  expect(getByText(/Eat By 02\/10\/2023/i)).toBeTruthy(); // Check if the ingredient name is still there
})

