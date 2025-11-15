import Vue from "vue";
import Router from "vue-router";
import store from "./store";

import Login from "./views/LoginApp.vue";
import Products from "./views/ProductsApp.vue";
import ProductForm from "./views/ProductForm.vue";
import UsersAdmin from "./views/UsersAdmin.vue";

Vue.use(Router);

const router = new Router({
  mode: "history",
  routes: [
    { path: "/", redirect: "/productsapp" },
    { path: "/loginapp", component: Login },
    { path: "/productsapp", component: Products, meta: { requiresAuth: true } },
    {
      path: "/productsapp/new",
      component: ProductForm,
      meta: { requiresAuth: true },
    },
    {
      path: "/productsapp/:id/edit",
      component: ProductForm,
      meta: { requiresAuth: true },
    },
    {
      path: "/productsapp/:id/delete",
      component: ProductForm,
      meta: { requiresAuth: true },
    },
    {
      path: "/usersadmin",
      component: UsersAdmin,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
  ],
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const requiresAdmin = to.matched.some((record) => record.meta.requiresAdmin);

  if (requiresAuth && !store.getters.isAuthenticated) {
    return next("/loginapp");
  }

  if (requiresAdmin) {
    const user = store.getters.user;
    if (!user || user.rol !== "admin") return next("/productsapp");
  }

  next();
});

export default router;
