import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import unusedImports from 'eslint-plugin-unused-imports';

export default [
  {
    ignores: [
      'node_modules/**',
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/coverage/**',
    ],
  },
  {
    files: ['**/*.{ts,tsx,js}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parser: tsParser,
    },
    plugins: {
      '@typescript-eslint': tseslint,
      'unused-imports': unusedImports,
    },
    rules: {
      quotes: ['error', 'double', { avoidEscape: true }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      'unused-imports/no-unused-imports': 'error',
    },
  },
];
