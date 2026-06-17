//2026-06-17 : Validation for Name, Time & Difficulty

//2026-06-10 : console.log removed

//2026-06-01 : Using FadeComponent and RowContainer

//2025-11-21 : Moving common UI elements into their own folder

//2025-11-19 : Ingredient_Name and Ingredient_Quantity now have Recipe_ prefix

//2025-10-20 : Switched to using Recipes Data Context

//Wed, May 21, 2025 11:23:24 AM : Switching Cancel and Submit buttons for consistency

import React from 'react';
import Recipe from '@/Types/Recipe';
import { useRecipes } from "@/Contexts/Recipes/RecipesDataProvider"
import Recipe_Ingredient from '@/Types/Recipe_Ingredient';
import {RowContainer, ButtonView, LabelText, FormTextInput, ScrollableContainer, FadeComponent} from '@/ui/BestBeforeUI';
import { MountState } from '@/ui/Types/MountState';

const blankRecipe = {
    Recipe_Name: "",
    Recipe_Difficulty: 0,
    Recipe_Time: 0,
    Recipe_Ingredients: [],
    Recipe_Instructions: "",
}

export default function RecipeForm({inputRecipe = blankRecipe, exitForm} : {inputRecipe?: Recipe, exitForm: () => void}) {

    const [currentRecipe, setCurrentRecipe] = React.useState<Recipe>(inputRecipe);
    const [mountState, setMountState] = React.useState<MountState>(MountState.Mount);
    const {addRecipe, updateRecipe} = useRecipes();

    const onSubmit = () => {
        if(validateRecipeName(currentRecipe.Recipe_Name) !== true || validateRecipeTime(currentRecipe.Recipe_Time?.toString() || "") !== true || validateRecipeDifficulty(currentRecipe.Recipe_Difficulty?.toString() || "") !== true){
            return;
        }
        if(inputRecipe.Recipe_ID) {
            updateRecipe(currentRecipe);
        }
        else {
            addRecipe(currentRecipe);
        }
        setCurrentRecipe(blankRecipe);
        setMountState(MountState.Unmount);
    }
    const onCancel = () => {
        setCurrentRecipe(inputRecipe);
        setMountState(MountState.Unmount);
    }
    const addNewRecipeIngredient = () => {
        const newIngredients = [
            ...(currentRecipe.Recipe_Ingredients || []),
            {
                Recipe_Ingredient_Name: "",
                Recipe_Ingredient_Quantity: 0,
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

    const exitFormWrapper = () => {
        exitForm();
    }

    const validateRecipeName = (name: string) => {
        if(name.trim() === "") {
            return "Recipe Name cannot be empty";
        }
        return true;
    }

    const validateRecipeTime = (time: string) => {
        if(time.trim() === "" || time === null) {
            return "Cannot be empty";
        }
        const timeNumber = Number.parseInt(time, 10);
        if(isNaN(timeNumber)) {
            return "Must be a number";
        }
        if(timeNumber < 0) {
            return "Cannot be negative";
        }
        return true;
    }

    const validateRecipeDifficulty = (difficulty: string) => {
        if(difficulty.trim() === "" || difficulty === null) {
            return "Cannot be empty";
        }
        const difficultyNumber = Number.parseInt(difficulty, 10);
        if(isNaN(difficultyNumber)) {
            return "Must be a number";
        }
        if(difficultyNumber < 0 || difficultyNumber > 5) {
            return "Must be between 0 and 5";
        }
        return true;
    }

    return (
        <FadeComponent 
            style={{backgroundColor:"transparent", flex:1, margin:0, padding:0}}
            aria-label="recipe-form-component"
            mountState={mountState}
            onUnmountAnimationEnd={() => {exitFormWrapper();}}
            >
            <FadeComponent style={{flexGrow:0}}>
                <RowContainer style={{padding:0, columnGap:10}}>
                    <ButtonView style={{flexGrow:1}} onPress={onCancel}>
                        <LabelText>Cancel</LabelText>
                    </ButtonView>
                    <ButtonView style={{flexGrow:1}} onPress={onSubmit}>
                        <LabelText>Submit</LabelText>
                    </ButtonView>
                </RowContainer>
            </FadeComponent>
            <FadeComponent style={{flex:1, width:"100%", marginHorizontal:0, paddingHorizontal:0}}>
                <ScrollableContainer style={{justifyContent: "flex-start", width: "100%"}}>
                    <RowContainer >
                        <LabelText>Recipe Name</LabelText>
                        <FormTextInput
                            placeholder="Enter recipe name"
                            aria-label="recipe-name"
                            onChangeText={(text) => {setCurrentRecipe({...currentRecipe, Recipe_Name: text})}}
                            defaultValue={currentRecipe.Recipe_Name || ""}
                            validationFunction={validateRecipeName}
                            style={{flexGrow: 1, width: "auto"}}
                        />
                    </RowContainer>

                    <RowContainer>
                        <LabelText>Recipe Time</LabelText>
                        <FormTextInput
                            placeholder="Enter recipe time"
                            aria-label="recipe-time"
                            onChangeText={(text) => {setCurrentRecipe({...currentRecipe, Recipe_Time: Number(text)})}}
                            defaultValue={currentRecipe.Recipe_Time?.toString() || "0"}
                            validationFunction={validateRecipeTime}
                            style={{flexGrow: 1, width: "auto"}}
                        />
                    </RowContainer>

                    <RowContainer>
                        <LabelText>Recipe Difficulty</LabelText>
                        <FormTextInput
                            placeholder="Enter recipe difficulty"
                            aria-label="recipe-difficulty"
                            onChangeText={(text) => {setCurrentRecipe({...currentRecipe, Recipe_Difficulty: Number(text)})}}
                            defaultValue={currentRecipe.Recipe_Difficulty?.toString() || "0"}
                            validationFunction={validateRecipeDifficulty}
                            style={{flexGrow: 1, width: "auto"}}
                        />
                    </RowContainer>

                    {currentRecipe.Recipe_Ingredients?.map((ingredient, index) => (
                        <RowContainer key={index}>
                            <FormTextInput
                                placeholder="Enter ingredient"
                                aria-label={`recipe-ingredient-name-${index}`}
                                onChangeText={(text) => {
                                    const newIngredients = [...currentRecipe.Recipe_Ingredients || []];
                                    newIngredients[index].Recipe_Ingredient_Name = text;
                                    setCurrentRecipe({...currentRecipe, Recipe_Ingredients: newIngredients});
                                }}
                                style={{flex: 1}}
                                defaultValue={ingredient.Recipe_Ingredient_Name || ""}
                            />
                            <FormTextInput
                                placeholder="Enter ingredient"
                                aria-label={`recipe-ingredient-quantity-${index}`}
                                inputMode="numeric"
                                onChangeText={(text) => {
                                    const newIngredients = [...currentRecipe.Recipe_Ingredients || []];
                                    newIngredients[index].Recipe_Ingredient_Quantity = Number(text);
                                    setCurrentRecipe({...currentRecipe, Recipe_Ingredients: newIngredients});
                                }}
                                style={{flex: 1}}
                                defaultValue={`${ingredient.Recipe_Ingredient_Quantity}` || ""}
                            />
                            <ButtonView 
                                onPress={() => deleteRecipeIngredient(index)}
                                aria-label={`recipe-ingredient-delete-${index}`}
                            >
                                <LabelText>X</LabelText>
                            </ButtonView>
                        </RowContainer>))
                    }

                    <RowContainer style={{alignContent: "center", justifyContent: "center", width: "100%"}}>
                        <ButtonView onPress={addNewRecipeIngredient} style={{flexGrow: 1}}>
                            <LabelText>Add Ingredient</LabelText>
                        </ButtonView>
                    </RowContainer>
                    <RowContainer style={{flexDirection: "column"}}>
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
                    </RowContainer>
                </ScrollableContainer>
            </FadeComponent>
        </FadeComponent>
    )
}