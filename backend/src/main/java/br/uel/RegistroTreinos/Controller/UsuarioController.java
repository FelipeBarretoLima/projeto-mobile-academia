package br.uel.RegistroTreinos.Controller;

import br.uel.RegistroTreinos.Model.Usuario;
import br.uel.RegistroTreinos.Service.UsuarioService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    // GET /api/usuarios?busca=texto -> lista todos ou pesquisa por nome
    @GetMapping
    public ResponseEntity<List<Usuario>> listar(@RequestParam(required = false) String busca) {
        List<Usuario> usuarios = (busca == null || busca.isBlank())
                ? usuarioService.listarTodos()
                : usuarioService.pesquisarPorNome(busca.trim());
        return ResponseEntity.ok(usuarios);
    }

    // GET /api/usuarios/{id} -> busca um usuário
    @GetMapping("/{id}")
    public ResponseEntity<Usuario> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(usuarioService.buscarPorID(id));
    }

    // POST /api/usuarios -> cadastra
    @PostMapping
    public ResponseEntity<Usuario> cadastrar(@RequestBody Usuario usuario) {
        Usuario salvo = usuarioService.salvar(usuario);
        return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
    }

    // PUT /api/usuarios/{id} -> atualiza
    @PutMapping("/{id}")
    public ResponseEntity<Usuario> atualizar(@PathVariable Long id, @RequestBody Usuario usuario) {
        return ResponseEntity.ok(usuarioService.atualizar(id, usuario));
    }

    // DELETE /api/usuarios/{id} -> exclui
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        usuarioService.excluir(id);
        return ResponseEntity.noContent().build();
    }
}