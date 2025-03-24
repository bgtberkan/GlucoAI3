import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from '@rneui/themed';
import { logoutUser } from '../services/authService';

export const HomeScreen = ({ navigation }) => {
  const handleLogout = async () => {
    await logoutUser();
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      <Text h3 style={styles.title}>GlucoAI Ana Sayfa</Text>
      <Button
        title="Çıkış Yap"
        onPress={handleLogout}
        containerStyle={styles.buttonContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: 30,
  },
  buttonContainer: {
    marginVertical: 10,
  },
}); 