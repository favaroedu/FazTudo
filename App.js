import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Text, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CadastroScreen = ({ navigation }) => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleCadastro = async () => {
    if (!nome || !email) {
      setErrorMessage('Por favor, preencha todos os campos.');
      return;
    }

    try {
      await AsyncStorage.setItem('usuario', JSON.stringify({ nome, email }));
      Alert.alert('Sucesso', 'Cadastro realizado com sucesso!');
      setNome('');
      setEmail('');
      setErrorMessage('');
      // Redirecionamento de cadastro.
      // navigation.navigate('Home'); 
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar os dados.');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('./assets/logo.png')} 
        style={styles.logo}
        resizeMode="contain"
      />
      
      <Text style={styles.label}>Nome:</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite seu nome"
        value={nome}
        onChangeText={setNome}
      />
      
      <Text style={styles.label}>E-mail:</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite seu e-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

      <View style={styles.buttonContainer}>
        <Button 
          title="Sou Autônomo" 
          onPress={handleCadastro} // Adicionar a lógica de navegação
        />
        <Button 
          title="Pesquisar por Profissionais" 
          onPress={() => {/* Adicionar a logica */}} 
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  logo: {
    width: 250,  // 
    height: 250, // 
    alignSelf: 'center', // 
    marginBottom: 20, // 
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 12,
    paddingLeft: 10,
    backgroundColor: '#fff',
  },
  error: {
    color: 'red',
    marginBottom: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});

export default CadastroScreen;
