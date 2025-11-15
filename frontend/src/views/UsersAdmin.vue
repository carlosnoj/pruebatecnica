<template>
  <v-container fluid>
    <v-card class="elevation-6 pa-4">
      <v-toolbar flat color="primary" dark>
        <v-toolbar-title>Administración de Usuarios</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn color="secondary" dark @click="abrirDialogoNuevo">
          <v-icon left>mdi-plus</v-icon>Nuevo Usuario
        </v-btn>
      </v-toolbar>

      <v-text-field
        v-model="busqueda"
        append-icon="mdi-magnify"
        label="Buscar usuario"
        class="mt-4"
        outlined
        dense
      ></v-text-field>

      <v-data-table
        :headers="headers"
        :items="usuariosFiltrados"
        :items-per-page="5"
        class="elevation-2 mt-2"
      >
        <template v-slot:[`item.acciones`]="{ item }">
          <v-btn icon color="blue" @click="editarUsuario(item)">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn icon color="red" @click="eliminarUsuario(item)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <!-- Diálogo Crear / Editar -->
    <v-dialog v-model="dialogo" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline"
            >{{ modoEditar ? "Editar" : "Nuevo" }} Usuario</span
          >
        </v-card-title>

        <v-card-text>
          <v-form ref="form">
            <v-text-field
              v-model="usuarioActual.usuario"
              label="Usuario"
              outlined
              dense
              required
            ></v-text-field>

            <v-text-field
              v-model="usuarioActual.nombre"
              label="Nombre completo"
              outlined
              dense
              required
            ></v-text-field>

            <v-text-field
              v-model="usuarioActual.correo"
              label="Correo electrónico"
              outlined
              dense
              required
              type="email"
            ></v-text-field>

            <v-text-field
              v-if="!modoEditar"
              v-model="usuarioActual.password"
              label="Contraseña"
              type="password"
              outlined
              dense
              required
            ></v-text-field>

            <v-select
              v-model="usuarioActual.id_rol"
              :items="roles"
              item-text="nombre_rol"
              item-value="id_rol"
              label="Rol"
              outlined
              dense
              required
            ></v-select>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text color="grey" @click="cerrarDialogo">Cancelar</v-btn>
          <v-btn color="primary" @click="guardarUsuario">
            {{ modoEditar ? "Actualizar" : "Guardar" }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar de notificaciones -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="2500">
      {{ snackbar.text }}
    </v-snackbar>
  </v-container>
</template>

<script>
import api from "../services/api";

export default {
  data() {
    return {
      usuarios: [],
      roles: [],
      busqueda: "",
      dialogo: false,
      modoEditar: false,
      usuarioActual: {
        id_usuario: null,
        usuario: "",
        nombre: "",
        correo: "",
        password: "",
        id_rol: null,
      },
      snackbar: {
        show: false,
        text: "",
        color: "",
      },
      headers: [
        { text: "Usuario", value: "usuario" },
        { text: "Nombre", value: "nombre" },
        { text: "Correo", value: "correo" },
        { text: "Rol", value: "nombre_rol" },
        { text: "Acciones", value: "acciones", sortable: false },
      ],
    };
  },

  computed: {
    usuariosFiltrados() {
      const term = this.busqueda.toLowerCase();
      return this.usuarios.filter(
        (u) =>
          u.usuario.toLowerCase().includes(term) ||
          u.nombre.toLowerCase().includes(term) ||
          u.correo.toLowerCase().includes(term)
      );
    },
  },

  methods: {
    async cargarUsuarios() {
      try {
        const res = await api.get("/usuarios");
        console.log("usuarios: ", res.data);
        this.usuarios = res.data;
      } catch (err) {
        console.error(err);
      }
    },

    async cargarRoles() {
      try {
        const res = await api.get("/rols");
        this.roles = res.data;
      } catch (err) {
        console.error(err);
      }
    },

    abrirDialogoNuevo() {
      this.modoEditar = false;
      this.usuarioActual = {
        id_usuario: null,
        usuario: "",
        nombre: "",
        correo: "",
        password: "",
        id_rol: null,
      };
      this.dialogo = true;
    },

    editarUsuario(usuario) {
      this.modoEditar = true;
      this.usuarioActual = { ...usuario };
      this.dialogo = true;
    },

    cerrarDialogo() {
      this.dialogo = false;
    },

    async guardarUsuario() {
      try {
        if (this.modoEditar) {
          console.log("id_usuario", this.usuarioActual.id_usuario);
          console.log("usuario", this.usuarioActual);
          const editUsuario = { ...this.usuarioActual };
          delete editUsuario.f_registro;
          delete editUsuario.nombre_rol;
          delete editUsuario.descripcion_rol;

          console.log("usuario", editUsuario);
          await api.patch(
            `/usuarios/${editUsuario.id_usuario}`, //this.usuarioActual.id_usuario
            editUsuario
          );
          this.mostrarSnackbar("Usuario actualizado con éxito", "success");
        } else {
          //const { id_usuario, ...nuevoUsuario } = this.usuarioActual;
          const nuevoUsuario = { ...this.usuarioActual };
          delete nuevoUsuario.id_usuario;

          console.log("usuario actual", nuevoUsuario);

          await api.post("/usuarios", nuevoUsuario); //this.usuarioActual
          this.mostrarSnackbar("Usuario creado con éxito", "success");
        }
        this.dialogo = false;
        this.cargarUsuarios();
      } catch (err) {
        console.error(err);
        this.mostrarSnackbar("Error al guardar usuario", "error");
      }
    },

    async eliminarUsuario(usuario) {
      if (confirm(`¿Desea eliminar al usuario ${usuario.usuario}?`)) {
        try {
          await api.delete(`/usuarios/${usuario.id_usuario}`);
          this.mostrarSnackbar("Usuario eliminado", "info");
          this.cargarUsuarios();
        } catch (err) {
          console.error(err);
          this.mostrarSnackbar("Error al eliminar usuario", "error");
        }
      }
    },

    mostrarSnackbar(text, color) {
      this.snackbar = { show: true, text, color };
    },
  },

  mounted() {
    this.cargarUsuarios();
    this.cargarRoles();
  },
};
</script>

<style scoped>
.v-card {
  border-radius: 16px;
}

.v-toolbar-title {
  font-weight: bold;
}

.v-data-table {
  border-radius: 12px;
}

.v-btn {
  border-radius: 8px;
}
</style>
