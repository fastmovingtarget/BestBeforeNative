import { render, screen, act } from '@testing-library/react';
import { updateShoppingListItemData } from './UpdateShoppingListItem';
import Shopping_List_Item from '../../Types/Shopping_List_Item'; // Adjust the import path as necessary
import fetchMock from 'jest-fetch-mock';
fetchMock.enableMocks();

// Mocking the fetch function
beforeEach(() => {
    fetch.resetMocks();
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

    const shoppingListItem : Shopping_List_Item = {
        Item_ID: 1,
        Item_Name: 'Updated Item 1',
        Item_Quantity: 3,
    };

    fetch.mockResponseOnce(JSON.stringify(
            shoppingListItem
        )
    );

    /*Act **********************************************************************/
    await updateShoppingListItemData(
        mockServerProps,
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

    fetch.mockResponseOnce(
        "",
        {status: 500, statusText: "Internal Server Error"}
    );

    /*Act **********************************************************************/
    await updateShoppingListItemData(
        mockServerProps,
        shoppingList,
        mockSetShoppingList,
        shoppingListItem
    );

    /*Assert *******************************************************************/

    expect(mockSetShoppingList).not.toHaveBeenCalled();
});