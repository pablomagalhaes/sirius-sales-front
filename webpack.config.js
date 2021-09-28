const { merge } = require("webpack-merge");
const singleSpaDefaults = require("webpack-config-single-spa-react-ts");
const webpack = require("webpack");
const dotenv = require('dotenv');

module.exports = (webpackConfigEnv, argv) => {
  let path = '';
  if (webpackConfigEnv.isLocal) {
    path = './env/.env.dev';
  } else if (webpackConfigEnv.isQA) {
    path = './env/.env.qa';
  } else if (webpackConfigEnv.isUAT) {
    path = './env/.env.uat';
  }else if (webpackConfigEnv.isProduction) {
    path = './env/.env.production';
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
   plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser'
  }),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(dotenv.config({ path: path }).parsed),
    }),
  ]
  });
};
