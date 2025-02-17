const path = require('path');

module.exports = {
  mode: 'development',
  target: 'electron-main',
  entry: './src/main/index.ts',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, '../dist/main'),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.node$/,
        loader: 'node-loader',
      }
    ],
  },
  resolve: {
    extensions: ['.ts', '.js', '.json'],
  },
  externals: {
    sharp: 'commonjs sharp',
    canvas: 'commonjs canvas',
    'pdfjs-dist': 'commonjs pdfjs-dist',
    'worker_threads': 'commonjs worker_threads'
  },
  node: {
    __dirname: false,
    __filename: false,
    global: true
  }
};