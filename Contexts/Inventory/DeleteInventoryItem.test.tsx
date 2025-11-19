//2025-11-19 : Renamed Ingredients to Inventory

//2025-10-23 : Minor improvements to test formatting

//2025-10-22 : Removing server props from test criteria

import { deleteInventoryItemData } from './DeleteInventoryItem';
import fetchMock from 'jest-fetch-mock';
import { UpdateState } from '@/Types/DataLoadingState';
import Inventory_Item from '../../Types/Inventory_Item';
fetchMock.enableMocks();

const today = new Date();
const inventoryItems : Inventory_Item[] = [
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

// Mocking the fetch function
beforeEach(() => {
    fetchMock.resetMocks();
})

test('should fetch inventory data and update state', async () => {

    /*Arrange *******************************************************************/
    const mockSetInventory = jest.fn();
    //input inventory items
    //output inventory items
    const inventoryItems_out : Inventory_Item[] = [
        {
            Inventory_Item_ID: 2,
            Inventory_Item_Name: 'Inventory Item 2',
            Inventory_Item_Date: today,
            Inventory_Item_Quantity: 2,
        },
    ]; 

    fetchMock.mockResponseOnce(
        "",
        {status: 204, statusText: "Inventory Item Deleted"}
    );

    /*Act **********************************************************************/
    const deleteStatus = await deleteInventoryItemData(
        inventoryItems,
        mockSetInventory,
        1
    );

    /*Assert *******************************************************************/
    expect(fetchMock).toHaveBeenCalledWith(
        `https://${"192.168.50.183"}:${"5091"}/inventory/1`,
        {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            }
        }
    );

    expect(mockSetInventory).toHaveBeenCalledWith(inventoryItems_out);
    expect(deleteStatus).toEqual(UpdateState.Successful);
})

test("should not update state if fetch fails", async () => {
    /*Arrange *******************************************************************/
    const mockSetInventory = jest.fn();

    fetchMock.mockResponseOnce(
        "",
        {status: 500, statusText: "Internal Server Error"}
    );

    /*Act **********************************************************************/
    const deleteStatus = await deleteInventoryItemData(
        inventoryItems,
        mockSetInventory,
        -1
    );

    /*Assert *******************************************************************/

    expect(mockSetInventory).not.toHaveBeenCalled();
    expect(deleteStatus).toEqual(UpdateState.Failed);
})