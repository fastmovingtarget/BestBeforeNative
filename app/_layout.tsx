//2025-10-24 : Adding shopping list data provider

//2025-10-20 : Added Recipes Data Provider

//2025-10-20 : Removed Data Provider, added Authentication Data Provider & Ingredients Data provider

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthenticationDataProvider } from '@/Contexts/Authentication/AuthenticationDataProvider';
import { IngredientsDataProvider } from '@/Contexts/Ingredients/IngredientsDataProvider';
import { RecipesDataProvider } from '@/Contexts/Recipes/RecipesDataProvider';
import { ShoppingListDataProvider } from '@/Contexts/ShoppingList/ShoppingListDataProvider';

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
      <AuthenticationDataProvider>
        <IngredientsDataProvider>
          <RecipesDataProvider>
            <ShoppingListDataProvider>
              <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="+not-found" />
              </Stack>
              <StatusBar style="auto" />
            </ShoppingListDataProvider>
          </RecipesDataProvider>
        </IngredientsDataProvider>
      </AuthenticationDataProvider>
    </ThemeProvider>
  );
}
