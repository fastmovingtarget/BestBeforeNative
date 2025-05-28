//2025-05-28 : Now tests the Asynchronous Delete implementation

import { render, screen, act } from '@testing-library/react';
import { deleteShoppingListItemData } from './DeleteShoppingListItem';
import Shopping_List_Item from '../../Types/Shopping_List_Item'; // Adjust the import path as necessary
import fetchMock from 'jest-fetch-mock';
fetchMock.enableMocks();

// Mocking the fetch function
beforeEach(() => {
    fetchMock.resetMocks();
})

test('should fetch ingredients data and update state', async () => {

    /*Arrange *******************************************************************/
    const mockSetShoppingList = jest.fn();
    const mockServerProps = { DatabaseServer: 'localhost', DatabasePort: '3000' };

    const shoppingList : Shopping_List_Item[] = [
        {
            Item_ID: 1,
            Item_Name: 'Item 1',
            Item_Quantity: 1,
        },
        {
            Item_ID: 2,
            Item_Name: 'Item 2',
            Item_Quantity: 2,
        },
    ]; 

    fetchMock.mockResponseOnce(
        "",
        {status: 204, statusText: "Ingredient Deleted"}
    );

    /*Act **********************************************************************/
    await deleteShoppingListItemData(
        mockServerProps,
        shoppingList,
        mockSetShoppingList,
        1
    );

    /*Assert *******************************************************************/

    expect(mockSetShoppingList).toHaveBeenCalledWith([{
        Item_ID: 2,
        Item_Name: 'Item 2',
        Item_Quantity: 2,
    }]);
})

test("should not update state if fetch fails", async () => {
    
    /*Arrange *******************************************************************/
    const mockSetShoppingList = jest.fn();
    const mockServerProps = { DatabaseServer: 'localhost', DatabasePort: '3000' };

    const shoppingList : Shopping_List_Item[] = [
        {
            Item_ID: 1,
            Item_Name: 'Item 1',
            Item_Quantity: 1,
        },
        {
            Item_ID: 2,
            Item_Name: 'Item 2',
            Item_Quantity: 2,
        },
    ]; 

    fetchMock.mockResponseOnce(
        "",
        {status: 500, statusText: "Internal Server Error"}
    );

    /*Act **********************************************************************/
    const deleteReturn = await deleteShoppingListItemData(
        mockServerProps,
        shoppingList,
        mockSetShoppingList,
        1
    );

    /*Assert *******************************************************************/

    expect(deleteReturn).toEqual("failed");
})