import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import QRCode from "react-native-qrcode-svg";

import {
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

import { onAuthStateChanged } from "firebase/auth";

import { auth, db } from "../services/firebaseConfig";

import AppHeader from "../components/AppHeader";
import Button from "../components/Button";

export default function QRCodeAvaliacaoScreen({ goTo }) {
  const [codigo, setCodigo] = useState(null);
  const [qrValue, setQrValue] = useState(null);

  const [carregando, setCarregando] = useState(true);
  const [gerando, setGerando] = useState(false);

  const [usuario, setUsuario] = useState(null);
  const [authVerificado, setAuthVerificado] = useState(false);

  // ==========================================
  // ACOMPANHAR AUTENTICAÇÃO
  // ==========================================

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        setUsuario(user);
        setAuthVerificado(true);
      }
    );

    return unsubscribe;
  }, []);

  // ==========================================
  // GERAR CÓDIGO ALEATÓRIO
  // ==========================================

  const gerarCodigo = () => {
    const caracteres =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    let resultado = "";

    for (let i = 0; i < 12; i++) {
      const indice = Math.floor(
        Math.random() * caracteres.length
      );

      resultado += caracteres.charAt(indice);
    }

    return resultado;
  };

  // ==========================================
  // GERAR QR CODE
  // ==========================================

  const gerarNovoQRCode = async (userAtual) => {
    try {
      setGerando(true);
      setCarregando(true);

      if (!userAtual) {
        console.log(
          "Usuário não autenticado ao tentar gerar QR Code."
        );

        Alert.alert(
          "Sessão não encontrada",
          "Não foi possível identificar sua conta. Volte ao painel e tente novamente."
        );

        setCarregando(false);
        return;
      }

      const novoCodigo = gerarCodigo();

      // ==========================================
      // DADOS QUE SERÃO GRAVADOS NO QR
      // ==========================================

      const dadosQR = JSON.stringify({
        tipo: "avaliacao",
        profissionalId: userAtual.uid,
        codigo: novoCodigo,
      });

      // ==========================================
      // VALIDADE DO QR CODE
      // ==========================================

      const agora = Date.now();

      const expiraEm = new Date(
        agora + 30 * 60 * 1000
      );

      // ==========================================
      // FIRESTORE
      // ==========================================

      const qrRef = doc(
        db,
        "qr_avaliacoes",
        novoCodigo
      );

      await setDoc(qrRef, {
        codigo: novoCodigo,
        profissionalId: userAtual.uid,
        utilizado: false,
        criadoEm: serverTimestamp(),
        expiraEm: expiraEm,
      });

      // ==========================================
      // ATUALIZAR TELA
      // ==========================================

      setCodigo(novoCodigo);
      setQrValue(dadosQR);

      console.log(
        "QR Code gerado com sucesso:",
        novoCodigo
      );
    } catch (error) {
      console.log(
        "Erro ao gerar QR Code:",
        error
      );

      console.log(
        "Código do erro Firebase:",
        error?.code
      );

      Alert.alert(
        "Erro ao gerar QR Code",
        `Não foi possível gerar o QR Code.\n\n${
          error?.code || "Erro desconhecido"
        }`
      );
    } finally {
      setGerando(false);
      setCarregando(false);
    }
  };

  // ==========================================
  // GERAR QR APÓS CONFIRMAR AUTENTICAÇÃO
  // ==========================================

  useEffect(() => {
    if (!authVerificado) {
      return;
    }

    if (!usuario) {
      setCarregando(false);

      Alert.alert(
        "Sessão não encontrada",
        "Não foi possível identificar sua conta profissional."
      );

      return;
    }

    gerarNovoQRCode(usuario);
  }, [authVerificado, usuario]);

  // ==========================================
  // LOADING
  // ==========================================

  if (!authVerificado || carregando) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <AppHeader
          title="QR Code de Avaliação"
          subtitle="Permita que seu cliente avalie seu atendimento"
          showBack
          onBack={() => goTo("homeProfissional")}
          backgroundColor="#0A2F73"
        />

        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color="#0A2F73"
          />

          <Text style={styles.loadingText}>
            {authVerificado
              ? "Gerando seu QR Code..."
              : "Verificando sua sessão..."}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // ==========================================
  // TELA PRINCIPAL
  // ==========================================

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader
        title="QR Code de Avaliação"
        subtitle="Permita que seu cliente avalie seu atendimento"
        showBack
        onBack={() => goTo("homeProfissional")}
        backgroundColor="#0A2F73"
      />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* ========================================== */}
        {/* EXPLICAÇÃO */}
        {/* ========================================== */}

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>
            Como funciona?
          </Text>

          <Text style={styles.infoText}>
            Depois de realizar um serviço, apresente
            este QR Code ao cliente.
          </Text>

          <Text style={styles.infoText}>
            O cliente deverá escanear o código pelo
            aplicativo FazTudo para registrar uma
            avaliação verificada.
          </Text>
        </View>

        {/* ========================================== */}
        {/* QR CODE */}
        {/* ========================================== */}

        {qrValue ? (
          <View style={styles.qrCard}>
            <Text style={styles.qrTitle}>
              Escaneie para avaliar
            </Text>

            <View style={styles.qrContainer}>
              <QRCode
                value={qrValue}
                size={230}
                backgroundColor="#ffffff"
                color="#000000"
              />
            </View>

            <Text style={styles.qrInstruction}>
              Mostre este código ao cliente após o
              atendimento.
            </Text>

            <View style={styles.validityCard}>
              <Text style={styles.validityTitle}>
                ⏱ QR Code temporário
              </Text>

              <Text style={styles.validityText}>
                Este código é válido por aproximadamente
                30 minutos.
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.errorCard}>
            <Text style={styles.errorTitle}>
              QR Code não disponível
            </Text>

            <Text style={styles.errorText}>
              Não foi possível gerar um código neste
              momento.
            </Text>
          </View>
        )}

        {/* ========================================== */}
        {/* CÓDIGO */}
        {/* ========================================== */}

        {codigo && (
          <View style={styles.codeCard}>
            <Text style={styles.codeLabel}>
              Código de segurança
            </Text>

            <Text style={styles.codeValue}>
              {codigo}
            </Text>
          </View>
        )}

        {/* ========================================== */}
        {/* NOVO QR */}
        {/* ========================================== */}

        <Button
          title={
            gerando
              ? "Gerando..."
              : "Gerar novo QR Code"
          }
          onPress={() => gerarNovoQRCode(usuario)}
          disabled={gerando}
        />

        {/* ========================================== */}
        {/* VOLTAR */}
        {/* ========================================== */}

        <View style={styles.backButton}>
          <Button
            title="Voltar ao painel"
            onPress={() =>
              goTo("homeProfissional")
            }
            type="secondary"
          />
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

  container: {
    padding: 20,
    paddingBottom: 35,
  },

  // ==========================================
  // LOADING
  // ==========================================

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  loadingText: {
    marginTop: 12,
    color: "#666",
    fontSize: 14,
  },

  // ==========================================
  // INFORMAÇÃO
  // ==========================================

  infoCard: {
    backgroundColor: "#fff7ed",
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: "#ffe0b8",
    marginBottom: 20,
  },

  infoTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#0A2F73",
    marginBottom: 8,
  },

  infoText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#555",
    marginBottom: 6,
  },

  // ==========================================
  // QR CODE
  // ==========================================

  qrCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: "#eee",
    alignItems: "center",
    marginBottom: 16,
  },

  qrTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: "#0A2F73",
    marginBottom: 18,
    textAlign: "center",
  },

  qrContainer: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#eee",
    marginBottom: 16,
  },

  qrInstruction: {
    fontSize: 13,
    color: "#666",
    textAlign: "center",
    lineHeight: 19,
  },

  // ==========================================
  // VALIDADE
  // ==========================================

  validityCard: {
    width: "100%",
    backgroundColor: "#f5f8ff",
    borderRadius: 12,
    padding: 12,
    marginTop: 16,
    alignItems: "center",
  },

  validityTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#0A2F73",
    marginBottom: 4,
  },

  validityText: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },

  // ==========================================
  // CÓDIGO
  // ==========================================

  codeCard: {
    backgroundColor: "#f7f7f7",
    borderRadius: 14,
    padding: 14,
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#eee",
  },

  codeLabel: {
    fontSize: 12,
    color: "#777",
    marginBottom: 5,
  },

  codeValue: {
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 2,
    color: "#0A2F73",
  },

  // ==========================================
  // ERRO
  // ==========================================

  errorCard: {
    backgroundColor: "#fff5f5",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#ffd6d6",
  },

  errorTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#b00020",
    marginBottom: 6,
  },

  errorText: {
    fontSize: 13,
    color: "#666",
    textAlign: "center",
  },

  // ==========================================
  // VOLTAR
  // ==========================================

  backButton: {
    marginTop: 10,
  },
});