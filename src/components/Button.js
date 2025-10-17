import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

export default function Button({ title, onPress, type = "primary", disabled = false }) {
  const backgroundColor = disabled
    ? "#ccc"
    : type === "secondary"
    ? "#fd951d"
    : "#00255f";

  const textColor = disabled ? "#666" : "#fff";

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor }]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.buttonText, { color: textColor }]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  buttonText: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
});
