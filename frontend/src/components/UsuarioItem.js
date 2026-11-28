import { View, Text, Pressable, StyleSheet } from "react-native";
import { cores } from "../styles/cores";

export default function UsuarioItem({ usuario, onAbrir, onEditar, onExcluir }) {
  return (
    <Pressable style={styles.cartao} onPress={onAbrir} disabled={!onAbrir}>
      <View style={styles.avatar}>
        <Text style={styles.avatarLetra}>{usuario.nome.charAt(0).toUpperCase()}</Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.nome}>{usuario.nome}</Text>
        {onAbrir && <Text style={styles.dica}>Toque para ver os treinos</Text>}
      </View>

      <View style={styles.acoes}>
        <Pressable onPress={onEditar} style={styles.botaoAcao}>
          <Text style={styles.textoEditar}>Editar</Text>
        </Pressable>
        <Pressable onPress={onExcluir} style={styles.botaoAcao}>
          <Text style={styles.textoExcluir}>Excluir</Text>
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cartao: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: cores.cartao,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: cores.borda,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: cores.primaria,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarLetra: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "700",
  },
  info: {
    flex: 1,
  },
  nome: {
    fontSize: 16,
    fontWeight: "600",
    color: cores.texto,
  },
  dica: {
    fontSize: 12,
    color: cores.textoSecundario,
    marginTop: 2,
  },
  acoes: {
    flexDirection: "row",
  },
  botaoAcao: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  textoEditar: {
    color: cores.primariaEscura,
    fontWeight: "600",
  },
  textoExcluir: {
    color: cores.perigo,
    fontWeight: "600",
  },
});