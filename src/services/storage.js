import AsyncStorage from '@react-native-async-storage/async-storage';

export async function saveCredentials(email, senha) {
  await AsyncStorage.setItem('email', email);
  await AsyncStorage.setItem('senha', senha);
}

export async function getCredentials() {
  const email = await AsyncStorage.getItem('email');
  const senha = await AsyncStorage.getItem('senha');
  return { email, senha };
}