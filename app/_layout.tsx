//2026-09-16 : Updated compatability for expo 57
//2026-09-15 : Wrapped all the components in a colour data provider
//2026-07-10 : App tabs now require a user id to exist

//2025-11-19 : Adjusting imports and calls to fit new naming convention

//2025-11-17 : Adding Recipe Plan data provider

//2025-10-24 : Adding shopping list data provider

//2025-10-20 : Added Recipes Data Provider

//2025-10-20 : Removed Data Provider, added Authentication Data Provider & Ingredients Data provider

import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router/react-navigation';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthenticationDataProvider } from '@/Contexts/Authentication/AuthenticationDataProvider';
import { ColourDataProvider } from '@/Contexts/Colours/ColourDataProvider';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <ColourDataProvider>
        <AuthenticationDataProvider>
          <Stack>
            <Stack.Screen name="(authentication)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="auto" />
        </AuthenticationDataProvider>
      </ColourDataProvider>
    </ThemeProvider>
  );
}
