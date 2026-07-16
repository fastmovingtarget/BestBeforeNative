//2026-07-16 : Added function description
//2026-07-10 : Basic user login page


import { useAuthenticationData } from '@/Contexts/Authentication/AuthenticationDataProvider';
import { ButtonView, FadeComponent, FormTextInput, PageView, RowContainer } from '@/ui/BestBeforeUI';
import { useState } from 'react';
import { Text } from 'react-native';

/**
 * LoginPage component
 * @returns The login page, which includes input fields for username and password, and buttons for login and sign up
 */
export default function LoginPage(){

    const {attemptLogin, signup} = useAuthenticationData();

    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");


    return (
        <PageView style={{flex:1, justifyContent:"center", alignItems:"center"}}>
            <FadeComponent>
                <RowContainer style={{justifyContent:"center", alignItems:"center", marginVertical:10}}>
                    <FormTextInput
                        style={{height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, paddingHorizontal: 10, marginVertical: 10}}
                        placeholder="Username"
                        inputMode="text"
                        aria-label="username-input"
                        defaultValue={""}
                        onChange={(event) => setUsername(event.nativeEvent.text)}
                    />
                </RowContainer>
                <RowContainer style={{justifyContent:"center", alignItems:"center", marginVertical:10}}>
                    <FormTextInput
                        style={{height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, paddingHorizontal: 10, marginVertical: 10}}
                        placeholder="Password"
                        inputMode="password"
                        aria-label="password-input"
                        defaultValue={""}
                        onChange={(event) => setPassword(event.nativeEvent.text)}
                    />
                </RowContainer>
                <RowContainer style={{justifyContent:"space-between"}}>
                    <ButtonView style={{padding:10, backgroundColor:"red", borderRadius:5}} onPress={() => attemptLogin(username, password)}>
                        <Text>Login</Text>
                    </ButtonView>
                    <ButtonView style={{padding:10, backgroundColor:"red", borderRadius:5}} onPress={() => signup(username, password)}>
                        <Text>Sign Up</Text>
                    </ButtonView>
                </RowContainer>
            </FadeComponent>
        </PageView>
    )
}