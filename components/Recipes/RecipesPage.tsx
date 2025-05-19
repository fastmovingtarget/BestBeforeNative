import { useState } from "react"
import type Recipe from "@/Types/Recipe"
import PageView from "../PageView"
import RecipeForm from "./RecipeForm/RecipeForm"
import RecipesList from "./RecipesList/RecipesList"
import RecipesSearch from "./RecipesSearch/RecipesSearch"
import RecipeSelected from "./RecipeSelected/RecipeSelected"
import FormFieldContainer from "../FormFieldContainer"
import ComponentView from "../ComponentView"
import ButtonView from "../ButtonView"
import {Text} from "react-native"

export default function RecipesPage() {

    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
    const [isEditing, setIsEditing] = useState(false);

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
                        <ComponentView>
                            <FormFieldContainer>
                                <ButtonView onPress={() => setIsEditing(true)}>
                                    <Text>Edit Recipe</Text>
                                </ButtonView>
                                <ButtonView onPress={() => setIsEditing(true)}>
                                    <Text>Delete Recipe</Text>
                                </ButtonView>
                            </FormFieldContainer>
                        </ComponentView>
                        <RecipeSelected
                            recipe={selectedRecipe}
                        />
                    </>
                ) : (//otherwise, show the recipe search and recipe list
                    <>
                        <ComponentView>
                            <ButtonView onPress={() => setIsEditing(true)}>
                                <Text>Add New Recipe</Text>
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