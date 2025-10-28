//2025-10-28 : Initial Recipe Plan Data Provider Implementation

import { createContext, useState, useContext, useEffect } from "react";

import { UpdateState, SyncState } from "@/Types/DataLoadingState";
import { getRecipePlansData } from "./GetRecipePlans";
import { deleteRecipePlanData } from "./DeleteRecipePlan";
import { addRecipePlanData } from "./AddRecipePlan";
import { updateRecipePlanData } from "./UpdateRecipePlan";
import { useAuthenticationData } from "../Authentication/AuthenticationDataProvider";
import Recipe_Plan from "@/Types/Recipe_Plan";

const RecipePlansDataContext = createContext({
    recipePlans: [] as Recipe_Plan[],
    recipePlansDataState: SyncState.Loading as SyncState | UpdateState,
    deleteRecipePlan: (recipePlanID: number) => {},
    addRecipePlan: (recipePlan: Recipe_Plan) => {},
    updateRecipePlan: (recipePlan: Recipe_Plan) => {},
});

export const RecipePlansDataProvider = ({children}:{children:React.ReactNode}) => {
    const [recipePlans, setRecipePlans] = useState<Recipe_Plan[]>([])
    const [recipePlansDataState, setRecipePlansDataState] = useState<UpdateState | SyncState>(SyncState.Loading)

    const {userId} = useAuthenticationData();
    useEffect(() => {
        if(recipePlansDataState === SyncState.Loading && userId){
            getRecipePlansData(userId, setRecipePlans).then((result) => setRecipePlansDataState(result));
        }
    }, [recipePlansDataState, userId]);

    const checkStartSync = (updateState : UpdateState) => {
        if(updateState === UpdateState.Successful){
            setRecipePlansDataState(SyncState.Loading);
        } else{
            setRecipePlansDataState(updateState);
        }
    }

    const deleteRecipePlan = (recipePlanID: number) => deleteRecipePlanData(recipePlans, setRecipePlans, recipePlanID).then((result) => checkStartSync(result));
    const addRecipePlan = (recipePlan: Recipe_Plan) => addRecipePlanData(userId, recipePlans, setRecipePlans, recipePlan).then((result) => checkStartSync(result));
    const updateRecipePlan = (recipePlan: Recipe_Plan) => updateRecipePlanData(recipePlans, setRecipePlans, recipePlan).then((result) => checkStartSync(result));

    return (
        <RecipePlansDataContext.Provider value={{
            recipePlans,
            recipePlansDataState,
            deleteRecipePlan,
            addRecipePlan,
            updateRecipePlan
        }}>
            {children}
        </RecipePlansDataContext.Provider>
    )
}

export const useRecipePlansData = () => {
    return useContext(RecipePlansDataContext);
}