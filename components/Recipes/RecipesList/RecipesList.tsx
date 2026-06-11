//2026-06-01 : FadeComponent handling, moved context bar

//2025-11-21 : Moving common UI elements into their own folder

//2025-10-20 : Switched to using recipes context, added key to stop list complaining

import React from "react";
import Recipe from "@/Types/Recipe";
import RecipesListItem from "./RecipesListItem/RecipesListItem";
import { useRecipes } from "@/Contexts/Recipes/RecipesDataProvider";
import { FadeComponent, ListView, ButtonView, LabelText } from "@/ui/BestBeforeUI";
import RecipesSearch from "../RecipesSearch/RecipesSearch";
import { MountState } from "@/ui/Types/MountState";

export default function RecipesList({ setSelectedRecipe, setIsEditing }: { setSelectedRecipe: (recipe: Recipe) => void, setIsEditing: (editing: boolean) => void }) {
    const { recipes } = useRecipes();
    const [mountState, setMountState] = React.useState<MountState>(MountState.Mount);

    const [selectedRecipe, setSelectedRecipeInternal] = React.useState<Recipe | null>(null);
    const [isEditing, setIsEditingInternal] = React.useState<boolean>(false);

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

    const selectRecipe = (recipe: Recipe) => {
        setSelectedRecipeInternal(recipe);
        setMountState(MountState.Unmount);
    }


    return (
        <FadeComponent 
            style={{backgroundColor:"transparent", flex:1, margin:0, padding:0}}
            aria-label="recipes-list-component"
            mountState={mountState}
            onUnmountAnimationEnd={onUnmountAnimationEnd}
        >
            <FadeComponent style={{flexDirection:"row"}}>
                <ButtonView onPress={() => {
                            setMountState(MountState.Unmount);
                            setIsEditingInternal(true)
                        }
                    } 
                    style={{flexGrow:1}}
                >
                    <LabelText>Add New Recipe</LabelText>
                </ButtonView>
            </FadeComponent>
            <RecipesSearch />
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