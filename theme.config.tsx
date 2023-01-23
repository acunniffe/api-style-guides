import React from 'react';
import { DocsThemeConfig } from 'nextra-theme-docs';
import { DownloadButton } from './components/index';

const config: DocsThemeConfig = {
  logo: <span>API Style Guides</span>,
  primaryHue: {
    light: 232,
    dark: 197,
  },
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
};

export default config;
