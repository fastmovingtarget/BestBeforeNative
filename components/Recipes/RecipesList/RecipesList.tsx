//2026-07-20 : Adding aria-label for iconised buttons
//2026-07-16 : Added function descriptions
//2026-07-01 : Putting Search and Add in same row

//2026-06-30 : Icon for Add New Recipe

//2026-06-11 : Improved vertical margins for consistency

//2026-06-01 : FadeComponent handling, moved context bar

//2025-11-21 : Moving common UI elements into their own folder

//2025-10-20 : Switched to using recipes context, added key to stop list complaining

import React from "react";
import Recipe from "@/Types/Recipe";
import RecipesListItem from "./RecipesListItem/RecipesListItem";
import { useRecipes } from "@/Contexts/Recipes/RecipesDataProvider";
import { FadeComponent, ListView, ButtonView, RowContainer } from "@/ui/BestBeforeUI";
import RecipesSearch from "../RecipesSearch/RecipesSearch";
import { MountState } from "@/ui/Types/MountState";
import { AddRecipeIcon } from "@/ui/ReactIcon";

/**
 * RecipesList component
 * @param setSelectedRecipe - Callback function to set the selected recipe in the parent component
 * @param setIsEditing - Callback function to set the editing state in the parent component
 * @returns A component that displays a list of recipes with options to search and add new recipes
 */
export default function RecipesList({ setSelectedRecipe, setIsEditing }: { setSelectedRecipe: (recipe: Recipe) => void, setIsEditing: (editing: boolean) => void }) {
    const { recipes } = useRecipes();
    const [mountState, setMountState] = React.useState<MountState>(MountState.Mount);

    const [selectedRecipe, setSelectedRecipeInternal] = React.useState<Recipe | null>(null);
    const [isEditing, setIsEditingInternal] = React.useState<boolean>(false);

    /**
     * Handles the end of the unmount animation. If a recipe was selected, it sets the selected recipe in the parent component. If the editing state was set, it sets the editing state in the parent component.
     * This function is called when the unmount animation ends, allowing for a smooth transition between components.
     */
    const onUnmountAnimationEnd = () => {
        if(isEditing) {
            setIsEditing(true);
        }
        else if(selectedRecipe) {
            setSelectedRecipe(selectedRecipe);
        }
        else {
            console.log("Warning: No action taken on unmount");
        }
    }

    /**
     * Sets the selected recipe in the internal state and triggers the unmount animation. This function is called when a recipe is selected from the list, allowing for a smooth transition to the recipe details view.
     * @param recipe - The recipe that was selected from the list
     */
    const selectRecipe = (recipe: Recipe) => {
        setSelectedRecipeInternal(recipe);
        setMountState(MountState.Unmount);
    }


    return (
        <FadeComponent 
            style={{backgroundColor:"transparent", flex:1, margin:0, marginVertical:0,  padding:0}}
            aria-label="recipes-list-component"
            mountState={mountState}
            onUnmountAnimationEnd={onUnmountAnimationEnd}
        >
            <FadeComponent style={{flexDirection:"row"}}>
                <RowContainer style={{justifyContent:"space-between", alignItems:"center", width:"100%"}}>
                    <RecipesSearch />
                    <ButtonView onPress={() => {
                                setMountState(MountState.Unmount);
                                setIsEditingInternal(true)
                            }
                        }
                        style={{margin : 5}}
                        aria-label="add-new-recipe-button"
                    >
                        <AddRecipeIcon />
                    </ButtonView>
                </RowContainer>
            </FadeComponent>
            <ListView>
                {recipes.map((recipe: Recipe) => (
                    <RecipesListItem
                        key={`recipe-list-item-${recipe.Recipe_ID}`}
                        recipe={recipe}
                        setSelectedRecipe={selectRecipe}
                    />
                ))}
            </ListView>
        </FadeComponent>
    );
}