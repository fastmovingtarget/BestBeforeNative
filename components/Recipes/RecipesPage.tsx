//2026-08-11 : Added LoadingBar
//2026-07-16 : Added function descriptions
//2026-07-01 : Pruning imports

//2026-06-01 : removed context bar

//2025-11-21 : Moving common UI elements into their own folder

//2025-10-20 : Changed to using recipes context

import { useState } from "react";
import { SyncState, UpdateState } from "@/Types/DataLoadingState";
import type Recipe from "@/Types/Recipe"
import RecipeForm from "./RecipeForm/RecipeForm"
import RecipesList from "./RecipesList/RecipesList"
import RecipeSelected from "./RecipeSelected/RecipeSelected"
import { useRecipes } from "../../Contexts/Recipes/RecipesDataProvider";
import { PageView } from "@/ui/BestBeforeUI";
import LoadingBar from "@/ui/LoadingBar"

/**
 * RecipesPage component
 * The selected recipe and editing state are managed in the state of this component
 * @returns The main recipes page, which includes a list of recipes, a search bar, and the ability to view or edit a selected recipe
 */
export default function RecipesPage() {

    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const {deleteRecipe, recipesDataState} = useRecipes();    

    return (
        <PageView>
            <LoadingBar isLoading={recipesDataState === UpdateState.Loading || recipesDataState === SyncState.Loading} />
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
                    <RecipeSelected
                        setIsEditing={setIsEditing}
                        setSelectedRecipe={setSelectedRecipe}
                        deleteRecipe={deleteRecipe}
                        recipe={selectedRecipe}
                    />
                ) : (//otherwise, show the recipe search and recipe list
                    <RecipesList setSelectedRecipe={setSelectedRecipe} setIsEditing={setIsEditing} />               
                ))
            }
        </PageView>
    )
}