const { resolve } = require('path');
const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');

const config = {
  devtool: 'cheap-module-eval-source-map',

  entry: [
    'react-hot-loader/patch',
    'webpack-dev-server/client?http://localhost:8080',
    'webpack/hot/only-dev-server',
    './main.js',
    './assets/scss/main.scss'
  ],

  output: {
    filename: 'bundle.js',
    path: resolve(__dirname, 'dist'),
    publicPath: ''
  },

  context: resolve(__dirname, 'app'),

  devServer: {
    hot: true,
    host: '0.0.0.0',
    contentBase: resolve(__dirname, 'build'),
    publicPath: '/',
    proxy: {
      '/newsite/mailer/data/messages.php': {
        target: 'http://10.161.9.26/newsite/mailer/data/messages.php',
        secure: false
      },
      '/newsite/mailer/data/singlemessage.php': {
        target: 'http://10.161.9.26/newsite/mailer/data/singlemessage.php',
        secure: false
      },
      '/newsite/mailer/data/singleattachment.php': {
        target: 'http://10.161.9.26/newsite/mailer/data/singleattachment.php',
        secure: false
      }
    }
  },

  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader'
      },
      {
        test: /\.js$/,
        loaders: [
          'babel-loader'
        ],
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: [
            {
              loader: 'css-loader',
              options: {
                modules: false,
                camelCase: true,
                localIdentName: '[path][name]__[local]--[hash:base64:5]'
              }
            }
          ]
        }),
        exclude: path.resolve(__dirname, "node_modules/")
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: [
            {
              loader: 'css-loader'
            }
          ]
        }),
        include: path.resolve(__dirname, "node_modules/")
      },
      {
        test: /\.less$/,
        // exclude: /node_modules/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                modules: true,
                camelCase: true,
                localIdentName: '[path][name]__[local]--[hash:base64:5]'
              }
            },
            {
              loader: 'less-loader',
              query: {
                sourceMap: false
              }
            }
          ],
          publicPath: '../'
        })
      },
      {
        test: /\.scss$/,
        // exclude: /node_modules/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                modules: true,
                camelCase: true,
                localIdentName: '[path][name]__[local]--[hash:base64:5]'
              }
            },
            {
              loader: 'sass-loader',
              query: {
                sourceMap: false
              }
            }
          ],
          publicPath: '../'
        }),
        exclude: path.resolve(__dirname, "node_modules/")
      },
      {
        test: /\.scss$/,
        // exclude: /node_modules/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader'
            },
            {
              loader: 'sass-loader',
              query: {
                sourceMap: false
              }
            }
          ],
          publicPath: '../'
        }),
        include: path.resolve(__dirname, "node_modules/")
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              mimetype: 'image/png',
              name: 'images/[name].[ext]'
            }
          }
        ]
      },
      {
        test: /\.eot(\?v=\d+.\d+.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'fonts/[name].[ext]'
            }
          }
        ]
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              mimetype: 'application/font-woff',
              name: 'fonts/[name].[ext]'
            }
          }
        ]
      },
      {
        test: /\.[ot]tf(\?v=\d+.\d+.\d+)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              mimetype: 'application/octet-stream',
              name: 'fonts/[name].[ext]'
            }
          }
        ]
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              mimetype: 'image/svg+xml',
              name: 'images/[name].[ext]'
            }
          }
        ]
      }
    ]
  },

  plugins: [
    new webpack.LoaderOptionsPlugin({
      test: /\.js$/,
      options: {
        eslint: {
          configFile: resolve(__dirname, '.eslintrc'),
          cache: false
        }
      }
    }),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new ExtractTextPlugin({ filename: './styles/style.css', disable: false, allChunks: true }),
    new CopyWebpackPlugin([{ from: 'vendors', to: 'vendors' }]),
    new OpenBrowserPlugin({ url: 'http://localhost:8080' }),
    new webpack.HotModuleReplacementPlugin()
  ]
};

module.exports = config;
