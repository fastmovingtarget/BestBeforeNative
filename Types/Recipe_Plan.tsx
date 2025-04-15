interface Recipe_Plan {
    Plan_ID : number;
    Plan_Date : Date;
    Recipe_ID : number;
    Recipe_Name : string;
    Plan_Ingredients : Plan_Ingredients[];
}

interface Plan_Ingredients extends Recipe_Ingredient{
    Ingredient_ID: number | null
    Item_ID: number | null
}