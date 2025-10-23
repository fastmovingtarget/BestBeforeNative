//2025-10-23 : Updated to use UpdateState enum, improved visual formatting

//2025-05-28 : Asynchronous fetch implementation

import { addShoppingListItemData } from './AddShoppingListItem';
import Shopping_List_Item from '../../Types/Shopping_List_Item'; // Adjust the import path as necessary
import fetchMock from 'jest-fetch-mock';
import { UpdateState } from '@/Types/DataLoadingState';
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

const shoppingListItem : Shopping_List_Item = {
    Item_Name: 'New Item 1',
    Item_Quantity: 3,
};

// Mocking the fetch function
beforeEach(() => {
    fetchMock.resetMocks();
})

test('should fetch item data and update state', async () => {

    /*Arrange *******************************************************************/
    const mockSetShoppingList = jest.fn();
    const expectedShoppingList = [
        {
            Item_ID: 1,
            Item_Name: 'Item 1',
            Item_Quantity: 1,
        },{
            Item_ID: 2,
            Item_Name: 'Item 2',
            Item_Quantity: 2,
        },{
            Item_ID: 3,
            Item_Name: 'New Item 1',
            Item_Quantity: 3,
        }
    ]; 

    fetchMock.mockResponseOnce(JSON.stringify(
            {
                ...shoppingListItem,
                Item_ID: 3,
            },
        )
    );

    /*Act **********************************************************************/
    const addShoppingListReturn = await addShoppingListItemData(
        1, // Assuming userID is 1 for this test
        shoppingList,
        mockSetShoppingList,
        shoppingListItem
    );

    /*Assert *******************************************************************/

    expect(addShoppingListReturn).toEqual(UpdateState.Successful);
    expect(mockSetShoppingList).toHaveBeenCalledWith(expectedShoppingList);
})
test("should not update state if fetch fails", async () => {
    /*Arrange *******************************************************************/
    const mockSetShoppingList = jest.fn();


    fetchMock.mockResponseOnce(
        "",
        {status: 500, statusText: "Internal Server Error"}
    );

    /*Act **********************************************************************/
    await addShoppingListItemData(
        1, // Assuming userID is 1 for this test
        shoppingList,
        mockSetShoppingList,
        shoppingListItem
    );

    /*Assert *******************************************************************/

    expect(mockSetShoppingList).not.toHaveBeenCalled();
});