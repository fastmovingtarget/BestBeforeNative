//2026-07-13 : Saving and loading token in Secure Store

//2026-07-10 : Calls for login and signup

//2026-06-01 : Holding colour variables in Auth

//2025-10-20 : Created Authentication Context

import { useState, createContext, useContext, useEffect  } from "react";
import * as SecureStore from "expo-secure-store";
import Login from "./Login";
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

    const [userId, setUserId] = useState<number | null>(null);
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

    useEffect(() => {
        const fetchToken = async () => {
            const tokenData = await getToken();
            if(tokenData) {
                const parsedData = JSON.parse(tokenData);
                setUserId(parsedData.userId);
            }
        }
        fetchToken();
    }, []);

    const saveToken = async (token: string, userId: number) => {
        await SecureStore.setItemAsync("authToken", JSON.stringify({token, userId}));
    }

    const getToken = async () => {
        return await SecureStore.getItemAsync("authToken");
    }

    const attemptLogin = (username: string, password: string) => {
        Login(username, password, setUserId, saveToken)
    }

    const logout = () => {
        setUserId(null);
        SecureStore.deleteItemAsync("authToken");
    }
    
    const signup = (username: string, password: string) => {
        Signup(username, password, setUserId, saveToken);
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