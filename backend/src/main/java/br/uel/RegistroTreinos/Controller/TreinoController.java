package br.uel.RegistroTreinos.Controller;

import br.uel.RegistroTreinos.Model.Treino;
import br.uel.RegistroTreinos.Service.TreinoService;
import br.uel.RegistroTreinos.Service.UsuarioService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios/{usuarioId}/treinos")
public class TreinoController {

    private final TreinoService treinoService;
    private final UsuarioService usuarioService;

    public TreinoController(TreinoService treinoService, UsuarioService usuarioService) {
        this.treinoService = treinoService;
        this.usuarioService = usuarioService;
    }

    // GET /api/usuarios/{usuarioId}/treinos?busca=texto&direcao=asc|desc
    @GetMapping
    public ResponseEntity<List<Treino>> listar(@PathVariable Long usuarioId,
                                               @RequestParam(required = false) String busca,
                                               @RequestParam(defaultValue = "asc") String direcao) {
        return ResponseEntity.ok(treinoService.listarPorUsuario(usuarioId, busca, direcao));
    }

    // GET /api/usuarios/{usuarioId}/treinos/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Treino> buscarPorId(@PathVariable Long usuarioId, @PathVariable Long id) {
        return ResponseEntity.ok(treinoService.buscarPorId(id));
    }

    // POST /api/usuarios/{usuarioId}/treinos
    @PostMapping
    public ResponseEntity<Treino> cadastrar(@PathVariable Long usuarioId, @RequestBody Treino treino) {
        treino.setUsuario(usuarioService.buscarPorID(usuarioId));
        Treino salvo = treinoService.salvar(treino);
        return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
    }

    // PUT /api/usuarios/{usuarioId}/treinos/{id}
    @PutMapping("/{id}")
    public ResponseEntity<Treino> atualizar(@PathVariable Long usuarioId, @PathVariable Long id,
                                            @RequestBody Treino treino) {
        treino.setUsuario(usuarioService.buscarPorID(usuarioId));
        return ResponseEntity.ok(treinoService.atualizar(id, treino));
    }

    // DELETE /api/usuarios/{usuarioId}/treinos/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long usuarioId, @PathVariable Long id) {
        treinoService.excluir(id);
        return ResponseEntity.noContent().build();
    }
}