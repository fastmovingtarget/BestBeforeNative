//2025-10-14 : Initial Implementation of Recipe Plan Page

import React from 'react';
import ScrollableComponent from '@/components/CustomComponents/ScrollableComponent';
import ListView from '@/components/CustomComponents/ListView';

import { useData } from '@/Contexts/DataProvider';
import Recipe from '@/Types/Recipe';
import Recipe_Plan from '@/Types/Recipe_Plan';
import ComponentView from '@/components/CustomComponents/ComponentView';
import LabelText from '@/components/CustomComponents/LabelText';
import RecipesListItem from '@/components/Recipes/RecipesList/RecipesListItem/RecipesListItem';
import FormFieldContainer from '@/components/CustomComponents/FormFieldContainer';
import ButtonView from '@/components/CustomComponents/ButtonView';




export default function RecipePlanActiveDayRecipes({date}: {date: Date}) {

    const { recipePlans, recipes, addRecipePlan, deleteRecipePlan } = useData();

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
                            <ButtonView onPress={() => {}}>
                                <LabelText>
                                    View Ingredients
                                </LabelText>
                            </ButtonView>
                            <ButtonView onPress={() => deleteRecipePlan(plan.Plan_ID)}>
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