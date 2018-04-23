module.exports = {
  entry: "./client.jsx",
  output: {
    filename: "public/tokenbundle.js"
  },
  module: {
    loaders: [
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ["es2015", "react", "stage-0"]
        }
      }
    ]
  }
}
