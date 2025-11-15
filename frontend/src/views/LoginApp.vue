<template>
  <v-row justify="center">
    <v-col cols="12" md="4">
      <v-card>
        <v-card-title>Iniciar sesión</v-card-title>
        <v-card-text>
          <v-text-field v-model="email" label="Correo"></v-text-field>
          <v-text-field
            v-model="password"
            label="Contraseña"
            type="password"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="doLogin">Entrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { isNavigationFailure, NavigationFailureType } from "vue-router";

export default {
  data() {
    return { email: "", password: "" };
  },
  methods: {
    async doLogin() {
      try {
        console.log("entro al action del boton");
        await this.$store.dispatch("login", {
          correo: this.email,
          password: this.password,
        });
        this.$router.push("/productsapp").catch((error) => {
          if (!isNavigationFailure(error, NavigationFailureType.redirected)) {
            Promise.reject(error);
          }
        });
      } catch (e) {
        alert("Error de autenticación");
      }
    },
  },
};
</script>
