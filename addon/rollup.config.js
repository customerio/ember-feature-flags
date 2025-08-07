export default {
  input: 'src/index.js',
  output: {
    file: 'dist/index.js',
    format: 'es',
    sourcemap: true,
  },
  external: ['@ember/service', '@ember/component/helper', 'tracked-built-ins'],
  plugins: [],
};
