import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';

type PatientDetailScreenRouteProp = RouteProp<RootStackParamList, 'PatientDetail'>;

interface PatientDetailScreenProps {
  route: PatientDetailScreenRouteProp;
}

export default function PatientDetailScreen({ route }: PatientDetailScreenProps) {
  const { patientId } = route.params;

  // Geçici mock veri
  const patient = {
    id: patientId,
    name: 'Ahmet Yılmaz',
    age: 45,
    diabetesType: 'Tip 2',
    lastGlucose: 120,
    lastMeasurement: '2 saat önce',
    status: 'normal',
    medications: ['Metformin', 'Insulin'],
    notes: 'Düzenli egzersiz yapıyor ve diyetine uyuyor.',
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hasta Bilgileri</Text>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Ad Soyad:</Text>
            <Text style={styles.value}>{patient.name}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Yaş:</Text>
            <Text style={styles.value}>{patient.age}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Diyabet Tipi:</Text>
            <Text style={styles.value}>{patient.diabetesType}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Son Ölçüm</Text>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Kan Şekeri:</Text>
            <Text style={styles.value}>{patient.lastGlucose} mg/dL</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Ölçüm Zamanı:</Text>
            <Text style={styles.value}>{patient.lastMeasurement}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>İlaçlar</Text>
          {patient.medications.map((medication, index) => (
            <View key={index} style={styles.infoRow}>
              <Text style={styles.value}>• {medication}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notlar</Text>
          <Text style={styles.notes}>{patient.notes}</Text>
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
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 20,
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    flex: 1,
    fontSize: 16,
    color: '#666',
  },
  value: {
    flex: 2,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  notes: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
}); 