// "2026-11-28" (formato do back-end) -> "28/11/2026" (formato exibido)
export function isoParaBr(iso) {
  if (!iso) return "";
  const [ano, mes, dia] = iso.split("-");
  return `${dia}/${mes}/${ano}`;
}

// "28/11/2026" -> "2026-11-28". Retorna null se a data for inválida (ex.: 31/02/2026).
export function brParaIso(textoBr) {
  const partes = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(textoBr.trim());
  if (!partes) return null;

  const [, dia, mes, ano] = partes;
  const data = new Date(Number(ano), Number(mes) - 1, Number(dia));
  const valida =
    data.getFullYear() === Number(ano) &&
    data.getMonth() === Number(mes) - 1 &&
    data.getDate() === Number(dia);

  return valida ? `${ano}-${mes}-${dia}` : null;
}

// Coloca as barras automaticamente enquanto o usuário digita: "28112026" -> "28/11/2026"
export function mascaraData(texto) {
  const digitos = texto.replace(/\D/g, "").slice(0, 8);
  if (digitos.length <= 2) return digitos;
  if (digitos.length <= 4) return `${digitos.slice(0, 2)}/${digitos.slice(2)}`;
  return `${digitos.slice(0, 2)}/${digitos.slice(2, 4)}/${digitos.slice(4)}`;
}

// Data de hoje no formato "DD/MM/AAAA" (usada como padrão no cadastro)
export function hojeBr() {
  const hoje = new Date();
  const dia = String(hoje.getDate()).padStart(2, "0");
  const mes = String(hoje.getMonth() + 1).padStart(2, "0");
  return `${dia}/${mes}/${hoje.getFullYear()}`;
}