//2026-07-01 : Pruning imports

//2026-06-01 : removed context bar

//2025-11-21 : Moving common UI elements into their own folder

//2025-10-20 : Changed to using recipes context

import { useState } from "react"
import type Recipe from "@/Types/Recipe"
import RecipeForm from "./RecipeForm/RecipeForm"
import RecipesList from "./RecipesList/RecipesList"
import RecipeSelected from "./RecipeSelected/RecipeSelected"
import { useRecipes } from "../../Contexts/Recipes/RecipesDataProvider";
import { PageView } from "@/ui/BestBeforeUI";

export default function RecipesPage() {

    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const {deleteRecipe} = useRecipes();    

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