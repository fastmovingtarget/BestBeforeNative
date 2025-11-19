//2025-11-19 : Renamed RecipePlan(s) to just Plan(s)

//2025-11-10 : Renamed for sanity and consistency

//2025-10-28 : Making useContext fn more consistent with others

//2025-10-28 : Initial Recipe Plan Data Provider Implementation

import { createContext, useState, useContext, useEffect } from "react";

import { UpdateState, SyncState } from "@/Types/DataLoadingState";
import { getPlansData } from "./GetPlans";
import { deletePlanData } from "./DeletePlan";
import { addPlanData } from "./AddPlan";
import { updatePlanData } from "./UpdatePlan";
import { useAuthenticationData } from "../Authentication/AuthenticationDataProvider";
import Plan from "@/Types/Plan";

const PlansDataContext = createContext({
    plans: [] as Plan[],
    plansDataState: SyncState.Loading as SyncState | UpdateState,
    deletePlan: (planID: number) => {},
    addPlan: (plan: Plan) => {},
    updatePlan: (plan: Plan) => {},
});

export const PlansDataProvider = ({children}:{children:React.ReactNode}) => {
    const [plans, setPlans] = useState<Plan[]>([])
    const [plansDataState, setPlansDataState] = useState<UpdateState | SyncState>(SyncState.Loading)

    const {userId} = useAuthenticationData();
    useEffect(() => {
        if(plansDataState === SyncState.Loading && userId){
            getPlansData(userId, setPlans).then((result) => setPlansDataState(result));
        }
    }, [plansDataState, userId]);

    const checkStartSync = (updateState : UpdateState) => {
        if(updateState === UpdateState.Successful){
            setPlansDataState(SyncState.Loading);
        } else{
            setPlansDataState(updateState);
        }
    }

    const deletePlan = (planID: number) => deletePlanData(plans, setPlans, planID).then((result) => checkStartSync(result));
    const addPlan = (plan: Plan) => addPlanData(userId, plans, setPlans, plan).then((result) => checkStartSync(result));
    const updatePlan = (plan: Plan) => updatePlanData(plans, setPlans, plan).then((result) => checkStartSync(result));

    return (
        <PlansDataContext.Provider value={{
            plans,
            plansDataState,
            deletePlan,
            addPlan,
            updatePlan
        }}>
            {children}
        </PlansDataContext.Provider>
    )
}

export const usePlans = () => {
    return useContext(PlansDataContext);
}