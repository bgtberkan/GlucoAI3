import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type StatisticsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Statistics'>;

interface Props {
  navigation: StatisticsScreenNavigationProp;
}

export default function StatisticsScreen({ navigation }: Props) {
  // TODO: Implement actual statistics data
  const mockData = {
    averageGlucose: '120',
    averageInsulin: '15',
    mealCount: '21',
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.title}>İstatistikler</Text>
          <Text style={styles.subtitle}>Son 7 günlük verileriniz</Text>

          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.valueText}>{mockData.averageGlucose}</Text>
              <Text style={styles.statLabel}>Ortalama Kan Şekeri</Text>
              <Text style={styles.statUnit}>mg/dL</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.valueText}>{mockData.averageInsulin}</Text>
              <Text style={styles.statLabel}>Ortalama İnsülin</Text>
              <Text style={styles.statUnit}>ünite/gün</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.valueText}>{mockData.mealCount}</Text>
              <Text style={styles.statLabel}>Toplam Öğün</Text>
              <Text style={styles.statUnit}>öğün/hafta</Text>
            </View>
          </View>

          <View style={styles.chartPlaceholder}>
            <Text style={styles.placeholderText}>Grafik burada görüntülenecek</Text>
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
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  valueText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 2,
  },
  statUnit: {
    fontSize: 10,
    color: '#999',
  },
  chartPlaceholder: {
    height: 300,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#666',
    fontSize: 16,
  },
}); 