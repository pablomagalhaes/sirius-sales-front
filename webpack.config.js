const { merge } = require("webpack-merge");
const singleSpaDefaults = require("webpack-config-single-spa-react-ts");
const webpack = require("webpack");
const dotenv = require('dotenv');
const path = require('path');

module.exports = (webpackConfigEnv, argv) => {
  let pathEnv = '';
  if (webpackConfigEnv.isLocal) {
    pathEnv = './env/.env.dev';
  } else if (webpackConfigEnv.isQA) {
    pathEnv = './env/.env.qa';
  } else if (webpackConfigEnv.isUAT) {
    pathEnv = './env/.env.uat';
  }else if (webpackConfigEnv.isProduction) {
    pathEnv = './env/.env.production';
  }

  const defaultConfig = singleSpaDefaults({
    orgName: "sirius",
    projectName: "sales-fe",
    webpackConfigEnv,
    argv,
  });

  return merge(defaultConfig, {
    externals: ['react-router-dom', 'styled-components', '@material-ui/core'],
    performance: {
      hints: false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000
  },
  output: {
    path: path.join(process.cwd(), 'build')
  },
   plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser'
  }),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(dotenv.config({ path: pathEnv }).parsed),
    }),
  ]
  });
};
