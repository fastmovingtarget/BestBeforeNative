//2026-09-15 : Colour data context provider created

import { useState, createContext, useContext, useEffect  } from "react";
import {useColorScheme} from "react-native";
import { LightColours, DarkColours, ColoursType } from "@/Contexts/Colours/Colors";

/**
 * ColourDataContext
 * This context provides colour-related data and functions to the components that consume it. It includes the current colour scheme and the corresponding colours.
 * @returns A context providing colour data and functions
 */
const ColourDataContext = createContext({
    colours: LightColours,
});

export const ColourDataProvider = ({children}:{children:React.ReactNode}) => {   

    const [colours, setColours] = useState<ColoursType>({
        ...LightColours,
    });

    const colorScheme = useColorScheme();
    useEffect(() => {
        if(colorScheme === "dark") {
            setColours(DarkColours);
        } else {
            setColours(LightColours);
        }
    }, [colorScheme]);

    return (
        <ColourDataContext.Provider 
            value={{colours}}>
            {children}
        </ColourDataContext.Provider>
    );
}

export const useColourData = () => {
  return useContext(ColourDataContext);
};