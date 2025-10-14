import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
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
    "Eletricista",
    "Encanador",
    "Pedreiro",
    "Pintor",
    "Jardineiro",
    "Marceneiro",
    "Diarista",
    "Outros",
  ];

  const servicosOrdenados = servicos.sort();

  const handleBuscar = () => {
    if (servico) {
      goTo("search", { servico });
    }
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
      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity onPress={abrirMenu}>
          <Text style={styles.menu}>☰</Text>
        </TouchableOpacity>
        <Text style={styles.headerText}>Profissionais</Text>
      </View>

      {/* Overlay para fechar o menu ao tocar fora */}
      {menuAberto && (
        <TouchableWithoutFeedback onPress={fecharMenu}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
      )}

      {/* Menu lateral animado */}
<Animated.View style={[styles.menuContainer, { left: menuAnim }]}>
  <View style={styles.menuContent}>
    {/* Foto e nome do usuário */}
    <View style={styles.userInfo}>
      <View style={styles.avatar} />
      <Text style={styles.userName}>Olá, Usuário!</Text>
      <Text style={styles.userEmail}>usuario@email.com</Text>
    </View>

    {/* Opções do menu */}
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


      {/* Conteúdo principal */}
      <View style={styles.container}>
        <Text style={styles.label}>Selecione um serviço:</Text>
        <Picker
          selectedValue={servico}
          style={styles.picker}
          onValueChange={(itemValue) => setServico(itemValue)}
        >
          <Picker.Item label="Escolha um serviço..." value="" />
          {servicosOrdenados.map((item) => (
            <Picker.Item key={item} label={item} value={item} />
          ))}
        </Picker>

        <Button title="Buscar" onPress={handleBuscar} disabled={!servico} />
        <Button title="Voltar" onPress={() => goTo("login")} type="secondary" />
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
    backgroundColor: "#ff9100ff",
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
  picker: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 12,
  },
  menuContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: Dimensions.get("window").width * 0.75,
    backgroundColor: "#f0f0f0",
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
    gap: 0,
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
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
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
  },
});

