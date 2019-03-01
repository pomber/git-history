module.exports = {
  webpack: {
    configure: {
      output: {
        // I need "this" for workerize-loader
        globalObject: "this"
      }
    }
  }
};
