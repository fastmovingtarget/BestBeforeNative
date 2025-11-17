//2025-11-17 : Added recipe search, toggle button

//2025-10-31 : SetSelectedRecipe now links correctly

//2025-10-29 : Added dummy setSelectedRecipe

//2025-10-28 : Now uses devolved contexts

//2025-10-14 : Initial Implementation of Recipe Plan Page

import React, {useState} from 'react';
import ScrollableComponent from '@/components/CustomComponents/ScrollableComponent';
import ListView from '@/components/CustomComponents/ListView';

import Recipe from '@/Types/Recipe';
import Recipe_Plan from '@/Types/Recipe_Plan';
import LabelText from '@/components/CustomComponents/LabelText';
import RecipesListItem from '@/components/Recipes/RecipesList/RecipesListItem/RecipesListItem'; 
import FormFieldContainer from '@/components/CustomComponents/FormFieldContainer';
import ButtonView from '@/components/CustomComponents/ButtonView';
import { useRecipePlans } from '@/Contexts/RecipePlans/RecipePlansDataProvider';
import { useRecipes } from '@/Contexts/Recipes/RecipesDataProvider';
import FormTextInput from '@/components/CustomComponents/FormTextInput';
import ComponentView from '@/components/CustomComponents/ComponentView';
import { View } from 'react-native';

/**
 * React Component for displaying the list of recipes planned for the active day
 * Allows viewing ingredients for a selected recipe plan and adding new recipe plans for the day
 * @param date The date for which to display the planned recipes
 * @param setSelectedRecipePlan Function to set the selected recipe plan in the parent component
 * @returns React Component
 */

export default function RecipePlanActiveDayRecipes({date, setSelectedRecipePlan}: {date: Date, setSelectedRecipePlan: (recipePlan: Recipe_Plan) => void}) {

    const { recipePlans, addRecipePlan, deleteRecipePlan } = useRecipePlans();
    const { recipes } = useRecipes();
    const [recipesVisible, setRecipesVisible] = useState<boolean>(false);

    //todo implement view Recipe Plan Ingredients

    const todayRecipePlans = recipePlans.filter((plan: Recipe_Plan) => {
        const planDate = new Date(plan.Plan_Date);
        return planDate.getFullYear() === date.getFullYear() &&
               planDate.getMonth() === date.getMonth() &&
               planDate.getDate() === date.getDate();
    })

    return (
        <View>
            <ScrollableComponent style={{maxHeight: 300, width: '100%', flex: 1}}>
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
            {
                recipesVisible && (
                    <ComponentView style={{flex: 1, borderWidth: 1, borderColor: 'gray', marginTop: 10, padding: 5, width: '100%'}}>
                        <FormTextInput
                            placeholder="Search Recipes"
                            defaultValue=''
                            aria-label='recipe plan recipe search'
                            onChangeText={(text) => {
                                // Implement search functionality
                            }}
                            style={{flex:1}}
                        />
                        <ListView style={{borderWidth: 1, borderColor: 'black', width: '100%', margin: 0, padding:0}}>
                        {
                            recipes.map((recipe: Recipe) => 
                                <RecipesListItem 
                                    recipe={recipe}
                                    setSelectedRecipe={
                                        () => {
                                            addRecipePlan({
                                                Recipe_ID: recipe.Recipe_ID,
                                                Recipe_Name: recipe.Recipe_Name,
                                                Plan_Date: date,
                                            });
                                        }
                                    }
                                    key={`recipe-${recipe.Recipe_ID}`}
                                />  
                            )
                        }
                        </ListView>
                    </ComponentView>
                )
            }
            <ButtonView onPress={() => setRecipesVisible(!recipesVisible)}>
                <LabelText>
                    {recipesVisible ? "That's Enough" : "Plan a Recipe"}
                </LabelText>
            </ButtonView>
            
        </View>
    )
}