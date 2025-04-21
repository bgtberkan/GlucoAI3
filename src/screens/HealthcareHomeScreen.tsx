import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  FlatList
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// Geçici mock veri
const MOCK_PATIENTS = [
  {
    id: '1',
    name: 'Ahmet Yılmaz',
    lastGlucose: 120,
    lastMeasurement: '2 saat önce',
    status: 'normal',
    age: 45,
    diabetesType: 'Tip 2',
  },
  {
    id: '2',
    name: 'Ayşe Demir',
    lastGlucose: 200,
    lastMeasurement: '1 saat önce',
    status: 'high',
    age: 32,
    diabetesType: 'Tip 1',
  },
  {
    id: '3',
    name: 'Mehmet Kaya',
    lastGlucose: 65,
    lastMeasurement: '30 dakika önce',
    status: 'low',
    age: 28,
    diabetesType: 'Tip 1',
  },
  {
    id: '4',
    name: 'Fatma Şahin',
    lastGlucose: 140,
    lastMeasurement: '3 saat önce',
    status: 'normal',
    age: 52,
    diabetesType: 'Tip 2',
  },
];

interface HealthcareHomeScreenProps {
  navigation: any;
}

export default function HealthcareHomeScreen({ navigation }: HealthcareHomeScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPatients, setFilteredPatients] = useState(MOCK_PATIENTS);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    const filtered = MOCK_PATIENTS.filter(patient =>
      patient.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredPatients(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'high':
        return '#dc3545';
      case 'low':
        return '#ffc107';
      default:
        return '#2196F3';
    }
  };

  const renderPatientCard = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.patientCard}
      onPress={() => navigation.navigate('PatientDetail', { patientId: item.id })}
    >
      <View style={styles.patientHeader}>
        <View>
          <Text style={styles.patientName}>{item.name}</Text>
          <Text style={styles.patientInfo}>
            {item.age} yaş • {item.diabetesType}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.lastGlucose} mg/dL</Text>
        </View>
      </View>
      
      <View style={styles.measurementInfo}>
        <Ionicons name="time-outline" size={16} color="#666" />
        <Text style={styles.measurementText}>Son ölçüm: {item.lastMeasurement}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Hastalarım</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate('AddPatient')}
        >
          <Ionicons name="add" size={24} color="#2196F3" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Hasta ara..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      <FlatList
        data={filteredPatients}
        renderItem={renderPatientCard}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.patientList}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  addButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    margin: 20,
    marginTop: 10,
    borderRadius: 10,
    paddingHorizontal: 15,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  patientList: {
    padding: 20,
    paddingTop: 0,
  },
  patientCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  patientHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  patientName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  patientInfo: {
    fontSize: 14,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  measurementInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  measurementText: {
    marginLeft: 6,
    color: '#666',
    fontSize: 14,
  },
}); 