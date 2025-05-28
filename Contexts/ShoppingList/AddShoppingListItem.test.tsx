//2025-05-28 : Asynchronous fetch implementation

import { render, screen, act } from '@testing-library/react';
import { addShoppingListItemData } from './AddShoppingListItem';
import Shopping_List_Item from '../../Types/Shopping_List_Item'; // Adjust the import path as necessary
import fetchMock from 'jest-fetch-mock';
fetchMock.enableMocks();

// Mocking the fetch function
beforeEach(() => {
    fetchMock.resetMocks();
})

test('should fetch item data and update state', async () => {

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

    const shoppingListItem : Shopping_List_Item = {
        Item_Name: 'New Item 1',
        Item_Quantity: 3,
    };

    fetchMock.mockResponseOnce(JSON.stringify(
            {
                ...shoppingListItem,
                Item_ID: 3,
            },
        )
    );

    /*Act **********************************************************************/
    const addShoppingListReturn = await addShoppingListItemData(
        mockServerProps,
        1, // Assuming userID is 1 for this test
        shoppingList,
        mockSetShoppingList,
        shoppingListItem
    );

    /*Assert *******************************************************************/

    expect(addShoppingListReturn).toEqual("successful");
    expect(mockSetShoppingList).toHaveBeenCalledWith([
        ...shoppingList,
        {
            ...shoppingListItem,
            Item_ID: 3,
        },
    ]);
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

    const shoppingListItem : Shopping_List_Item = {
        Item_Name: 'New Item 1',
        Item_Quantity: 3,
    };

    fetchMock.mockResponseOnce(
        "",
        {status: 500, statusText: "Internal Server Error"}
    );

    /*Act **********************************************************************/
    await addShoppingListItemData(
        mockServerProps,
        1, // Assuming userID is 1 for this test
        shoppingList,
        mockSetShoppingList,
        shoppingListItem
    );

    /*Assert *******************************************************************/

    expect(mockSetShoppingList).not.toHaveBeenCalled();
});