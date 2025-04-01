// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      ecmaVersion: 5,
      sourceType: 'module',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      "object-curly-spacing": ["error", "always"],
      'eol-last': 'off',
      'no-trailing-spaces': 'off', // Disable trailing space errors
      'no-multiple-empty-lines': ['warn', { max: 10 }],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'off', // Completely disable this rule
      '@typescript-eslint/no-unsafe-assignment': 'off', // Completely disable this rule
      '@typescript-eslint/no-unsafe-member-access': 'off', // Completely disable this rule
    },
  },
);
