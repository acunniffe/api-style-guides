const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
  cssLoaderOptions: {
    url: false,
  },
});

module.exports = withNextra();
