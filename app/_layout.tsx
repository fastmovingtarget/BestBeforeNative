//2025-11-19 : Adjusting imports and calls to fit new naming convention

//2025-11-17 : Adding Recipe Plan data provider

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
import { InventoryDataProvider } from '@/Contexts/Inventory/InventoryDataProvider';
import { RecipesDataProvider } from '@/Contexts/Recipes/RecipesDataProvider';
import { ShoppingListDataProvider } from '@/Contexts/ShoppingList/ShoppingListDataProvider';
import { PlansDataProvider } from '@/Contexts/Plans/PlansDataProvider';

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
        <InventoryDataProvider>
          <RecipesDataProvider>
            <ShoppingListDataProvider>
              <PlansDataProvider>
                <Stack>
                  <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                  <Stack.Screen name="+not-found" />
                </Stack>
                <StatusBar style="auto" />
              </PlansDataProvider>
            </ShoppingListDataProvider>
          </RecipesDataProvider>
        </InventoryDataProvider>
      </AuthenticationDataProvider>
    </ThemeProvider>
  );
}
