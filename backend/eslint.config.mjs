import { FlatCompat } from '@eslint/eslintrc';
const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});
const eslintConfig = [
  ...compat.config({
    extends: ['plugin:@typescript-eslint/recommended'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
    },
  }),
];
export default eslintConfig;
