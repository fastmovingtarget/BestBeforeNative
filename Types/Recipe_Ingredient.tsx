//2025-11-19 : Ingredient_Name and Ingredient_Quantity now have Recipe_ prefix

interface Recipe_Ingredient {
    Recipe_Ingredient_ID: number;
    Recipe_Ingredient_Name : string;
    Recipe_Ingredient_Quantity: number;
}

export default Recipe_Ingredient;