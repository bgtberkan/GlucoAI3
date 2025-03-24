import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Input, Button, Text } from '@rneui/themed';
import { registerUser } from '../services/authService';

export const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password || !displayName) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun.');
      return;
    }

    setLoading(true);
    const result = await registerUser(email, password, displayName);
    setLoading(false);

    if ('code' in result) {
      Alert.alert('Hata', result.message);
    } else {
      navigation.replace('Home');
    }
  };

  return (
    <View style={styles.container}>
      <Text h3 style={styles.title}>GlucoAI'ya Hoş Geldiniz</Text>
      <Input
        placeholder="Ad Soyad"
        value={displayName}
        onChangeText={setDisplayName}
        autoCapitalize="words"
      />
      <Input
        placeholder="E-posta"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <Input
        placeholder="Şifre"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button
        title="Kayıt Ol"
        onPress={handleRegister}
        loading={loading}
        containerStyle={styles.buttonContainer}
      />
      <Button
        title="Zaten hesabınız var mı? Giriş yapın"
        type="clear"
        onPress={() => navigation.navigate('Login')}
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