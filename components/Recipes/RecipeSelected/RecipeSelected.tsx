//2026-07-01 : Top page component sizing consistency

//2026-06-29 : Added Back/Edit/Delete icons

//2026-06-11 : Removed a console log

//2026-06-01 : FadeComponent handling, moved context bar

//2025-11-21 : Moving common UI elements into their own folder

//2025-11-19 : Ingredient_Name and Ingredient_Quantity now have Recipe_ prefix

//2025-10-20 : Removed unnecessary imports

import React from "react";
import Recipe from "@/Types/Recipe";
import { ScrollableContainer, LabelText, FadeComponent, RowContainer, ButtonView } from "@/ui/BestBeforeUI";
import { MountState } from "@/ui/Types/MountState";
import { BackIcon, DeleteIcon, EditRecipeIcon } from "@/ui/ReactIcon";

export default function RecipeSelected({recipe, setSelectedRecipe, setIsEditing, deleteRecipe}: { recipe: Recipe, setSelectedRecipe: (recipe: Recipe | null) => void, setIsEditing: (editing: boolean) => void, deleteRecipe: (id: number) => void }) {

    const [mountState, setMountState] = React.useState<MountState>(MountState.Mount);

    const [endSelectMethod, setEndSelectMethod] = React.useState<"Back" | "Delete" | "Edit" | "none">("none");

    const endSelectFunction = () => {
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
            style={{backgroundColor:"transparent", flex:1, margin:0, padding:0, justifyContent:"space-between"}}
            aria-label="recipe-selected-component"
            mountState={mountState}
            onUnmountAnimationEnd={() => endSelectFunction()}
            >
            <FadeComponent style={{flexGrow:0, marginTop:0}}>
                <RowContainer style={{justifyContent:"space-between", alignItems:"center", width:"100%"}}>
                    <ButtonView style={{flexGrow:1, margin:5, marginVertical: 8}} onPress={() => {setEndSelectMethod("Back"); setMountState(MountState.Unmount)}}>
                        <BackIcon />
                    </ButtonView>
                    <ButtonView style={{flexGrow:1, margin:5, marginVertical: 8}} onPress={() => {setEndSelectMethod("Edit"); setMountState(MountState.Unmount)}}>
                        <EditRecipeIcon />
                    </ButtonView>
                    <ButtonView style={{flexGrow:1, margin:5, marginVertical: 8}} onPress={() => {setEndSelectMethod("Delete"); setMountState(MountState.Unmount)}}>
                        <DeleteIcon />
                    </ButtonView>
                </RowContainer>
            </FadeComponent>
            <FadeComponent style={{flex:1, width:"100%", marginHorizontal:0, paddingHorizontal:0, marginBottom:0}}>
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