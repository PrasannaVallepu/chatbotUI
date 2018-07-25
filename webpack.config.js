const { NoEmitOnErrorsPlugin } = require('webpack');

module.exports = {
  "entry": "./main.ts",
  "output": {
    "filename": "main.bundle.js"
  },
  "module": {
    "rules": [
      {
        "test": /\.ts$/,
        "loader": "awesome-typescript-loader"
      }
    ]
  },
  "plugins": [
    new NoEmitOnErrorsPlugin()
  ]
};