module.exports = {
    rules: {
      '@typescript-eslint/consistent-type-definitions': 'off',
      '@typescript-eslint/strict-boolean-expressions': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/comma-spacing': 'off',
      '@typescript-eslint/return-await': 'off',
      '@typescript-eslint/no-namespace': 'off',
      'no-redeclare': 'off',
      'import/export': 'off',
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error',
      'no-console': 'error',
      'no-use-before-define': 'off',
      '@typescript-eslint/no-misused-promises': 'off',
      '@typescript-eslint/no-unnecessary-type-assertion': 'off',
      '@typescript-eslint/method-signature-style': 'off'
    },
    extends: 'standard-with-typescript',
    parserOptions: {
      project: './tsconfig.json'
    }
  }
  