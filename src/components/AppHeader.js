import React from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

export default function AppHeader({
  title,
  subtitle,
  showBack = false,
  showMenu = false,
  onBack,
  onMenu,
  backgroundColor = "#ff9100ff",
}) {
  return (
    <View style={[styles.header, { backgroundColor }]}>
      <View style={styles.leftContainer}>
        {showBack && (
          <TouchableOpacity
            onPress={onBack}
            style={styles.iconButton}
          >
            <Ionicons
              name="chevron-back"
              size={30}
              color="#fff"
            />
          </TouchableOpacity>
        )}

        <View>
          <Text style={styles.title}>{title}</Text>

          {subtitle ? (
            <Text style={styles.subtitle}>{subtitle}</Text>
          ) : null}
        </View>
      </View>

      {showMenu && (
        <TouchableOpacity
          onPress={onMenu}
          style={styles.menuButton}
        >
          <Ionicons
            name="menu"
            size={32}
            color="#fff"
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 78,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  iconButton: {
    width: 42,
    height: 42,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 6,
    marginLeft: -6,
  },

  menuButton: {
    width: 42,
    height: 42,
    justifyContent: "center",
    alignItems: "center",
    marginRight: -6,
  },

  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "800",
  },

  subtitle: {
    color: "#fff",
    fontSize: 12,
    opacity: 0.9,
    marginTop: 2,
  },
});