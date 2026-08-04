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
export default function Login(username: string, password: string, setUserId: (id: number) => void, saveToken: (token: string, userId: number) => void): Promise<SyncState> {

    log(`Logging in: ${username}`, "debug");

    let returnPromise = new Promise<SyncState>((resolve) => {
        fetch(
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
                log(`Error fetching login data: ${rawData.status} : ${rawData.statusText}`, "error");
                resolve(SyncState.Failed);
            }
            else {
                rawData.json().then((data : {User_ID: number, Token_ID: string, Expiration_Date: string}) => {
                    if(data.User_ID < 0) {
                        resolve(SyncState.Failed);
                    }
                    else {
                        setUserId(data.User_ID);
                        saveToken(data.Token_ID, data.User_ID);
                        log(`Successfully logged in with user ID: ${data.User_ID}`, "debug");
                        resolve(SyncState.Successful);
                    }
                })
            }
        }).catch((error) => {
            log(`Error fetching login data: ${error}`, "error");
            resolve(SyncState.Failed);
        });
    });
    return returnPromise;
}