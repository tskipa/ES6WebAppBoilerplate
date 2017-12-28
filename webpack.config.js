const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const Paths = {
  src: path.resolve(__dirname, 'src'),
  index: path.resolve(__dirname, 'assets/template.html'),
  build: path.resolve(__dirname, 'build'),
};

const config = {
  context: __dirname,
  entry: ['webpack-hot-middleware/client', Paths.src],
  devtool: 'cheap-module-eval-source-map',
  output: {
    path: Paths.build,
    filename: 'bundle.js',
    publicPath: '/',
  },
  devServer: {
    hot: true,
    publicPath: '/',
    historyApiFallback: true,
    port: 3000,
  },
  resolve: {
    extensions: ['.js', '.json'],
  },
  stats: {
    colors: true,
    reasons: true,
    chunks: false,
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js/,
        loader: 'eslint-loader',
        exclude: [/node_modules/, /assets/],
      },
      {
        test: /\.js/,
        loader: 'babel-loader',
        exclude: [/node_modules/, /assets/],
      },
      {
        test: /\.(png|jpg|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              mimetype: 'image/svg+xml',
            },
          },
        ],
      },
      {
        test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 5000,
              prefix: 'font/',
            },
          },
        ],
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              mimetype: 'application/octet-stream',
            },
          },
        ],
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
    ],
  },
};

if (process.env.npm_lifecycle_event === 'build') {
  config.entry = Paths.src;
  config.devtool = false;
  config.module.rules.push({
    test: /\.(css|scss)$/,
    use: ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use: [
        {
          loader: 'css-loader',
        },
        {
          loader: 'sass-loader',
        },
      ],
    }),
  });
  config.plugins = [
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production',
    }),
    new HtmlWebpackPlugin({
      inject: true,
      filename: 'index.html',
      template: Paths.index,
      hash: true,
    }),
    new ExtractTextPlugin({
      filename: 'style.css',
      disable: false,
      allChunks: true,
    }),
    new webpack.optimize.CommonsChunkPlugin({
      children: true,
      async: true,
    }),
    new webpack.optimize.UglifyJsPlugin(),
  ];
} else {
  config.plugins = [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
  ];
  config.module.rules.push({
    test: /\.(css|scss)$/,
    use: ['style-loader', 'css-loader', 'sass-loader'],
    include: [path.join(__dirname, 'src/sass')],
  });
}

module.exports = config;
