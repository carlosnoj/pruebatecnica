<template>
  <v-container fluid class="pa-6 grey lighten-5 min-h-screen">
    <v-row justify="center">
      <v-col cols="12" md="8" class="text-center mb-4">
        <h1 class="font-weight-bold display-1 blue--text text--darken-2">
          🛍️ Catálogo de Productos
        </h1>

        <v-text-field
          v-model="searchTerm"
          label="Buscar producto..."
          outlined
          dense
          prepend-inner-icon="mdi-magnify"
          class="mt-6"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col
        v-for="producto in filteredProductos"
        :key="producto.id_producto"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <v-card
          class="rounded-xl elevation-5 hover-scale transition-ease-in-out"
          max-width="320"
        >
          <v-img
            :src="
              producto.imagen ||
              'https://via.placeholder.com/320x200?text=Producto'
            "
            height="200px"
            class="rounded-t-xl"
          ></v-img>

          <v-card-title class="headline text-truncate">{{
            producto.nombre
          }}</v-card-title>

          <v-card-text>
            <div class="grey--text text--darken-1 mb-2">
              {{ producto.descripcion }}
            </div>

            <div class="d-flex justify-space-between align-center mt-4">
              <span class="font-weight-bold text-h6 blue--text">
                Q{{ producto.precio }}
              </span>

              <v-chip
                :color="
                  producto.stock > 0 ? 'green lighten-4' : 'red lighten-4'
                "
                :text-color="
                  producto.stock > 0 ? 'green darken-2' : 'red darken-2'
                "
                small
              >
                {{ producto.stock > 0 ? "Disponible" : "Agotado" }}
              </v-chip>
            </div>
          </v-card-text>

          <v-card-actions>
            <v-btn
              color="blue darken-2"
              dark
              block
              elevation="2"
              @click="verDetalle(producto)"
            >
              Ver Detalle
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Paginación -->
    <v-row justify="center" class="mt-6">
      <v-pagination
        v-model="currentPage"
        :length="totalPages"
        color="blue darken-2"
      ></v-pagination>
    </v-row>

    <!-- Modal de detalle del producto -->
    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-img
          :src="
            selectedProduct.imagen ||
            'https://via.placeholder.com/500x300?text=Producto'
          "
          height="300px"
        ></v-img>
        <v-card-title class="headline">{{
          selectedProduct.nombre
        }}</v-card-title>
        <v-card-text>
          <p>{{ selectedProduct.descripcion }}</p>
          <p class="mt-2 font-weight-bold text-h6">
            Precio: Q{{ selectedProduct.precio }}
          </p>
          <p>
            <v-chip
              :color="
                selectedProduct.stock > 0 ? 'green lighten-4' : 'red lighten-4'
              "
              :text-color="
                selectedProduct.stock > 0 ? 'green darken-2' : 'red darken-2'
              "
              small
            >
              {{ selectedProduct.stock > 0 ? "Disponible" : "Agotado" }}
            </v-chip>
          </p>
        </v-card-text>
        <v-card-actions>
          <v-btn color="blue darken-2" text @click="dialog = false"
            >Cerrar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  name: "ProductosList",
  data() {
    return {
      productos: [],
      currentPage: 1,
      perPage: 8,
      searchTerm: "",
      dialog: false,
      selectedProduct: {},
    };
  },
  computed: {
    filteredProductos() {
      let filtered = this.productos.filter((p) =>
        p.nombre.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
      const start = (this.currentPage - 1) * this.perPage;
      return filtered.slice(start, start + this.perPage);
    },
    totalPages() {
      return Math.ceil(this.productos.length / this.perPage);
    },
  },
  methods: {
    async fetchProductos() {
      try {
        const response = await axios.get("http://localhost:3000/productos");
        this.productos = response.data;
      } catch (error) {
        console.error("Error al obtener los productos:", error);
      }
    },
    verDetalle(producto) {
      this.selectedProduct = producto;
      this.dialog = true;
    },
  },
  mounted() {
    this.fetchProductos();
  },
};
</script>

<style scoped>
.hover-scale {
  transition: all 0.2s ease-in-out;
}
.hover-scale:hover {
  transform: translateY(-5px) scale(1.03);
}
</style>
