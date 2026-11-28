import axios from "axios";


// O celular precisa estar no mesmo Wi-Fi que o computador.
const API_URL = "http://192.168.15.4:8080/api";

export const api = axios.create({
  baseURL: API_URL,
  timeout: 5000,
});


// Se o back-end não respondeu (desligado, IP errado), devolve uma mensagem genérica.
export function mensagemDeErro(error, padrao = "Ocorreu um erro inesperado.") {
  if (error.response?.data?.errors?.general) {
    return error.response.data.errors.general;
  }
  if (!error.response) {
    return "Não foi possível conectar ao servidor. Verifique se o back-end está rodando.";
  }
  return padrao;
}