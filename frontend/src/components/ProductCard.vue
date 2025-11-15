<template>
  <v-col cols="12" sm="6" md="4">
    <v-card class="hover-scale elevation-4">
      <v-card-title>{{ product.nombre }}</v-card-title>
      <v-card-text>
        <div>{{ product.descripcion }}</div>
        <div class="mt-2 font-weight-bold">Precio: {{ product.precio }}</div>
        <div>Stock: {{ product.stock }}</div>
      </v-card-text>
      <v-card-actions class="justify-center">
        <v-btn
          small
          color="blue darken-2"
          dark
          @click="$emit('edit', product.id_producto)"
          ><v-icon left>mdi-pencil</v-icon>Editar</v-btn
        >
        <v-btn
          small
          color="red darken-2"
          dark
          @click="$emit('delete', product.id_producto)"
          ><v-icon left>mdi-delete</v-icon>Eliminar</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-col>
</template>

<script>
export default {
  props: ["product"],
};
</script>
