import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";

import Button from "../components/Button";
import { Picker } from "@react-native-picker/picker";
import { SafeAreaView } from "react-native-safe-area-context";

const screenWidth = Dimensions.get("window").width;

export default function HomeScreen({ goTo }) {
  const [servico, setServico] = useState("");
  const [menuAberto, setMenuAberto] = useState(false);
  const menuAnim = useRef(new Animated.Value(-screenWidth)).current;

  const servicos = [
    "Construção",
    "Reformas",
    "Pintura",
    "Elétrica",
    "Hidráulica",
    "Marcenaria",
    "Vidraçaria",
    "Gesso e Drywall",
    "Climatização",
    "Jardinagem",
    "Limpeza residencial",
    "Montagem de móveis",
    "Serralheria",
    "Dedetização",
    "Segurança eletrônica",
    "Energia solar",
    "Piscinas",
    "Informática",
    "Internet e Redes",
    "Instalações",
  ].sort((a, b) => a.localeCompare(b, "pt-BR", { sensitivity: "base" }));

  const categoriasDestaque = [
    "Elétrica",
    "Hidráulica",
    "Pintura",
    "Limpeza residencial",
    "Climatização",
    "Jardinagem",
  ];

  const handleBuscar = () => {
    if (servico) {
      goTo("search", { servico });
    }
  };

  const selecionarCategoria = (item) => {
    setServico(item);
  };

  const abrirMenu = () => {
    setMenuAberto(true);
    Animated.timing(menuAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const fecharMenu = () => {
    Animated.timing(menuAnim, {
      toValue: -screenWidth,
      duration: 300,
      useNativeDriver: false,
    }).start(() => setMenuAberto(false));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={abrirMenu}>
          <Text style={styles.menu}>☰</Text>
        </TouchableOpacity>

        <View>
          <Text style={styles.headerText}>FazTudo</Text>
          <Text style={styles.headerSubtitle}>Profissionais para sua casa</Text>
        </View>
      </View>

      {menuAberto && (
        <TouchableWithoutFeedback onPress={fecharMenu}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
      )}

      <Animated.View style={[styles.menuContainer, { left: menuAnim }]}>
        <View style={styles.menuContent}>
          <View style={styles.userInfo}>
            <View style={styles.avatar} />
            <Text style={styles.userName}>Olá, Usuário!</Text>
            <Text style={styles.userEmail}>usuario@email.com</Text>
          </View>

          <Button title="Meu Perfil" onPress={() => goTo("profile")} />
          <Button title="Meus Agendamentos" onPress={() => goTo("agendamentos")} />
          <Button title="Histórico" onPress={() => goTo("historico")} />
          <Button title="Mensagens" onPress={() => goTo("mensagens")} />
          <Button title="Avaliações" onPress={() => goTo("avaliacoes")} />
          <Button title="Endereço" onPress={() => goTo("endereco")} />
          <Button title="Configurações" onPress={() => goTo("configuracoes")} />
          <Button title="Suporte" onPress={() => goTo("suporte")} />
          <Button title="Sair do aplicativo" onPress={() => goTo("login")} type="secondary" />
          <Button title="Fechar menu" onPress={fecharMenu} type="secondary" />
        </View>
      </Animated.View>

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroCard}>
          <Text style={styles.heroTitle}>Olá, o que você precisa hoje?</Text>
          <Text style={styles.heroSubtitle}>
            Encontre profissionais de confiança para serviços residenciais.
          </Text>
        </View>

        <View style={styles.searchCard}>
          <Text style={styles.sectionTitle}>Buscar profissional</Text>
          <Text style={styles.helperText}>Selecione uma área de serviço:</Text>

          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={servico}
              style={styles.picker}
              onValueChange={(itemValue) => setServico(itemValue)}
            >
              <Picker.Item label="Escolha um serviço..." value="" />

              {servicos.map((item) => (
                <Picker.Item key={item} label={item} value={item} />
              ))}
            </Picker>
          </View>

          <Button
            title="Buscar profissionais"
            onPress={handleBuscar}
            disabled={!servico}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Serviços populares</Text>

          <View style={styles.grid}>
            {categoriasDestaque.map((item) => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.categoryCard,
                  servico === item && styles.categoryCardSelected,
                ]}
                onPress={() => selecionarCategoria(item)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    servico === item && styles.categoryTextSelected,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Como funciona?</Text>
          <Text style={styles.infoText}>
            Escolha o serviço, encontre profissionais disponíveis e acompanhe
            seus agendamentos pelo app.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },

  header: {
    backgroundColor: "#ff9100ff",
    paddingVertical: 14,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
  },

  menu: {
    fontSize: 28,
    color: "#fff",
    marginRight: 14,
  },

  headerText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "800",
  },

  headerSubtitle: {
    color: "#fff",
    fontSize: 12,
    opacity: 0.9,
  },

  container: {
    padding: 20,
    paddingBottom: 35,
  },

  heroCard: {
    backgroundColor: "#0A2F73",
    borderRadius: 18,
    padding: 20,
    marginBottom: 18,
  },

  heroTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 8,
  },

  heroSubtitle: {
    color: "#fff",
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.9,
  },

  searchCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 22,
    borderWidth: 1,
    borderColor: "#eee",
  },

  section: {
    marginBottom: 22,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#0A2F73",
    marginBottom: 8,
  },

  helperText: {
    color: "#666",
    fontSize: 13,
    marginBottom: 10,
  },

  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    backgroundColor: "#fff",
    marginBottom: 12,
    overflow: "hidden",
  },

  picker: {
    height: 52,
    color: "#333",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  categoryCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 14,
    paddingVertical: 18,
    paddingHorizontal: 10,
    alignItems: "center",
  },

  categoryCardSelected: {
    backgroundColor: "#ff9100ff",
    borderColor: "#ff9100ff",
  },

  categoryText: {
    color: "#0A2F73",
    fontWeight: "700",
    textAlign: "center",
  },

  categoryTextSelected: {
    color: "#fff",
  },

  infoCard: {
    backgroundColor: "#fff7ed",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#ffe0b8",
  },

  infoTitle: {
    color: "#0A2F73",
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 6,
  },

  infoText: {
    color: "#555",
    fontSize: 13,
    lineHeight: 19,
  },

  menuContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: Dimensions.get("window").width * 0.75,
    backgroundColor: "#f5f5f5",
    zIndex: 20,
    paddingTop: 60,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },

  menuContent: {
    paddingHorizontal: 20,
  },

  overlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: Dimensions.get("window").width * 0.75,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    zIndex: 15,
  },

  userInfo: {
    alignItems: "center",
    marginBottom: 20,
  },

  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#ccc",
    marginBottom: 10,
  },

  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111",
  },

  userEmail: {
    fontSize: 14,
    color: "#666",
  },
});