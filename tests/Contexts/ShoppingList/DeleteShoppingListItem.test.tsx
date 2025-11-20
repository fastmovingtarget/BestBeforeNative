//2025-11-20 : Shifting test files into their own folder in the hierarchy

//2025-11-19 : Item_(...) now have Shopping_ Prefix

//2025-10-23 : Updated to use UpdateState enum, improved visual formatting

//2025-05-28 : Now tests the Asynchronous Delete implementation

import { deleteShoppingListItemData } from '../../../Contexts/ShoppingList/DeleteShoppingListItem';
import Shopping_List_Item from '../../../Types/Shopping_List_Item'; // Adjust the import path as necessary
import fetchMock from 'jest-fetch-mock';
import { UpdateState } from '@/Types/DataLoadingState';
fetchMock.enableMocks();

// Mocking the fetch function
beforeEach(() => {
    fetchMock.resetMocks();
})

test('should fetch ingredients data and update state', async () => {

    /*Arrange *******************************************************************/
    const mockSetShoppingList = jest.fn();

    const shoppingList : Shopping_List_Item[] = [
        {
            Shopping_Item_ID: 1,
            Shopping_Item_Name: 'Item 1',
            Shopping_Item_Quantity: 1,
        },
        {
            Shopping_Item_ID: 2,
            Shopping_Item_Name: 'Item 2',
            Shopping_Item_Quantity: 2,
        },
    ]; 

    fetchMock.mockResponseOnce(
        "",
        {status: 204, statusText: "Ingredient Deleted"}
    );

    /*Act **********************************************************************/
    await deleteShoppingListItemData(
        shoppingList,
        mockSetShoppingList,
        1
    );

    /*Assert *******************************************************************/

    expect(mockSetShoppingList).toHaveBeenCalledWith([{
        Shopping_Item_ID: 2,
        Shopping_Item_Name: 'Item 2',
        Shopping_Item_Quantity: 2,
    }]);
})

test("should not update state if fetch fails", async () => {
    
    /*Arrange *******************************************************************/
    const mockSetShoppingList = jest.fn();

    const shoppingList : Shopping_List_Item[] = [
        {
            Shopping_Item_ID: 1,
            Shopping_Item_Name: 'Item 1',
            Shopping_Item_Quantity: 1,
        },
        {
            Shopping_Item_ID: 2,
            Shopping_Item_Name: 'Item 2',
            Shopping_Item_Quantity: 2,
        },
    ]; 

    fetchMock.mockResponseOnce(
        "",
        {status: 500, statusText: "Internal Server Error"}
    );

    /*Act **********************************************************************/
    const deleteReturn = await deleteShoppingListItemData(
        shoppingList,
        mockSetShoppingList,
        1
    );

    /*Assert *******************************************************************/

    expect(deleteReturn).toEqual(UpdateState.Failed);
    expect(mockSetShoppingList).not.toHaveBeenCalled();
})