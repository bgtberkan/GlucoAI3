import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RootStackParamList, TabParamList } from '../navigation/types';

type HomeScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, 'Home'>,
  NativeStackNavigationProp<RootStackParamList>
>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

export default function HomeScreen({ navigation }: HomeScreenProps) {
  // TODO: Bu verileri gerçek verilerle değiştir
  const lastMeasurements = {
    glucose: {
      value: '120',
      time: '2 saat önce',
      status: 'normal', // 'high', 'low', 'normal'
    },
    insulin: {
      value: '10',
      time: '4 saat önce',
      type: 'Hızlı Etkili',
    },
    meal: {
      name: 'Öğle Yemeği',
      time: '4 saat önce',
      carbs: '45',
    },
  };

  const getStatusColor = (value: number) => {
    if (value > 180) return '#dc3545';
    if (value < 70) return '#ffc107';
    return '#2196F3';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.title}>GlucoAI</Text>
          <Text style={styles.subtitle}>Diyabet Yönetim asistanınız</Text>

          <View style={styles.menuContainer}>
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => navigation.navigate('AddGlucose')}
            >
              <Text style={styles.menuTitle}>Kan Şekeri Ekle</Text>
              <Text style={styles.menuDescription}>Kan şekeri ölçümünüzü kaydedin</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => navigation.navigate('AddInsulin')}
            >
              <Text style={styles.menuTitle}>İnsülin Ekle</Text>
              <Text style={styles.menuDescription}>İnsülin dozunuzu kaydedin</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => navigation.navigate('AddMeal')}
            >
              <Text style={styles.menuTitle}>Öğün Ekle</Text>
              <Text style={styles.menuDescription}>Öğün bilgilerinizi kaydedin</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.lastMeasurementsContainer}>
            <Text style={styles.sectionTitle}>Son Ölçümler</Text>
            
            <View style={styles.measurementCard}>
              <View style={styles.measurementHeader}>
                <Text style={styles.measurementTitle}>Kan Şekeri</Text>
                <Text style={styles.measurementTime}>{lastMeasurements.glucose.time}</Text>
              </View>
              <Text style={[styles.measurementValue, { color: getStatusColor(parseInt(lastMeasurements.glucose.value)) }]}>
                {lastMeasurements.glucose.value} mg/dL
              </Text>
            </View>

            <View style={styles.measurementCard}>
              <View style={styles.measurementHeader}>
                <Text style={styles.measurementTitle}>Son İnsülin</Text>
                <Text style={styles.measurementTime}>{lastMeasurements.insulin.time}</Text>
              </View>
              <Text style={styles.measurementValue}>{lastMeasurements.insulin.value} ünite</Text>
              <Text style={styles.measurementSubtext}>{lastMeasurements.insulin.type}</Text>
            </View>

            <View style={styles.measurementCard}>
              <View style={styles.measurementHeader}>
                <Text style={styles.measurementTitle}>Son Öğün</Text>
                <Text style={styles.measurementTime}>{lastMeasurements.meal.time}</Text>
              </View>
              <Text style={styles.measurementValue}>{lastMeasurements.meal.name}</Text>
              <Text style={styles.measurementSubtext}>{lastMeasurements.meal.carbs}g karbonhidrat</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2196F3',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
  },
  menuContainer: {
    gap: 15,
    marginBottom: 30,
  },
  menuItem: {
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
    paddingLeft: 10,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  menuDescription: {
    fontSize: 14,
    color: '#666',
  },
  lastMeasurementsContainer: {
    gap: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  measurementCard: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
  },
  measurementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  measurementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  measurementTime: {
    fontSize: 12,
    color: '#666',
  },
  measurementValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 2,
  },
  measurementSubtext: {
    fontSize: 14,
    color: '#666',
  },
  addButtonText: {
    color: '#2196F3',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 