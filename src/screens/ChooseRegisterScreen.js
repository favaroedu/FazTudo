import React from "react";
import { View, StyleSheet } from "react-native";
import Button from "../components/Button";

export default function ChooseRegisterScreen({ goTo }) {
  return (
    <View style={styles.container}>
      <Button
        title="Sou USUÁRIO"
        onPress={() => goTo("registerUser")}
        type="secondary"
      />
      <Button
        title="Sou AUTÔNOMO"
        onPress={() => goTo("registerAutonomo")}
        type="secondary"
      />
      <Button title="Voltar ao LOGIN" onPress={() => goTo("login")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
});
