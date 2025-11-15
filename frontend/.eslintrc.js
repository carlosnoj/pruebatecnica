module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ["plugin:vue/essential", "eslint:recommended"],
  parserOptions: {
    parser: "@babel/eslint-parser",
    requireConfigFile: false, // Permite funcionar sin babel.config.js
  },
  rules: {
    // Puedes agregar reglas personalizadas aquí
  },
};
