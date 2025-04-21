import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { Meal } from '../types/meal';
import { getUserMeals } from '../services/mealService';

type NutritionScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Nutrition'>;

interface NutritionScreenProps {
  navigation: NutritionScreenNavigationProp;
}

export default function NutritionScreen({ navigation }: NutritionScreenProps) {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMeals();
  }, []);

  const loadMeals = async () => {
    try {
      // Şimdilik mock bir userId kullanıyoruz
      const mockUserId = '123';
      const userMeals = await getUserMeals(mockUserId);
      setMeals(userMeals);
    } catch (error) {
      console.error('Öğünler yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    const d = new Date(date);
    return d.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getMealTypeName = (mealType: string) => {
    const mealTypes = {
      BREAKFAST: 'Kahvaltı',
      LUNCH: 'Öğle Yemeği',
      DINNER: 'Akşam Yemeği',
      SNACK: 'Ara Öğün',
    };
    return mealTypes[mealType] || mealType;
  };

  const renderMealItem = ({ item }: { item: Meal }) => (
    <View style={styles.mealItem}>
      <View style={styles.mealHeader}>
        <Text style={styles.mealType}>{getMealTypeName(item.mealType)}</Text>
        <Text style={styles.mealDate}>{formatDate(item.date)}</Text>
      </View>
      <View style={styles.mealDetails}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Kan Şekeri:</Text>
          <Text style={styles.detailValue}>{item.bloodSugar} mg/dL</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Karbonhidrat:</Text>
          <Text style={styles.detailValue}>{item.carbAmount} g</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>İnsülin:</Text>
          <Text style={styles.detailValue}>{item.insulinAmount} ünite</Text>
        </View>
      </View>
      {item.notes && (
        <View style={styles.notesContainer}>
          <Text style={styles.notesLabel}>Notlar:</Text>
          <Text style={styles.notesText}>{item.notes}</Text>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Beslenme Takibi</Text>
        <Text style={styles.description}>
          Bu bölümde öğünlerinizi ve beslenme alışkanlıklarınızı takip edebilirsiniz.
        </Text>

        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate('AddMeal')}
        >
          <Text style={styles.addButtonText}>Öğün Ekle</Text>
        </TouchableOpacity>

        {loading ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>Yükleniyor...</Text>
          </View>
        ) : meals.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              Henüz öğün kaydı bulunmuyor.
            </Text>
            <Text style={styles.emptyStateSubText}>
              Öğün eklemek için yukarıdaki butonu kullanabilirsiniz.
            </Text>
          </View>
        ) : (
          <FlatList
            data={meals}
            renderItem={renderMealItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.mealList}
          />
        )}
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
  button: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  addButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  mealList: {
    flexGrow: 1,
  },
  mealItem: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  mealType: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  mealDate: {
    fontSize: 14,
    color: '#666',
  },
  mealDetails: {
    marginBottom: 10,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  detailLabel: {
    fontSize: 16,
    color: '#666',
  },
  detailValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  notesContainer: {
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 10,
    marginTop: 5,
  },
  notesLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  notesText: {
    fontSize: 14,
    color: '#333',
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