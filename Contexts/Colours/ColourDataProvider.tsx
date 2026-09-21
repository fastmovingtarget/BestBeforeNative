//2026-09-21 : removed unnecessary useEffect
//2026-09-15 : Colour data context provider created

import { createContext, useContext  } from "react";
import {useColorScheme} from "react-native";
import { LightColours, DarkColours } from "@/Contexts/Colours/Colors";

/**
 * ColourDataContext
 * This context provides colour-related data and functions to the components that consume it. It includes the current colour scheme and the corresponding colours.
 * @returns A context providing colour data and functions
 */
const ColourDataContext = createContext({
    colours: LightColours,
});

export const ColourDataProvider = ({children}:{children:React.ReactNode}) => {   
    const colorScheme = useColorScheme();

    return (
        <ColourDataContext.Provider 
            value={{colours: colorScheme === "dark" ? DarkColours : LightColours}}>
            {children}
        </ColourDataContext.Provider>
    );
}

export const useColourData = () => {
  return useContext(ColourDataContext);
};