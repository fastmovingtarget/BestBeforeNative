//2025-11-20 : Shifting test files into their own folder in the hierarchy

//2025-11-19 : Item_(...) now have Shopping_ Prefix

//2025-10-23 : Updated to use UpdateState enum, improved visual formatting

//2025-05-28 : Changed to work with promise return and asynchronous fetch

import { updateShoppingListItemData } from '../../../Contexts/ShoppingList/UpdateShoppingListItem';
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

    const shoppingListItem : Shopping_List_Item = {
        Shopping_Item_ID: 1,
        Shopping_Item_Name: 'Updated Item 1',
        Shopping_Item_Quantity: 3,
    };

    fetchMock.mockResponseOnce(JSON.stringify(
            shoppingListItem
        )
    );

    /*Act **********************************************************************/
    await updateShoppingListItemData(
        shoppingList,
        mockSetShoppingList,
        shoppingListItem
    );

    /*Assert *******************************************************************/

    expect(mockSetShoppingList).toHaveBeenCalledWith([
        shoppingListItem,
        shoppingList[1],
    ]);
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

    const shoppingListItem : Shopping_List_Item = {
        Shopping_Item_Name: 'New Item 1',
        Shopping_Item_Quantity: 3,
    };

    fetchMock.mockResponseOnce(
        "",
        {status: 500, statusText: "Internal Server Error"}
    );

    /*Act **********************************************************************/
    const updateReturn = await updateShoppingListItemData(
        shoppingList,
        mockSetShoppingList,
        shoppingListItem
    );

    /*Assert *******************************************************************/
    expect(updateReturn).toEqual(UpdateState.Failed);
    expect(mockSetShoppingList).not.toHaveBeenCalled();
});