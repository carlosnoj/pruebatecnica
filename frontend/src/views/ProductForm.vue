<template>
  <v-row justify="center">
    <v-col cols="12" md="8">
      <v-card>
        <v-card-title>{{ isEdit ? "Editar" : "Crear" }} producto</v-card-title>
        <v-card-text>
          <v-text-field v-model="product.nombre" label="Nombre" />
          <v-textarea v-model="product.descripcion" label="Descripción" />
          <v-text-field v-model="product.precio" label="Precio" type="number" />
          <v-text-field v-model="product.stock" label="Stock" type="number" />
          <v-text-field v-model="product.id_categoria" label="Categoria" />
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="save">Guardar</v-btn>
          <v-btn text @click="$router.push('/productsapp')">Cancelar</v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import api from "../services/api";

export default {
  data() {
    return {
      product: {
        nombre: "",
        descripcion: "",
        precio: 0,
        stock: 0,
        id_categoria: "",
      },
      isEdit: false,
    };
  },
  async created() {
    const id = this.$route.params.id;
    if (id) {
      this.isEdit = true;
      const res = await api.get(`/productos/${id}`);
      this.product = res.data;
    }
  },
  methods: {
    async save() {
      const producto = this.product;
      producto.precio = Number(this.product.precio);
      producto.stock = Number(this.product.stock);

      try {
        if (this.isEdit) {
          await api.put(`/productos/${this.product.id_producto}`, producto);
        } else {
          await api.post("/productos", producto);
        }
        this.$router.push("/productsapp");
      } catch (e) {
        console.log(e);
        alert("Error al guardar");
      }
    },

    async removeItem() {
      try {
        if (this.isDelete) {
          await api.delete(`/productos/${this.product.id_producto}`);
          this.$router.push("/productsapp");
        }
      } catch (e) {
        console.log(e);
        alert("Error al borrar registro");
      }
    },
  },
};
</script>
