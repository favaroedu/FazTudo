import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import Button from "../components/Button";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen({ goTo }) {
  const [busca, setBusca] = useState("");

  const handleBuscar = () => {
    console.log("Buscando por:", busca);
    goTo("search", { termo: busca });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.menu}>☰</Text>
        <Text style={styles.headerText}>Profissionais</Text>
      </View>

      <View style={styles.container}>
        <Text style={styles.label}>Buscar profissional:</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite o nome ou serviço"
          value={busca}
          onChangeText={setBusca}
          onSubmitEditing={handleBuscar}
          returnKeyType="search"
        />

        <Button title="Buscar" onPress={handleBuscar} />
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
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  menu: {
    fontSize: 24,
    color: "#fff",
    marginRight: 12,
  },
  headerText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
});
