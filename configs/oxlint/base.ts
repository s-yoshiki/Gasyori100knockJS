const baseConfig = {
  plugins: ['typescript'],
  categories: {
    correctness: 'error',
    suspicious: 'warn',
  },
  // Image-processing exercises intentionally allocate sparse buffers with new Array(length).
  rules: {
    'unicorn/no-new-array': 'off',
  },
  ignorePatterns: ['**/dist/**', '**/cdk.out/**', '**/.turbo/**'],
};

export default baseConfig;
