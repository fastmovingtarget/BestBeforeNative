//2025-11-19 : Renamed "Ingredient" to "Inventory_Item"

interface Inventory_Item {
    Inventory_Item_ID?: number;
    Inventory_Item_Name: string | null;
    Inventory_Item_Date?: Date | null;
    Inventory_Item_Quantity?: number | null;
    Inventory_Item_Frozen?: Date | null;
    Plan_ID?: number | null;
    Plan_Date?: Date | null;
    Plan_Recipe_ID?: number | null;
    Plan_Recipe_Name?: string | null;
    Plan_Ingredient_ID?: number | null;
}

export interface InventorySearchOptions {
    searchText?: string;
    sortBy?: "Inventory_Item_Name" | "Inventory_Item_Date" | "Inventory_Item_Quantity";
    sortOrder?: "asc" | "desc";
    amount?: number;
}

export default Inventory_Item;