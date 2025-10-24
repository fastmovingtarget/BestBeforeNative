//2025-10-23 : Updated to use UpdateState enum, improved visual formatting

//2025-05-28 : Fixing for newer implementaton of getShoppingList, removing extraneous tests

import { getShoppingListData } from './GetShoppingList';
import Shopping_List_Item from '../../Types/Shopping_List_Item'; // Adjust the import path as necessary
import fetchMock from 'jest-fetch-mock';
fetchMock.enableMocks();

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

// Mocking the fetch function
beforeEach(() => {
    fetchMock.resetMocks();
})

test('should fetch recipes with amount high and low and update state', async () => {
    const mockSetShoppingList = jest.fn();
    const userID = 1;
        

    //if I instance the dates seperately in the call and response, I get different timestamps 'cos the test takes time, so I'll just make 'em here
    fetchMock.mockResponseOnce(JSON.stringify(shoppingList));

    await getShoppingListData(
        userID,
        mockSetShoppingList,
    );

    expect(mockSetShoppingList).toHaveBeenCalledWith(shoppingList);
})

test('should handle fetch error', async () => {
    const mockSetShoppingList = jest.fn();
    const userID = 1;

    fetchMock.mockResponseOnce(JSON.stringify({}), { status: 500 });

    await getShoppingListData(
        userID,
        mockSetShoppingList,
    );

    expect(mockSetShoppingList).not.toHaveBeenCalled(); // Check if setRecipes was not called
});