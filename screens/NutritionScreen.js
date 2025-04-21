import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NutritionScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Beslenme Takibi</Text>
        <Text style={styles.description}>
          Bu bölümde öğünlerinizi ve beslenme alışkanlıklarınızı takip edebilirsiniz.
        </Text>

        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate('AddMeal')}
        >
          <Text style={styles.addButtonText}>Öğün Ekle</Text>
        </TouchableOpacity>

        {/* Öğün listesi buraya eklenecek */}
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            Henüz öğün kaydı bulunmuyor.
          </Text>
          <Text style={styles.emptyStateSubText}>
            Öğün eklemek için yukarıdaki butonu kullanabilirsiniz.
          </Text>
        </View>
      </View>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  addButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 10,
  },
  emptyStateSubText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
}); 