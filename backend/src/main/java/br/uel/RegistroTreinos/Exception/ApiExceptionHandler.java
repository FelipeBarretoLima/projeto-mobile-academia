package br.uel.RegistroTreinos.Exception;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class ApiExceptionHandler {

    // Dados inválidos (campo obrigatório vazio, carga <= 0, etc.) -> 400
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Object> handleDadosInvalidos(IllegalArgumentException ex) {
        return montarResposta(HttpStatus.BAD_REQUEST, ex.getMessage());
    }

    // Registro não encontrado (id inexistente) -> 404
    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<Object> handleNaoEncontrado(EntityNotFoundException ex) {
        return montarResposta(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    // Regra de negócio violada (treino duplicado, usuário com treinos) -> 409
    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<Object> handleConflito(IllegalStateException ex) {
        return montarResposta(HttpStatus.CONFLICT, ex.getMessage());
    }

    // JSON mal formatado (ex.: data inválida, texto em campo numérico) -> 400
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Object> handleJsonInvalido(HttpMessageNotReadableException ex) {
        return montarResposta(HttpStatus.BAD_REQUEST,
                "Dados em formato inválido. Verifique datas (AAAA-MM-DD) e campos numéricos.");
    }

    // Monta o corpo padrão da resposta de erro
    private ResponseEntity<Object> montarResposta(HttpStatus status, String mensagem) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", status.value());

        Map<String, String> errors = new HashMap<>();
        errors.put("general", mensagem);
        body.put("errors", errors);

        return ResponseEntity.status(status).body(body);
    }
}