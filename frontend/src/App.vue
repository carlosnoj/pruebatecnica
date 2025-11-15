<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <!-- <div class="d-flex align-center">

      </div> -->
      <v-app-bar-title class="mr-2">Catálogos App</v-app-bar-title>
      <v-spacer></v-spacer>

      <div v-if="!isAuthenticated">
        <v-btn text @click="$router.push('/loginapp')">Ingresar</v-btn>
      </div>
      <div v-else>
        <v-btn text @click="$router.push('/productsapp')">Productos</v-btn>
        <v-btn text v-if="isAdmin" @click="$router.push('/usersadmin')"
          >Usuarios</v-btn
        >
        <v-btn text @click="logout">Salir</v-btn>
      </div>
    </v-app-bar>

    <VMain>
      <v-container fluid>
        <router-view />
      </v-container>
    </VMain>
  </v-app>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "App",
  computed: {
    ...mapGetters(["isAuthenticated", "user"]),
    isAdmin() {
      console.log("user en appvue: ", this.user);
      console.log("rol en appvue:", this.user.rol);
      return this.user && this.user.rol === "admin";
    },
  },
  methods: {
    ...mapActions(["logout"]),
  },
};
</script>
