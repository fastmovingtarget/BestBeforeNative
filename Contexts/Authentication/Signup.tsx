//2026-11-27 : added handling for error responses from server
//2026-08-04 : Updating api calls to use correct env variable
//2026-07-16 : Added function descriptions
//2026-07-13 : Saving Token to local storage

//2026-07-10 : Calls for login and signup


import { SyncState } from "@/Types/DataLoadingState";
import log from "@/utils/log";

/**
 * Signup function
 * Attempts to sign up a new user with the provided username and password. If successful, it sets the user ID and saves the authentication token.
 * @param username - The username of the new user attempting to sign up
 * @param password - The password of the new user attempting to sign up
 * @param setUserId - A callback function to set the user ID upon successful signup
 * @param saveToken - A callback function to save the authentication token upon successful signup
 * @returns A promise that resolves to a SyncState indicating the result of the signup attempt (Successful or Failed)
 */
export default function Signup(username: string, password: string, setUserId: (id: number) => void, saveToken: (token: string, userId: number) => void, setError: (error: string) => void): Promise<SyncState> {

    log(`Signing up: ${username}`, "debug");

    let returnPromise = new Promise<SyncState>((resolve) => {
        fetch(
            //`https://bestbeforeapi.fastmovingtarget.co.uk/authentication/signup`, 
            `${process.env.EXPO_PUBLIC_API_URL}/authentication/signup`,
            {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({Username : username, Password : password}),
            }
        ).then(async (rawData) => {
            if(rawData.status !== 200) {
                const errorData : {error: string} = await rawData.json(); 
                setError(errorData.error);
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
                        const successMsg = `Successfully signed up with user ID: ${data.User_ID}`;
                        log(successMsg, "debug");
                        setError(""); // Clear any previous errors
                        resolve(SyncState.Successful);
                    }
                })
            }
        }).catch((error) => {
            const errorMsg = `Error fetching signup data: ${error}`;
            log(errorMsg, "error");
            setError(errorMsg);
            resolve(SyncState.Failed);
        });
    });
    return returnPromise;
}