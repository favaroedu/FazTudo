import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import Input from '../components/Input';
import Button from '../components/Button';
import { TextInputMask } from 'react-native-masked-text';
import { saveCredentials } from '../services/storage';

export default function RegisterScreen({ goTo }) {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [ddd, setDdd] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const validarSenha = (senha) => {
    const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/;
    return regex.test(senha);
  };

  const handleRegister = async () => {
    if (!nome || !cpf || !ddd || !telefone || !email || !senha) {
      Alert.alert('Preencha todos os campos');
      return;
    }

    if (ddd.length !== 2) {
      Alert.alert('DDD inválido', 'O DDD deve conter 2 dígitos.');
      return;
    }

    const telefoneLimpo = telefone.replace(/\D/g, '');
    if (telefoneLimpo.length < 8 || telefoneLimpo.length > 9) {
      Alert.alert('Telefone inválido', 'O número deve conter entre 8 e 9 dígitos.');
      return;
    }

    if (!validarSenha(senha)) {
      Alert.alert(
        'Senha inválida',
        'A senha deve ter no mínimo 8 caracteres, incluindo pelo menos 1 número e 1 caractere especial.'
      );
      return;
    }

    const telefoneCompleto = `(${ddd}) ${telefone}`;
    const dados = { nome, cpf, telefone: telefoneCompleto, email, senha };

    await saveCredentials(email, senha);
    console.log('Dados do usuário:', dados);
    Alert.alert('Cadastro realizado!');
    goTo('login');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Cadastro de Usuário</Text>
      </View>

      <Input placeholder="Nome completo" value={nome} onChangeText={setNome} />
      <Text style={styles.label}>CPF:</Text>
      <TextInputMask
        type={'cpf'}
        value={cpf}
        onChangeText={setCpf}
        style={styles.input}
        keyboardType="numeric"
      />

      <View style={styles.row}>
        <View style={styles.dddContainer}>
          <Text style={styles.label}>DDD:</Text>
          <TextInputMask
            type={'custom'}
            options={{ mask: '99' }}
            value={ddd}
            onChangeText={setDdd}
            style={styles.input}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.telefoneContainer}>
          <Text style={styles.label}>Telefone:</Text>
          <TextInputMask
            type={'cel-phone'}
            options={{ maskType: 'BRL', withDDD: false }}
            value={telefone}
            onChangeText={setTelefone}
            style={styles.input}
            keyboardType="phone-pad"
          />
        </View>
      </View>

      <Input
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Input placeholder="Senha" value={senha} onChangeText={setSenha} secureTextEntry />

      <Button title="Cadastrar" onPress={handleRegister} />
      <Button title="Voltar" onPress={() => goTo('chooseRegister')} type="secondary" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
    justifyContent: 'center',
  },
  header: {
    backgroundColor: '#ff9100ff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
  },
  headerText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  label: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  dddContainer: {
    flex: 0.7,
  },
  telefoneContainer: {
    flex: 2,
  },
});
