//2025-11-19 : Renamed Ingredients to Inventory

//2025-10-22 : Removing server props from test criteria

import { addInventoryItemData } from './AddInventoryItem';
import fetchMock from 'jest-fetch-mock';
import Inventory_Item from '../../Types/Inventory_Item';
fetchMock.enableMocks();

// Mocking the fetch function
beforeEach(() => {
    fetchMock.resetMocks();
})

test('should fetch inventory data and update state', async () => {

    /*Arrange *******************************************************************/
    const mockSetInventory = jest.fn();
    const today = new Date();
    const inventory : Inventory_Item[] = [
        {
            Inventory_Item_ID: 1,
            Inventory_Item_Name: 'Inventory Item 1',
            Inventory_Item_Date: today,
            Inventory_Item_Quantity: 1,
        },
        {
            Inventory_Item_ID: 2,
            Inventory_Item_Name: 'Inventory Item 2',
            Inventory_Item_Date: today,
            Inventory_Item_Quantity: 2,
        },
    ]; 

    const inventoryItem : Inventory_Item = {
        Inventory_Item_Name: 'Inventory Item 1',
        Inventory_Item_Date: today,
        Inventory_Item_Quantity: 1,
    };

    fetchMock.mockResponseOnce(JSON.stringify(
            {
                ...inventoryItem,
                Inventory_Item_ID: 3,
            },
        )
    );

    /*Act **********************************************************************/
    await addInventoryItemData(
        1,
        inventory,
        mockSetInventory,
        inventoryItem
    );

    /*Assert *******************************************************************/

    expect(fetchMock).toHaveBeenCalledWith(
        `https://${"192.168.50.183"}:${"5091"}/inventory/`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body : `{\"Inventory_Item_Name\":\"Inventory Item 1\",\"Inventory_Item_Date\":\"${today.toISOString().slice(0, 10)}\",\"Inventory_Item_Quantity\":1,\"User_ID\":1}`
        })
    expect(mockSetInventory).toHaveBeenCalledWith([
        ...inventory,
        {
            ...inventoryItem,
            Inventory_Item_ID: 3,
        },
    ]);
})
test("should not update state if fetch fails", async () => {
    /*Arrange *******************************************************************/
    const mockSetInventory = jest.fn();
    const inventory : Inventory_Item[] = [
        {
            Inventory_Item_ID: 1,
            Inventory_Item_Name: 'Inventory Item 1',
            Inventory_Item_Date: new Date(),
            Inventory_Item_Quantity: 1,
        },
        {
            Inventory_Item_ID: 2,
            Inventory_Item_Name: 'Inventory Item 2',
            Inventory_Item_Date: new Date(),
            Inventory_Item_Quantity: 2,
        },
    ]; 

    const inventoryItem : Inventory_Item = {
        Inventory_Item_Name: 'Inventory Item 1',
        Inventory_Item_Date: new Date(),
        Inventory_Item_Quantity: 1,
    };

    fetchMock.mockResponseOnce(
        "",
        {status: 500, statusText: "Internal Server Error"}
    );

    /*Act **********************************************************************/
    await addInventoryItemData(
        1,
        inventory,
        mockSetInventory,
        inventoryItem
    );

    /*Assert *******************************************************************/

    expect(mockSetInventory).not.toHaveBeenCalled();
});