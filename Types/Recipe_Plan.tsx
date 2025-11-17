//2025-11-17 : Plan_Ingredient type name should not have been pluralised

//2025-10-14 : Initial Implementation of Recipe Plan Page

import Recipe_Ingredient from "./Recipe_Ingredient";

interface Recipe_Plan {
    Plan_ID? : number;
    Plan_Date : Date;
    Recipe_ID? : number;
    Recipe_Name : string;
    Plan_Ingredients? : Plan_Ingredient[];
}

interface Plan_Ingredient extends Recipe_Ingredient{
    Ingredient_ID?: number | null | undefined,
    Item_ID?: number | null | undefined
}

export default Recipe_Plan;
export {Plan_Ingredient};