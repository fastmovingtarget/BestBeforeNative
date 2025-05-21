import { useState } from "react"
import type Recipe from "@/Types/Recipe"
import PageView from "../CustomComponents/PageView"
import RecipeForm from "./RecipeForm/RecipeForm"
import RecipesList from "./RecipesList/RecipesList"
import RecipesSearch from "./RecipesSearch/RecipesSearch"
import RecipeSelected from "./RecipeSelected/RecipeSelected"
import FormFieldContainer from "../CustomComponents/FormFieldContainer"
import ComponentView from "../CustomComponents/ComponentView"
import ButtonView from "../CustomComponents/ButtonView"
import LabelText from "../CustomComponents/LabelText"
import {Text} from "react-native"
import { useData } from "@/Contexts/DataProvider"

export default function RecipesPage() {

    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const {deleteRecipe} = useData();

    return (
        <PageView>
            {
                isEditing ? //if there's a selected recipe and we're editing it, show the form
                (
                    <RecipeForm
                        inputRecipe={selectedRecipe || undefined}
                        exitForm={() => {
                            setSelectedRecipe(null);
                            setIsEditing(false);
                        }}
                    />
                ) : (
                selectedRecipe && !isEditing ? (//if there's a selected recipe and we're not editing it, show the selected recipe
                    <>
                        <ComponentView style={{flexGrow:0}}>
                            <FormFieldContainer style={{padding:0, columnGap:10}}>
                                <ButtonView style={{flexGrow:1}} onPress={() => setSelectedRecipe(null)}>
                                    <LabelText>Back</LabelText>
                                </ButtonView>
                                <ButtonView style={{flexGrow:1}} onPress={() => setIsEditing(true)}>
                                    <LabelText>Edit Recipe</LabelText>
                                </ButtonView>
                                <ButtonView style={{flexGrow:1}} onPress={() => {setSelectedRecipe(null);deleteRecipe(selectedRecipe.Recipe_ID || -1)}}>
                                    <LabelText>Delete Recipe</LabelText>
                                </ButtonView>
                            </FormFieldContainer>
                        </ComponentView>
                        <RecipeSelected
                            recipe={selectedRecipe}
                        />
                    </>
                ) : (//otherwise, show the recipe search and recipe list
                    <>
                        <ComponentView style={{flexDirection:"row"}}>
                            <ButtonView onPress={() => setIsEditing(true)} style={{flexGrow:1}}>
                                <LabelText>Add New Recipe</LabelText>
                            </ButtonView>
                        </ComponentView>
                        <RecipesSearch />
                        <RecipesList setSelectedRecipe={setSelectedRecipe}/>
                    </>
                ))
            }
        </PageView>
    )
}