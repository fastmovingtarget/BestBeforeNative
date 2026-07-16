//2026-07-16 : Adding function description

//2026-07-10 : App tabs now require a user id to exist

//2026-06-30 : Using tab icons from MDI library

//2026-06-17 : Minor text fix

//2025-11-19 : Adjusting imports and calls to fit new naming convention

//2025-05-27 : Adding Shopping list tab in to the app

import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { MaterialDesignIcons} from '@react-native-vector-icons/material-design-icons';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { InventoryDataProvider } from '@/Contexts/Inventory/InventoryDataProvider';
import { RecipesDataProvider } from '@/Contexts/Recipes/RecipesDataProvider';
import { ShoppingListDataProvider } from '@/Contexts/ShoppingList/ShoppingListDataProvider';
import { PlansDataProvider } from '@/Contexts/Plans/PlansDataProvider';


/**
 * App tab layout component
 * Returns a tab layout with the following tabs:
 * - Inventory
 * - Recipes
 * - Planner
 * - Shopping List
 * - Profile
 */
export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <InventoryDataProvider>
      <RecipesDataProvider>
        <ShoppingListDataProvider>
          <PlansDataProvider>
            <Tabs
              screenOptions={{
                tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
                headerShown: false,
                tabBarButton: HapticTab,
                tabBarBackground: TabBarBackground,
                tabBarStyle: Platform.select({
                  ios: {
                    // Use a transparent background on iOS to show the blur effect
                    position: 'absolute',
                  },
                  default: {},
                }),
              }}>
              <Tabs.Screen
                name="inventory"
                options={{
                  title: 'Inventory',
                  tabBarIcon: ({ color }) => <MaterialDesignIcons size={28} name="fridge-outline" color={color} />,
                }}
              />
              <Tabs.Screen
                name="recipes"
                options={{
                  title: 'Recipes',
                  tabBarIcon: ({ color }) => <MaterialDesignIcons size={28} name="pot-steam-outline" color={color} />,
                }}
              />
              <Tabs.Screen
                name="planner"
                options={{
                  title: 'Planner',
                  tabBarIcon: ({ color }) => <MaterialDesignIcons size={28} name="calendar-month-outline" color={color} />,
                }}
              />
              <Tabs.Screen
                name="shoppinglist"
                options={{
                  title: 'Shopping List',
                  tabBarIcon: ({ color }) => <MaterialDesignIcons size={28} name="basket-outline" color={color} />,
                }}
              />
              <Tabs.Screen
                name="profile"
                options={{
                  title: 'Profile',
                  tabBarIcon: ({ color }) => <MaterialDesignIcons size={28} name="account-outline" color={color} />,
                }}
              />
            </Tabs>
          </PlansDataProvider>
        </ShoppingListDataProvider>
      </RecipesDataProvider>
    </InventoryDataProvider>
  );
}
