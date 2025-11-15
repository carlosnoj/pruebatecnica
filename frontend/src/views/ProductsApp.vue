<template>
  <div>
    <v-row align="center" justify="space-between">
      <v-col cols="12" md="8" class="text-center mb-4">
        <v-text-field
          v-model="q"
          append-icon="mdi-magnify"
          label="Buscar productos"
          class="mt-6"
          @keyup.enter="search"
        ></v-text-field>
      </v-col>

      <v-col cols="12" md="6" class="text-right">
        <v-btn color="primary" @click="$router.push('/productsapp/new')"
          >Nuevo producto</v-btn
        >
      </v-col>
    </v-row>

    <v-row>
      <product-card
        v-for="p in productos"
        :key="p.producto"
        :product="p"
        @edit="editProduct"
        @delete="deleteProduct"
      />
    </v-row>

    <v-dialog v-model="confirmDialog" max-width="400">
      <v-card>
        <v-card-title class="headline">Confirmar eliminación</v-card-title>
        <v-card-text>
          ¿Estás seguro de que deseas eliminar este producto?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey darken-1" text @click="confirmDialog = false">
            Cancelar
          </v-btn>
          <v-btn color="red darken-2" text @click="confirmDelete">
            Eliminar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color" top>
      {{ snackbar.text }}
    </v-snackbar>

    <pagination
      :total="meta.total"
      :page.sync="page"
      :limit.sync="limit"
      @change="loadPage"
    />
  </div>
</template>

<script>
import ProductCard from "../components/ProductCard.vue";
import Pagination from "../components/PaginationApp.vue";
import { mapGetters } from "vuex";
import api from "../services/api";

export default {
  components: { ProductCard, Pagination },
  data() {
    return {
      page: 1,
      limit: 9,
      q: "",
      confirmDialog: false,
      productoAEliminar: null,
      snackbar: { show: false, text: "", color: "" },
    };
  },
  computed: {
    ...mapGetters(["productos", "productosMeta"]),
    meta() {
      console.log("productsMeta: ", this.productosMeta);
      console.log("products: ", this.productos);
      return this.productosMeta;
    },
  },
  methods: {
    loadPage() {
      this.$store.dispatch("fetchProducts", {
        page: this.page,
        limit: this.limit,
        q: this.q,
      });
    },
    search() {
      this.page = 1;
      this.loadPage();
    },
    editProduct(id) {
      this.$router.push(`/productsapp/${id}/edit`);
    },
    deleteProduct(id) {
      this.productoAEliminar = id;
      this.confirmDialog = true;
    },
    async confirmDelete() {
      try {
        await api.delete(`/productos/${this.productoAEliminar}`);

        await this.$store.dispatch("fetchProducts");

        this.showSnackbar("Producto eliminado correctamente", "green");
      } catch (error) {
        console.error("Error al eliminar el producto:", error);
        this.showSnackbar("Error al eliminar el producto", "red");
      } finally {
        this.confirmDialog = false;
        this.productoAEliminar = null;
      }
    },

    showSnackbar(text, color) {
      this.snackbar = { show: true, text, color };
      setTimeout(() => (this.snackbar.show = false), 3000);
    },
  },
  created() {
    this.loadPage();
  },
};
</script>
