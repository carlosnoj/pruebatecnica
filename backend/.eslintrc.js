module.exports = {
  ignorePatterns: ['test-mongo-connection.js'],
  extends: '@loopback/eslint-config',
  rules: {
    // Permitir snake_case en propiedades de objetos (común en bases de datos)
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'default',
        format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
        leadingUnderscore: 'allow',
      },
      {
        // Permitir snake_case en propiedades de objetos literales
        selector: 'objectLiteralProperty',
        format: null, // Desactivar para propiedades de objetos
      },
      {
        // Permitir snake_case en propiedades de clases (modelos de BD)
        selector: 'classProperty',
        format: null, // Desactivar para propiedades de clases
      },
      {
        selector: 'property',
        format: ['camelCase', 'snake_case', 'PascalCase', 'UPPER_CASE'],
      },
      {
        // Permitir snake_case en variables que reflejan estructura de BD
        selector: 'variable',
        format: ['camelCase', 'PascalCase', 'UPPER_CASE', 'snake_case'],
      },
    ],
    // Permitir 'any' en ciertos contextos (menos estricto)
    '@typescript-eslint/no-explicit-any': 'warn', // Cambiar a warning en lugar de error
    // Permitir || además de ?? (menos estricto)
    '@typescript-eslint/prefer-nullish-coalescing': 'warn', // Cambiar a warning
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
  },
};
