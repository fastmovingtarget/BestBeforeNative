//2026-06-29 : Centralised React Icons for import

import {Ionicons} from '@react-native-vector-icons/ionicons';
import {Colours} from "@/constants/Colors";

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
        <Ionicons name={"trash-outline"} size={size} color={color} style={{padding:5}} />
    );  
}

export function ForwardIcon({size = defaultSize, color = Colours.text}: {size?: number, color?: string}) {
    return (
        <Ionicons name={"chevron-forward"} size={size} color={color} style={{padding:5}} />
    );  
}