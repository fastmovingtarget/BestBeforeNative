//2026-11-27 : Implemented error state to store recent error
//2026-11-13 : Improved handling for token not present
//2026-09-21 : added loading state support
//2026-09-15 : Removed colour data handling
//2026-07-16 : Added function descriptions
//2026-07-13 : Saving and loading token in Secure Store
//2026-07-10 : Calls for login and signup
//2026-06-01 : Holding colour variables in Auth
//2025-10-20 : Created Authentication Context

import { useState, createContext, useContext, useEffect  } from "react";
import { UpdateState, SyncState } from "@/Types/DataLoadingState";
import * as SecureStore from "expo-secure-store";
import Login from "./Login";
import Signup from "./Signup";

/**
 * AuthenticationDataContext
 * This context provides authentication-related data and functions to the components that consume it. It includes the user ID, colour scheme, and functions for login, logout, and signup.
 * @returns A context providing authentication data and functions
 */
const AuthenticationDataContext = createContext({
    userId: 1 as number | null,
    loadingDataState: "UpdateLoading" as UpdateState | SyncState,
    attemptLogin: (username: string, password: string) => {},
    logout: () => {},
    signup: (username: string, password: string) => {},
    error: null as string | null,
});

export const AuthenticationDataProvider = ({children}:{children:React.ReactNode}) => {   

    const [userId, setUserId] = useState<number | null>(null);
    const [loadingDataState, setLoadingDataState] = useState<UpdateState | SyncState>(UpdateState.Loading);
    const [error, setError] = useState<string | null>(null);

    const saveToken = async (token: string, userId: number) => {
        await SecureStore.setItemAsync("authToken", JSON.stringify({token, userId}));
    }

    const getToken = async () => {
        const token = await SecureStore.getItemAsync("authToken");
        if (!token) {
            setLoadingDataState(UpdateState.Failed);
            return null
        };
        setLoadingDataState(UpdateState.Successful);
        return token;
    }

    const attemptLogin = (username: string, password: string) => {
        setLoadingDataState(UpdateState.Loading);
        Login(username, password, setUserId, saveToken, setError).then(() => setLoadingDataState(UpdateState.Successful));
    }

    const logout = () => {
        setUserId(null);
        SecureStore.deleteItemAsync("authToken");
    }
    
    const signup = (username: string, password: string) => {
        setLoadingDataState(UpdateState.Loading);
        Signup(username, password, setUserId, saveToken, setError).then(() => setLoadingDataState(UpdateState.Successful));
    }

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

    return (
        <AuthenticationDataContext.Provider 
            value={{userId, loadingDataState, attemptLogin, logout, signup, error}}>
            {children}
        </AuthenticationDataContext.Provider>
    );
}

export const useAuthenticationData = () => {
  return useContext(AuthenticationDataContext);
};