//2026-07-10 : App tabs now require a user id to exist


import { Stack } from 'expo-router';
import { useAuthenticationData } from '@/Contexts/Authentication/AuthenticationDataProvider';

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