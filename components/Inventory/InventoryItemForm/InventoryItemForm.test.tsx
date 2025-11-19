//2025-11-19 : Renamed "Ingredient(s)" to "Inventory(_Items)"

//2025-10-24 : Fixing import and mock to use correct context provider

import {render, userEvent, fireEvent} from '@testing-library/react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import InventoryItemForm from './InventoryItemForm';
import {useInventory} from '@/Contexts/Inventory/InventoryDataProvider';
import Inventory_Item from '@/Types/Inventory_Item';


const mockdataContext = {
  deleteInventoryItem: jest.fn(),
  addInventoryItem : jest.fn(),
  updateInventoryItem: jest.fn(),
};

jest.mock("@/Contexts/Inventory/InventoryDataProvider", () => {
  return {
    __esModule: true,
    useInventory: jest.fn(),
  };
});

const originalModule = jest.requireActual('@react-native-community/datetimepicker');
jest.mock('@react-native-community/datetimepicker', () => {
  return {
    __esModule: true,
    default: jest.fn(),
  };
});
const mockDateTimePicker = DateTimePicker as jest.Mock;


const onCancelMock = jest.fn();

beforeEach(() => {
    jest.resetAllMocks();
    const useInventoryMock = useInventory as jest.Mock;
    useInventoryMock.mockReturnValue(mockdataContext);
    mockDateTimePicker.mockImplementation(originalModule.default);
});

describe('Ingredient renders correctly', () => {
  it('when given no ingredient', () => {

    const {getByText, getByLabelText} = render(
      <InventoryItemForm isFormVisible={true}/>,
    );

    expect(getByText(/Ingredient:/i)).toBeTruthy();
    expect(getByText(/Quantity:/i)).toBeTruthy();
    expect(getByText(/Use By:/i)).toBeTruthy();

    expect(getByLabelText(/name-input/i)).toBeTruthy();
    expect(getByLabelText(/quantity-input/i)).toBeTruthy();
    expect(getByLabelText(/date-input-button/i)).toBeTruthy();

    expect(getByLabelText(/name-input/i)).toHaveDisplayValue('');
    expect(getByLabelText(/quantity-input/i)).toHaveDisplayValue('0');
  });
  it('when given an ingredient', () => {
    const mockDateTimePicker = DateTimePicker as jest.Mock;
    mockDateTimePicker.mockImplementation(originalModule.default);

    const {getByText, getByLabelText} = render(
      <InventoryItemForm inventoryItem={{
            Inventory_Item_Name: 'Test Ingredient',
            Inventory_Item_Quantity: 1,
            Inventory_Item_Date: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 7), // 1 week from now
        }} 
        onCancel={onCancelMock}
        isFormVisible={true}
      />,
    );

    expect(getByText(/Ingredient:/i)).toBeTruthy();
    expect(getByText(/Quantity:/i)).toBeTruthy();
    expect(getByText(/Use By:/i)).toBeTruthy();

    expect(getByLabelText(/name-input/i)).toBeTruthy();
    expect(getByLabelText(/quantity-input/i)).toBeTruthy();
    expect(getByLabelText(/date-input-button/i)).toBeTruthy();

    expect(getByLabelText(/name-input/i)).toHaveDisplayValue('Test Ingredient');
    expect(getByLabelText(/quantity-input/i)).toHaveDisplayValue('1');
  });
});
describe('IngredientForm input registers correct change', () => {
    describe('when given no ingredient', () => {
        test('and name input is changed', async () => {
            const user = userEvent.setup();
    
            const {getByLabelText} = render(
                <InventoryItemForm isFormVisible={true}/>,
            );
    
            const nameInput = getByLabelText(/name-input/i);
    
            expect(nameInput).toBeTruthy();
    
            await user.type(nameInput, 'Test Ingredient 1', {submitEditing: true});
    
            expect(nameInput).toHaveDisplayValue('Test Ingredient 1');
        });
        test('and date input is changed', async () => {
            const user = userEvent.setup();
            const testDate = new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 7); // 1 week from now
    
            const {getByLabelText, getByText} = render(
                <InventoryItemForm isFormVisible={true}/>,
            );
    
            const dateInputButton = getByLabelText("date-input-button");

            await user.press(dateInputButton);
            const dateInput = getByLabelText("date-input");
    
            expect(dateInput).toBeTruthy();
    
            fireEvent(dateInput, 'onChange', {
                type: 'set',
                nativeEvent: {
                    timestamp: testDate.getTime(),
                    utcOffset: 0,
                }}, dateInput);

            expect(getByText(testDate.toLocaleDateString("en-UK", { year: "numeric", month: "2-digit", day: "2-digit" }))).toBeTruthy();
        });
        test('and quantity input is changed', async () => {
            const user = userEvent.setup();
    
            const {getByLabelText} = render(
                <InventoryItemForm isFormVisible={true}/>,
            );
    
            const quantityInput = getByLabelText(/quantity-input/i);
    
            expect(quantityInput).toBeTruthy();
    
            await user.type(quantityInput, '1');
    
            expect(quantityInput).toHaveDisplayValue('01');
        });
    })
    describe('when given an ingredient', () => {
        test('and name input is changed', async() => {
            const user = userEvent.setup();
    
            const {getByLabelText} = render(
                <InventoryItemForm inventoryItem={{
                    Inventory_Item_Name: 'Test Ingredient',
                    Inventory_Item_Quantity: 1,
                    Inventory_Item_Date: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 7), // 1 week from now
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
                <InventoryItemForm inventoryItem={{
                    Inventory_Item_Name: 'Test Ingredient',
                    Inventory_Item_Quantity: 1,
                    Inventory_Item_Date: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 7), // 1 week from now
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
    describe("and there is no ingredient, data context Add Ingredient is called", () => {
        test("With initial values when unchanged", async () => {
            const user = userEvent.setup();
            const {getByText, getByLabelText} = render(
                <InventoryItemForm isFormVisible={true}/>,
            );

            const submitButton = getByText(/Submit/i);

            expect(getByLabelText(/name-input/i)).toBeTruthy();
            expect(getByLabelText(/quantity-input/i)).toBeTruthy();
            expect(getByLabelText(/date-input-button/i)).toBeTruthy();

            expect(submitButton).toBeTruthy();

            await user.press(submitButton);

            expect(mockdataContext.addInventoryItem).toHaveBeenCalledTimes(1);
            expect(mockdataContext.updateInventoryItem).toHaveBeenCalledTimes(0);
        })
        test("With changed values when changed", async () => {
            const user = userEvent.setup();
            const {getByText, getByLabelText} = render(
                <InventoryItemForm isFormVisible={true}/>,
            );

            const testIngredient : Inventory_Item = {
                Inventory_Item_Name: 'Test Ingredient 1',
                Inventory_Item_Quantity: 1,
                Inventory_Item_Date: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 7), // 1 week from now
            };

            const submitButton = getByText(/Submit/i);

            const nameInput = getByLabelText(/name-input/i);
            const quantityInput = getByLabelText(/quantity-input/i);
            const dateInputButton = getByLabelText("date-input-button");

            await user.type(nameInput, 'Test Ingredient 1', {submitEditing: true});
            await user.type(quantityInput, '1', {submitEditing: true});

            await user.press(dateInputButton);
            const dateInput = getByLabelText("date-input");

            fireEvent(dateInput, 'onChange', {
                type: 'set',
                nativeEvent: {
                    timestamp: testIngredient.Inventory_Item_Date?.getTime(),
                    utcOffset: 0,
                }}, dateInput);

            expect(submitButton).toBeTruthy();

            await user.press(submitButton);

            expect(mockdataContext.addInventoryItem).toHaveBeenCalledTimes(1);
            expect(mockdataContext.updateInventoryItem).toHaveBeenCalledTimes(0);

            expect(mockdataContext.addInventoryItem).toHaveBeenCalledWith(testIngredient);
        })

    })
    describe("and there is an ingredient, data context Update Ingredient is called", () => {
        test("With initial values when unchanged", async () => {
            const user = userEvent.setup();

            const testInventoryItem : Inventory_Item = {
                Inventory_Item_ID: 1,
                Inventory_Item_Name: 'Test Ingredient',
                Inventory_Item_Quantity: 1,
                Inventory_Item_Date: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 7), // 1 week from now
            };

            const {getByText, getByLabelText} = render(
                <InventoryItemForm inventoryItem={testInventoryItem} isFormVisible={true} />,
            );

            const submitButton = getByText(/Submit/i);

            expect(getByLabelText(/name-input/i)).toBeTruthy();
            expect(getByLabelText(/quantity-input/i)).toBeTruthy();
            expect(getByLabelText(/date-input-button/i)).toBeTruthy();

            expect(submitButton).toBeTruthy();

            await user.press(submitButton);

            expect(mockdataContext.addInventoryItem).toHaveBeenCalledTimes(0);
            expect(mockdataContext.updateInventoryItem).toHaveBeenCalledTimes(1);
            expect(mockdataContext.updateInventoryItem).toHaveBeenCalledWith(testInventoryItem);
        })
        test("With changed values when changed", async () => { 
            const user = userEvent.setup();
            const testInventoryItem : Inventory_Item = {
                Inventory_Item_ID: 1,
                Inventory_Item_Name: 'Test Ingredient 1',
                Inventory_Item_Quantity: 1,
                Inventory_Item_Date: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 7), // 1 week from now
            };

            const {getByText, getByLabelText} = render(
                <InventoryItemForm inventoryItem={testInventoryItem} isFormVisible={true}/>,
            );

            const expectedInventoryItem : Inventory_Item = {
                Inventory_Item_ID: 1,
                Inventory_Item_Name: 'Test Ingredient 1 Input Test',
                Inventory_Item_Quantity: 12,
                Inventory_Item_Date: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 4), // 1 week from now
            };

            const submitButton = getByText(/Submit/i);

            const nameInput = getByLabelText(/name-input/i);
            const quantityInput = getByLabelText(/quantity-input/i);
            const dateInputButton = getByLabelText(/date-input-button/i);


            await user.type(nameInput, ' Input Test', {submitEditing: true});
            await user.type(quantityInput, '2', {submitEditing: true});

            await user.press(dateInputButton);
            const dateInput = getByLabelText("date-input");

            fireEvent(dateInput, 'onChange', {
                type: 'set',
                nativeEvent: {
                    timestamp: expectedInventoryItem.Inventory_Item_Date?.getTime(),
                    utcOffset: 0,
                }}, dateInput);

            expect(submitButton).toBeTruthy();

            await user.press(submitButton);

            expect(mockdataContext.addInventoryItem).toHaveBeenCalledTimes(0);
            expect(mockdataContext.updateInventoryItem).toHaveBeenCalledTimes(1);

            expect(mockdataContext.updateInventoryItem).toHaveBeenCalledWith(expectedInventoryItem);
        })
    })
})
describe("Form Visibility is", () => {
    test("Visble when isFormVisible is true", () => {
        const { getByLabelText} = render(
            <InventoryItemForm isFormVisible={true}/>,
        );

        const form = getByLabelText("formContainer");
        expect(form).toHaveProperty("props.style.display", "flex");
    })
    test("Invisible when isFormVisible is false", () => {
        const {queryByLabelText} = render(
            <InventoryItemForm isFormVisible={false}/>,
        );

        const form = queryByLabelText("formContainer");
        expect(form).toBeNull();
        
    })
})