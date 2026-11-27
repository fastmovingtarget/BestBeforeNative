//2026-11-27 : added handling for error responses from server
//2026-08-04 : Updating api calls to use correct env variable
//2026-07-16 : Added function descriptions
//2026-07-13 : Saving Token to local storage

//2026-07-10 : Calls for login and signup


import { SyncState } from "@/Types/DataLoadingState";
import log from "@/utils/log";

/**
 * Login function
 * Attempts to log in a user with the provided username and password. If successful, it sets the user ID and saves the authentication token.
 * @param username - The username of the user attempting to log in
 * @param password - The password of the user attempting to log in
 * @param setUserId - A callback function to set the user ID upon successful login
 * @param saveToken - A callback function to save the authentication token upon successful login
 * @returns A promise that resolves to a SyncState indicating the result of the login attempt (Successful or Failed)
 */
export default function Login(username: string, password: string, setUserId: (id: number) => void, saveToken: (token: string, userId: number) => void, setError: (error: string) => void): Promise<SyncState> {

    log(`Logging in: ${username}`, "debug");

    let returnPromise = new Promise<SyncState>((resolve) => {
        fetch(
            //`https://bestbeforeapi.fastmovingtarget.co.uk/authentication/login`, 
            `${process.env.EXPO_PUBLIC_API_URL}/authentication/login`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({Username : username, Password : password}),
            }
        ).then((rawData) => {
            if(rawData.status !== 200) {
                const errorMsg = `Error fetching login data: ${rawData.status} : ${rawData.statusText}`;
                log(errorMsg, "error");
                setError(errorMsg);
                resolve(SyncState.Failed);
            }
            else {
                rawData.json().then((data : {User_ID: number, Token_ID: string, Expiration_Date: string}) => {
                    if(!data.User_ID || data.User_ID < 0) {
                        const errorMsg = `Invalid user ID received: ${data.User_ID}`;
                        log(errorMsg, "error");
                        setError(errorMsg);
                        resolve(SyncState.Failed);
                    }
                    else {
                        setUserId(data.User_ID);
                        saveToken(data.Token_ID, data.User_ID);
                        const successMsg = `Successfully logged in with user ID: ${data.User_ID}`;
                        log(successMsg, "debug");
                        setError(""); // Clear any previous errors
                        resolve(SyncState.Successful);
                    }
                })
            }
        }).catch((error) => {
            const errorMsg = `Error fetching login data: ${error}`;
            log(errorMsg, "error");
            setError(errorMsg);
            resolve(SyncState.Failed);
        });
    });
    return returnPromise;
}