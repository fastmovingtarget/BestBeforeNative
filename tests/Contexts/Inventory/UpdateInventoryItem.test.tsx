//2025-11-20 : Shifting test files into their own folder in the hierarchy

//2025-11-19 : Renamed Ingredients to Inventory

//2025-11-10 : Update now handles null date correctly

//2025-10-23 : Minor improvements to test formatting

//2025-10-22 : Removing server props from test criteria


import { updateInventoryItemData } from '../../../Contexts/Inventory/UpdateInventoryItem';
import Inventory_Item from '../../../Types/Inventory_Item'; // Adjust the import path as necessary
import fetchMock from 'jest-fetch-mock';
import { UpdateState } from '@/Types/DataLoadingState';
fetchMock.enableMocks();

// Mocking the fetch function
beforeEach(() => {
    fetchMock.resetMocks();
})

test('should fetch inventory data and update state', async () => {

    /*Arrange *******************************************************************/
    const mockSetInventory = jest.fn();
    const inventory : Inventory_Item[] = [
        {
            Inventory_Item_ID: 1,
            Inventory_Item_Name: 'Ingredient 1',
            Inventory_Item_Date: new Date(),
            Inventory_Item_Quantity: 1,
        },
        {
            Inventory_Item_ID: 2,
            Inventory_Item_Name: 'Ingredient 2',
            Inventory_Item_Date: new Date(),
            Inventory_Item_Quantity: 2,
        },
    ]; 

    const inventory_item_changed : Inventory_Item = {
        Inventory_Item_Name: 'Updated Ingredient 1',
        Inventory_Item_Date: new Date(),
        Inventory_Item_Quantity: 1,
        Inventory_Item_ID: 1,
    };

    fetchMock.mockResponseOnce(JSON.stringify(
            {
                ...inventory_item_changed,
                Inventory_Item_ID: 1,
            },
        ), {status: 200}
    );

    /*Act **********************************************************************/
    const updateInventoryState = await updateInventoryItemData(
        inventory,
        mockSetInventory,
        inventory_item_changed
    );

    /*Assert *******************************************************************/

    expect(mockSetInventory).toHaveBeenCalledWith([
        inventory_item_changed,
        inventory[1]
    ]);
    expect(updateInventoryState).toEqual(UpdateState.Successful);
})

test("should not update state if fetch fails", async () => {
    /*Arrange *******************************************************************/
    const mockSetInventory = jest.fn();
    const inventory : Inventory_Item[] = [
        {
            Inventory_Item_ID: 1,
            Inventory_Item_Name: 'Ingredient 1',
            Inventory_Item_Date: new Date(),
            Inventory_Item_Quantity: 1,
        },
        {
            Inventory_Item_ID: 2,
            Inventory_Item_Name: 'Ingredient 2',
            Inventory_Item_Date: new Date(),
            Inventory_Item_Quantity: 2,
        },
    ]; 

    const inventory_item_changed : Inventory_Item = {
        Inventory_Item_Name: 'Updated Ingredient 1',
        Inventory_Item_Date: new Date(),
        Inventory_Item_Quantity: 1,
        Inventory_Item_ID: 1,
    };

    fetchMock.mockResponseOnce(
        "",
        {status: 500, statusText: "Internal Server Error"}
    );

    /*Act **********************************************************************/
    const inventoryState = await updateInventoryItemData(
        inventory,
        mockSetInventory,
        inventory_item_changed
    );

    /*Assert *******************************************************************/

    expect(inventoryState).toEqual(UpdateState.Failed);
    expect(mockSetInventory).not.toHaveBeenCalled();
})
test("updates correctly when there is no date provided", async () => {
    /*Arrange *******************************************************************/
    const mockSetInventory = jest.fn();
    const inventory : Inventory_Item[] = [
        {
            Inventory_Item_ID: 1,
            Inventory_Item_Name: 'Ingredient 1',
            Inventory_Item_Date: new Date('2025-11-01'),
            Inventory_Item_Quantity: 1, 
        },
        {
            Inventory_Item_ID: 2,
            Inventory_Item_Name: 'Ingredient 2',
            Inventory_Item_Date: new Date(),
            Inventory_Item_Quantity: 2,
        },
    ];
    const inventory_item_changed : Inventory_Item = {
        Inventory_Item_Name: 'Updated Ingredient 1',
        Inventory_Item_Date: undefined,
        Inventory_Item_Quantity: 1,
        Inventory_Item_ID: 1,
    };
    fetchMock.mockResponseOnce(JSON.stringify(
            {
                ...inventory_item_changed,
                Inventory_Item_ID: 1,
            },
        ), {status: 200}
    );
    /*Act **********************************************************************/
    const updateInventoryState = await updateInventoryItemData(
        inventory,
        mockSetInventory,
        inventory_item_changed
    );
    /*Assert *******************************************************************/ 
    expect(mockSetInventory).toHaveBeenCalledWith([
        inventory_item_changed,
        inventory[1]
    ]);
    expect(updateInventoryState).toEqual(UpdateState.Successful);
    expect(fetchMock.mock.calls[0][1]?.body).toContain('"Inventory_Item_Date":null');//check that the date was set to today in the body
});