module.exports = {
  semi: true,
  singleQuote: true,
  trailingComma: 'es5',
  plugins: ['prettier-plugin-astro'],
  overrides: [
    {
      files: ['**/*.astro'],
      options: {
        parser: 'astro',
      },
    },
  ],
};
