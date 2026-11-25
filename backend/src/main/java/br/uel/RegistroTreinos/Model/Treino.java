package br.uel.RegistroTreinos.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "treino")
@Setter
@Getter
public class Treino {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    // Obrigatórios
    private LocalDate date;
    private String nomeTreino;

    // Opcional
    @Column(length = 255)
    private String observacoes;

    public Treino() {
    }

    public Treino(Usuario usuario, LocalDate date, String nomeTreino) {
        this.usuario = usuario;
        this.date = date;
        this.nomeTreino = nomeTreino;
    }
}