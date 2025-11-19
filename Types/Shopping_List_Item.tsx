//2025-11-19 : Item_... fields now have Shopping_ as a prefix

//2025-05-27 : Adding Shopping List Search Options

interface Shopping_List_Item {
    Shopping_Item_ID?: number;
    Shopping_Item_Name: string;
    Shopping_Item_Quantity: number;
    Plan_ID?: number | null;
    Plan_Date?: Date | null;
    Plan_Recipe_Name?: string | null;
    Plan_Ingredient_ID?: number | null; 
}

export interface ShoppingListSearchOptions {
    searchString?: string;
    sortBy?: "Shopping_Item_Name" | "Shopping_Item_Quantity";
    sortOrder?: "asc" | "desc";
    amount?: number;
}


export default Shopping_List_Item;