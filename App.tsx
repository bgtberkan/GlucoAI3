import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootStackParamList, TabParamList } from './src/navigation/types';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import AddMealScreen from './src/screens/AddMealScreen';
import AddGlucoseScreen from './src/screens/AddGlucoseScreen';
import AddInsulinScreen from './src/screens/AddInsulinScreen';
import StatisticsScreen from './src/screens/StatisticsScreen';
import SettingsScreen from './src/screens/SettingsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#4CAF50',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: '#666',
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ 
          title: 'GlucoAI',
          tabBarLabel: 'Ana Sayfa',
        }}
      />
      <Tab.Screen 
        name="Statistics" 
        component={StatisticsScreen}
        options={{ 
          title: 'İstatistikler',
          tabBarLabel: 'İstatistikler',
        }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{ 
          title: 'Ayarlar',
          tabBarLabel: 'Ayarlar',
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator 
          screenOptions={{
            headerStyle: {
              backgroundColor: '#4CAF50',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen 
            name="MainTabs" 
            component={TabNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="AddMeal" 
            component={AddMealScreen}
            options={{ title: 'Öğün Ekle' }}
          />
          <Stack.Screen 
            name="AddGlucose" 
            component={AddGlucoseScreen}
            options={{ title: 'Kan Şekeri Ekle' }}
          />
          <Stack.Screen 
            name="AddInsulin" 
            component={AddInsulinScreen}
            options={{ title: 'İnsülin Ekle' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}
