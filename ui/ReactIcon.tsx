//2026-07-01 : Adding Icons for Submit and Cancel

//2026-06-30 : Adding more subicons, changing some to MDI for consistency

//2026-06-30 : Adding Icons from material-design-icons

//2026-06-29 : Centralised React Icons for import

import {Ionicons} from '@react-native-vector-icons/ionicons';
import {MaterialDesignIcons} from '@react-native-vector-icons/material-design-icons';
import {Colours} from "@/constants/Colors";
import {RowContainer} from "@/ui/BestBeforeUI";

const defaultSize = 30;

export function BackIcon({size = defaultSize, color = Colours.text}: {size?: number, color?: string}) {
    return (
        <Ionicons name={"chevron-back"} size={size} color={color} style={{padding:5}} />
    );  
}   

export function EditIcon({size = defaultSize, color = Colours.text}: {size?: number, color?: string}) {
    return (
        <Ionicons name={"create-outline"} size={size} color={color} style={{padding:5}} />
    );  
}

export function DeleteIcon({size = defaultSize, color = Colours.text}: {size?: number, color?: string}) {
    return (
        <MaterialDesignIcons name={"trash-can-outline"} size={size} color={color} style={{padding:5}} />
    );  
}

export function ForwardIcon({size = defaultSize, color = Colours.text}: {size?: number, color?: string}) {
    return (
        <Ionicons name={"chevron-forward"} size={size} color={color} style={{padding:5}} />
    );  
}

export function WarningIcon({size = defaultSize, color = Colours.text}: {size?: number, color?: string}) {
    return (
        <MaterialDesignIcons name={"alert-outline"} size={size} color={color} style={{padding:5}} />
    );  
}

export function AddInventoryIcon({size = defaultSize, color = Colours.text, background = Colours.buttonBackground}: {size?: number, color?: string, background?: string}) {
    return (
        <RowContainer style={{padding:0, margin:0, justifyContent:"center", alignItems:"center", position:"relative", width:"auto"}}>
            <MaterialDesignIcons name={"fridge-outline"} size={size} color={color} style={{padding:5}} />
            <RowContainer style={{position:"absolute", right:3, bottom:3, padding:0, backgroundColor: background, height:"auto", width:"auto", borderRadius: "50%"}} >
                <MaterialDesignIcons name={"plus-thick"} size={size/2} color={color} />
            </RowContainer>
        </RowContainer>
    );  
}

export function AddShoppingListItemIcon({size = defaultSize, color = Colours.text, background = Colours.buttonBackground}: {size?: number, color?: string, background?: string}) {
    return (
        <RowContainer style={{padding:0, margin:0, justifyContent:"center", alignItems:"center", position:"relative", width:"auto"}}>
            <MaterialDesignIcons name={"basket-outline"} size={size} color={color} style={{padding:5}} />
            <RowContainer style={{position:"absolute", right:3, bottom:3, padding:0, backgroundColor: background, height:"auto", width:"auto", borderRadius: "50%"}} >
                <MaterialDesignIcons name={"plus-thick"} size={size/2} color={color} />
            </RowContainer>
        </RowContainer>
    );  
}

export function LinkInventoryItemIcon({size = defaultSize, color = Colours.text, background = Colours.buttonBackground}: {size?: number, color?: string, background?: string}) {
    return (
        <RowContainer style={{padding:0, margin:0, justifyContent:"center", alignItems:"center", position:"relative", width:"auto"}}>
            <MaterialDesignIcons name={"fridge-outline"} size={size} color={color} style={{padding:5}} />
            <RowContainer style={{position:"absolute", right:3, bottom:3, padding:0, backgroundColor: background, height:"auto", width:"auto", borderRadius: "50%"}} >
                <MaterialDesignIcons name={"link-variant"} size={size/2} color={color} />
            </RowContainer>
        </RowContainer>
    );  
}

export function InventoryIcon({size = defaultSize, color = Colours.text}: {size?: number, color?: string}) {
    return (
        <MaterialDesignIcons name={"fridge-outline"} size={size} color={color} style={{padding:5}} />
    );  
}

export function ShoppingListIcon({size = defaultSize, color = Colours.text}: {size?: number, color?: string}) {
    return (
        <MaterialDesignIcons name={"basket-outline"} size={size} color={color} style={{padding:5}} />
    );  
}

export function EditShoppingListIcon({size = defaultSize, color = Colours.text, background = Colours.buttonBackground}: {size?: number, color?: string, background?: string}) {
    return (
        <RowContainer style={{padding:0, margin:0, justifyContent:"center", alignItems:"center", position:"relative", width:"auto"}}>
            <MaterialDesignIcons name={"basket-outline"} size={size} color={color} style={{padding:5}} />
            <RowContainer style={{position:"absolute", right:3, bottom:3, padding:0, backgroundColor: background, height:"auto", width:"auto", borderRadius: "50%"}} >
                <MaterialDesignIcons name={"pencil"} size={size/2} color={color} />
            </RowContainer>
        </RowContainer>
    );    
}

export function EditInventoryItemIcon({size = defaultSize, color = Colours.text, background = Colours.buttonBackground}: {size?: number, color?: string, background?: string}) {
    return (
        <RowContainer style={{padding:0, margin:0, justifyContent:"center", alignItems:"center", position:"relative", width:"auto"}}>
            <MaterialDesignIcons name={"fridge-outline"} size={size} color={color} style={{padding:5}} />
            <RowContainer style={{position:"absolute", right:3, bottom:3, padding:0, backgroundColor: background, height:"auto", width:"auto", borderRadius: "50%"}} >
                <MaterialDesignIcons name={"pencil"} size={size/2} color={color} />
            </RowContainer>
        </RowContainer>
    );    
}

export function EditRecipeIcon({size = defaultSize, color = Colours.text, background = Colours.buttonBackground}: {size?: number, color?: string, background?: string}) {
    return (
        <RowContainer style={{padding:0, margin:0, justifyContent:"center", alignItems:"center", position:"relative", width:"auto"}}>
            <MaterialDesignIcons name={"pot-steam-outline"} size={size} color={color} style={{padding:5}} />
            <RowContainer style={{position:"absolute", right:3, bottom:3, padding:0, backgroundColor: background, height:"auto", width:"auto", borderRadius: "50%"}} >
                <MaterialDesignIcons name={"pencil"} size={size/2} color={color} />
            </RowContainer>
        </RowContainer>
    );    
}

export function AddRecipeIcon({size = defaultSize, color = Colours.text, background = Colours.buttonBackground}: {size?: number, color?: string, background?: string}) {
    return (
        <RowContainer style={{padding:0, margin:0, justifyContent:"center", alignItems:"center", position:"relative", width:"auto"}}>
            <MaterialDesignIcons name={"pot-steam-outline"} size={size} color={color} style={{padding:5}} />
            <RowContainer style={{position:"absolute", right:3, bottom:3, padding:0, backgroundColor: background, height:"auto", width:"auto", borderRadius: "50%"}} >
                <MaterialDesignIcons name={"plus-thick"} size={size/2} color={color} />
            </RowContainer>
        </RowContainer>
    );    
}

export function CancelIcon({size = defaultSize, color = Colours.text}: {size?: number, color?: string}) {
    return (
        <MaterialDesignIcons name={"backspace-outline"} size={size} color={color} style={{padding:5}} />
    );  
}

export function SubmitInventoryIcon({size = defaultSize, color = Colours.text, background = Colours.buttonBackground}: {size?: number, color?: string, background?: string}) {
    return (
        <RowContainer style={{padding:0, margin:0, justifyContent:"center", alignItems:"center", position:"relative", width:"auto"}}>
            <MaterialDesignIcons name={"fridge-outline"} size={size} color={color} style={{padding:5}} />
            <RowContainer style={{position:"absolute", right:3, bottom:3, padding:0, backgroundColor: background, height:"auto", width:"auto", borderRadius: "50%"}} >
                <MaterialDesignIcons name={"check-bold"} size={size/2} color={color} />
            </RowContainer>
        </RowContainer>
    );  
}

export function SubmitRecipeIcon({size = defaultSize, color = Colours.text, background = Colours.buttonBackground}: {size?: number, color?: string, background?: string}) {
    return (
        <RowContainer style={{padding:0, margin:0, justifyContent:"center", alignItems:"center", position:"relative", width:"auto"}}>
            <MaterialDesignIcons name={"pot-steam-outline"} size={size} color={color} style={{padding:5}} />
            <RowContainer style={{position:"absolute", right:3, bottom:3, padding:0, backgroundColor: background, height:"auto", width:"auto", borderRadius: "50%"}} >
                <MaterialDesignIcons name={"check-bold"} size={size/2} color={color} />
            </RowContainer>
        </RowContainer>
    );  
}

export function SubmitShoppingListIcon({size = defaultSize, color = Colours.text, background = Colours.buttonBackground}: {size?: number, color?: string, background?: string}) {
    return (
        <RowContainer style={{padding:0, margin:0, justifyContent:"center", alignItems:"center", position:"relative", width:"auto"}}>
            <MaterialDesignIcons name={"basket-outline"} size={size} color={color} style={{padding:5}} />
            <RowContainer style={{position:"absolute", right:3, bottom:3, padding:0, backgroundColor: background, height:"auto", width:"auto", borderRadius: "50%"}} >
                <MaterialDesignIcons name={"check-bold"} size={size/2} color={color} />
            </RowContainer>
        </RowContainer>
    );  
}