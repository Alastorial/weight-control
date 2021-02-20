'use strict'
module.exports = {
  NODE_ENV: '"production"',
  module: {
    rules: [
      {
        test: /\.styl$/,
        loader: "stylus-loader", // compiles Styl to CSS
      },
    ],
  },
}
