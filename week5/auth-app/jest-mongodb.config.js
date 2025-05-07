module.exports = {
    mongodbMemoryServerOptions: {
      binary: {
        version: '10.1.4',
        skipMD5: true,
      },
      autoStart: false,
      instance: {
        dbName: 'jest',
      },
    },
};