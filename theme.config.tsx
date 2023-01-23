import React from 'react';
import { DocsThemeConfig } from 'nextra-theme-docs';
import { DownloadButton } from './components/index';

const config: DocsThemeConfig = {
  logo: <span>API Style Guides</span>,
  primaryHue: {
    light: 232,
    dark: 197,
  },
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta property="og:title" content="API Style Guides" />
      <meta property="og:description" content="Build your OpenAPI style guide" />
    </>
  ),
  darkMode: true,
  project: {
    link: 'https://github.com/acunniffe/api-style-guides',
  },
  // chat: {
  //   link: 'https://discord.com',
  // },
  docsRepositoryBase: 'https://github.com/acunniffe/api-style-guides',
  footer: {
    text: 'API Style Guides',
  },
  navbar: {
    extraContent: <DownloadButton />,
  },
  useNextSeoProps() {
    return {
      titleTemplate: '%s – API Style Guides'
    }
  },
};

export default config;
