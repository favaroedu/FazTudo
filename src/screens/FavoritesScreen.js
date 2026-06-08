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
  getDocs,
  doc,
  deleteDoc,
} from "firebase/firestore";

import { auth, db } from "../services/firebaseConfig";

import AppHeader from "../components/AppHeader";
import Button from "../components/Button";

export default function FavoritesScreen({ goTo }) {
  const [favoritos, setFavoritos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const carregarFavoritos = async () => {
    try {
      const usuario = auth.currentUser;

      if (!usuario) {
        setCarregando(false);
        return;
      }

      const favoritosRef = collection(
        db,
        "users",
        usuario.uid,
        "favoritos"
      );

      const favoritosSnap = await getDocs(favoritosRef);

      const lista = [];

      favoritosSnap.forEach((documento) => {
        lista.push({
          id: documento.id,
          ...documento.data(),
        });
      });

      setFavoritos(lista);
    } catch (error) {
      console.log("Erro ao carregar favoritos:", error);
      Alert.alert("Erro", "Não foi possível carregar seus favoritos.");
    } finally {
      setCarregando(false);
    }
  };

  const removerFavorito = async (favoritoId) => {
    try {
      const usuario = auth.currentUser;

      if (!usuario) {
        Alert.alert("Erro", "Usuário não autenticado.");
        return;
      }

      await deleteDoc(
        doc(
          db,
          "users",
          usuario.uid,
          "favoritos",
          favoritoId
        )
      );

      setFavoritos((listaAtual) =>
        listaAtual.filter((item) => item.id !== favoritoId)
      );

      Alert.alert("Removido", "Profissional removido dos favoritos.");
    } catch (error) {
      console.log("Erro ao remover favorito:", error);
      Alert.alert("Erro", "Não foi possível remover dos favoritos.");
    }
  };

  useEffect(() => {
    carregarFavoritos();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader
        title="Favoritos"
        subtitle="Profissionais salvos por você"
        showBack
        onBack={() => goTo("home")}
        backgroundColor="#0A2F73"
      />

      {carregando ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0A2F73" />
          <Text style={styles.loadingText}>Carregando favoritos...</Text>
        </View>
      ) : favoritos.length === 0 ? (
        <View style={styles.container}>
          <View style={styles.emptyCard}>
            <Text style={styles.icon}>♡</Text>

            <Text style={styles.title}>
              Você ainda não possui favoritos
            </Text>

            <Text style={styles.subtitle}>
              Quando encontrar um profissional de confiança, salve aqui para
              acessar depois com facilidade.
            </Text>

            <Button
              title="Buscar profissionais"
              onPress={() => goTo("home")}
            />
          </View>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.resultText}>
            {favoritos.length} profissional(is) salvo(s)
          </Text>

          {favoritos.map((profissional) => (
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
                      profissionalId: profissional.profissionalId,
                    })
                  }
                />

                <Button
                  title="Remover dos favoritos"
                  onPress={() => removerFavorito(profissional.id)}
                  type="secondary"
                />
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
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
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },

  listContainer: {
    padding: 20,
    paddingBottom: 35,
  },

  resultText: {
    fontSize: 15,
    color: "#666",
    marginBottom: 14,
  },

  emptyCard: {
    backgroundColor: "#fff7ed",
    borderRadius: 20,
    padding: 26,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ffe0b8",
  },

  icon: {
    fontSize: 52,
    color: "#ff9100ff",
    marginBottom: 12,
  },

  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0A2F73",
    textAlign: "center",
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 22,
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