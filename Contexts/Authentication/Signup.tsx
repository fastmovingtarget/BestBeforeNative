//2026-07-10 : Calls for login and signup


import { SyncState } from "@/Types/DataLoadingState";
import log from "@/utils/log";

export default function Signup(username: string, password: string, setUserId: (id: number) => void): Promise<SyncState> {

 const serverProps = {
        DatabaseServer: process.env.REACT_APP_DATABASE_SERVER || "192.168.50.201",
        DatabasePort: process.env.REACT_APP_DATABASE_PORT || "5091",
        DatabaseProtocol: process.env.REACT_APP_PROTOCOL || "http",
    }

    log(`Signing up: ${username}`, "debug");

    let returnPromise = new Promise<SyncState>((resolve) => {
        fetch(
            `${serverProps.DatabaseProtocol}://${serverProps.DatabaseServer}:${serverProps.DatabasePort}/authentication/signup`, 
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({Username : username, Password : password}),
            }
        ).then((rawData) => {
            if(rawData.status !== 200) {
                log(`Error fetching signup data: ${rawData.status} : ${rawData.statusText}`, "error");
                resolve(SyncState.Failed);
            }
            else {
                rawData.json().then((data : {User_ID: number, Token_ID: string, Expiration_Date: string}) => {
                    if(data.User_ID < 0) {
                        resolve(SyncState.Failed);
                    }
                    else {
                        setUserId(data.User_ID);
                        log(`Successfully signed up with user ID: ${data.User_ID}`, "debug");
                        resolve(SyncState.Successful);
                    }
                })
            }
        }).catch((error) => {
            log(`Error fetching signup data: ${error}`, "error");
            resolve(SyncState.Failed);
        });
    });
    return returnPromise;
}