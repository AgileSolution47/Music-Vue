module.exports = {
  pluginOptions: {
    electronBuilder: {
      chainWebpackRendererProcess: config => {
        config.plugin('define').tap(args => {
          args[0]['process.env.FLUENTFFMPEG_COV'] = false;
          return args;
        });
      },
      nodeIntegration: true,
      customFileProtocol: './',
      builderOptions: {
        productName: 'Music',
        appId: 'com.LutetiumVanadium.Music',
        directories: {
          output: 'build',
        },
        files: ['dist/electron/**/*'],
        dmg: {
          contents: [
            {
              x: 410,
              y: 150,
              type: 'link',
              path: '/Applications',
            },
            {
              x: 130,
              y: 150,
              type: 'file',
            },
          ],
        },
        mac: {
          icon: 'build/icons/icon.icns',
        },
        win: {
          icon: 'build/icons/icon.ico',
        },
        linux: {
          icon: 'build/icons',
        },
      },
    },
  },
};
