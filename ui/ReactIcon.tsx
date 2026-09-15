//2026-09-15 : Colours now sourced from ColourProvider
//2026-07-21 : Added aria-label to star and outline-star icons
//2026-07-21 : Added stars and star outlines
//2026-07-16 : Added function descriptions
//2026-07-01 : Adding Icons for Submit and Cancel

//2026-06-30 : Adding more subicons, changing some to MDI for consistency

//2026-06-30 : Adding Icons from material-design-icons

//2026-06-29 : Centralised React Icons for import

import {Ionicons} from '@react-native-vector-icons/ionicons';
import {MaterialDesignIcons} from '@react-native-vector-icons/material-design-icons';
import { useColourData } from "@/Contexts/Colours/ColourDataProvider";
import {RowContainer} from "@/ui/BestBeforeUI";

const defaultSize = 30;

/**
 * Library of React icons for use in the app. Each icon is a functional component that returns a JSX element representing the icon.
 * @param {number} size - Optional size of the icon. Default is 30.
 * @param {string} color - Optional color of the icon. Default is Colours.text.
 * @param {string} background - Optional background color for icons with sub-icons. Default is Colours.buttonBackground.
 * @returns {JSX.Element} A React component that renders the specified icon with the given size and color.
 */

export function BackIcon({size = defaultSize, color}: {size?: number, color?: string}) {
    const {colours} = useColourData();
    color = color ?? colours.text;
    return (
        <Ionicons name={"chevron-back"} size={size} color={color} style={{padding:5}} />
    );  
}   

export function EditIcon({size = defaultSize, color}: {size?: number, color?: string}) {
    const {colours} = useColourData();
    color = color ?? colours.text;
    return (
        <Ionicons name={"create-outline"} size={size} color={color} style={{padding:5}} />
    );  
}

export function DeleteIcon({size = defaultSize, color}: {size?: number, color?: string}) {
    const {colours} = useColourData();
    color = color ?? colours.text;
    return (
        <MaterialDesignIcons name={"trash-can-outline"} size={size} color={color} style={{padding:5}} />
    );  
}

export function ForwardIcon({size = defaultSize, color}: {size?: number, color?: string}) {
    const {colours} = useColourData();
    color = color ?? colours.text;
    return (
        <Ionicons name={"chevron-forward"} size={size} color={color} style={{padding:5}} />
    );  
}

export function WarningIcon({size = defaultSize, color}: {size?: number, color?: string}) {
    const {colours} = useColourData();
    color = color ?? colours.text;
    return (
        <MaterialDesignIcons name={"alert-outline"} size={size} color={color} style={{padding:5}} />
    );  
}

export function AddInventoryIcon({size = defaultSize, color, background}: {size?: number, color?: string, background?: string}) {
    const {colours} = useColourData();
    color = color ?? colours.text;
    background = background ?? colours.buttonBackground;
    return (
        <RowContainer style={{padding:0, margin:0, justifyContent:"center", alignItems:"center", position:"relative", width:"auto"}}>
            <MaterialDesignIcons name={"fridge-outline"} size={size} color={color} style={{padding:5}} />
            <RowContainer style={{position:"absolute", right:3, bottom:3, padding:0, backgroundColor: background, height:"auto", width:"auto", borderRadius: "50%"}} >
                <MaterialDesignIcons name={"plus-thick"} size={size/2} color={color} />
            </RowContainer>
        </RowContainer>
    );  
}

export function AddShoppingListItemIcon({size = defaultSize, color, background}: {size?: number, color?: string, background?: string}) {
    const {colours} = useColourData();
    color = color ?? colours.text;
    background = background ?? colours.buttonBackground;
    return (
        <RowContainer style={{padding:0, margin:0, justifyContent:"center", alignItems:"center", position:"relative", width:"auto"}}>
            <MaterialDesignIcons name={"basket-outline"} size={size} color={color} style={{padding:5}} />
            <RowContainer style={{position:"absolute", right:3, bottom:3, padding:0, backgroundColor: background, height:"auto", width:"auto", borderRadius: "50%"}} >
                <MaterialDesignIcons name={"plus-thick"} size={size/2} color={color} />
            </RowContainer>
        </RowContainer>
    );  
}

export function LinkInventoryItemIcon({size = defaultSize, color, background}: {size?: number, color?: string, background?: string}) {
    const {colours} = useColourData();
    color = color ?? colours.text;
    background = background ?? colours.buttonBackground;
    return (
        <RowContainer style={{padding:0, margin:0, justifyContent:"center", alignItems:"center", position:"relative", width:"auto"}}>
            <MaterialDesignIcons name={"fridge-outline"} size={size} color={color} style={{padding:5}} />
            <RowContainer style={{position:"absolute", right:3, bottom:3, padding:0, backgroundColor: background, height:"auto", width:"auto", borderRadius: "50%"}} >
                <MaterialDesignIcons name={"link-variant"} size={size/2} color={color} />
            </RowContainer>
        </RowContainer>
    );  
}

export function InventoryIcon({size = defaultSize, color}: {size?: number, color?: string}) {
    const {colours} = useColourData();
    color = color ?? colours.text;
    return (
        <MaterialDesignIcons name={"fridge-outline"} size={size} color={color} style={{padding:5}} />
    );  
}

export function ShoppingListIcon({size = defaultSize, color}: {size?: number, color?: string}) {
    const {colours} = useColourData();
    color = color ?? colours.text;
    return (
        <MaterialDesignIcons name={"basket-outline"} size={size} color={color} style={{padding:5}} />
    );  
}

export function EditShoppingListIcon({size = defaultSize, color, background}: {size?: number, color?: string, background?: string}) {
    const {colours} = useColourData();
    color = color ?? colours.text;
    background = background ?? colours.buttonBackground;
    return (
        <RowContainer style={{padding:0, margin:0, justifyContent:"center", alignItems:"center", position:"relative", width:"auto"}}>
            <MaterialDesignIcons name={"basket-outline"} size={size} color={color} style={{padding:5}} />
            <RowContainer style={{position:"absolute", right:3, bottom:3, padding:0, backgroundColor: background, height:"auto", width:"auto", borderRadius: "50%"}} >
                <MaterialDesignIcons name={"pencil"} size={size/2} color={color} />
            </RowContainer>
        </RowContainer>
    );    
}

export function EditInventoryItemIcon({size = defaultSize, color, background}: {size?: number, color?: string, background?: string}) {
    const {colours} = useColourData();
    color = color ?? colours.text;
    background = background ?? colours.buttonBackground;
    return (
        <RowContainer style={{padding:0, margin:0, justifyContent:"center", alignItems:"center", position:"relative", width:"auto"}}>
            <MaterialDesignIcons name={"fridge-outline"} size={size} color={color} style={{padding:5}} />
            <RowContainer style={{position:"absolute", right:3, bottom:3, padding:0, backgroundColor: background, height:"auto", width:"auto", borderRadius: "50%"}} >
                <MaterialDesignIcons name={"pencil"} size={size/2} color={color} />
            </RowContainer>
        </RowContainer>
    );    
}

export function EditRecipeIcon({size = defaultSize, color, background}: {size?: number, color?: string, background?: string}) {
    const {colours} = useColourData();
    color = color ?? colours.text;
    background = background ?? colours.buttonBackground;
    return (
        <RowContainer style={{padding:0, margin:0, justifyContent:"center", alignItems:"center", position:"relative", width:"auto"}}>
            <MaterialDesignIcons name={"pot-steam-outline"} size={size} color={color} style={{padding:5}} />
            <RowContainer style={{position:"absolute", right:3, bottom:3, padding:0, backgroundColor: background, height:"auto", width:"auto", borderRadius: "50%"}} >
                <MaterialDesignIcons name={"pencil"} size={size/2} color={color} />
            </RowContainer>
        </RowContainer>
    );    
}

export function AddRecipeIcon({size = defaultSize, color, background}: {size?: number, color?: string, background?: string}) {
    const {colours} = useColourData();
    color = color ?? colours.text;
    background = background ?? colours.buttonBackground;
    return (
        <RowContainer style={{padding:0, margin:0, justifyContent:"center", alignItems:"center", position:"relative", width:"auto"}}>
            <MaterialDesignIcons name={"pot-steam-outline"} size={size} color={color} style={{padding:5}} />
            <RowContainer style={{position:"absolute", right:3, bottom:3, padding:0, backgroundColor: background, height:"auto", width:"auto", borderRadius: "50%"}} >
                <MaterialDesignIcons name={"plus-thick"} size={size/2} color={color} />
            </RowContainer>
        </RowContainer>
    );    
}

export function CancelIcon({size = defaultSize, color}: {size?: number, color?: string}) {
    const {colours} = useColourData();
    color = color ?? colours.text;
    return (
        <MaterialDesignIcons name={"backspace-outline"} size={size} color={color} style={{padding:5}} />
    );  
}

export function SubmitInventoryIcon({size = defaultSize, color, background}: {size?: number, color?: string, background?: string}) {
    const {colours} = useColourData();
    color = color ?? colours.text;
    background = background ?? colours.buttonBackground;
    return (
        <RowContainer style={{padding:0, margin:0, justifyContent:"center", alignItems:"center", position:"relative", width:"auto"}}>
            <MaterialDesignIcons name={"fridge-outline"} size={size} color={color} style={{padding:5}} />
            <RowContainer style={{position:"absolute", right:3, bottom:3, padding:0, backgroundColor: background, height:"auto", width:"auto", borderRadius: "50%"}} >
                <MaterialDesignIcons name={"check-bold"} size={size/2} color={color} />
            </RowContainer>
        </RowContainer>
    );  
}

export function SubmitRecipeIcon({size = defaultSize, color, background}: {size?: number, color?: string, background?: string}) {
    const {colours} = useColourData();
    color = color ?? colours.text;
    background = background ?? colours.buttonBackground;
    return (
        <RowContainer style={{padding:0, margin:0, justifyContent:"center", alignItems:"center", position:"relative", width:"auto"}}>
            <MaterialDesignIcons name={"pot-steam-outline"} size={size} color={color} style={{padding:5}} />
            <RowContainer style={{position:"absolute", right:3, bottom:3, padding:0, backgroundColor: background, height:"auto", width:"auto", borderRadius: "50%"}} >
                <MaterialDesignIcons name={"check-bold"} size={size/2} color={color} />
            </RowContainer>
        </RowContainer>
    );  
}

export function SubmitShoppingListIcon({size = defaultSize, color, background}: {size?: number, color?: string, background?: string}) {
    const {colours} = useColourData();
    color = color ?? colours.text;
    background = background ?? colours.buttonBackground;
    return (
        <RowContainer style={{padding:0, margin:0, justifyContent:"center", alignItems:"center", position:"relative", width:"auto"}}>
            <MaterialDesignIcons name={"basket-outline"} size={size} color={color} style={{padding:5}} />
            <RowContainer style={{position:"absolute", right:3, bottom:3, padding:0, backgroundColor: background, height:"auto", width:"auto", borderRadius: "50%"}} >
                <MaterialDesignIcons name={"check-bold"} size={size/2} color={color} />
            </RowContainer>
        </RowContainer>
    );  
}

export function StarOutlineIcon({size = defaultSize, color, "aria-label" : ariaLabel}: {size?: number, color?: string, "aria-label"?: string}) {
    const {colours} = useColourData();
    color = color ?? colours.text;
    return (
        <MaterialDesignIcons name={"star-outline"} size={size} color={color} style={{padding:5}} aria-label={ariaLabel} />
    );  
}

export function StarFilledIcon({size = defaultSize, color, "aria-label" : ariaLabel}: {size?: number, color?: string, "aria-label"?: string}) {
    const {colours} = useColourData();
    color = color ?? colours.text;
    return (
        <MaterialDesignIcons name={"star"} size={size} color={color} style={{padding:5}} aria-label={ariaLabel} />
    );  
}