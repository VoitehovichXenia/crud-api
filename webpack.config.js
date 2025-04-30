const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: './src/server.ts',              // Entry point for your app
  target: 'node',                        // Set target to 'node' for a backend app
  externals: [nodeExternals()],          // Exclude node_modules from bundling
  module: {
    rules: [
      {
        test: /\.ts$/,                   // Process .ts files
        use: 'ts-loader',                // Use ts-loader to transpile TypeScript
        exclude: /node_modules/,
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js'],         // Resolve both .ts and .js files
  },
  output: {
    filename: 'server.js',              // Output file for the bundled server
    path: path.resolve(__dirname, 'dist'), // Output directory
  },
  mode: 'development',
}