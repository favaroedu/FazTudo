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

import {
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

import { db } from "../services/firebaseConfig";

import AppHeader from "../components/AppHeader";
import Button from "../components/Button";

export default function SearchScreen({ goTo, servico }) {
  const [profissionais, setProfissionais] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const buscarProfissionais = async () => {
    if (!servico) {
      setCarregando(false);
      Alert.alert("Erro", "Nenhum serviço foi selecionado.");
      return;
    }

    try {
      console.log("Buscando profissionais para:", servico);

      const q = query(
        collection(db, "users"),
        where("tipo", "==", "profissional"),
        where("servico", "==", servico)
      );

      const querySnapshot = await getDocs(q);

      const lista = [];

      querySnapshot.forEach((documento) => {
        lista.push({
          id: documento.id,
          ...documento.data(),
        });
      });

      console.log("Profissionais encontrados:", lista.length);

      setProfissionais(lista);
    } catch (error) {
      console.log("Erro ao buscar profissionais:", error);
      Alert.alert(
        "Erro",
        "Não foi possível buscar os profissionais. Verifique as regras do Firestore."
      );
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    buscarProfissionais();
  }, [servico]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader
        title="Profissionais"
        subtitle={servico || "Resultado da busca"}
        showBack
        onBack={() => goTo("home")}
        backgroundColor="#0A2F73"
      />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {carregando ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0A2F73" />
            <Text style={styles.loadingText}>Buscando profissionais...</Text>
          </View>
        ) : profissionais.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>
              Nenhum profissional encontrado
            </Text>

            <Text style={styles.emptyText}>
              Ainda não existem profissionais cadastrados para {servico}.
            </Text>

            <Button
              title="Buscar outra categoria"
              onPress={() => goTo("home")}
            />
          </View>
        ) : (
          <>
            <Text style={styles.resultText}>
              {profissionais.length} profissional(is) encontrado(s)
            </Text>

            {profissionais.map((profissional) => (
              <View key={profissional.id} style={styles.card}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {profissional.nome
                      ? profissional.nome.charAt(0).toUpperCase()
                      : "P"}
                  </Text>
                </View>

                <View style={styles.cardContent}>
                  <Text style={styles.name}>
                    {profissional.nome || "Nome não informado"}
                  </Text>

                  <Text style={styles.service}>
                    {profissional.servico || "Serviço não informado"}
                  </Text>

                  <Text style={styles.location}>
                    {profissional.cidade || "Cidade não informada"} -{" "}
                    {profissional.uf || "UF"}
                  </Text>

                  <Text style={styles.rating}>
                    ⭐ Ainda sem avaliações
                  </Text>

                  <Button
                    title="Ver perfil"
                    onPress={() =>
                      goTo("professionalProfile", {
                        profissionalId: profissional.id,
                      })
                    }
                  />
                </View>
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },

  container: {
    padding: 20,
    paddingBottom: 35,
  },

  loadingContainer: {
    marginTop: 80,
    alignItems: "center",
  },

  loadingText: {
    marginTop: 12,
    color: "#666",
  },

  resultText: {
    fontSize: 15,
    color: "#666",
    marginBottom: 14,
  },

  emptyCard: {
    marginTop: 80,
    backgroundColor: "#fff7ed",
    borderRadius: 18,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ffe0b8",
  },

  emptyTitle: {
    fontSize: 21,
    fontWeight: "800",
    color: "#0A2F73",
    textAlign: "center",
    marginBottom: 8,
  },

  emptyText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#eee",
  },

  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#0A2F73",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  avatarText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "900",
  },

  cardContent: {
    flex: 1,
  },

  name: {
    fontSize: 17,
    fontWeight: "800",
    color: "#0A2F73",
    marginBottom: 3,
  },

  service: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ff9100ff",
    marginBottom: 3,
  },

  location: {
    fontSize: 13,
    color: "#666",
    marginBottom: 4,
  },

  rating: {
    fontSize: 13,
    color: "#555",
    marginBottom: 10,
  },
});