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
import { db } from "../services/firebaseConfig";

import AppHeader from "../components/AppHeader";
import Button from "../components/Button";

export default function ProfileProfessionalScreen({ goTo, profissionalId }) {
  const [profissional, setProfissional] = useState(null);
  const [carregando, setCarregando] = useState(true);

  const carregarProfissional = async () => {
    if (!profissionalId) {
      Alert.alert("Erro", "Profissional não encontrado.");
      goTo("home");
      return;
    }

    try {
      const profissionalRef = doc(db, "users", profissionalId);
      const profissionalSnap = await getDoc(profissionalRef);

      if (!profissionalSnap.exists()) {
        Alert.alert("Erro", "Perfil profissional não encontrado.");
        goTo("home");
        return;
      }

      setProfissional(profissionalSnap.data());
    } catch (error) {
      console.log("Erro ao carregar profissional:", error);
      Alert.alert("Erro", "Não foi possível carregar o perfil.");
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarProfissional();
  }, [profissionalId]);

  if (carregando) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <AppHeader
          title="Perfil profissional"
          subtitle="Carregando informações"
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
        title="Perfil profissional"
        subtitle={profissional?.servico || "Profissional"}
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
              {profissional?.nome
                ? profissional.nome.charAt(0).toUpperCase()
                : "P"}
            </Text>
          </View>

          <Text style={styles.name}>
            {profissional?.nome || "Nome não informado"}
          </Text>

          <Text style={styles.service}>
            {profissional?.servico || "Serviço não informado"}
          </Text>

          <Text style={styles.location}>
            {profissional?.cidade || "Cidade não informada"} -{" "}
            {profissional?.uf || "UF"}
          </Text>

          <Text style={styles.rating}>⭐ Ainda sem avaliações</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sobre o profissional</Text>

          <View style={styles.infoCard}>
            <Text style={styles.infoText}>
              Este profissional atua na área de{" "}
              {profissional?.servico || "serviços residenciais"} e está
              disponível para atendimento conforme contato informado.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contato</Text>

          <InfoItem label="Telefone" value={profissional?.telefone} />
          <InfoItem label="Email" value={profissional?.email} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Localização</Text>

          <InfoItem label="Cidade" value={profissional?.cidade} />
          <InfoItem label="Estado" value={profissional?.estado} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Galeria de trabalhos</Text>

          <View style={styles.galleryEmpty}>
            <Text style={styles.galleryIcon}>🖼️</Text>

            <Text style={styles.galleryTitle}>
              Nenhuma foto adicionada ainda
            </Text>

            <Text style={styles.galleryText}>
              Em breve este profissional poderá adicionar fotos dos trabalhos
              realizados.
            </Text>
          </View>
        </View>

        <Button
          title="Adicionar aos favoritos"
          onPress={() =>
            Alert.alert(
              "Favoritos",
              "Funcionalidade de favoritos será implementada em breve."
            )
          }
        />

        <Button
          title="Voltar para resultados"
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
  },

  container: {
    padding: 20,
    paddingBottom: 35,
  },

  profileCard: {
    alignItems: "center",
    backgroundColor: "#fff7ed",
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#ffe0b8",
  },

  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "#0A2F73",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },

  avatarText: {
    color: "#fff",
    fontSize: 36,
    fontWeight: "900",
  },

  name: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0A2F73",
    textAlign: "center",
    marginBottom: 4,
  },

  service: {
    fontSize: 15,
    fontWeight: "700",
    color: "#ff9100ff",
    marginBottom: 4,
  },

  location: {
    fontSize: 14,
    color: "#666",
    marginBottom: 6,
  },

  rating: {
    fontSize: 14,
    color: "#555",
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

  infoCard: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 14,
    padding: 14,
  },

  infoText: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
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

  galleryEmpty: {
    backgroundColor: "#fff7ed",
    borderRadius: 18,
    padding: 22,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ffe0b8",
  },

  galleryIcon: {
    fontSize: 40,
    marginBottom: 10,
  },

  galleryTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#0A2F73",
    textAlign: "center",
    marginBottom: 6,
  },

  galleryText: {
    fontSize: 13,
    color: "#666",
    textAlign: "center",
    lineHeight: 19,
  },
});