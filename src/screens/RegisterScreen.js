import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import Input from '../components/Input';
import Button from '../components/Button';
import { saveCredentials } from '../services/storage';

export default function RegisterScreen({ goTo }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleRegister = async () => {
    if (!email || !senha) {
      Alert.alert('Preencha todos os campos');
      return;
    }
    await saveCredentials(email, senha);
    Alert.alert('Cadastro realizado!');
    goTo('login');
  };

  return (
    <View style={styles.container}>
      <Input placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      <Input placeholder="Senha" value={senha} onChangeText={setSenha} secureTextEntry />
      <Button title="Cadastrar" onPress={handleRegister} />
      <Button title="Voltar" onPress={() => goTo('chooseRegister')} type="secondary" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
});