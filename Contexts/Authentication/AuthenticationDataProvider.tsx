//2026-06-01 : Holding colour variables in Auth

//2025-10-20 : Created Authentication Context

import { useState, createContext, useContext  } from "react";

const AuthenticationDataContext = createContext({
    userId: 1 as number,
    colours: {
        primary: "#191f2b",
        secondary: "#111111",
        background: "#0d0d0d",
        text: "#e6e0d4",
    } as {
        primary: string,
        secondary: string,
        background: string,
        text: string,
    },  
});

export const AuthenticationDataProvider = ({children}:{children:React.ReactNode}) => {   

    const [userId] = useState<number>(1);
    const [colours, setColours] = useState<{
        primary: string,
        secondary: string,
        background: string,
        text: string,
    }>({
        primary: "#191f2b",
        secondary: "#111111",
        background: "#0d0d0d",
        text: "#e6e0d4",
    });

    return (
        <AuthenticationDataContext.Provider 
            value={{userId, colours}}>
        {children}
        </AuthenticationDataContext.Provider>
    );
}

export const useAuthenticationData = () => {
  return useContext(AuthenticationDataContext);
};