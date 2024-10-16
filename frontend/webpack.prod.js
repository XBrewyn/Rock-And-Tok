const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const Dotenv = require('dotenv-webpack');

const pathPublic = (fileName) =>
  path.resolve(__dirname, 'public', fileName);

const config = {
  mode: 'production',
  devtool: 'cheap-module-source-map',
  entry: path.resolve(__dirname, 'src', 'index.tsx'),

  output: {
    path: path.resolve(__dirname, '../backend/build'),
    filename: '[name].[chunkhash].js',
    publicPath: '/',
  },

  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.(s[c|a]ss)$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-modules-typescript-loader',
          { loader: 'css-loader', options: { modules: true } },
          'sass-loader',
        ],
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[hash].[ext]',
              outputPath: 'images',
            },
          },
        ],
      },
    ],
  },

  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.scss', '.sass', '.css'],
  },

  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: pathPublic('robots.txt'), to: '' },
        { from: pathPublic('manifest.json'), to: '' },
        { from: pathPublic('images/logo192.jpg'), to: '' },
        { from: pathPublic('images/logo512.jpg'), to: '' },
        { from: pathPublic('images/favicon.ico'), to: '' },
        { from: pathPublic('images/sign-up.webp'), to: '' },
        { from: pathPublic('images/logo.jpg'), to: '' },
        { from: pathPublic('images/log-in.jpg'), to: '' },
        { from: pathPublic('audios/home.mp3'), to: '' },
        { from: pathPublic('videos/home.mp4'), to: '' },
        { from: pathPublic('fonts/Futura.otf'), to: '' },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, 'public', 'index.html'),
      hash: true,
      favicon: pathPublic('images/favicon.ico'),
    }),
    new Dotenv(),
  ],
}

module.exports = config;
