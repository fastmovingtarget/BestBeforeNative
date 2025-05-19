import React from 'react';
import LabelText from '@/components/LabelText';
import FormFieldContainer from '@/components/FormFieldContainer';
import FormTextInput from '@/components/FormTextInput';
import ScrollableComponent from '@/components/ScrollableComponent';
import ButtonView from '@/components/ButtonView';
import Recipe from '@/Types/Recipe';
import { useData } from '@/Contexts/DataProvider';
import { Button } from 'react-native';
import Recipe_Ingredient from '@/Types/Recipe_Ingredient';

const blankRecipe = {
    Recipe_Name: "",
    Recipe_Difficulty: 0,
    Recipe_Time: 0,
    Recipe_Ingredients: [],
    Recipe_Instructions: "",
}

export default function RecipeForm({inputRecipe = blankRecipe, exitForm} : {inputRecipe?: Recipe, exitForm: () => void}) {

    const [currentRecipe, setCurrentRecipe] = React.useState<Recipe>(inputRecipe);
    const {addRecipe, updateRecipe} = useData();

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
        <ScrollableComponent>
            <FormFieldContainer>
                <LabelText>Recipe Name</LabelText>
                <FormTextInput
                    placeholder="Enter recipe name"
                    aria-label="recipe-name"
                    onChangeText={(text) => {setCurrentRecipe({...currentRecipe, Recipe_Name: text})}}
                    defaultValue={currentRecipe.Recipe_Name}
                />
            </FormFieldContainer>

            <FormFieldContainer>
                <LabelText>Recipe Time</LabelText>
                <FormTextInput
                    placeholder="Enter recipe time"
                    aria-label="recipe-time"
                    onChangeText={(text) => {setCurrentRecipe({...currentRecipe, Recipe_Time: Number(text)})}}
                    defaultValue={currentRecipe.Recipe_Time.toString()}
                />
            </FormFieldContainer>

            <FormFieldContainer>
                <LabelText>Recipe Difficulty</LabelText>
                <FormTextInput
                    placeholder="Enter recipe difficulty"
                    aria-label="recipe-difficulty"
                    onChangeText={(text) => {setCurrentRecipe({...currentRecipe, Recipe_Difficulty: Number(text)})}}
                    defaultValue={currentRecipe.Recipe_Difficulty.toString()}
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

            <ButtonView onPress={addNewRecipeIngredient}>
                <LabelText>Add Ingredient</LabelText>
            </ButtonView>

            <FormFieldContainer>
                <LabelText>Recipe Instructions</LabelText>
                <FormTextInput
                    placeholder="Enter recipe instructions"
                    aria-label="recipe-instructions"
                    onChangeText={(text) => {setCurrentRecipe({...currentRecipe, Recipe_Instructions: text})}}
                    defaultValue={currentRecipe.Recipe_Instructions || ""}
                />
            </FormFieldContainer>
            <FormFieldContainer>
                <ButtonView onPress={onSubmit}>
                    <LabelText>Submit</LabelText>
                </ButtonView>
                <ButtonView onPress={onCancel}>
                    <LabelText>Cancel</LabelText>
                </ButtonView>
            </FormFieldContainer>
        </ScrollableComponent>
    )
}