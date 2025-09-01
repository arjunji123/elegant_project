const { getDefaultConfig } = require("metro-config");

module.exports = (async () => {
  const {
    resolver: { sourceExts, assetExts },
  } = await getDefaultConfig();

  return {
    watchFolders: [__dirname],
    resolver: {
      assetExts,
      // Remove 'flow' extension so .js.flow files are ignored
      sourceExts: sourceExts.filter(ext => ext !== "flow"),
    },
    // Ignore CMake build folders under node_modules
    watch: {
      ignore: [/node_modules[/\\].+[/\\]\.cxx[/\\].*/],
    },
  };
})();
