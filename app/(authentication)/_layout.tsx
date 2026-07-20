//2026-07-16 : Adding function description

//2026-07-10 : App tabs now require a user id to exist


import { Stack } from 'expo-router';
import { useAuthenticationData } from '@/Contexts/Authentication/AuthenticationDataProvider';

/**
 * Authentication layout component
 * Returns a protected stack layout with the following screens:
 * - (tabs) : App tabs layout accessible only if user id is not null
 * - login : Login screen accessible when user id is null
 */
export default function AuthLayout() {

    const {userId} = useAuthenticationData();

    return (
        <Stack>
          <Stack.Protected guard={userId !== null}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack.Protected>
          <Stack.Protected guard={userId === null}>
            <Stack.Screen name="login" options={{ headerShown: false }} />
          </Stack.Protected>
        </Stack>
    )
}