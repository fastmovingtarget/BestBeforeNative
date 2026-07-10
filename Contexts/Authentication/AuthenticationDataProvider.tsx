//2026-07-10 : Calls for login and signup

//2026-06-01 : Holding colour variables in Auth

//2025-10-20 : Created Authentication Context

import { useState, createContext, useContext  } from "react";
import Login from "./Login";
import { SyncState } from "@/Types/DataLoadingState";
import Signup from "./Signup";

const AuthenticationDataContext = createContext({
    userId: 1 as number | null,
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
    setColours: (colours: {primary: string, secondary: string, background: string, text: string}) => {},
    attemptLogin: (username: string, password: string) => {},
    logout: () => {},
    signup: (username: string, password: string) => {},
});

export const AuthenticationDataProvider = ({children}:{children:React.ReactNode}) => {   

    const [userId, setUserId] = useState<number | null>(1);
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

    

    const attemptLogin = (username: string, password: string) => {
        Login(username, password, setUserId)
    }

    const logout = () => {
        setUserId(null);
    }
    
    const signup = (username: string, password: string) => {
        Signup(username, password, setUserId);
    }

    return (
        <AuthenticationDataContext.Provider 
            value={{userId, colours, setColours, attemptLogin, logout, signup}}>
            {children}
        </AuthenticationDataContext.Provider>
    );
}

export const useAuthenticationData = () => {
  return useContext(AuthenticationDataContext);
};