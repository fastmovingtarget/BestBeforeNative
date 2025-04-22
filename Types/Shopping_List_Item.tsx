interface Shopping_List_Item {
    Item_ID: number;
    Item_Name: string;
    Item_Quantity: number;
    Item_Recipe_Plan: number | null;
    Plan_Date: Date | null;
    Recipe_Name: string | null;
    Item_Recipe_Plan_Ingredient: number | null; 
}

export default Shopping_List_Item;