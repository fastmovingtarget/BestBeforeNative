//2025-10-20 : Created Authentication Context

import { useState, createContext, useContext  } from "react";

const AuthenticationDataContext = createContext({
    userId: 1 as number,
});

export const AuthenticationDataProvider = ({children}:{children:React.ReactNode}) => {

    const [userId] = useState<number>(1);

    return (
        <AuthenticationDataContext.Provider 
            value={{userId}}>
        {children}
        </AuthenticationDataContext.Provider>
    );
}

export const useAuthenticationData = () => {
  return useContext(AuthenticationDataContext);
};