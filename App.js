import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Screens
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ProfileScreen from './screens/ProfileScreen';
import GlucoseScreen from './screens/GlucoseScreen';
import NutritionScreen from './screens/NutritionScreen';
import ExerciseScreen from './screens/ExerciseScreen';
import SettingsScreen from './screens/SettingsScreen';
import AddMealScreen from './screens/AddMealScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <NavigationContainer>
          <Stack.Navigator 
            initialRouteName="Home"
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
              name="Home" 
              component={HomeScreen}
              options={{ title: 'GlucoAI' }}
            />
            <Stack.Screen 
              name="Login" 
              component={LoginScreen}
              options={{ title: 'Giriş Yap' }}
            />
            <Stack.Screen 
              name="Register" 
              component={RegisterScreen}
              options={{ title: 'Kayıt Ol' }}
            />
            <Stack.Screen 
              name="Profile" 
              component={ProfileScreen}
              options={{ title: 'Profil' }}
            />
            <Stack.Screen 
              name="Glucose" 
              component={GlucoseScreen}
              options={{ title: 'Kan Şekeri Takibi' }}
            />
            <Stack.Screen 
              name="Nutrition" 
              component={NutritionScreen}
              options={{ title: 'Beslenme Takibi' }}
            />
            <Stack.Screen 
              name="Exercise" 
              component={ExerciseScreen}
              options={{ title: 'Egzersiz Takibi' }}
            />
            <Stack.Screen 
              name="Settings" 
              component={SettingsScreen}
              options={{ title: 'Ayarlar' }}
            />
            <Stack.Screen 
              name="AddMeal" 
              component={AddMealScreen}
              options={{ title: 'Öğün Ekle' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
        <StatusBar style="auto" />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
}); 