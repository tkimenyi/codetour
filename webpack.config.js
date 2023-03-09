const path = require("path");
const webpack = require("webpack");
const CopyPlugin = require("copy-webpack-plugin");

const config = {
  entry: "./src/extension.ts",
  devtool: "source-map",
  externals: {
    vscode: "commonjs vscode"
  },
  resolve: {
    fallback: {
      fs: false,
      os: require.resolve("os-browserify/browser"),
      path: require.resolve("path-browserify")
    },
    extensions: [".ts", ".js", ".json"]
  },
  node: {
    __filename: false,
    __dirname: false
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "ts-loader"
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.SourceMapDevToolPlugin({
      test: /\.ts$/,
      noSources: false,
      module: true,
      columns: true
    }),
    new CopyPlugin({
      patterns: [
        {
          from: "*.wasm",
          to: "wasm/",
          context: "node_modules/vscode-oniguruma/release/"
        },
        {
          from: "grammars/*",
          to: "."
        }
      ]
    })
  ]
};

const nodeConfig = {
  ...config,
  target: "node",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "extension-node.js",
    libraryTarget: "commonjs2",
    devtoolModuleFilenameTemplate: "../[resource-path]"
  }
};

const webConfig = {
  ...config,
  target: "webworker",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "extension-web.js",
    libraryTarget: "commonjs2",
    devtoolModuleFilenameTemplate: "../[resource-path]"
  }
};

module.exports = [nodeConfig, webConfig];
