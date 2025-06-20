import { defineConfig } from 'vite';

export default defineConfig({
  root: 'public',   // treat public/ as the site root
  publicDir: false  // disable the extra copy-everything folder
});