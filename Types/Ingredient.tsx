interface Ingredient {
    Ingredient_ID?: number | null;
    Ingredient_Name: string | null;
    Ingredient_Date?: Date | null;
    Ingredient_Quantity?: number | null;
    Ingredient_Frozen?: Date | null;
    Plan_ID?: number | null;
    Plan_Date?: Date | null;
    Recipe_ID?: number | null;
    Recipe_Name?: string | null;
    Recipe_Ingredient_ID?: number | null;
}

export default Ingredient;