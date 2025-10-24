//2025-10-24 : mock data context names fixed

//2025-10-23 : Converted to use Shopping List Context

//2025-05-22 : Initial implementation and basic tests using ingredients form as a template

import {render, userEvent} from '@testing-library/react-native';
import ShoppingListForm from './ShoppingListForm';
import { useShoppingList } from '@/Contexts/ShoppingList/ShoppingListDataProvider';
import Shopping_List_Item from '@/Types/Shopping_List_Item';

const mockdataContext = {
  deleteShoppingItem: jest.fn(),
  addShoppingItem: jest.fn(),
  updateShoppingItem: jest.fn(),
};


jest.mock("@/Contexts/ShoppingList/ShoppingListDataProvider", () => {
  return {
    __esModule: true,
    useShoppingList: jest.fn(),
  };
});

const onCancelMock = jest.fn();

beforeEach(() => {
    jest.resetAllMocks();
    const useShoppingListMock = useShoppingList as jest.Mock;
    useShoppingListMock.mockReturnValue(mockdataContext);
});

describe('Shopping List Form renders correctly', () => {
  it('when given no input item', () => {
    const {getByText, getByLabelText} = render(
      <ShoppingListForm isFormVisible={true}/>,
    );

    expect(getByText(/Item:/i)).toBeTruthy();
    expect(getByText(/Quantity:/i)).toBeTruthy();

    expect(getByLabelText(/name-input/i)).toBeTruthy();
    expect(getByLabelText(/quantity-input/i)).toBeTruthy();

    expect(getByLabelText(/name-input/i)).toHaveDisplayValue('');
    expect(getByLabelText(/quantity-input/i)).toHaveDisplayValue('0');
  });
  it('when given an input item', () => {
    const {getByText, getByLabelText} = render(
      <ShoppingListForm item={{
            Item_Name: "Test Item",
            Item_Quantity: 1,
        }} 
        onCancel={onCancelMock}
        isFormVisible={true}
      />,
    );

    expect(getByText(/Item:/i)).toBeTruthy();
    expect(getByText(/Quantity:/i)).toBeTruthy();

    expect(getByLabelText(/name-input/i)).toBeTruthy();
    expect(getByLabelText(/quantity-input/i)).toBeTruthy();

    expect(getByLabelText(/name-input/i)).toHaveDisplayValue('Test Item');
    expect(getByLabelText(/quantity-input/i)).toHaveDisplayValue('1');
  });
});
describe('ShoppingListForm input registers correct change', () => {
    describe('when given no input item', () => {
        test('and name input is changed', async () => {
            const user = userEvent.setup();
    
            const {getByLabelText} = render(
                <ShoppingListForm isFormVisible={true}/>,
            );
    
            const nameInput = getByLabelText(/name-input/i);
    
            expect(nameInput).toBeTruthy();
    
            await user.type(nameInput, 'Test Ingredient 1', {submitEditing: true});
    
            expect(nameInput).toHaveDisplayValue('Test Ingredient 1');
        });
        test('and quantity input is changed', async () => {
            const user = userEvent.setup();
    
            const {getByLabelText} = render(
                <ShoppingListForm isFormVisible={true}/>,
            );
    
            const quantityInput = getByLabelText(/quantity-input/i);
    
            expect(quantityInput).toBeTruthy();
    
            await user.type(quantityInput, '1');
    
            expect(quantityInput).toHaveDisplayValue('01');
        });
    })
    describe('when given an input item', () => {
        test('and name input is changed', async() => {
            const user = userEvent.setup();
    
            const {getByLabelText} = render(
                <ShoppingListForm item={{
                    Item_Name: 'Test Ingredient',
                    Item_Quantity: 1
                }} 
                onCancel={onCancelMock}
                isFormVisible={true}
                />,
            );
    
            const nameInput = getByLabelText(/name-input/i);
    
            expect(nameInput).toBeTruthy();
    
            await user.type(nameInput, ' Input 1');
    
            expect(nameInput).toHaveDisplayValue('Test Ingredient Input 1');
        })
        test('and quantity input is changed', async() => {
            const user = userEvent.setup();
    
            const {getByLabelText} = render(
                <ShoppingListForm item={{
                    Item_Name: 'Test Ingredient',
                    Item_Quantity: 1,
                }} 
                onCancel={onCancelMock}
                isFormVisible={true}
                />,
            );
    
            const quantityInput = getByLabelText(/quantity-input/i);
    
            expect(quantityInput).toBeTruthy();
    
            await user.type(quantityInput, '2');
    
            expect(quantityInput).toHaveDisplayValue('12');
        });
    })
})
describe("When Submit button is pressed", () => {
    describe("and there is no input item, data context Add Ingredient is called", () => {
        test("With initial values when unchanged", async () => {
            const user = userEvent.setup();
            const {getByText, getByLabelText} = render(
                <ShoppingListForm isFormVisible={true}/>,
            );

            const submitButton = getByText(/Submit/i);

            expect(getByLabelText(/name-input/i)).toBeTruthy();
            expect(getByLabelText(/quantity-input/i)).toBeTruthy();

            expect(submitButton).toBeTruthy();

            await user.press(submitButton);

            expect(mockdataContext.addShoppingItem).toHaveBeenCalledTimes(1);
            expect(mockdataContext.updateShoppingItem).toHaveBeenCalledTimes(0);
        })
        test("With changed values when changed", async () => {
            const user = userEvent.setup();
            const {getByText, getByLabelText} = render(
                <ShoppingListForm isFormVisible={true}/>,
            );

            const testItem : Shopping_List_Item = {
                    Item_Name: 'Test Item 1',
                    Item_Quantity: 1,
                };

            const submitButton = getByText(/Submit/i);

            const nameInput = getByLabelText(/name-input/i);
            const quantityInput = getByLabelText(/quantity-input/i);

            await user.type(nameInput, 'Test Item 1', {submitEditing: true});
            await user.type(quantityInput, '1', {submitEditing: true});

            expect(submitButton).toBeTruthy();

            await user.press(submitButton);

            expect(mockdataContext.addShoppingItem).toHaveBeenCalledTimes(1);
            expect(mockdataContext.addShoppingItem).toHaveBeenCalledWith(testItem);

            expect(mockdataContext.updateShoppingItem).toHaveBeenCalledTimes(0);

        })

    })
    describe("and there is an input item, data context Update Ingredient is called", () => {
        test("With initial values when unchanged", async () => {
            const user = userEvent.setup();

            const testItem : Shopping_List_Item = {
                    Item_ID: 1,
                    Item_Name: 'Test Item 1',
                    Item_Quantity: 1,
                };


            const {getByText, getByLabelText} = render(
                <ShoppingListForm item={testItem} isFormVisible={true} />,
            );

            const submitButton = getByText(/Submit/i);

            expect(getByLabelText(/name-input/i)).toBeTruthy();
            expect(getByLabelText(/quantity-input/i)).toBeTruthy();

            expect(submitButton).toBeTruthy();

            await user.press(submitButton);

            expect(mockdataContext.addShoppingItem).toHaveBeenCalledTimes(0);
            expect(mockdataContext.updateShoppingItem).toHaveBeenCalledTimes(1);
            expect(mockdataContext.updateShoppingItem).toHaveBeenCalledWith(testItem);
        })
        test("With changed values when changed", async () => { 
            const user = userEvent.setup();
            const testItem : Shopping_List_Item = {
                    Item_ID: 1,
                    Item_Name: 'Test Item 1',
                    Item_Quantity: 1,
                };


            const {getByText, getByLabelText} = render(
                <ShoppingListForm item={testItem} isFormVisible={true} />,
            );

            const expectedIngredient : Shopping_List_Item = {
                Item_ID: 1,
                Item_Name: 'Test Item 1 Input Test',
                Item_Quantity: 12,
            };

            const submitButton = getByText(/Submit/i);

            const nameInput = getByLabelText(/name-input/i);
            const quantityInput = getByLabelText(/quantity-input/i);

            await user.type(nameInput, ' Input Test', {submitEditing: true});
            await user.type(quantityInput, '2', {submitEditing: true});

            expect(submitButton).toBeTruthy();

            await user.press(submitButton);

            expect(mockdataContext.addShoppingItem).toHaveBeenCalledTimes(0);
            expect(mockdataContext.updateShoppingItem).toHaveBeenCalledTimes(1);

            expect(mockdataContext.updateShoppingItem).toHaveBeenCalledWith(expectedIngredient);
        })
    })
})
describe("Form Visibility is", () => {
    test("Visble when isFormVisible is true", () => {
        const { getByLabelText} = render(
            <ShoppingListForm isFormVisible={true}/>,
        );

        const form = getByLabelText("formContainer");
        expect(form).toHaveProperty("props.style.display", "flex");
    })
    test("Invisible when isFormVisible is false", () => {
        const {queryByLabelText} = render(
            <ShoppingListForm isFormVisible={false}/>,
        );

        const form = queryByLabelText("formContainer");
        expect(form).toBeNull();
        
    })
})