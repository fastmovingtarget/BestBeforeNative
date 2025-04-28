import {render, userEvent, fireEvent, screen} from '@testing-library/react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { DateTimePickerAndroid, DateTimePickerEvent } from '@react-native-community/datetimepicker';
import IngredientForm from './IngredientForm';
import {useData} from '@/Contexts/DataProvider';

const mockdataContext = {
  deleteIngredient: jest.fn(),
  addIngredient : jest.fn(),
  updateIngredient: jest.fn(),
};


jest.mock("@/Contexts/DataProvider", () => {
  return {
    __esModule: true,
    useData: jest.fn(),
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
    const useDataMock = useData as jest.Mock;
    useDataMock.mockReturnValue(mockdataContext);
    mockDateTimePicker.mockImplementation(originalModule.default);
});

describe('Ingredient renders correctly', () => {
  it('when given no ingredient', () => {
    const user = userEvent.setup();

    const {getByText, getByLabelText} = render(
      <IngredientForm/>,
    );

    expect(getByText(/Ingredient:/i)).toBeTruthy();
    expect(getByText(/Quantity:/i)).toBeTruthy();
    expect(getByText(/Use By:/i)).toBeTruthy();

    expect(getByLabelText(/name-input/i)).toBeTruthy();
    expect(getByLabelText(/quantity-input/i)).toBeTruthy();
    expect(getByLabelText(/date-input/i)).toBeTruthy();

    expect(getByLabelText(/name-input/i)).toHaveDisplayValue('');
    expect(getByLabelText(/quantity-input/i)).toHaveDisplayValue('0');
    //we can't check that the date picker has the correct date via display value so will have to check visually when implemented
    expect(mockDateTimePicker.mock.calls[0][0].value.toLocaleDateString()).toEqual(new Date().toLocaleDateString());//careful running these tests at midnight as the date will change
  });
  it('when given an ingredient', () => {
    const mockDateTimePicker = DateTimePicker as jest.Mock;
    mockDateTimePicker.mockImplementation(originalModule.default);
    const user = userEvent.setup();

    const {getByText, getByLabelText} = render(
      <IngredientForm ingredient={{
            Ingredient_Name: 'Test Ingredient',
            Ingredient_Quantity: 1,
            Ingredient_Date: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 7), // 1 week from now
        }} 
        onCancel={onCancelMock}
      />,
    );

    expect(getByText(/Ingredient:/i)).toBeTruthy();
    expect(getByText(/Quantity:/i)).toBeTruthy();
    expect(getByText(/Use By:/i)).toBeTruthy();

    expect(getByLabelText(/name-input/i)).toBeTruthy();
    expect(getByLabelText(/quantity-input/i)).toBeTruthy();
    expect(getByLabelText(/date-input/i)).toBeTruthy();

    expect(getByLabelText(/name-input/i)).toHaveDisplayValue('Test Ingredient');
    expect(getByLabelText(/quantity-input/i)).toHaveDisplayValue('1');
    //we can't check that the date picker has the correct date via display value so will have to check visually when implemented
    expect(mockDateTimePicker.mock.calls[0][0].value.toLocaleDateString()).toEqual(new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 7).toLocaleDateString());//careful running these tests at midnight as the date will change
  });
});
describe('IngredientForm input registers correct change', () => {
    describe('when given no ingredient', () => {
        test('and name input is changed', async () => {
            const user = userEvent.setup();
    
            const {getByLabelText} = render(
                <IngredientForm/>,
            );
    
            const nameInput = getByLabelText(/name-input/i);
    
            expect(nameInput).toBeTruthy();
    
            await user.type(nameInput, 'Test Ingredient 1');
    
            expect(nameInput).toHaveDisplayValue('Test Ingredient 1');
        });
        test('and date input is changed', async () => {
            const user = userEvent.setup();
            const testDate = new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 7); // 1 week from now
    
            const {getByLabelText} = render(
                <IngredientForm/>,
            );
    
            const dateInput = getByLabelText(/date-input/i);
    
            expect(dateInput).toBeTruthy();
    
            fireEvent(dateInput, 'onChange', {
                type: 'set',
                nativeEvent: {
                    timestamp: testDate.getTime(),
                    utcOffset: 0,
                }}, dateInput);

            expect(new Date(dateInput.props.date).toTimeString()).toEqual(testDate.toTimeString());
        });
        test('and quantity input is changed', async () => {
            const user = userEvent.setup();
    
            const {getByLabelText} = render(
                <IngredientForm/>,
            );
    
            const quantityInput = getByLabelText(/quantity-input/i);
    
            expect(quantityInput).toBeTruthy();
    
            await user.type(quantityInput, '1');
    
            expect(quantityInput).toHaveDisplayValue('1');
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
    test("and there is no ingredient, data context Add Ingredient is called", async () => {
        const user = userEvent.setup();
        const {getByText, getByLabelText} = render(
            <IngredientForm/>,
        );

        const submitButton = getByText(/Submit/i);

        expect(getByLabelText(/name-input/i)).toBeTruthy();
        expect(getByLabelText(/quantity-input/i)).toBeTruthy();
        expect(getByLabelText(/date-input/i)).toBeTruthy();

        expect(submitButton).toBeTruthy();

        await user.press(submitButton);

        expect(mockdataContext.addIngredient).toHaveBeenCalledTimes(1);
        expect(mockdataContext.updateIngredient).toHaveBeenCalledTimes(0);
        expect(mockdataContext.addIngredient).toHaveBeenCalledWith({
            Ingredient_Name: '',
            Ingredient_Quantity: 0,
            Ingredient_Date: new Date(),
        });
    })
    test("and there is an ingredient, data context Add Ingredient is called", async () => {
        const user = userEvent.setup();

        const testIngredient = {
            Ingredient_ID: 1,
            Ingredient_Name: 'Test Ingredient',
            Ingredient_Quantity: 1,
            Ingredient_Date: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 7), // 1 week from now
        };

        const {getByText, getByLabelText} = render(
            <IngredientForm ingredient={testIngredient} />,
        );

        const submitButton = getByText(/Submit/i);

        expect(getByLabelText(/name-input/i)).toBeTruthy();
        expect(getByLabelText(/quantity-input/i)).toBeTruthy();
        expect(getByLabelText(/date-input/i)).toBeTruthy();

        expect(submitButton).toBeTruthy();

        await user.press(submitButton);

        expect(mockdataContext.addIngredient).toHaveBeenCalledTimes(0);
        expect(mockdataContext.updateIngredient).toHaveBeenCalledTimes(1);
        expect(mockdataContext.updateIngredient).toHaveBeenCalledWith(testIngredient);
    })
})