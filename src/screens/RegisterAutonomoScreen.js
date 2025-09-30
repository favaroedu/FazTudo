import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Button from "../components/Button";

export default function RegisterAutonomoScreen({ goTo }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Tela do autônomo (em construção)</Text>
      <Button
        title="Voltar"
        onPress={() => goTo("chooseRegister")}
        type="secondary"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
});
