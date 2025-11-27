import resolve from '@rollup/plugin-node-resolve';

export default [
  // ES MODULE BUILD
  {
    input: 'src/credit-balanced-bst.esm.js',
    output: {
      file: 'dist/credit-balanced-bst.esm.js',
      format: 'esm'
    },
    plugins: [resolve()]
  },

  // UMD BUILD
  {
    input: 'src/credit-balanced-bst.esm.js',
    output: {
      file: 'dist/credit-balanced-bst.umd.js',
      format: 'umd',
      name: 'CreditBalancedBST'   // <-- GLOBAL WINDOW.CreditBalancedBST
    },
    plugins: [resolve()]
  }
];
