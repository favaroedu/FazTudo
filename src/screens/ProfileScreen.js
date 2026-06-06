import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../services/firebaseConfig";

import AppHeader from "../components/AppHeader";
import Button from "../components/Button";

export default function ProfileScreen({ goTo }) {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  const carregarPerfil = async () => {
    try {
      const user = auth.currentUser;

      if (!user) {
        Alert.alert("Erro", "Usuário não autenticado.");
        goTo("login");
        return;
      }

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        Alert.alert("Erro", "Perfil não encontrado.");
        goTo("home");
        return;
      }

      setUsuario(userSnap.data());
    } catch (error) {
      console.log("Erro ao carregar perfil:", error);
      Alert.alert("Erro", "Não foi possível carregar seu perfil.");
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarPerfil();
  }, []);

  if (carregando) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <AppHeader
          title="Meu Perfil"
          subtitle="Carregando suas informações"
          showBack
          onBack={() => goTo("home")}
          backgroundColor="#0A2F73"
        />

        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0A2F73" />
          <Text style={styles.loadingText}>Carregando perfil...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader
        title="Meu Perfil"
        subtitle="Suas informações cadastradas"
        showBack
        onBack={() => goTo("home")}
        backgroundColor="#0A2F73"
      />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {usuario?.nome ? usuario.nome.charAt(0).toUpperCase() : "U"}
            </Text>
          </View>

          <Text style={styles.name}>
            {usuario?.nome || "Nome não informado"}
          </Text>

          <Text style={styles.email}>
            {usuario?.email || "Email não informado"}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dados pessoais</Text>

          <InfoItem label="Nome" value={usuario?.nome} />
          <InfoItem label="Email" value={usuario?.email} />
          <InfoItem label="Telefone" value={usuario?.telefone} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Endereço</Text>

          <InfoItem label="Cidade" value={usuario?.cidade} />
          <InfoItem label="Estado" value={usuario?.estado} />
          <InfoItem label="Endereço" value={usuario?.endereco} />
          <InfoItem label="Referência" value={usuario?.referencia || "Não informada"} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Conta</Text>

          <InfoItem label="Tipo de conta" value={usuario?.tipo} />
        </View>

        <Button
          title="Voltar para início"
          onPress={() => goTo("home")}
          type="secondary"
        />
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoItem({ label, value }) {
  return (
    <View style={styles.infoItem}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value || "Não informado"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    marginTop: 12,
    color: "#666",
    fontSize: 14,
  },

  container: {
    padding: 20,
    paddingBottom: 35,
  },

  profileCard: {
    alignItems: "center",
    backgroundColor: "#fff7ed",
    borderRadius: 18,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#ffe0b8",
  },

  avatar: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: "#0A2F73",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },

  avatarText: {
    color: "#fff",
    fontSize: 34,
    fontWeight: "900",
  },

  name: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0A2F73",
    textAlign: "center",
    marginBottom: 4,
  },

  email: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },

  section: {
    marginBottom: 22,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#0A2F73",
    marginBottom: 10,
  },

  infoItem: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },

  infoLabel: {
    fontSize: 12,
    color: "#777",
    marginBottom: 4,
  },

  infoValue: {
    fontSize: 15,
    color: "#222",
    fontWeight: "600",
  },
});