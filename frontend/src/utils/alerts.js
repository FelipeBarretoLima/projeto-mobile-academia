import { Alert, Platform } from "react-native";

// Exibe uma mensagem simples (sucesso ou erro).
export function avisar(titulo, mensagem) {
  if (Platform.OS === "web") {
    window.alert(`${titulo}\n\n${mensagem}`);
  } else {
    Alert.alert(titulo, mensagem);
  }
}

// Pede confirmação antes de uma ação destrutiva (ex.: excluir).
export function confirmarExclusao(mensagem, aoConfirmar) {
  if (Platform.OS === "web") {
    if (window.confirm(mensagem)) aoConfirmar();
    return;
  }
  Alert.alert("Confirmar exclusão", mensagem, [
    { text: "Cancelar", style: "cancel" },
    { text: "Excluir", style: "destructive", onPress: aoConfirmar },
  ]);
}