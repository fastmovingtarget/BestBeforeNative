//2025-10-24 : Fixing import and mock to use correct context provider

import {render, userEvent} from '@testing-library/react-native';
import { Text, Pressable } from 'react-native';
import IngredientsList from './IngredientsList';
import Ingredient from '@/Types/Ingredient';
import IngredientComponent from './IngredientComponent/IngredientComponent';
import IngredientForm from '../IngredientForm/IngredientForm';
import {useIngredients} from '@/Contexts/Ingredients/IngredientsDataProvider';

// No need to test things we've already tested in the IngredientComponent test, just a basic array of ingredients to test the list rendering
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

const mockdataContext = {
  ingredients : mockIngredients
};

// Not exactly a unit test if it's using IngredientComponent, so I'm adding in a basic mock of it here
const mockIngredientComponent = ({ingredient, onEdit} : {ingredient : Ingredient, onEdit : (id : number | undefined) => void}) =>
  <>
    <Text>{ingredient.Ingredient_Name}</Text>
    <Text>{ingredient.Ingredient_Quantity ? ingredient.Ingredient_Quantity + "g" : "??g"}</Text>
    <Text>{`Eat By ${ingredient.Ingredient_Date?.toLocaleDateString("en-UK", { year: "numeric", month: "2-digit", day: "2-digit" }) || "??/??/????"}`}</Text>
    <Pressable onPress={() => onEdit(ingredient.Ingredient_ID)}>
      <Text>Edit</Text>
    </Pressable>
  </>

const mockIngredientForm = ({ingredient, onCancel} : {ingredient : Ingredient, onCancel : () => void}) => {
  return (
    <>  
      <Text>{`Form for : ${ingredient.Ingredient_Name}`}</Text>    
      <Pressable onPress={() => onCancel()}>
        <Text>Cancel</Text>
      </Pressable>
    </>
  )
}

jest.mock("./IngredientComponent/IngredientComponent", () => {
  return {
    __esModule: true,
    default: jest.fn()
  }
});

jest.mock("../IngredientForm/IngredientForm", () => {
  return {
    __esModule: true,
    default: jest.fn()
  }
});

jest.mock("@/Contexts/Ingredients/IngredientsDataProvider", () => {
  return {
    __esModule: true,
    useIngredients: jest.fn(),
  };
});

beforeEach(() => {
  jest.resetAllMocks();
  const useIngredientsMock = useIngredients as jest.Mock;
  useIngredientsMock.mockReturnValue(mockdataContext);

  const IngredientComponentMock = IngredientComponent as jest.Mock;
  IngredientComponentMock.mockImplementation(mockIngredientComponent);

  const IngredientFormMock = IngredientForm as jest.Mock;
  IngredientFormMock.mockImplementation(mockIngredientForm);
});

describe('IngredientsList renders correctly', () => {
    test('when given all basic ingredient data', () => {
        const {getByText} = render(
            <IngredientsList onEdit={() => {}} />
        );

        expect(getByText(/Test Ingredient 1/i)).toBeTruthy();
        expect(getByText(/1g/i)).toBeTruthy();
        expect(getByText(/Eat By 01\/10\/2023/i)).toBeTruthy();
        expect(getByText(/Test Ingredient 2/i)).toBeTruthy();
        expect(getByText(/2g/i)).toBeTruthy();
        expect(getByText(/Eat By 02\/10\/2023/i)).toBeTruthy();
        expect(getByText(/Test Ingredient 3/i)).toBeTruthy();
        expect(getByText(/3g/i)).toBeTruthy();
        expect(getByText(/Eat By 03\/10\/2023/i)).toBeTruthy();
    })
})

test('IngredientComponent is replaced by FormComponent when Edit is clicked', async () => {
  const user = userEvent.setup();

  const {getAllByText, getByText} = render(
    <IngredientsList onEdit={() => {}} />
  );

  const editButton = getAllByText(/Edit/i)[1]; // Get the second edit button (for Test Ingredient 2)

  await user.press(editButton); // Simulate the press event

  expect(getByText(/Form For : Test Ingredient 2/i)).toBeTruthy(); // Check if the ingredient name is still there
})

test('onEdit is called when edit button is clicked', async () => {
  const user = userEvent.setup();
  const mockOnEdit = jest.fn(); // Mock function to track calls

  const {getAllByText} = render(
    <IngredientsList onEdit={mockOnEdit} />
  );

  const editButton = getAllByText(/Edit/i)[1]; // Get the second edit button (for Test Ingredient 2)

  await user.press(editButton); // Simulate the press event

  expect(mockOnEdit).toHaveBeenCalled(); // Check if the onEdit function was called
})

test('IngredientComponent is replaced by FormComponent when Edit is clicked and then goes back to IngredientComponent when cancelled', async () => {
  const user = userEvent.setup();

  const {getAllByText, getByText} = render(
    <IngredientsList onEdit={() => {}} />
  );

  const editButton = getAllByText(/Edit/i)[1]; // Get the second edit button (for Test Ingredient 2)

  await user.press(editButton); // Simulate the press event

  const cancelButton = getByText(/Cancel/i); // Get the cancel button
  await user.press(cancelButton); // Simulate the press event

  expect(getByText(/Eat By 02\/10\/2023/i)).toBeTruthy(); // Check if the ingredient name is still there
})

