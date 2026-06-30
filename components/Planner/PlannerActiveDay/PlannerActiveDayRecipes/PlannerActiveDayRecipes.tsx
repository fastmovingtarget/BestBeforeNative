//2026-06-30 : Icon for delete plan

//2026-06-18 : Added recipe search functionality

//2026-06-12 : Added ResizeComponent wrapper for height changes

//2026-06-01 : Using FadeComponent and RowContainer

//2025-11-21 : Moving common UI elements into their own folder

//2025-11-19 : Renamed RecipePlan/nner to just Planner, Recipe_Plan to just Plan

//2025-11-17 : Added recipe search, toggle button

//2025-10-31 : SetSelectedRecipe now links correctly

//2025-10-29 : Added dummy setSelectedRecipe

//2025-10-28 : Now uses devolved contexts

//2025-10-14 : Initial Implementation of Recipe Plan Page

import React, {useState} from 'react';
import { Keyboard } from 'react-native';
import ScrollableComponent from '@/ui/ScrollableComponent';

import Recipe from '@/Types/Recipe';
import Plan from '@/Types/Plan';
import RecipesListItem from '@/components/Recipes/RecipesList/RecipesListItem/RecipesListItem'; 
import { usePlans } from '@/Contexts/Plans/PlansDataProvider';
import { useRecipes } from '@/Contexts/Recipes/RecipesDataProvider';
import {RowContainer, ButtonView, LabelText, FormTextInput, ListView, ColumnContainer, FadeComponent} from '@/ui/BestBeforeUI';
import ResizeComponent from '@/ui/ResizeComponent';
import { DeleteIcon } from '@/ui/ReactIcon';

/**
 * React Component for displaying the list of recipes planned for the active day
 * Allows viewing ingredients for a selected recipe plan and adding new recipe plans for the day
 * @param date The date for which to display the planned recipes
 * @param setSelectedRecipePlan Function to set the selected recipe plan in the parent component
 * @returns React Component
 */

export default function PlanActiveDayRecipes({date, setSelectedPlan}: {date: Date, setSelectedPlan: (plan: Plan) => void}) {

    const { plans, addPlan, deletePlan } = usePlans();
    const { recipes } = useRecipes();
    const [recipesVisible, setRecipesVisible] = useState<boolean>(false);
    const [containerHeight, setContainerHeight] = useState<number>(0);
    const [recipesSearch, setRecipesSearch] = useState<string>('');

    //todo implement view Recipe Plan Ingredients

    const todayPlans = plans.filter((plan: Plan) => {
        const planDate = new Date(plan.Plan_Date);
        return planDate.getFullYear() === date.getFullYear() &&
               planDate.getMonth() === date.getMonth() &&
               planDate.getDate() === date.getDate();
    })

    //Behaviour, TODO: Define what happens when a recipe plan with inventory or shopping item attached is deleted
    //Suggestion: Have a dialogue popup warning the user that deleting this plan will also delete associated items, or have them choose to keep them

    return (
        <ColumnContainer style={{ flex: 1, width: "100%"}}>
            <ColumnContainer style={{width: "100%", justifyContent: "flex-start"}} onLayout={(event) => setContainerHeight(event.nativeEvent.layout.height)}>
                <ResizeComponent targetHeight={(containerHeight - 10)*(recipesVisible ? 0.3 : 1)} style={{ width: "100%"}}>
                    <FadeComponent >
                        <ScrollableComponent style={{justifyContent: 'flex-start', flexGrow: 1, margin:0}}>
                            {
                                todayPlans.length === 0 ?
                                <LabelText>
                                    No recipes planned for today!
                                </LabelText> :
                                todayPlans.map((plan: Plan) => {
                                    return (
                                        <RowContainer 
                                                style={{justifyContent: 'space-between', alignItems: 'center', width:"100%", marginVertical: 5}}
                                                key={`recipe-plan-${plan.Plan_ID}`}>
                                            <LabelText>
                                                {plan.Recipe_Name}
                                            </LabelText>
                                            <RowContainer style={{width: "42%"}}>
                                                <ButtonView onPress={() => setSelectedPlan(plan)} style={{marginRight: 5}}>
                                                    <LabelText>
                                                        Ingredients
                                                    </LabelText>
                                                </ButtonView>
                                                <ButtonView 
                                                    onPress={() => {
                                                        if(plan.Plan_ID !== undefined) 
                                                            deletePlan(plan.Plan_ID)
                                                    }}
                                                    style={{ width: "30%"}}>
                                                    <DeleteIcon/>
                                                </ButtonView>
                                            </RowContainer>
                                        </RowContainer>
                                    );
                                })
                            }
                        </ScrollableComponent> 
                    </FadeComponent>
                </ResizeComponent>
                <ResizeComponent targetHeight={(containerHeight - 10)*(recipesVisible ? 0.7 : 0.0)} style={{ width: "100%"}}>
                    <FadeComponent style={{ marginTop: 10, padding: 5, width:"100%"}}>
                        <FormTextInput
                            placeholder="Search Recipes..."
                            defaultValue=''
                            aria-label='recipe plan recipe search'
                            onChangeText={(text) => {
                                setRecipesSearch(text);
                            }}
                            style={{height: 40}}
                        />
                        <ListView style={{ width: '100%', margin: 0, padding:0}}>
                        {
                            recipes.filter((recipe: Recipe) => recipe.Recipe_Name.toLowerCase().includes(recipesSearch.toLowerCase())).map((recipe: Recipe) => 
                                <RecipesListItem 
                                    recipe={recipe}
                                    setSelectedRecipe={
                                        () => {
                                            addPlan({
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
                    </FadeComponent>
                </ResizeComponent>
            </ColumnContainer>
        
            
            <ButtonView onPress={() => {
                    Keyboard.dismiss();
                    setRecipesVisible(!recipesVisible);
                }} 
                style={{alignSelf: 'center', margin: 5, height: 45, width: "100%"}}
            >
                <LabelText >
                    {recipesVisible ? "That's Enough" : "Plan a Recipe"}
                </LabelText>
            </ButtonView>
            
        </ColumnContainer>
    )
}