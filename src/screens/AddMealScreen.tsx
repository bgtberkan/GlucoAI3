import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type AddMealScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'AddMeal'>;

interface AddMealScreenProps {
  navigation: AddMealScreenNavigationProp;
}

export default function AddMealScreen({ navigation }: AddMealScreenProps) {
  const [mealName, setMealName] = useState('');
  const [carbAmount, setCarbAmount] = useState('');
  const [insulinAmount, setInsulinAmount] = useState('');
  const [bloodSugar, setBloodSugar] = useState('');
  const [notes, setNotes] = useState('');

  const handleSave = () => {
    if (!mealName || !carbAmount || !insulinAmount || !bloodSugar) {
      Alert.alert('Hata', 'Lütfen tüm zorunlu alanları doldurun');
      return;
    }

    // TODO: Verileri kaydet
    Alert.alert('Başarılı', 'Öğün kaydedildi', [
      {
        text: 'Tamam',
        onPress: () => navigation.goBack(),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView style={styles.content}>
          <Text style={styles.title}>Öğün Ekle</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Öğün Adı</Text>
            <TextInput
              style={styles.input}
              value={mealName}
              onChangeText={setMealName}
              placeholder="Örn: Kahvaltı"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Karbonhidrat Miktarı (gram)</Text>
            <TextInput
              style={styles.input}
              value={carbAmount}
              onChangeText={setCarbAmount}
              placeholder="Örn: 45"
              placeholderTextColor="#999"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>İnsülin Miktarı (ünite)</Text>
            <TextInput
              style={styles.input}
              value={insulinAmount}
              onChangeText={setInsulinAmount}
              placeholder="Örn: 4"
              placeholderTextColor="#999"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Açlık Kan Şekeri (mg/dL)</Text>
            <TextInput
              style={styles.input}
              value={bloodSugar}
              onChangeText={setBloodSugar}
              placeholder="Örn: 120"
              placeholderTextColor="#999"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Notlar (İsteğe bağlı)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={notes}
              onChangeText={setNotes}
              placeholder="Öğün ile ilgili notlarınızı buraya yazabilirsiniz..."
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
            />
          </View>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.cancelButton]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.buttonText}>İptal</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.saveButton]}
            onPress={handleSave}
          >
            <Text style={[styles.buttonText, styles.saveButtonText]}>Kaydet</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    color: '#333',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  saveButtonText: {
    color: '#fff',
  },
}); 