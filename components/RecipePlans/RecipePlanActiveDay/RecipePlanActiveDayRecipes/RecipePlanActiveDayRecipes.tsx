//2025-10-31 : SetSelectedRecipe now links correctly

//2025-10-29 : Added dummy setSelectedRecipe

//2025-10-28 : Now uses devolved contexts

//2025-10-14 : Initial Implementation of Recipe Plan Page

import React from 'react';
import ScrollableComponent from '@/components/CustomComponents/ScrollableComponent';
import ListView from '@/components/CustomComponents/ListView';

import Recipe from '@/Types/Recipe';
import Recipe_Plan from '@/Types/Recipe_Plan';
import LabelText from '@/components/CustomComponents/LabelText';
import RecipesListItem from '@/components/Recipes/RecipesList/RecipesListItem/RecipesListItem'; 
import FormFieldContainer from '@/components/CustomComponents/FormFieldContainer';
import ButtonView from '@/components/CustomComponents/ButtonView';
import { useRecipePlans } from '@/Contexts/RecipePlans/RecipePlanDataProvider';
import { useRecipes } from '@/Contexts/Recipes/RecipesDataProvider';


export default function RecipePlanActiveDayRecipes({date, setSelectedRecipePlan}: {date: Date, setSelectedRecipePlan: (recipePlan: Recipe_Plan) => void}) {

    const { recipePlans, addRecipePlan, deleteRecipePlan } = useRecipePlans();
    const { recipes } = useRecipes();
    //todo implement view Recipe Plan Ingredients

    const todayRecipePlans = recipePlans.filter((plan: Recipe_Plan) => {
        const planDate = new Date(plan.Plan_Date);
        return planDate.getFullYear() === date.getFullYear() &&
               planDate.getMonth() === date.getMonth() &&
               planDate.getDate() === date.getDate();
    })

    return (
        <>
            <ScrollableComponent>
                {todayRecipePlans.map((plan: Recipe_Plan) => {
                    return (
                        <FormFieldContainer
                                key={`recipe-plan-${plan.Plan_ID}`}>
                            <LabelText>
                                {plan.Recipe_Name}
                            </LabelText>
                            <ButtonView onPress={() => setSelectedRecipePlan(plan)}>
                                <LabelText>
                                    View Ingredients
                                </LabelText>
                            </ButtonView>
                            <ButtonView onPress={() => {
                                if(plan.Plan_ID !== undefined) 
                                    deleteRecipePlan(plan.Plan_ID)
                                }}>
                                <LabelText>
                                    Remove
                                </LabelText>
                            </ButtonView>
                        </FormFieldContainer>
                    );
                })}
            </ScrollableComponent> 
            <ListView>
                {
                    recipes.map((recipe: Recipe) => 
                        <RecipesListItem 
                            recipe={recipe}
                            setSelectedRecipe={() => addRecipePlan({
                                Recipe_ID: recipe.Recipe_ID,
                                Recipe_Name: recipe.Recipe_Name,
                                Plan_Date: date,
                            })}
                            key={`recipe-${recipe.Recipe_ID}`}
                        />
                    )
                }
            </ListView>
        </>
    )
}