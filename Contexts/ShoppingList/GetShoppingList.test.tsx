import { render, screen, act } from '@testing-library/react';
import { getShoppingListData } from './GetShoppingList';
import Shopping_List_Item from '../../Types/Shopping_List_Item'; // Adjust the import path as necessary
import fetchMock from 'jest-fetch-mock';
fetchMock.enableMocks();

// Mocking the fetch function
beforeEach(() => {
    fetch.resetMocks();
})

test('should fetch recipes with amount high and low and update state', async () => {
    const mockSetShoppingList = jest.fn();
    const mockServerProps = { DatabaseServer: 'localhost', DatabasePort: '3000' };
    const userID = 1;
        
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

    //if I instance the dates seperately in the call and response, I get different timestamps 'cos the test takes time, so I'll just make 'em here
    fetch.mockResponseOnce(JSON.stringify(shoppingList));

    await getShoppingListData(
        mockServerProps,
        userID,
        [] as Shopping_List_Item[],
        mockSetShoppingList,
        100,
        300
    );

    expect(mockSetShoppingList).toHaveBeenCalledWith(shoppingList);
})

test('should fetch shopping list with existing entries and update state', async () => {
    const mockSetShoppingList = jest.fn();
    const mockServerProps = { DatabaseServer: 'localhost', DatabasePort: '3000' };
    const userID = 1;
        
    const existingShoppingList : Shopping_List_Item[] = [
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

    const fetchedShoppingList : Shopping_List_Item[] = [
        {
            Item_ID: 3,
            Item_Name: 'Item 3',
            Item_Quantity: 1,
        },
        {
            Item_ID: 4,
            Item_Name: 'Item 4',
            Item_Quantity: 2,
        },
        {
            Item_ID: 5,
            Item_Name: 'Item 5',
            Item_Quantity: 3,
        }
    ]

    //if I instance the dates seperately in the call and response, I get different timestamps 'cos the test takes time, so I'll just make 'em here
    fetch.mockResponseOnce(JSON.stringify(fetchedShoppingList));

    await getShoppingListData(
        mockServerProps,
        userID,
        existingShoppingList,
        mockSetShoppingList,
    );

    expect(mockSetShoppingList).toHaveBeenCalledWith(
        [
            ...existingShoppingList,
            ...fetchedShoppingList,
        ]
    );
})

test('should fetch shopping list with dates and update state correctly', async () => {
    const mockSetShoppingList = jest.fn();
    const mockServerProps = { DatabaseServer: 'localhost', DatabasePort: '3000' };
    const userID = 1;
        
    const fetchedShoppingList : Shopping_List_Item[] = [
        {
            Item_ID: 1,
            Item_Name: 'Item 1',
            Item_Quantity: 1,
            Plan_Date: new Date('2023-04-01T00:00:00Z'), // Example date
        },
        {
            Item_ID: 2,
            Item_Name: 'Item 2',
            Item_Quantity: 2,
            Plan_Date: new Date('2023-10-01T00:00:00Z'), // Example date
        },
    ]; 

    //if I instance the dates seperately in the call and response, I get different timestamps 'cos the test takes time, so I'll just make 'em here
    fetch.mockResponseOnce(JSON.stringify(fetchedShoppingList));

    await getShoppingListData(
        mockServerProps,
        userID,
        [] as Shopping_List_Item[],
        mockSetShoppingList,
    );

    expect(mockSetShoppingList).toHaveBeenCalledWith(fetchedShoppingList);
})

test('should handle fetch error', async () => {
    const mockSetShoppingList = jest.fn();
    const mockServerProps = { DatabaseServer: 'localhost', DatabasePort: '3000' };
    const userID = 1;

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
    fetch.mockResponseOnce(JSON.stringify({}), { status: 500 });

    await getShoppingListData(
        mockServerProps,
        userID,
        shoppingList,
        mockSetShoppingList,
    );

    expect(mockSetShoppingList).not.toHaveBeenCalled(); // Check if setRecipes was not called
});