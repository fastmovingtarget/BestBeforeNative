//2026-06-01 : FadeComponent handling, moved context bar

//2025-11-21 : Moving common UI elements into their own folder

//2025-11-19 : Ingredient_Name and Ingredient_Quantity now have Recipe_ prefix

//2025-10-20 : Removed unnecessary imports

import React from "react";
import Recipe from "@/Types/Recipe";
import { ScrollableContainer, LabelText, FadeComponent, RowContainer, ButtonView } from "@/ui/BestBeforeUI";
import { MountState } from "@/ui/Types/MountState";

export default function RecipeSelected({recipe, setSelectedRecipe, setIsEditing, deleteRecipe}: { recipe: Recipe, setSelectedRecipe: (recipe: Recipe | null) => void, setIsEditing: (editing: boolean) => void, deleteRecipe: (id: number) => void }) {

    const [mountState, setMountState] = React.useState<MountState>(MountState.Mount);

    const [endSelectMethod, setEndSelectMethod] = React.useState<"Back" | "Delete" | "Edit" | "none">("none");

    const endSelectFunction = () => {
        console.log("End select function called with method:", endSelectMethod);
        if(endSelectMethod === "Back") {
            setSelectedRecipe(null);
        }
        else if(endSelectMethod === "Edit") {
            setIsEditing(true);
        }
        else if(endSelectMethod === "Delete") {
            if(recipe.Recipe_ID) {
                deleteRecipe(recipe.Recipe_ID);
            }
            setSelectedRecipe(null);
        }
    }


    return (
        <FadeComponent 
            style={{backgroundColor:"transparent", flex:1, margin:0, padding:0}}
            aria-label="recipe-selected-component"
            mountState={mountState}
            onUnmountAnimationEnd={() => endSelectFunction()}
            >
            <FadeComponent style={{flexGrow:0}}>
                <RowContainer style={{padding:0, columnGap:10}}>
                    <ButtonView style={{flexGrow:1}} onPress={() => {setEndSelectMethod("Back"); setMountState(MountState.Unmount)}}>
                        <LabelText>Back</LabelText>
                    </ButtonView>
                    <ButtonView style={{flexGrow:1}} onPress={() => {setEndSelectMethod("Edit"); setMountState(MountState.Unmount)}}>
                        <LabelText>Edit Recipe</LabelText>
                    </ButtonView>
                    <ButtonView style={{flexGrow:1}} onPress={() => {setEndSelectMethod("Delete"); setMountState(MountState.Unmount)}}>
                        <LabelText>Delete Recipe</LabelText>
                    </ButtonView>
                </RowContainer>
            </FadeComponent>
            <FadeComponent style={{flex:1, width:"100%", marginHorizontal:0, paddingHorizontal:0}}>
                <ScrollableContainer style={{ width:"100%"}}>
                    <LabelText >{recipe.Recipe_Name}</LabelText>
                    <LabelText >Time: {recipe.Recipe_Time} min</LabelText>
                    <LabelText >Difficulty: {recipe.Recipe_Difficulty}</LabelText>
                    <LabelText >Ingredients:</LabelText>
                    {recipe.Recipe_Ingredients?.map((ingredient) => (
                        <LabelText key={ingredient.Recipe_Ingredient_ID}>
                            {ingredient.Recipe_Ingredient_Name}: {ingredient.Recipe_Ingredient_Quantity}
                        </LabelText>
                    ))}
                    <LabelText >Instructions:</LabelText>
                    <LabelText >{recipe.Recipe_Instructions}</LabelText>
                </ScrollableContainer>
            </FadeComponent>
        </FadeComponent>
    );
}