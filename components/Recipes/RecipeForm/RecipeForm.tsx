//2025-10-20 : Switched to using Recipes Data Context

//Wed, May 21, 2025 11:23:24 AM : Switching Cancel and Submit buttons for consistency

import React from 'react';
import LabelText from '@/components/CustomComponents/LabelText';
import FormFieldContainer from '@/components/CustomComponents/FormFieldContainer';
import FormTextInput from '@/components/CustomComponents/FormTextInput';
import ScrollableComponent from '@/components/CustomComponents/ScrollableComponent';
import ButtonView from '@/components/CustomComponents/ButtonView';
import Recipe from '@/Types/Recipe';
import { useRecipes } from "@/Contexts/Recipes/RecipesDataProvider"
import Recipe_Ingredient from '@/Types/Recipe_Ingredient';
import ComponentView from '@/components/CustomComponents/ComponentView';

const blankRecipe = {
    Recipe_Name: "",
    Recipe_Difficulty: 0,
    Recipe_Time: 0,
    Recipe_Ingredients: [],
    Recipe_Instructions: "",
}

export default function RecipeForm({inputRecipe = blankRecipe, exitForm} : {inputRecipe?: Recipe, exitForm: () => void}) {

    const [currentRecipe, setCurrentRecipe] = React.useState<Recipe>(inputRecipe);
    const {addRecipe, updateRecipe} = useRecipes();

    const onSubmit = () => {
        if(inputRecipe.Recipe_ID) {
            updateRecipe(currentRecipe);
        }
        else {
            addRecipe(currentRecipe);
        }
        setCurrentRecipe(blankRecipe);
        exitForm();
    }
    const onCancel = () => {
        setCurrentRecipe(inputRecipe);
        exitForm();
    }
    const addNewRecipeIngredient = () => {
        const newIngredients = [
            ...(currentRecipe.Recipe_Ingredients || []),
            {
                Ingredient_Name: "",
                Ingredient_Quantity: 0,
            } as Recipe_Ingredient
        ];
        setCurrentRecipe({
            ...currentRecipe,
            Recipe_Ingredients: newIngredients,
        });
    }

    const deleteRecipeIngredient = (index: number) => {
        const newIngredients = [...(currentRecipe.Recipe_Ingredients || [])];
        newIngredients.splice(index, 1);
        setCurrentRecipe({
            ...currentRecipe,
            Recipe_Ingredients: newIngredients,
        });
    }

    return (
        <>
            <ComponentView style={{flexGrow:0}}>
                <FormFieldContainer style={{padding:0, columnGap:10}}>
                    <ButtonView style={{flexGrow:1}} onPress={onCancel}>
                        <LabelText>Cancel</LabelText>
                    </ButtonView>
                    <ButtonView style={{flexGrow:1}} onPress={onSubmit}>
                        <LabelText>Submit</LabelText>
                    </ButtonView>
                </FormFieldContainer>
            </ComponentView>
            <ScrollableComponent style={{justifyContent: "flex-start"}}>
                <FormFieldContainer>
                    <LabelText>Recipe Name</LabelText>
                    <FormTextInput
                        placeholder="Enter recipe name"
                        aria-label="recipe-name"
                        onChangeText={(text) => {setCurrentRecipe({...currentRecipe, Recipe_Name: text})}}
                        defaultValue={currentRecipe.Recipe_Name || ""}
                        style={{flexGrow: 1, width: "auto"}}
                    />
                </FormFieldContainer>

                <FormFieldContainer>
                    <LabelText>Recipe Time</LabelText>
                    <FormTextInput
                        placeholder="Enter recipe time"
                        aria-label="recipe-time"
                        onChangeText={(text) => {setCurrentRecipe({...currentRecipe, Recipe_Time: Number(text)})}}
                        defaultValue={currentRecipe.Recipe_Time?.toString() || "0"}
                        style={{flexGrow: 1, width: "auto"}}
                    />
                </FormFieldContainer>

                <FormFieldContainer>
                    <LabelText>Recipe Difficulty</LabelText>
                    <FormTextInput
                        placeholder="Enter recipe difficulty"
                        aria-label="recipe-difficulty"
                        onChangeText={(text) => {setCurrentRecipe({...currentRecipe, Recipe_Difficulty: Number(text)})}}
                        defaultValue={currentRecipe.Recipe_Difficulty?.toString() || "0"}
                        style={{flexGrow: 1, width: "auto"}}
                    />
                </FormFieldContainer>

                {currentRecipe.Recipe_Ingredients?.map((ingredient, index) => (
                    <FormFieldContainer key={index}>
                        <FormTextInput
                            placeholder="Enter ingredient"
                            aria-label={`recipe-ingredient-name-${index}`}
                            onChangeText={(text) => {
                                const newIngredients = [...currentRecipe.Recipe_Ingredients || []];
                                newIngredients[index].Ingredient_Name = text;
                                setCurrentRecipe({...currentRecipe, Recipe_Ingredients: newIngredients});
                            }}
                            style={{flex: 1}}
                            defaultValue={ingredient.Ingredient_Name || ""}
                        />
                        <FormTextInput
                            placeholder="Enter ingredient"
                            aria-label={`recipe-ingredient-quantity-${index}`}
                            inputMode="numeric"
                            onChangeText={(text) => {
                                const newIngredients = [...currentRecipe.Recipe_Ingredients || []];
                                newIngredients[index].Ingredient_Quantity = Number(text);
                                setCurrentRecipe({...currentRecipe, Recipe_Ingredients: newIngredients});
                            }}
                            style={{flex: 1}}
                            defaultValue={`${ingredient.Ingredient_Quantity}` || ""}
                        />
                        <ButtonView 
                            onPress={() => deleteRecipeIngredient(index)}
                            aria-label={`recipe-ingredient-delete-${index}`}
                        >
                            <LabelText>X</LabelText>
                        </ButtonView>
                    </FormFieldContainer>))
                }

                <FormFieldContainer style={{alignContent: "center", justifyContent: "center", width: "100%"}}>
                    <ButtonView onPress={addNewRecipeIngredient} style={{flexGrow: 1}}>
                        <LabelText>Add Ingredient</LabelText>
                    </ButtonView>
                </FormFieldContainer>

                <FormFieldContainer style={{flexDirection: "column"}}>
                    <LabelText>Recipe Instructions</LabelText>
                    <FormTextInput
                        placeholder="Enter recipe instructions"
                        aria-label="recipe-instructions"
                        onChangeText={(text) => {setCurrentRecipe({...currentRecipe, Recipe_Instructions: text})}}
                        defaultValue={currentRecipe.Recipe_Instructions || ""}
                        style={{width: "auto", flexGrow: 1}}
                        multiline={true}
                        numberOfLines={4}
                    />
                </FormFieldContainer>
            </ScrollableComponent>
        </>
    )
}