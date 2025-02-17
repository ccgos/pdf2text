const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

const commonConfig = {
  mode: 'development',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.node$/,
        loader: 'node-loader',
        options: {
          name: '[name].[ext]'
        }
      }
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
};

const mainConfig = {
  ...commonConfig,
  target: 'electron-main',
  entry: './src/main/index.ts',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
  },
  externals: {
    canvas: 'commonjs canvas',
    'pdf-lib': 'commonjs pdf-lib'
  }
};

const preloadConfig = {
  ...commonConfig,
  target: 'electron-preload',
  entry: './src/main/preload.ts',
  output: {
    filename: 'preload.js',
    path: path.resolve(__dirname, 'dist'),
  },
};

const rendererConfig = {
  ...commonConfig,
  target: 'web',
  entry: ['./src/renderer/styles/styles.css', './src/renderer/index.tsx'],
  output: {
    filename: 'renderer.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: 'src/renderer/index.html',
          to: path.resolve(__dirname, 'dist/index.html'),
        },
        {
          from: 'src/renderer/styles/styles.css',
          to: path.resolve(__dirname, 'dist/styles.css'),
        },
      ],
    }),
  ],
  resolve: {
    ...commonConfig.resolve,
    fallback: {
      path: false,
      fs: false,
    },
  },
};

module.exports = [mainConfig, preloadConfig, rendererConfig]; 