//2025-11-19 : Renamed Ingredients to Inventory

//2025-10-22 : Removing server props from test criteria

import { getInventoryData } from './GetInventory';
import { InventorySearchOptions } from '../../Types/Inventory_Item'; // Adjust the import path as necessary
import fetchMock from 'jest-fetch-mock';
fetchMock.enableMocks();

// Mocking the fetch function
beforeEach(() => {
    fetchMock.resetMocks();
})

describe('getInventoryData', () => {
    test('should fetch inventory data and update state', async () => {
        const mockSetInventory = jest.fn();
        const userID = 1;

        const now = new Date();
        const tomorrow = new Date(now.getUTCMilliseconds() + 86400000); // 1 day later
        //if I instance the dates seperately in the call and response, I get different timestamps 'cos the test takes time, so I'll just make 'em here
        
        fetchMock.mockResponseOnce(JSON.stringify([
            {
                Inventory_Item_ID: 1,
                Inventory_Item_Name: 'Ingredient 1',
                Inventory_Item_Date: now,
                Inventory_Item_Quantity: 1,
            },
            {
                Inventory_Item_ID: 2,
                Inventory_Item_Name: 'Ingredient 2',
                Inventory_Item_Date: tomorrow,
                Inventory_Item_Quantity: 2,
            },
        ])
        );

        await getInventoryData(
            userID,
            mockSetInventory,
        );

        expect(mockSetInventory).toHaveBeenCalledWith([
            {
                Inventory_Item_ID: 1,
                Inventory_Item_Name: 'Ingredient 1',
                Inventory_Item_Date: now,
                Inventory_Item_Quantity: 1,
            },
            {
                Inventory_Item_ID: 2,
                Inventory_Item_Name: 'Ingredient 2',
                Inventory_Item_Date: tomorrow,
                Inventory_Item_Quantity: 2,
            },
        ]);
    })

    test('test get ingredients works when date isn\'t in the fetched data', async () => {
        const mockSetInventory = jest.fn();
        const userID = 1;

        //if I instance the dates seperately in the call and response, I get different timestamps 'cos the test takes time, so I'll just make 'em here
        
        fetchMock.mockResponseOnce(JSON.stringify([
            {
                Inventory_Item_ID: 1,
                Inventory_Item_Name: 'Ingredient 1',
                Inventory_Item_Quantity: 1,
            },
            {
                Inventory_Item_ID: 2,
                Inventory_Item_Name: 'Ingredient 2',
                Inventory_Item_Quantity: 2,
            },
        ])
        );

        await getInventoryData(
            userID,
            mockSetInventory,
        );

        expect(mockSetInventory).toHaveBeenCalledWith([
            {
                Inventory_Item_ID: 1,
                Inventory_Item_Name: 'Ingredient 1',
                Inventory_Item_Quantity: 1,
            },
            {
                Inventory_Item_ID: 2,
                Inventory_Item_Name: 'Ingredient 2',
                Inventory_Item_Quantity: 2,
            },
        ]);
    })

    test('should handle fetch error', async () => {
        const mockSetInventory = jest.fn();
        const userID = 1;
        fetchMock.mockResponseOnce(JSON.stringify({}), { status: 500 });

        await getInventoryData(
            userID,
            mockSetInventory,
        );

        expect(mockSetInventory).not.toHaveBeenCalled(); // Check if setInventory was not called
    })
    
    describe("Should be called with options", () => {
        test('search string', async () => {
            const mockSetInventory = jest.fn();
            const userID = 1;
    
            const now = new Date();

            const searchOptions : InventorySearchOptions = {
                searchText: 'Ingredient 1',
            }
    
            //if I instance the dates seperately in the call and response, I get different timestamps 'cos the test takes time, so I'll just make 'em here
            fetchMock.mockResponseOnce(JSON.stringify([
                {
                    Inventory_Item_ID: 1,
                    Inventory_Item_Name: 'Ingredient 1',
                    Inventory_Item_Date: now,
                    Inventory_Item_Quantity: 1,
                }
            ])
            );
    
            await getInventoryData(
                userID,
                mockSetInventory,
                searchOptions
            );
    
            expect(mockSetInventory).toHaveBeenCalledWith([
                {
                    Inventory_Item_ID: 1,
                    Inventory_Item_Name: 'Ingredient 1',
                    Inventory_Item_Date: now,
                    Inventory_Item_Quantity: 1,
                }
            ]);

            expect(fetch).toHaveBeenCalledWith(
                `https://${"192.168.50.183"}:${"5091"}/inventory/${userID}?searchText=Ingredient%201`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })

            expect(mockSetInventory.mock.calls[0][0]).toHaveLength(1); // Check if the length of the array is 2  
        })
        test('search called with all options', async () => {
            const mockSetInventory = jest.fn();
            const userID = 1;
    
            const now = new Date();

            const searchOptions : InventorySearchOptions = {
                searchText: 'Inventory Item 1',
                sortBy: 'Inventory_Item_Name',
                sortOrder: 'asc',
                amount: 100,
            }
    
            //if I instance the dates seperately in the call and response, I get different timestamps 'cos the test takes time, so I'll just make 'em here
            fetchMock.mockResponseOnce(JSON.stringify([
                {
                    Inventory_Item_ID: 1,
                    Inventory_Item_Name: 'Inventory Item 1',
                    Inventory_Item_Date: now,
                    Inventory_Item_Quantity: 1,
                }
            ])
            );
    
            await getInventoryData(
                userID,
                mockSetInventory,
                searchOptions
            );
    
            expect(mockSetInventory).toHaveBeenCalledWith([
                {
                    Inventory_Item_ID: 1,
                    Inventory_Item_Name: 'Inventory Item 1',
                    Inventory_Item_Date: now,
                    Inventory_Item_Quantity: 1,
                }
            ]);

            expect(fetch).toHaveBeenCalledWith(
                `https://${"192.168.50.183"}:${"5091"}/inventory/${userID}?searchText=Inventory%20Item%201&sortBy=Inventory_Item_Name&sortOrder=asc&amount=100`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })

            expect(mockSetInventory.mock.calls[0][0]).toHaveLength(1); // Check if the length of the array is 2  
        })
    })
})