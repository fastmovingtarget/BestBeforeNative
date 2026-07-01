//2026-07-01 : Icons for Cancel, Submit and Remove Ingredient

//2026-06-18 : Removed unused import

//2026-06-18 : Allow use of blank number input, validation for ingredients

//2026-06-17 : Added validation, tinkered with style

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
import { CancelIcon, DeleteIcon, SubmitRecipeIcon } from '@/ui/ReactIcon';

const emptyRecipe = {
    Recipe_Name: "",
    Recipe_Difficulty: undefined,
    Recipe_Time: undefined,
    Recipe_Ingredients: [],
    Recipe_Instructions: "",
}

export default function RecipeForm({inputRecipe = emptyRecipe, exitForm} : {inputRecipe?: Recipe, exitForm: () => void}) {

    const [currentRecipe, setCurrentRecipe] = React.useState<Recipe>(inputRecipe);
    const [mountState, setMountState] = React.useState<MountState>(MountState.Mount);
    const {addRecipe, updateRecipe} = useRecipes();

    const onSubmit = () => {
        if(!checkValidation())
            return;
        
        if(inputRecipe.Recipe_ID) {
            updateRecipe(currentRecipe);
        }
        else {
            addRecipe(currentRecipe);
        }
        setCurrentRecipe(emptyRecipe);
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
                Recipe_Ingredient_Quantity: undefined,
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
            return "Time cannot be empty";
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
            return "Difficulty cannot be empty";
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

    const validateRecipeIngredientName = (name: string) => {
        if(name.trim() === "") {
            return "Name cannot be empty";
        }
        return true;
    }

    const validateRecipeIngredientQuantity = (quantity: string) => {
        if(quantity.trim() === "" || quantity === null) {
            return "Quantity cannot be empty";
        }
        const quantityNumber = Number.parseInt(quantity, 10);
        if(isNaN(quantityNumber)) {
            return "Must be a number";
        }
        if(quantityNumber < 0) {
            return "Cannot be negative";
        }
        return true;
    }

    const checkValidation = () => {
        if(validateRecipeName(currentRecipe.Recipe_Name) !== true 
            || validateRecipeTime(currentRecipe.Recipe_Time?.toString() || "") !== true 
            || validateRecipeDifficulty(currentRecipe.Recipe_Difficulty?.toString() || "") !== true){
            return false;
        }
        if(currentRecipe.Recipe_Ingredients) {
            for(const ingredient of currentRecipe.Recipe_Ingredients) {
                if(validateRecipeIngredientName(ingredient.Recipe_Ingredient_Name) !== true 
                    || validateRecipeIngredientQuantity(ingredient.Recipe_Ingredient_Quantity?.toString() || "") !== true){
                    return false;
                }
            }
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
            <FadeComponent style={{flexGrow:0, marginTop:0}}>
                <RowContainer style={{padding:0, columnGap:10}}>
                    <ButtonView style={{flexGrow:1, margin: 5, marginVertical: 8}} onPress={onCancel}>
                        <CancelIcon />
                    </ButtonView>
                    <ButtonView style={{flexGrow:1, margin: 5, marginVertical: 8}} onPress={onSubmit}>
                        <SubmitRecipeIcon />
                    </ButtonView>
                </RowContainer>
            </FadeComponent>
            <FadeComponent style={{flex:1, width:"100%", marginHorizontal:0}}>
                <ScrollableContainer style={{justifyContent: "flex-start", width: "100%"}}>
                    <RowContainer style={{width: "100%"}}>
                        <FormTextInput
                            placeholder="Recipe Name"
                            aria-label="recipe-name"
                            onChangeText={(text) => {setCurrentRecipe({...currentRecipe, Recipe_Name: text})}}
                            defaultValue={currentRecipe.Recipe_Name || ""}
                            validationFunction={validateRecipeName}
                            style={{width: "100%"}}
                        />
                    </RowContainer>

                    <RowContainer style={{width: "100%", justifyContent: "space-between"}}>
                        <FormTextInput
                            placeholder="Time"
                            aria-label="recipe-time"
                            onChangeText={(text) => {setCurrentRecipe({...currentRecipe, Recipe_Time: text === "" ? undefined : Number.parseInt(text)})}}
                            defaultValue={currentRecipe.Recipe_Time?.toString() || ""}
                            inputMode="numeric"
                            validationFunction={validateRecipeTime}
                            style={{ width: "48.5%"}}
                        />
                        <FormTextInput
                            placeholder="Difficulty"
                            aria-label="recipe-difficulty"
                            onChangeText={(text) => {setCurrentRecipe({...currentRecipe, Recipe_Difficulty: text === "" ? undefined : Number.parseInt(text)})}}
                            defaultValue={currentRecipe.Recipe_Difficulty?.toString() || ""}
                            inputMode="numeric"
                            validationFunction={validateRecipeDifficulty}
                            style={{ width: "48.5%"}}
                        />
                    </RowContainer>

                    {currentRecipe.Recipe_Ingredients?.map((ingredient, index) => (
                        <RowContainer key={index} style={{width: "100%", justifyContent: "space-between"}}>
                            <FormTextInput
                                placeholder="Ingredient Name"
                                aria-label={`recipe-ingredient-name-${index}`}
                                onChangeText={(text) => {
                                    const newIngredients = [...currentRecipe.Recipe_Ingredients || []];
                                    newIngredients[index].Recipe_Ingredient_Name = text;
                                    setCurrentRecipe({...currentRecipe, Recipe_Ingredients: newIngredients});
                                }}
                                defaultValue={ingredient.Recipe_Ingredient_Name || ""}
                                validationFunction={validateRecipeIngredientName}
                                style={{width: "42%", height:57}}
                            />
                            <FormTextInput
                                placeholder="Ingredient Quantity"
                                aria-label={`recipe-ingredient-quantity-${index}`}
                                inputMode="numeric"
                                onChangeText={(text) => {
                                    const newIngredients = [...currentRecipe.Recipe_Ingredients || []];
                                    newIngredients[index].Recipe_Ingredient_Quantity = Number(text);
                                    setCurrentRecipe({...currentRecipe, Recipe_Ingredients: newIngredients});
                                }}
                                validationFunction={validateRecipeIngredientQuantity}
                                defaultValue={ingredient.Recipe_Ingredient_Quantity?.toString() || ""}
                                style={{width: "45%", height:57}}
                            />
                            <ButtonView 
                                onPress={() => deleteRecipeIngredient(index)}
                                aria-label={`recipe-ingredient-delete-${index}`}
                            >
                                <DeleteIcon />
                            </ButtonView>
                        </RowContainer>))
                    }

                    <RowContainer style={{alignContent: "center", justifyContent: "center", width: "100%", marginVertical: 10}}>
                        <ButtonView onPress={addNewRecipeIngredient} style={{flexGrow: 1}}>
                            <LabelText>Add Ingredient</LabelText>
                        </ButtonView>
                    </RowContainer>
                    
                    <RowContainer style={{width: "100%"}}>
                        <FormTextInput
                            placeholder="Enter recipe instructions..."
                            aria-label="recipe-instructions"
                            onChangeText={(text) => {setCurrentRecipe({...currentRecipe, Recipe_Instructions: text})}}
                            defaultValue={currentRecipe.Recipe_Instructions || ""}
                            style={{width: "100%", height: 100}}
                            multiline={true}
                            numberOfLines={5}
                        />
                    </RowContainer>
                </ScrollableContainer>
            </FadeComponent>
        </FadeComponent>
    )
}
