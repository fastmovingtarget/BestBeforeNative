//2025-10-24 : Fixing import and mock to use correct context provider

import {render, userEvent, fireEvent} from '@testing-library/react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import IngredientForm from './IngredientForm';
import {useIngredients} from '@/Contexts/Ingredients/IngredientsDataProvider';
import Ingredient from '@/Types/Ingredient';

const mockdataContext = {
  deleteIngredient: jest.fn(),
  addIngredient : jest.fn(),
  updateIngredient: jest.fn(),
};


jest.mock("@/Contexts/Ingredients/IngredientsDataProvider", () => {
  return {
    __esModule: true,
    useIngredients: jest.fn(),
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
    const useIngredientsMock = useIngredients as jest.Mock;
    useIngredientsMock.mockReturnValue(mockdataContext);
    mockDateTimePicker.mockImplementation(originalModule.default);
});

describe('Ingredient renders correctly', () => {
  it('when given no ingredient', () => {

    const {getByText, getByLabelText} = render(
      <IngredientForm isFormVisible={true}/>,
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
      <IngredientForm ingredient={{
            Ingredient_Name: 'Test Ingredient',
            Ingredient_Quantity: 1,
            Ingredient_Date: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 7), // 1 week from now
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
                <IngredientForm isFormVisible={true}/>,
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
                <IngredientForm isFormVisible={true}/>,
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
                <IngredientForm isFormVisible={true}/>,
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
                <IngredientForm ingredient={{
                    Ingredient_Name: 'Test Ingredient',
                    Ingredient_Quantity: 1,
                    Ingredient_Date: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 7), // 1 week from now
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
                <IngredientForm ingredient={{
                    Ingredient_Name: 'Test Ingredient',
                    Ingredient_Quantity: 1,
                    Ingredient_Date: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 7), // 1 week from now
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
                <IngredientForm isFormVisible={true}/>,
            );

            const submitButton = getByText(/Submit/i);

            expect(getByLabelText(/name-input/i)).toBeTruthy();
            expect(getByLabelText(/quantity-input/i)).toBeTruthy();
            expect(getByLabelText(/date-input-button/i)).toBeTruthy();

            expect(submitButton).toBeTruthy();

            await user.press(submitButton);

            expect(mockdataContext.addIngredient).toHaveBeenCalledTimes(1);
            expect(mockdataContext.updateIngredient).toHaveBeenCalledTimes(0);
        })
        test("With changed values when changed", async () => {
            const user = userEvent.setup();
            const {getByText, getByLabelText} = render(
                <IngredientForm isFormVisible={true}/>,
            );

            const testIngredient : Ingredient = {
                Ingredient_Name: 'Test Ingredient 1',
                Ingredient_Quantity: 1,
                Ingredient_Date: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 7), // 1 week from now
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
                    timestamp: testIngredient.Ingredient_Date?.getTime(),
                    utcOffset: 0,
                }}, dateInput);

            expect(submitButton).toBeTruthy();

            await user.press(submitButton);

            expect(mockdataContext.addIngredient).toHaveBeenCalledTimes(1);
            expect(mockdataContext.updateIngredient).toHaveBeenCalledTimes(0);

            expect(mockdataContext.addIngredient).toHaveBeenCalledWith(testIngredient);
        })

    })
    describe("and there is an ingredient, data context Update Ingredient is called", () => {
        test("With initial values when unchanged", async () => {
            const user = userEvent.setup();

            const testIngredient = {
                Ingredient_ID: 1,
                Ingredient_Name: 'Test Ingredient',
                Ingredient_Quantity: 1,
                Ingredient_Date: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 7), // 1 week from now
            };

            const {getByText, getByLabelText} = render(
                <IngredientForm ingredient={testIngredient} isFormVisible={true} />,
            );

            const submitButton = getByText(/Submit/i);

            expect(getByLabelText(/name-input/i)).toBeTruthy();
            expect(getByLabelText(/quantity-input/i)).toBeTruthy();
            expect(getByLabelText(/date-input-button/i)).toBeTruthy();

            expect(submitButton).toBeTruthy();

            await user.press(submitButton);

            expect(mockdataContext.addIngredient).toHaveBeenCalledTimes(0);
            expect(mockdataContext.updateIngredient).toHaveBeenCalledTimes(1);
            expect(mockdataContext.updateIngredient).toHaveBeenCalledWith(testIngredient);
        })
        test("With changed values when changed", async () => { 
            const user = userEvent.setup();
            const testIngredient = {
                Ingredient_ID: 1,
                Ingredient_Name: 'Test Ingredient 1',
                Ingredient_Quantity: 1,
                Ingredient_Date: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 7), // 1 week from now
            };

            const {getByText, getByLabelText} = render(
                <IngredientForm ingredient={testIngredient} isFormVisible={true}/>,
            );

            const expectedIngredient : Ingredient = {
                Ingredient_ID: 1,
                Ingredient_Name: 'Test Ingredient 1 Input Test',
                Ingredient_Quantity: 12,
                Ingredient_Date: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 4), // 1 week from now
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
                    timestamp: expectedIngredient.Ingredient_Date?.getTime(),
                    utcOffset: 0,
                }}, dateInput);

            expect(submitButton).toBeTruthy();

            await user.press(submitButton);

            expect(mockdataContext.addIngredient).toHaveBeenCalledTimes(0);
            expect(mockdataContext.updateIngredient).toHaveBeenCalledTimes(1);

            expect(mockdataContext.updateIngredient).toHaveBeenCalledWith(expectedIngredient);
        })
    })
})
describe("Form Visibility is", () => {
    test("Visble when isFormVisible is true", () => {
        const { getByLabelText} = render(
            <IngredientForm isFormVisible={true}/>,
        );

        const form = getByLabelText("formContainer");
        expect(form).toHaveProperty("props.style.display", "flex");
    })
    test("Invisible when isFormVisible is false", () => {
        const {queryByLabelText} = render(
            <IngredientForm isFormVisible={false}/>,
        );

        const form = queryByLabelText("formContainer");
        expect(form).toBeNull();
        
    })
})