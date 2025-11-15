import Vue from "vue";
import Vuex from "vuex";
import api from "../services/api";
import { decodeToken } from "../services/auth";
import router from "../router";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token: localStorage.getItem("token") || null,
    user: JSON.parse(localStorage.getItem("user") || "null"),
    productos: [],
    productosMeta: { total: 0 },
  },
  getters: {
    isAuthenticated: (state) => !!state.token,
    token: (state) => state.token,
    user: (state) => state.user,
    productos: (state) => state.productos,
    productosMeta: (state) => state.productosMeta,
  },
  mutations: {
    setToken(state, token) {
      state.token = token;
      if (token) localStorage.setItem("token", token);
      else localStorage.removeItem("token");
    },
    setUser(state, user) {
      state.user = user;
      if (user) localStorage.setItem("user", JSON.stringify(user));
      else localStorage.removeItem("user");
    },
    setProducts(state, { items, meta }) {
      state.productos = items;
      state.productosMeta = meta;
    },
  },
  actions: {
    async login({ commit }, { correo, password }) {
      let user = null;
      try {
        console.log("enviando datos al backend desde index: ");

        const res = await api.post("/usuarios/login", { correo, password });
        // adaptación según LoopBack: res.data.id o res.data.token

        console.log("respuesta del backend del login index: ", res.data);

        const token =
          res.data.id ||
          res.data.token ||
          res.data.accessToken ||
          res.data.token;
        commit("setToken", token);

        console.log("token: ", token);

        const payload = decodeToken(token);
        // Si el token no contiene rol, puedes pedir /users/{userId}
        console.log("payload decodificado: ", payload);

        if (payload) {
          user = {
            id: payload.id_usuario || payload.userId || payload.id,
            rol: payload.rol || payload.rol_name,
          };
        }
      } catch (error) {
        console.log(error.message);
      }
      // // fallback: obtener usuario del endpoint /users/me
      // try {
      //   const userRes = await api.get("/usuarios/me");
      //   user = { ...userRes.data };
      // } catch (e) {
      //   console.log(e);
      // }
      commit("setUser", user);
    },
    logout({ commit }) {
      commit("setToken", null);
      commit("setUser", null);
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      router.push("/loginapp").catch(() => {});
    },
    async fetchProducts({ commit }, { page = 1, limit = 10, q = "" } = {}) {
      // Asumimos que el LoopBack soporta filtros (limit, skip, where)
      const skip = (page - 1) * limit;
      // Filtro básico por nombre usando 'like'
      let filter = { limit, skip, order: "createdAt DESC" };
      if (q && q.length) {
        filter.where = { nombre: { like: q, options: "i" } };
      }
      const res = await api.get("/productos", {
        params: { filter: JSON.stringify(filter) },
      });
      // LoopBack devuelve array y a veces encabezados con conteo; aquí simplificamos
      const items = res.data;
      console.log("lo que devuelve el backend ", res.data);
      // No siempre hay total; si tu backend envía X-Total-Count, usa res.headers
      const total = Number(res.headers["x-total-count"] || items.length);
      console.log("total de registros: ", total);
      commit("setProducts", { items, meta: { total } });
    },
  },
});
