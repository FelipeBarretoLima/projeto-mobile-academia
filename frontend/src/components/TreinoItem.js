import { View, Text, Pressable, StyleSheet } from "react-native";
import { cores } from "../styles/cores";
import { isoParaBr } from "../utils/datas";

export default function TreinoItem({ treino, onAbrir, onEditar, onExcluir }) {
  return (
    <Pressable style={styles.cartao} onPress={onAbrir} disabled={!onAbrir}>
      <View style={styles.faixa} />

      <View style={styles.info}>
        <Text style={styles.data}>{isoParaBr(treino.date)}</Text>
        <Text style={styles.nome}>{treino.nomeTreino}</Text>
        {treino.observacoes ? (
          <Text style={styles.observacoes} numberOfLines={2}>
            {treino.observacoes}
          </Text>
        ) : null}
        {onAbrir && <Text style={styles.dica}>Toque para ver os exercícios</Text>}
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
    marginBottom: 10,
    borderWidth: 1,
    borderColor: cores.borda,
    overflow: "hidden",
  },
  faixa: {
    width: 6,
    alignSelf: "stretch",
    backgroundColor: cores.primaria,
  },
  info: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  data: {
    fontSize: 12,
    fontWeight: "700",
    color: cores.primariaEscura,
  },
  nome: {
    fontSize: 16,
    fontWeight: "600",
    color: cores.texto,
    marginTop: 2,
  },
  observacoes: {
    fontSize: 13,
    fontStyle: "italic",
    color: cores.textoSecundario,
    marginTop: 4,
  },
  dica: {
    fontSize: 12,
    color: cores.textoSecundario,
    marginTop: 4,
  },
  acoes: {
    flexDirection: "row",
    paddingRight: 8,
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