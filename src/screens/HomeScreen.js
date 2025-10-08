import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Button from "../components/Button";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen({ goTo }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Bem-vindo ao App!</Text>
      </View>

      <View style={styles.container}>
        <Text style={styles.welcome}>Escolha uma opção para continuar:</Text>

        <Button title="Buscar Profissionais" onPress={() => goTo("search")} />
        <Button title="Meu Perfil" onPress={() => goTo("profile")} />
        <Button title="Sair" onPress={() => goTo("login")} type="secondary" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#6c757d",
    paddingVertical: 16,
    alignItems: "center",
    width: "100%",
  },
  headerText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  welcome: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
});
